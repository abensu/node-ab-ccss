var
    fs      = require('fs'),
    path    = require('path');


/**
 * 生成目录
 *
 * @example : setPath(root, to, path, ...)
 *
 * @param {string} root|to|path : [] 目录字符串，如 "../", "css/"
 *
 * @return {object}             : [] json 数据
 *                                  |
 *                                  |- @node {number} status    : [] 状态
 *                                  |                               |- 1 : 目录已创建
 *                                  |                               `- 0 : 目录未创建
 *                                  |
 *                                  |- @node {string} msg       : [] 提示信息
 *                                  |
 *                                  `- @node {string} data      : [] 目录路径或为错误信息
 */

exports.setPath = function() {

    var
        _rePath     = '',
        _pathlist   = Array.prototype.slice.call(arguments),
        _lsPath     = [],
        _ckPath     = '',
        _json       = {"status": 0, "data": "", "msg": ""};

    _rePath = path.join.apply(null, _pathlist);
    _lsPath = _rePath.split(/[\/\\]/g);

    // xunix系统的根目录为 '/'，上方的 split 方法会使根目录缺失，从而引起 fs.mkdirSync 出错
    if (_lsPath[0] === '') {

        _lsPath[0] = '/';
    }

    for (var i = 0, len = _lsPath.length; i < len; i++) {

        _ckPath = _lsPath.slice(0, i + 1).join('/');

        if (!fs.existsSync(_ckPath)) {

            try {

                fs.mkdirSync(_ckPath);

            } catch (error) {

                _json.msg = error;

                return _json;
            }
        }
    }

    _json.data      = _rePath;
    _json.msg       = "目录已创建";
    _json.status    = 1;

    return _json;
};