var util = require("util");


/**
 * 扩展参数对象（单层扩展）
 *
 * @param {object} obj  : [] 多个参数对象，如 "{param1:1, param2:'str'}"
 *
 * @return {object}     : [] 扩展后的参数对象
 */

exports.extend = function() {

    var
        _J      = JSON,
        _len    = arguments.length,
        _opt    = {};

    for (var i = 0; i < _len; i++) {

        var
            _arg = arguments[i],
            _parentObj;

        if (!_arg) {

            continue;
        }

        _parentObj = _J.parse(_J.stringify(_arg)); // 通过 json 的编译和解析，获得一个新对象

        for(var _key in _parentObj) {

            _opt[_key] = _parentObj[_key];
        }
    }

    return _opt;
};