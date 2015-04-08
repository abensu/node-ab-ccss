var
    cluster     = require("cluster"),
    images      = require("images"),
    path        = require("path"),
    ab_setPath  = require("./abc-util-setPath").setPath,
    ab_getType  = require("./abc-util-getType").getType,
    ab_md5      = require("./abc-util-md5").md5;


/**
 * 生成对应合成图片
 *
 * @param {object} opt          : [ TASKLIST[n] ] TASKLIST 的元素
 * @param {number} taskIndex    : [] TASKLIST 的元素的索引值
 */

exports.createImg = function (opt, taskIndex) {

    var
        _root           = opt.root,
        _images         = opt.images,
        _imagesPath     = opt.imagesPath,
        _img            = opt.img,
        _imgFold        = opt.imgFold,
        _cssOptObj      = opt.cssOptObj,
        _opt            = opt.opt,
        _widths         = opt.widths,
        _heights        = opt.heights,
        _maxWidth       = opt.maxWidth,
        _maxHeight      = opt.maxHeight,
        _totalWidth     = opt.totalWidth,
        _totalHeight    = opt.totalHeight,
        _bgColor        = opt["bgColor-img"],
        _bgColor        = _bgColor ? JSON.parse('[' + _bgColor + ']') : [0xff, 0xff, 0xff, 0],
        _len            = _images.length,
        _sep            = isNaN(_opt.sep) ? 0 : _opt.sep,
        _type           = _opt.type,
        _qualityImg     = (isNaN(_opt["quality-img"])) ? 100 : _opt["quality-img"];

    var _newImg,
        _index          = 0,
        _px             = 0,
        _py             = 0,
        _bgImg;

    var _func_exportImg;

    /**
     * 生成图片
     *
     * @info 当图片文件名后缀为 png 或 jpg，透明度 alpha 做相应的处理
     *
     * @param {string} imgName      : [] 生成图片的路径
     * @param {object} srcImages    : [] 添加好图片的 images 对象
     * @param {object} bgImages     : [] 用于做 jpg 背景的 images 对象
     * @param {array} bgColor       : [] 背景色数组 [red, green, blue, alpha]
     * @param {number} quality      : [] 图片质量，取值范围 0 至 1
     * @param {function} callback   : [ function() ] 回调函数
     */
    _func_exportImg = function(imgName, srcImages, bgImages, bgColor, quality, callback) {

        if (/\.png$/i.test(imgName)) {

            srcImages.save(imgName, {"quality" : quality});

        } else if (/\.jpg$/i.test(imgName)) {

            bgColor[3] = 1;
            bgImages
                .fill(bgColor[0], bgColor[1], bgColor[2], bgColor[3])
                .draw(srcImages, 0, 0)
                .save(imgName, {"quality" : quality});
        }

        (typeof callback === "function") && callback();
    };

    switch(_type) {

        /**
         * 水平排列的独立图片
         */
        case "h-ele" :
            _newImg = images(_totalWidth + (_len - 1) * _sep, _maxHeight);
            _bgImg  = images(_totalWidth + (_len - 1) * _sep, _maxHeight);

            while(_index < _len) {

                // 垂直居中
                if (_cssOptObj[_index].pos === "middle") {
                    _py = (_maxHeight - _heights[_index])/2;
                }

                // 靠下
                if (_cssOptObj[_index].pos === "bottom") {
                    _py = _maxHeight - _heights[_index];
                }

                // _newImg = _newImg.draw(_images[_index], _px, _py); // 主程调用，拼接图片
                _newImg = _newImg.draw(images(_imagesPath[_index]), _px, _py); // 子程调用，拼接图片
                _index ++;
                _px += _widths[_index - 1] + _sep;
                _py = 0;
            }
            break;

        /**
         * 垂直排列的独立图片
         */
        case "v-ele" :
            _newImg = images(_maxWidth, _totalHeight + (_len - 1) * _sep);
            _bgImg  = images(_maxWidth, _totalHeight + (_len - 1) * _sep);

            while(_index < _len) {

                // 左右居中
                if (_cssOptObj[_index].pos === "middle") {
                    _px = (_maxWidth - _widths[_index])/2;
                }

                // 靠右
                if (_cssOptObj[_index].pos === "right") {
                    _px = _maxWidth - _widths[_index];
                }

                // _newImg = _newImg.draw(_images[_index], _px, _py); // 主程调用，拼接图片
                _newImg = _newImg.draw(images(_imagesPath[_index]), _px, _py); // 子程调用，拼接图片
                _index ++;
                _py += _heights[_index - 1] + _sep;
                _px = 0;
            }
            break;

        /**
         * 水平平铺的背景
         */
        case "h-bg" :
            _newImg = images(_maxWidth, _totalHeight + (_len - 1) * _sep);
            _bgImg  = images(_maxWidth, _totalHeight + (_len - 1) * _sep);

            while(_index < _len) {
                // _newImg = _newImg.draw(_images[_index].width(_maxWidth), _px, _py); // 主程调用，拼接图片
                _newImg = _newImg.draw(images(_imagesPath[_index]).width(_maxWidth), _px, _py); // 子程调用，拼接图片
                _index ++;
                _py += _heights[_index - 1] + _sep;
            }
            break;

        /**
         * 垂直平铺的背景
         */
        case "v-bg" :
            _newImg = images(_totalWidth + (_len - 1) * _sep, _maxHeight);
            _bgImg  = images(_totalWidth + (_len - 1) * _sep, _maxHeight);

            while(_index < _len) {
                // _newImg = _newImg.draw(_images[_index].height(_maxHeight), _px, _py); // 主程调用，拼接图片
                _newImg = _newImg.draw(images(_imagesPath[_index]).height(_maxHeight), _px, _py); // 子程调用，拼接图片
                _index ++;
                _px += _widths[_index - 1] + _sep;
            }
            break;

        /**
         * 水平嵌套的背景
         */
        case "h-box" :
            _newImg = images(_maxWidth, _totalHeight + (_len - 1) * _sep);
            _bgImg  = images(_maxWidth, _totalHeight + (_len - 1) * _sep);

            while(_index < _len) {
                var __w = _widths[_index];

                // 中部左右拉伸，仅当宽度不足时
                if (_cssOptObj[_index].pos === "middle") {
                    __w = (__w !== _maxWidth) ? _maxWidth : __w;
                }

                // 靠右
                if (_cssOptObj[_index].pos === "right") {
                    _px = _maxWidth - _widths[_index];
                }

                // _newImg = _newImg.draw(_images[_index].width(__w), _px, _py); // 主程调用，拼接图片
                _newImg = _newImg.draw(images(_imagesPath[_index]).width(__w), _px, _py); // 子程调用，拼接图片
                _index ++;
                _py += _heights[_index - 1] + _sep;
                _px = 0;
            }
            break;

        /**
         * 垂直嵌套的背景
         */
        case "v-box" :
            _newImg = images(_totalWidth + (_len - 1) * _sep, _maxHeight);
            _bgImg  = images(_totalWidth + (_len - 1) * _sep, _maxHeight);

            while(_index < _len) {
                var __h = _heights[_index];

                // 中部上下拉伸，仅当宽度不足时
                if (_cssOptObj[_index].pos === "middle") {
                    __h = (__h !== _maxHeight) ? _maxHeight : __h;
                }

                // 靠下
                if (_cssOptObj[_index].pos === "bottom") {
                    _py = _maxHeight - _heights[_index];
                }

                // _newImg = _newImg.draw(_images[_index].height(__h), _px, _py); // 主程调用，拼接图片
                _newImg = _newImg.draw(images(_imagesPath[_index]).height(__h), _px, _py); // 子程调用，拼接图片
                _index ++;
                _px += _widths[_index - 1] + _sep;
                _py = 0;
            }
            break;

        default :
            throw "ERROR: createImg: 你输入的 opt 参数不在处理范围内";
            break;
    }

    // 生成图片目录
    ab_setPath(_imgFold);

    // 生成额外类型的图片（mutilExportImg）
    if (_opt.mutilExportImg) {

        // 正则-所支持图片输出类型
        var _re_imgType = /\.(jpg|png)$/i;

        switch(ab_getType(_opt.mutilExportImg)) {

            case "array" :
                for (var __i = _opt.mutilExportImg.length; __i--;) {

                    var __imgPath = path.join(_imgFold, _opt.mutilExportImg[__i]);

                    _re_imgType.lastIndex = 0;

                    if (!_re_imgType.test(__imgPath)) {

                        throw "ERROR: createImg: mutilExportImg 参数值为非支持的输出类型 <- " + __imgPath;
                    }

                    _func_exportImg(__imgPath, _newImg, _bgImg, _bgColor, _qualityImg);

                    console.log("生成额外类型的图片（mutilExportImg） <- " + __imgPath);
                }
                break;

            case "string" :
                var __imgPath = path.join(_imgFold, _opt.mutilExportImg);

                _re_imgType.lastIndex = 0;

                if (!_re_imgType.test(__imgPath)) {

                    throw "ERROR: createImg: mutilExportImg 参数值为非支持的输出类型 <- " + __imgPath;

                } else {

                    _func_exportImg(__imgPath, _newImg, _bgImg, _bgColor, _qualityImg);

                    console.log("生成额外类型的图片（mutilExportImg） <- " + __imgPath);
                }
                break;

            default :
                throw "ERROR: createImg: mutilExportImg 参数值仅支持数组或字符串 <-" + _opt.mutilExportImg;
                break;
        }
    }

    // 生成图片
    _func_exportImg(_img, _newImg, _bgImg, _bgColor, _qualityImg, function() {

        // 获取生成图片的 md5 码
        ab_md5(_img, function(md5) {

            opt._imgMd5 = md5;

            // 当为子程时调用
            if (cluster.isWorker) {
                console.log("level 2 => id : " + cluster.worker.id + " => 生成 : " + _img);
                process.send({status:2, msg:"finish", taskIndex: taskIndex, md5: md5}); // 返回信息给子程主程（level 3）
            }
        });
    });
};