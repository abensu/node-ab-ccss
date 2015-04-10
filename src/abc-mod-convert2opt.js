var
    path        = require('path'),
    fs          = require('fs'),
    ab_trim     = require('./abc-util-trim').trim,
    ab_getPath  = require('./abc-util-getPath').getPath,
    ab_getFile  = require('./abc-util-getFile').getFile;


/**
 * 将目录文本转换成处理对象
 *
 * @use {function} txt2opt(root)
 * @use {function} txt2opt(root, path1, path2, ...)
 *
 * @param {string} root     : [] 根目录
 * @param {string} path(n)  : [] 目录/文件名（第 1 个之后的参数）
 *
 * @return {object}         : [] 待处理的对象
 *                              |- {
 *                              |       "base" : ..., // "公用的基本操作参数对象"
 *                              |       "list" : [{
 *                              |                   "root"  : ...,  // "根目录路径"
 *                              |                   "fold"  : ...,  // "需要扫描的目录路径"
 *                              |                   "img"   : ...,  // "合成图片路径"
 *                              |                   "css"   : ...,  // "合成 css 的路径"
 *                              |                   "opt"   : ...   // "实际操作参数对象"
 *                              |               }, ...]
 *                              |   }
 *                              |
 *                              `- null : 文件不存在
 */

exports.txt2opt = function(root) {

    var _filePath = path.join.apply(null, Array.prototype.slice.call(arguments));

    // 当文件不存在，报错
    if (ab_getPath(_filePath).status !== 1) {

        throw "ERROR: txt2opt: 文件不存在或为外链 <- " + _filePath;
    }

    var
        _fileData   = fs.readFileSync( ab_trim(_filePath), {encoding:"utf-8"} ),
        _fileslist  = _fileData.split(/\r\r|\n\n|\r\n\r\n(?:\s*)/g),
        _listObj    = [],
        _base       = {},
        _fileroot   = arguments[0];

    // 头部对象 '{"include":["url1","url2"]}'
    if (/^{/.test(ab_trim(_fileslist[0]))) {

        _base = JSON.parse(ab_trim(_fileslist[0]));
        _fileslist.shift();
    }

    for (var i = 0, len = _fileslist.length; i < len; i++) {

        var
            _com        = ab_trim(_fileslist[i]),
            _comList    = _com.split(/[\r\n]+/g),
            _src_fold   = _comList[0],
            _src_img    = _comList[1],
            _src_css    = _comList[2],
            _src_opt    = _comList[3] || "{}";

        _listObj.push({
            "root"  : _fileroot,
            "fold"  : path.join(_fileroot, ab_trim(_src_fold)),
            "img"   : path.join(_fileroot, ab_trim(_src_img)),
            "css"   : path.join(_fileroot, ab_trim(_src_css)),
            "opt"   : JSON.parse(ab_trim(_src_opt))
        });
    }

    return {
        "base" : _base,
        "list" : _listObj
    };
};


/**
 * json 转换成处理对象
 *
 * @example : json2opt(root, json)
 * @example : json2opt(root, path1, path2, ...)
 *
 * @param {string} root     : [] 根目录
 * @param {object} json     : [] json 对象（第2个参数）
 * @param {string} path(n)  : [] 目录/文件名（第1个之后的参数）
 *
 * @return {object}         : [] 待处理的对象
 *                              |- {
 *                              |       "base" : ..., // "公用的基本操作参数对象"
 *                              |       "list" : [{
 *                              |                   "root"  : ...,  // "根目录路径"
 *                              |                   "fold"  : ...,  // "需要扫描的目录路径"
 *                              |                   "img"   : ...,  // "合成图片路径"
 *                              |                   "css"   : ...,  // "合成 css 的路径"
 *                              |                   "opt"   : ...   // "实际操作参数对象"
 *                              |               }, ...]
 *                              `   }
 */

exports.json2opt = function(root, json) {

    var
        _J = JSON,
        _json;

    // 当参数 json 非对象时，尝试当作其传入的是路径
    if (typeof json !== "object") {

        var
            _filePath   = path.join.apply(null, Array.prototype.slice.call(arguments)),
            _fileObj    = ab_getPath(_filePath),
            _fileCon;

        // 当文件不存在，报错
        if (_fileObj.status !== 1) {

            throw "ERROR: json2opt: 文件不存在或为外链 <- " + _filePath;
        }

        _fileObj    = ab_getFile(_filePath);
        _fileCon    = _fileObj.data;
        _json       = _J.parse(_fileCon);

    } else {

        _json = json;
    }

    var
        _fileData   = _json,
        _filesbase  = _fileData.base || {},
        _fileslist  = _fileData.list || [],
        _fileroot   = root;

    for (var i = 0, len = _fileslist.length; i <len; i++) {

        _fileslist[i]["root"]  = _fileroot;
        _fileslist[i]["fold"]  = path.join(_fileroot, _fileslist[i]["fold"]);
        _fileslist[i]["img"]   = path.join(_fileroot, _fileslist[i]["img"]);
        _fileslist[i]["css"]   = path.join(_fileroot, _fileslist[i]["css"]);
        _fileslist[i]["opt"]   = _fileslist[i]["opt"] || {};
    }

    return {
        "base" : _filesbase,
        "list" : _fileslist
    };
};