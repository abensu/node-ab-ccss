var
    fs              = require("fs"),
    path            = require("path"),
    url             = require("url"),
    images          = require("images"),
    ab_getPath      = require("./abc-util-getPath").getPath,
    ab_extend       = require("./abc-util-extend").extend,
    ab_checkMime    = require("./abc-util-checkMime").checkMime,
    ab_getType      = require("./abc-util-getType").getType,
    ab_model        = require("./abc-opt"),
    ab_optOptions   = ab_model.opt_options,
    ab_optTask      = ab_model.opt_task,
    ab_optPreOpt    = ab_model.opt_preOpt;

var
    preOpt2IdPreOpt;


/**
 * 修改预处理参数（"{$now}" -> "{xxx@$now}"）修改
 * 如果不存在于 ab_optPreOpt 中，则不作处理
 *
 * @param {string} srcStr           : [] 源字符串
 * @param {string|number} idname    : [] id 名
 *
 * @return {string}                 : [] 处理完的字符串
 */

exports.preOpt2IdPreOpt = preOpt2IdPreOpt = function(srcStr, idName) {

    return srcStr.replace(/\{\$[^{}]+\}/g, function(str) {

        var
            __name      = str
                            .replace(/^\{\s*/, '')
                            .replace(/\s*\}$/, ''),
            __isSupport = __name in ab_optPreOpt,
            __newStr    = __isSupport ? "{" + idName + "@" + __name + "}" : str;

        return __newStr;
    });
};


/**
 * 生成单个完整的任务对象
 *
 * @param {object} taskOpt  : [] 从文本转换成的基本对象（结构与 ab_optOptions 一致）
 * @param {object} baseOpt  : [ {} ] 公共参数对象（结构与 ab_optTask 一致）
 *
 * @return {object}         : [] 处理完的 task 参数对象
 */

exports.createTask = function(taskOpt, baseOpt) {

    // 退出 -> 参数类型错误
    if (ab_getType(taskOpt) !== "object") {

        throw "ERROR: createTask: 第一个参数必须为对象（第二个参数选填）<- " + taskOpt;
    }


    var
        _taskOpt    = ab_extend({}, ab_optTask, taskOpt),
        _baseOpt    = baseOpt || {},
        _baseOpt    = ab_extend({}, ab_optOptions, baseOpt),
        _fold       = _taskOpt.fold,
        _files      = [],               // 指定文件夹中的文件列表
        _re_fName   = /[^\/\\]+?$/,     // 路径中，最末的文件名
        _re_lastSep = /[\\\/]+?$/,
        _now        = new Date();;      // 去除完文件名后的最末的 "/" 或 "\"

    var __func_add0;

    _func_add0 = function(num) {

        return (num < 10 ? "0" : "") + num;
    };

    // （内部变量）id、时间

    _taskOpt._dateRaw
        = _now.getTime();

    _taskOpt._dateNow
        = ""
        + _now.getFullYear()
        + _func_add0(_now.getMonth() + 1)
        + _func_add0(_now.getDate())
        + _func_add0(_now.getHours())
        + _func_add0(_now.getMinutes())
        + _func_add0(_now.getSeconds());

    _taskOpt._id
        = _taskOpt._dateRaw
        + Math.random()
            .toString(16)
            .replace(/^0\./, "");

    // img 和 css 的路径值中的预处理变量进行处理（如 "{$now}" -> "{nnn:$now}"）
    _taskOpt.img = preOpt2IdPreOpt(_taskOpt.img, _taskOpt._id);
    _taskOpt.css = preOpt2IdPreOpt(_taskOpt.css, _taskOpt._id);


    var
        _imgUrl     = url.parse(_taskOpt.img),
        _imgSearch  = _imgUrl.search || "",
        _cssUrl     = url.parse(_taskOpt.css),
        _cssSearch  = _cssUrl.search || "";

    // 解码 search 部分
    _taskOpt._imgSearch = decodeURIComponent(_imgSearch);
    _taskOpt._cssSearch = decodeURIComponent(_cssSearch);

    // 去除 search 部分
    _taskOpt.img = _taskOpt.img.replace(/\?[^?]+$/, "");
    _taskOpt.css = _taskOpt.css.replace(/\?[^?]+$/, "");

    // 提取目录部分
    _taskOpt.imgFold = _taskOpt.img.replace(_re_fName, '').replace(_re_lastSep, '');
    _taskOpt.cssFold = _taskOpt.css.replace(_re_fName, '').replace(_re_lastSep, '');

    // 退出 <- 仅支持 png 或 jpg 输出
    if ( !_taskOpt.img.match(/\.(png|jpg)$/i) ) {

        throw "WARM: createTask: 仅支持 png 或 jpg 输出 <- " + _taskOpt.img;
    }

    // 退出 <- 目录不存在
    if (ab_getPath(_fold).status !== 1) {

        throw "ERROR: createTask: 目录不存在或为外链 <- " + _fold;
    }

    _files = fs.readdirSync(_fold);

    // 退出 <- 指定文件夹不存在图片文件
    if (!_files || _files.length === 0) {

        throw "ERROR: createTask: 指定文件夹不存在图片文件 <- " + _fold;
    }

    // 读取图片，并进行相关操作
    for (var i = 0, len = _files.length; i < len; i++) {

        var __checkVal = _files[i].match(/\.(jpg|png|gif)$/i);

        // 不添加到操作列表中 <- 文件后缀不为 jpg/png/gif
        if (!__checkVal) {

            continue;
        }

        var __imgPath = path.join(_fold, _files[i]);

        // 不添加到操作列表中 <- 文件后缀与其文件 mime 类型不匹配
        // （总处理时间增加大约 50ms）
        if (!ab_checkMime(__imgPath, __checkVal[0].replace(/^\./, ""))) {

            continue;
        }

        var
            __img       = images(__imgPath);
            __imgW      = __img.width(),
            __imgH      = __img.height(),
            __name      = _files[i]
                            .replace(/\.(jpg|png|gif)$/i, ''),   // 去掉后缀（.jpg | .png | .gif）的文件名
            __cssOptStr = (/#/.test(__name)) ?
                            __name.replace(/^[^#]*?#/, '') :
                            '' ,
            __cName     = __name
                            .replace(__cssOptStr, '')
                            .replace(/^\d+[\s]*/g,'')
                            .replace("#",'')
                            .replace(/[ ]+/g, '_');

        // 不添加到操作列表中 <- 文件名前缀为 #
        if (/^#/.test(__name)) {

            continue;
        }

        _taskOpt.filename.push(__name);
        _taskOpt.cssname.push(__cName);
        _taskOpt.cssOptStr.push(__cssOptStr);
        _taskOpt.images.push(__img);
        _taskOpt.imagesPath.push(__imgPath);
        _taskOpt.widths.push(__imgW);
        _taskOpt.heights.push(__imgH);
        _taskOpt.maxWidth = (__imgW > _taskOpt.maxWidth) ? __imgW : _taskOpt.maxWidth;
        _taskOpt.maxHeight = (__imgH > _taskOpt.maxHeight) ? __imgH : _taskOpt.maxHeight;
        _taskOpt.totalWidth += __imgW;
        _taskOpt.totalHeight += __imgH;

        // 子类操作参数继承基类操作参数
        _taskOpt.opt = ab_extend({}, _baseOpt, _taskOpt.opt);
    }

    return _taskOpt;
};