var fs = require('fs');


/**
 * 获取文件内容
 *
 * @param {string} filename : [] 带路径的文件名
 *
 * @return {object}         : [] json 数据
 *                              |
 *                              |- @node {number} status    : [] 状态
 *                              |                               |- 1 : 读取成功
 *                              |                               |- 0 : 读取失败：文件不存在
 *                              |                               `- 2 : 读取失败：目标为文件夹
 *                              |
 *                              |- @node {string} msg       : [] 提示信息
 *                              |
 *                              `- @node {string} data      : [] 文件内容或为空字符串
 */

exports.getFile = function(filename) {

    var _json = {"status": 0, "data": "", "msg": ""};

    if ( !fs.existsSync(filename) ) {

        _json.status    = 0;
        _json.msg       = "读取失败：文件不存在";

    } else if ( fs.statSync(filename).isDirectory() ) {

        _json.status    = 2;
        _json.msg       = "读取失败：目标为文件夹";

    } else {

        _json.data      = fs.readFileSync( filename, {"encoding" : "utf8"} );
        _json.status    = 1;
        _json.msg       = "读取成功";
    }

    return _json;
};