/**
 * 清除前后空字符
 *
 * @param {string} str  : [] 需处理的字符串
 *
 * @return {string}     : [] 处理完的字符串
 */

exports.trim = function(str) {

    return str.replace(/^\s+/, '').replace(/\s+$/, '');
};