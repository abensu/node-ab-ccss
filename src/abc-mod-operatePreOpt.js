var
    ab_frename      = require("./abc-util-frename").frename,
    ab_extend       = require("./abc-util-extend").extend,
    ab_model        = require("./abc-opt"),
    ab_optPreOpt    = ab_model.opt_preOpt;

var
    _json       = {"status": 0, "data": "", "msg": ""},
    _re_preOpt  = /\{\d+\w+@\$[^}]+\}/g;


/**
 * 对预处理变量进行处理
 *
 * @param {string} type         : [] 处理类型
 * @param {string} pathOrtxt    : [] 文件路径或字符串
 * @param {array} tasklist      : [] 总任务列表：TASKLIST
 *
 * @return {object}             : [] json 数据
 *                                  |
 *                                  |- {number} "status": [] 状态
 *                                  |                       |- 1    : 修改成功/不需要修改
 *                                  |                       |- 0    : 修改失败：处理类型不存在 <- xxx
 *                                  |
 *                                  |- {string} "msg"   : [] 提示信息
 *                                  |
 *                                  `- {string} "data"  : [ "" ] 修改后的内容
 */

exports.operatePreOpt = function(type, pathOrtxt, tasklist) {

    // 先判断是否存在预处理变量（如 "{nnn@$now}"）
    if (_re_preOpt.test(pathOrtxt)) {

        var _paramObj = {};

        // 将 _paramObj 从 {} 变成 { "...(_id)": { ...(TASK[n]) }, ... }
        for (var _i = tasklist.length; _i--;) {

            var _id = tasklist[_i]._id;

            _paramObj[_id] = tasklist[_i];
        }

        _re_preOpt.lastIndex = 0; // 匹配位置恢复到第 1 个位

        switch (type) {

            case "path" :
            case "txt" :
                var
                    __new = pathOrtxt,
                    __obj = _paramObj;

                __new = __new.replace(_re_preOpt, function(str) {

                    var
                        ___val      = str.replace(/^\{/, "").replace(/\}$/, "").split("@"),
                        ___id       = ___val[0],
                        ___preOpt   = ___val[1],
                        ___key      = ab_optPreOpt[___preOpt],
                        ___tarObj   = __obj[___id],
                        ___keyVal   = ___tarObj[___key];

                    return ___keyVal;
                });

                type === "path" && ab_frename(pathOrtxt, __new);

                _json.status    = 1;
                _json.data      = __new;
                _json.msg       = "修改成功";
                break;

            default :
                _json.msg = "修改成功：处理类型不存在 <- " + type;
                break;
        }

    } else {

        _json.status    = 1;
        _json.data      = pathOrtxt;
        _json.msg       = "不需要修改";
    }

    return ab_extend({}, _json);
};