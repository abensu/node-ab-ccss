var
    fs      = require('fs'),
    path    = require('path');


/**
 * 检测文件/目录，并返回文件路径或其他状态符
 *
 * @attention   : 不支持 外链（"http://"）
 *
 * @example     : getPath(root, to, path, ...)
 *
 * @param {string} root|to|path : [] 目录（或文件）字符串，如 "../", "css/", "base.css"
 *
 * @return {object}             : [] json 数据
 *                                  |
 *                                  |- {number} "status": [] 状态
 *                                  |                       |- 1    : 文件存在
 *                                  |                       |- 0    : 读取失败：文件不存在
 *                                  |                       `- 2    : 读取失败：此方法不支持 外链（\"http://\"）
 *                                  |
 *                                  |- {string} "msg"   : [] 提示信息
 *                                  |
 *                                  `- {string} "url"   : [] 文件路径或为空字符串
 */

exports.getPath = function() {

    var
        _path       = '',
        _pathlist   = Array.prototype.slice.call(arguments),
        _optPath    = _pathlist.join('@%'),
        _re_lin     = /@%[^\/\\\s]+?:[\/\\]{2}/g, // 不支持 外链（"http://"）
        _isExist    = false,
        _json       = {"status": 0, "msg": "", "url": ""};

    // 外链 "http://"
    if (_re_lin.test('@%' + _optPath)) {

        _json.status    = 2;
        _json.msg       = "读取失败：此方法不支持 外链（\"http://\"）";

        return _json;
    }

    _path = path.join.apply(null, _pathlist);

    _isExist = fs.existsSync(_path);

    if (_isExist) { // 文件存在时

        _json.status    = 1;
        _json.msg       = "文件存在";
        _json.url       = _path;

    } else {

        _json.msg       = "读取失败：文件不存在";
        _json.status    = 0;
    }

    return _json;
};