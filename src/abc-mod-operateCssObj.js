var
    path        = require("path"),
    fs          = require("fs"),
    ab_getPath  = require("./abc-util-getPath").getPath,
    ab_getFile  = require("./abc-util-getFile").getFile,
    ab_extend   = require("./abc-util-extend").extend,
    ab_trim     = require("./abc-util-trim").trim,
    ab_getType  = require("./abc-util-getType").getType;


var
    txt2opt;


/**
 * 将文本（文件名内联内容或文档文件）转换成参数对象
 * 判断是否有 = 号，无则加载文件，有则直接使用参数
 * （仅供内部使用，对外仅作测试）
 *
 * @dependence {function} ab_trim
 * @dependence {function} ab_getFile
 * @dependence {function} ab_getPath
 * @dependence {function} ab_extend
 *
 * @param {string} str          : [] # 号后的字符串
 * @param {string} imgFold      : [] 图片路径
 * @param {object} rootOptObj   : [] 根参数对象，处理后的结果会最终合并到此对象中
 *
 * @return {obj}                : [] 待处理的参数对象
 */

exports._txt2opt = txt2opt = function(str, imgFold, rootOptObj) {

    var
        _str        = str,
        _imgFold    = imgFold,
        _rootOptObj = rootOptObj,
        _subOptObj  = {};

    /**
     * 对文件名内联内容的参数进行操作，如 key=value&&key=value
     *
     * @info: 暂时仅对 pos=position 有效
     *
     * @dependence {function} ab_trim
     *
     * @param {string} str  : [] 含 # 的字符串
     *
     * @return {object}     : [] 操作对象
     */
    function _func_hashtxt2obj(str) {

        var
            __paramList = str.split("&&"),
            __index     = __paramList.length,
            __subOptObj = {};

        while (__index--) {

            var
                __kvList    = __paramList[__index].split("="),
                __key       = ab_trim(__kvList[0]),
                __val       = ab_trim(__kvList[1]);

            if (__key === "pos") {

                __subOptObj.pos = __val;

            } else {

                throw "ERROR: txt2opt: _func_hashtxt2obj: 文件名内联操作参数仅支持 '#pos=position' <= " + str;
            }
        }

        return __subOptObj;
    };

    /**
     * 对文件中的参数进行操作，如 filename
     *
     * @dependence {function} ab_getPath
     * @dependence {function} ab_getFile
     *
     * @param {string} filename : [] 文件名
     *
     * @return {object}         : [] 操作对象
     */
    function _func_file2obj(filename) {

        // 退出 <- 文件不存在或为外链
        if (ab_getPath(filename).status !== 1) {

            throw "ERROR: txt2opt: _func_file2obj: 文件不存在或为外链 <= " + filename;
        }

        var
            __fileData      = ab_getFile(filename).data,
            __fileBlocks    = __fileData.split(/\r\r|\n\n|\r\n\r\n(?:\s*)/g),
            __subOptObj     = {};

        for (var i = 0, len = __fileBlocks.length; i <len; i++) {

            var
                __com       = ab_trim(__fileBlocks[i]),
                __comList   = __com.split(/[\r\n]+[\t ]*/g),
                __key       = ab_trim(__comList[0]);

            __comList.shift();

            switch(__key) {

                case "css" :
                    __subOptObj.css = (function() {

                        var ___cssObj = {};

                        for (var ___i = 0, ___len = __comList.length; ___i < ___len; ___i++) {

                            var
                                ___kvList   = __comList[___i].split(":"),
                                ___key      = ab_trim(___kvList[0]),
                                ___val      = ab_trim(___kvList[1]).replace(/[;]+$/g, '');

                            ___cssObj[___key] = ___val;
                        }

                        return ___cssObj;
                    })();
                    break;

                case "pos" :
                    __subOptObj.pos = __comList[0];
                    break;

                default :
                    __subOptObj[__key] = __comList;
                    break;
            }
        }

        return __subOptObj;
    };

    // 字符串存在等号则用 字符串操作方式（_func_hashtxt2obj），
    // 否则用 文件操作（_func_file2obj）
    if ( /=/.test(_str) ) {

        _subOptObj = _func_hashtxt2obj(_str);

    } else {

        _subOptObj = _func_file2obj(path.join(_imgFold, _str));
    }

    return ab_extend(_rootOptObj, _subOptObj);
};


/**
 * 生成完整的 CSSOBJ 并生成 css 目录
 *
 * @dependence {function} ab_getType
 * @dependence {function} txt2opt
 *
 * @param {object} opt      : [ TASKLIST[n] ] TASKLIST 的元素
 * @param {object} tarObj   : [] 待处理的目标对象（这里为 CSSOBJ）
 */

exports.operateCssObj = function(opt, tarObj) {

    var
        _root           = opt.root,
        _fold           = opt.fold,
        _images         = opt.images,
        _img            = opt.img,
        _imgFold        = opt.imgFold,
        _css            = opt.css,
        _cssFold        = opt.cssFold,
        _cssname        = opt.cssname,
        _cssOptStr      = opt.cssOptStr,
        _opt            = opt.opt,
        _widths         = opt.widths,
        _heights        = opt.heights,
        _maxWidth       = opt.maxWidth,
        _maxHeight      = opt.maxHeight,
        _totalWidth     = opt.totalWidth,
        _totalHeight    = opt.totalHeight,
        _imgSearch      = opt._imgSearch,
        _cssSearch      = opt._cssSearch,
        _len            = _images.length,
        _sep            = isNaN(_opt.sep) ? 0 : _opt.sep,
        _type           = _opt.type,
        _comment        = _opt.comment,
        _pre            = _opt.pre,
        _cssCon         = _opt.css,
        _isMinifyCss    = (!!_opt["minify-css"]) ? true : false;

    var
        _norCsscontent  = '',
        _bgCsscontent   = '',
        _picIndex       = 0,
        _rPath          = path.relative(_cssFold, _imgFold),
        _rFile          = path.join( _rPath, _img.replace(_imgFold, '') ).replace(/\\/g, "/") + _imgSearch,
        _px             = 0,
        _py             = 0,
        _rootOptObj     = {
                                "after" : null,
                                "css"   : {},
                                "pre"   : null,
                                "pos"   : null
                            },
        _globBgCssObj   = {"background": ""},
        _re_cssCon      = /\s*\{[^\{\}]+\}\s*/g,
        _re_lastDot     = /,\s*$/;

    var
        _func_pre2txt,
        _func_css2txt,
        _func_extend2txt,
        _func_combine4csstxt;


    /**
     * 将 pre 数组，转换成文本
     *（当是数组时，填充“$$parentChild”用于字段替换留占位符）
     *
     * @param {array} preList   : [] 父代数组
     *
     * @return {string}         : [] 父代字符串
     */
    _func_pre2txt = function(preList) {

        return (preList) ? preList.join(" $$parentChild,\r\n") + " $$parentChild,\r\n" : "";
    };

    /**
     * 将 css 对象，转换成文本
     *
     * @param {object} cssObj   : [] 样式对象
     *
     * @return {string}         : [] css 字符串
     */
    _func_css2txt = function(cssObj) {

        var __str = "";

        for (var __cssName in cssObj) {

            __str += __cssName + ":" + cssObj[__cssName] + ";";
        }

        return __str;
    };

    /**
     * 将 extend 数组，转换成文本
     *
     * @param {array} extendList: [] 独立外加样式数组
     *
     * @return {string}         : [] 独立外加样式字符串
     */
    _func_extend2txt = function(extendList) {

        return (extendList) ? extendList.join(",\r\n") : "";
    };

    /**
     * 组合成完整的 css 字符串
     *
     * @dependence {function} ab_getType
     *
     * @param {string} baseCls          : [] 基础类名（可含 &&）
     * @param {object} cssObj           : [] 样式对象
     * @param {array} afterList         : [] 后缀数组（伪类、伪对象、筛选器等）
     * @param {array} preList           : [] 父代数组
     * @param {array} extendList        : [] 独立外加样式数组
     *
     * @return {string}                 : [] 完整 css 字符串
     */
    _func_combine4csstxt = function(baseCls, cssObj, afterList, preList, extendList) {

        var
            __str           = "",
            __baseCls       = ( /&&/.test(baseCls) ) ? baseCls.split("&&") : "." + baseCls,
            __afterList     = afterList,
            __pre           = _func_pre2txt(preList),
            __css           = _func_css2txt(cssObj),
            __extend        = _func_extend2txt(extendList);

        if (ab_getType(__afterList) === "array") { // 多个伪类（或伪元素）

            if (typeof __baseCls === "string") {

                for (var __i = 0, __len = __afterList.length; __i < __len; __i++) {

                    __str += __pre ? __pre.replace(/\$\$parentChild/g, __baseCls + __afterList[__i]) : __baseCls + __afterList[__i];
                }

            } else {

                for (var __i = 0, __len = __afterList.length; __i < __len; __i++) {

                    for (var __n = 0, __l = __baseCls.length; __n < __l; __n++) {

                        __str += __pre.replace(/\$\$parentChild/g, "." + __baseCls[__n] + __afterList[__i]);
                    }
                }
            }

        } else { // 没有或单个伪类（或伪元素）

            if (typeof __baseCls === "string") {

                __str = (__pre) ? __pre.replace(/\$\$parentChild/g, __baseCls) : __baseCls + ",\r\n";

            } else {

                for (var __n = 0, __l = __baseCls.length; __n < __l; __n++) {

                    __str += (__pre) ? __pre.replace(/\$\$parentChild/g, "." + __baseCls[__n]) : "." + __baseCls[__n] + ",\r\n";
                }
            }
        }

        __str += __extend;
        __str = __str.replace(/,\r\n$/, "").replace(/\$self/g, "");
        __str += " {" + __css + "}\r\n";

        // 当压缩选项为 true 时，将所有换行符去掉
        if (_isMinifyCss) {

            __str = __str.replace(/\r\n/g, '');
        }

        return __str;
    };

    // 注释 [for _bgCsscontent]
    if (_comment && !_isMinifyCss) {

        _bgCsscontent += '/**\r\n * ' + _comment.split("||").join("\r\n * ") + '\r\n */\r\n\r\n';
    }

    // 前缀（class/id/tagName） [for _rootOptObj.pre]
    // 文本变数组
    if (_pre) {

        _rootOptObj.pre = _pre.split(/\s+/g);
    }

    // css（追加css的内容） [for _rootOptObj.css]
    if (_cssCon) {

        var
            __cssConList    = ab_trim(_cssCon).replace(/;$/, '').split(';'),
            __cssConObj     = {};

        for (var i = __cssConList.length; i--;) {

            var
                __kvlist    = __cssConList[i].split(":"),
                __key       = ab_trim(__kvlist[0]),
                __val       = ab_trim(__kvlist[1]);

            __cssConObj[__key] = __val;
        }

        _rootOptObj.css = __cssConObj;
    }

    switch(_type) {

        /**
         * 水平排列的独立图片
         */
        case "h-ele" :

            while(_picIndex < _len) {

                var __optObj = (_cssOptStr[_picIndex]) ? txt2opt(_cssOptStr[_picIndex], _fold, _rootOptObj) : _rootOptObj;

                if (__optObj.pos === "middle") {

                    // 垂直居中
                    _py = (_maxHeight - _heights[_picIndex]) / 2 + "px";

                } else if (__optObj.pos === "bottom") {

                    // 靠下
                    _py = "bottom";
                }

                __optObj.css.width = _widths[_picIndex] + "px";
                __optObj.css.height = _heights[_picIndex] + "px";
                __optObj.css["background-position"] = "-" + _px + "px " + _py;

                _norCsscontent += _func_combine4csstxt(_cssname[_picIndex], __optObj.css, __optObj.after, __optObj.pre, __optObj.extend);

                _picIndex ++;
                _px += _widths[_picIndex - 1] + _sep;
                _py = 0;
                opt.cssOptObj.push(__optObj);
                __optObj = null;
            }

            _globBgCssObj.background = "url(" + _rFile + ") no-repeat";

            break;

        /**
         * 垂直排列的独立图片
         */
        case "v-ele" :

            while(_picIndex < _len) {

                var __optObj = (_cssOptStr[_picIndex]) ? txt2opt(_cssOptStr[_picIndex], _fold, _rootOptObj) : _rootOptObj;

                if (__optObj.pos === "middle") {

                    // 左右居中
                    _px = (_maxWidth - _widths[_picIndex])/2 + "px";

                } else if (__optObj.pos === "right") {

                    // 靠右
                    _px = "right";
                }

                __optObj.css.width = _widths[_picIndex] + "px";
                __optObj.css.height = _heights[_picIndex] + "px";
                __optObj.css["background-position"] = _px + " -" + _py + "px";

                _norCsscontent += _func_combine4csstxt(_cssname[_picIndex], __optObj.css, __optObj.after, __optObj.pre, __optObj.extend);

                _picIndex ++;
                _py += _heights[_picIndex - 1] + _sep;
                _px = 0;
                opt.cssOptObj.push(__optObj);
                __optObj = null;
            }

            _globBgCssObj.background = "url(" + _rFile + ") no-repeat";

            break;

        /**
         * 水平平铺的背景
         */
        case "h-bg" :

            while(_picIndex < _len) {

                var __optObj = (_cssOptStr[_picIndex]) ? txt2opt(_cssOptStr[_picIndex], _fold, _rootOptObj) : _rootOptObj;

                __optObj.css["background-position"] = "0 -" + _py + "px";
                __optObj.css["min-height"] = _heights[_picIndex] + "px";

                _norCsscontent += _func_combine4csstxt(_cssname[_picIndex], __optObj.css, __optObj.after, __optObj.pre, __optObj.extend);

                _picIndex ++;
                _py += _heights[_picIndex - 1] + _sep;
                opt.cssOptObj.push(__optObj);
                __optObj = null;
            }

            _globBgCssObj.background = "url(" + _rFile + ") repeat-x";

            break;

        /**
         * 垂直平铺的背景
         */
        case "v-bg" :

            while(_picIndex < _len) {

                var __optObj = (_cssOptStr[_picIndex]) ? txt2opt(_cssOptStr[_picIndex], _fold, _rootOptObj) : _rootOptObj;

                __optObj.css["background-position"] = "-" + _px + "px 0";
                __optObj.css["max-width"] = _widths[_picIndex] + "px";

                _norCsscontent += _func_combine4csstxt(_cssname[_picIndex], __optObj.css, __optObj.after, __optObj.pre, __optObj.extend);

                _picIndex ++;
                _px += _widths[_picIndex - 1] + _sep;
                opt.cssOptObj.push(__optObj);
                __optObj = null;
            }

            _globBgCssObj.background = "url(" + _rFile + ") repeat-y";

            break;

        /**
         * 水平嵌套的背景
         */
        case "h-box" :

            while(_picIndex < _len) {

                var __optObj = (_cssOptStr[_picIndex]) ? txt2opt(_cssOptStr[_picIndex], _fold, _rootOptObj) : _rootOptObj;

                if (__optObj.pos === "middle") {

                    // 中部左右拉伸，仅当宽度不足时
                    __optObj.css.height = _heights[_picIndex] + "px";
                    __optObj.css["background-repeat"] = "repeat-x";
                    __optObj.css["background-position"] = "0 -" + _py + "px";

                } else if (__optObj.pos === "right") {

                    // 靠右
                    __optObj.css.height = _heights[_picIndex] + "px";
                    __optObj.css["background-position"] = "right -" + _py + "px";
                    __optObj.css["padding-right"] = _widths[_picIndex] + "px";

                } else {

                    // 一般情况
                    __optObj.css.height = _heights[_picIndex] + "px";
                    __optObj.css["background-position"] = "0 -" + _py + "px";
                    __optObj.css["padding-left"] = _widths[_picIndex] + "px";
                }

                _norCsscontent += _func_combine4csstxt(_cssname[_picIndex], __optObj.css, __optObj.after, __optObj.pre, __optObj.extend);

                _picIndex ++;
                _py += _heights[_picIndex - 1] + _sep;
                _px = 0;
                opt.cssOptObj.push(__optObj);
                
                // 重置 css 节点，以免影响之后的元素的 css
                if (__optObj.pos === "middle") {

                    // 中部
                    delete __optObj.css.height;

                } else if (__optObj.pos === "right") {

                    // 靠右
                    delete __optObj.css.height;
                    delete __optObj.css["padding-right"];

                } else {

                    // 一般情况
                    delete __optObj.css.height;
                    delete __optObj.css["padding-left"];
                }
            }

            _globBgCssObj.background = "url(" + _rFile + ") no-repeat";

            break;

        /**
         * 垂直嵌套的背景
         */
        case "v-box" :

            while(_picIndex < _len) {

                var __optObj = (_cssOptStr[_picIndex]) ? txt2opt(_cssOptStr[_picIndex], _fold, _rootOptObj) : _rootOptObj;

                if (__optObj.pos === "middle") {

                    // 中部上下拉伸，仅当宽度不足时
                    __optObj.css.width = _widths[_picIndex] + "px";
                    __optObj.css["background-repeat"] = "repeat-y";
                    __optObj.css["background-position"] = "-" + _px + "px 0";

                } else if (__optObj.pos === "bottom") {

                    // 靠下
                    __optObj.css.width = _widths[_picIndex] + "px";
                    __optObj.css["background-position"] = "-" + _px + "px bottom";
                    __optObj.css["padding-bottom"] = _heights[_picIndex] + "px";

                } else {

                    // 一般情况
                    __optObj.css.width = _widths[_picIndex] + "px";
                    __optObj.css["background-position"] = "-" + _px + "px 0";
                    __optObj.css["padding-top"] = _heights[_picIndex] + "px";
                }

                _norCsscontent += _func_combine4csstxt(_cssname[_picIndex], __optObj.css, __optObj.after, __optObj.pre, __optObj.extend);

                _picIndex ++;
                _px += _widths[_picIndex - 1] + _sep;
                _py = 0;
                opt.cssOptObj.push(__optObj);
                
                // 重置 css 节点，以免影响之后的元素的 css
                if (__optObj.pos === "middle") {

                    // 中部
                    delete __optObj.css.width;

                } else if (__optObj.pos === "bottom") {

                    // 靠下
                    delete __optObj.css.width;
                    delete __optObj.css["padding-bottom"];

                } else {

                    // 一般情况
                    delete __optObj.css.width;
                    delete __optObj.css["padding-top"];
                }
            }

            _globBgCssObj.background = "url(" + _rFile + ") no-repeat";

            break;

        /**
         * 其他排列类型则报错
         */
        default :
            throw "ERROR: operateCssObj: 你输入的 opt.type 参数不在处理范围（可为：'v-ele','h-ele','v-bg','h-bg','v-box','h-box'）内 <- " + _type;
            break;
    }

    _bgCsscontent
        += _norCsscontent
                .replace(_re_cssCon, ",\r\n")
                .replace(_re_lastDot, '')
        + " {"
        + _func_css2txt(_globBgCssObj)
        + "}\r\n";

    if (_isMinifyCss) {

        _bgCsscontent = _bgCsscontent
                            .replace(/\r\n/g, "")
                            .replace(/\s+\{/g, "{")
                            .replace(/;\}/g, "}");

        _norCsscontent = _norCsscontent
                            .replace(/\s+\{/g, "{")
                            .replace(/;\}/g, "}");
    }

    _norCsscontent = _bgCsscontent + _norCsscontent;

    // 当还有 css 块时，添加换行，
    // 到最后，将最后的换行符去掉
    if (tarObj[_css]) {

        tarObj[_css] += ( (_isMinifyCss) ? "" : "\r\n\r\n\r\n" ) + _norCsscontent.replace(/\r\n$/, "");

    } else {

        tarObj[_css] = _norCsscontent.replace(/\r\n$/, "");
    }
};