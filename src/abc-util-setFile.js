var
    fs          = require('fs'),
    ab_getPath  = require('./abc-util-getPath').getPath,
    ab_setPath  = require('./abc-util-setPath').setPath;


/**
 * 生成文件
 *
 * @param {string} filename : [] 带路径的文件名
 * @param {string} content  : [ "" ] 需要生成的内容
 *
 * @return {object}         : [] json 数据
 *                              |
 *                              |- @node {number} status    : [] 状态
 *                              |                               |- 1    : 文件已创建
 *                              |                               `- 0    : 文件创建失败：不能为外链（如 \"http://test.com\"）
 *                              |
 *                              `- @node {string} msg       : [] 提示信息
 */

exports.setFile = function(filename, content) {

    if (typeof filename !== "string") {

        throw "ERROR: setFile 的第一个参数必须为字符串类型的路径名: setFile(filename[, content])";
    }

    var
        _cData      = ab_getPath(filename),
        _status     = _cData.status,
        _content    = content || "",
        _re_dirSep  = /[\/\\]/g,                    // 路径分隔符，用于检测是否为含文件夹的字符串
        _re_fname   = /[\/\\][^\/\\]+?\.[\w]+$/i,   // 带点号的文件名，用于生成文件夹所用
        _json       = {"msg": "", "status": 0};

    if (_status === 1) { // 文件已存在

        fs.writeFileSync( filename, _content, {encoding : 'utf8'} );

        _json.msg       = "文件已创建";
        _json.status    = 1;

    } else if (_status === 0) { // 文件不存在

        if ( _re_dirSep.test(filename) ) { // 存在文件夹分隔符，则创建文件夹

            ab_setPath( filename.replace(_re_fname, '') ); // 去除结尾的文件名（带点的文件名）
        }

        fs.writeFileSync( filename, _content, {encoding : 'utf8'} );

        _json.msg       = "文件已创建";
        _json.status    = 1;

    } else if (_status === 2) { // 文件名包含外链

        _json.msg       = "文件创建失败：不能为外链（如 \"http://test.com\"）";
        _json.status    = 0;
    }

    return _json;
};