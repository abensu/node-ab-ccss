/**
 * 获得数据类型
 *
 * @param {*} data  : [] 待判定类型的数据
 *
 * @return {string} : [] 类型数据
 *                      |- "string"
 *                      |- "number"
 *                      |- "regexp"
 *                      |- "array"
 *                      |- "function"
 *                      |- "nan"
 *                      |- "null"
 *                      |- "undefined"
 *                      `- "object"
 */

exports.getType = function(data) {

    var _type = Object.prototype.toString.call(data).replace(/(^\[object\s)|(]$)/ig, "").toLocaleLowerCase();

    // 由于 NaN 和普通数字都返回 number，所以对 number 要再作判定
    // 先判定是否为 number，是因为 isNaN("NaN") 会返回 true
    if (_type === "number" && isNaN(data)) {

        _type = "nan";
    }

    return _type;
};