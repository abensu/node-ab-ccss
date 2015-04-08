var
    fs      = require('fs'),
    path    = require('path');


/**
 * 目录/文件重命名
 *
 * @param {string} oldpath  : [] 目标路径
 * @param {string} newpath  : [] 新路径
 *
 * @return {object}         : [] json 数据
 *                              |
 *                              |- {number} "status": [] 状态
 *                              |                       |- 1    : 重命名成功
 *                              |                       |- 0    : 重命名失败：文件已被重命名
 *                              |                       |- -1   : 重命名失败：参数数量必须为 2 个
 *                              |                       |- -2   : 重命名失败：参数不能为空或非字符串
 *                              |                       |- -3   : 重命名失败：目标路径不存在
 *                              |                       `- -4   : 重命名失败：路径层数不一致
 *                              |
 *                              `- {string} "msg"   : [] 提示信息
 */

exports.frename = function(oldpath, newpath) {

    var _json = {"status": 0, "msg": ""};

    if (arguments.length !== 2) {

        _json.msg       = "重命名失败：参数数量必须为 2 个 <- 参数数量: " + arguments.length;
        _json.status    = -1;
        return _json;
    }

    if (!oldpath || !newpath) {

        _json.msg       = "重命名失败：参数不能为空或非字符串 <- oldpath: " + oldpath + ", newpath: " + newpath;
        _json.status    = -2;
        return _json;
    }

    var
        _sep            = path.sep,
        _re_lastSep     = /[\\\/]+$/,
        _oldpath        = path.join(oldpath),
        _newpath        = path.join(newpath),
        _oldpath        = _oldpath.replace(_re_lastSep, ''),
        _newpath        = _newpath.replace(_re_lastSep, ''),
        _oldpathList    = _oldpath.split(_sep),
        _newpathList    = _newpath.split(_sep),
        _oldpathListLen = _oldpathList.length,
        _newpathListLen = _newpathList.length,
        _curOldpathList = [],
        _curNewpathList = [];

    if (!fs.existsSync(oldpath)) {

        _json.msg       = "重命名失败：目标路径不存在 <- " + oldpath;
        _json.status    = -3;
        return _json;
    }

    if (_oldpathListLen !== _newpathListLen) {

        _json.msg       = "重命名失败：路径层数不一致 <- oldpath 的层数为 " + _oldpathListLen + ", newpath 的层数为 " + _newpathListLen;
        _json.status    = -4;
        return _json;
    }

    if (_oldpath === _newpath) {

        _json.msg       = "重命名失败：文件已被重命名 <- oldpath: " + _oldpath + ", newpath: " + _newpath;
        _json.status    = 0;
        return _json;
    }

    for (var _i = 0, _len = _oldpathListLen; _i < _len; _i++) {

        var
            __oldpathCell = _oldpathList[_i],
            __newpathCell = _newpathList[_i];

        // 当第 1 项为空字符串时，即为分隔符开头
        if (_i === 0) {

            __oldpathCell === "" && (__oldpathCell = _sep);
            __newpathCell === "" && (__newpathCell = _sep);
        }

        _curOldpathList.push(__oldpathCell);
        _curNewpathList.push(__newpathCell);

        if (__oldpathCell !== __newpathCell) {

            fs.renameSync(
                path.join.apply(null, _curOldpathList),
                path.join.apply(null, _curNewpathList)
            );

            _curOldpathList[_i] = _curNewpathList[_i];
        }
    }

    _json.msg       = "重命名成功";
    _json.status    = 1;
    return _json;
};