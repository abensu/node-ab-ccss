var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    path        = require('path'),
    testTar     = require('../src/abc-mod-operateCssObj'),
    ab_cTask    = require('../src/abc-mod-createTask');

describe('abc-mod-operateCssObj', function() {

    describe('1、txt2opt', function() {

        it('文件名内联内容: 成功: 属性值对被支持: pos=middle', function() {

            var
                _task   = "pos=middle",
                _tarObj = { pos: 'middle' },
                _reObj  = testTar._txt2opt(_task, '', {});

            expect(_reObj).to.eql(_reObj);
        });

        it('文件名内联内容: 失败: 属性值对不被支持: css=display:block', function() {

            var
                _task   = "css=display:block",
                _tarObj = {},
                _test   = function() { testTar._txt2opt(_task, '', {}); };

            expect(_test).to.throw(/ERROR/);
        });

        it('文档文件: 成功: 文件存在', function() {

            var
                _task   = "icon.txt",
                _tarObj = {
                                after: ['$self', ':link', ':visited', ':hover', '::eq(1)', ':after', '[hello="123"]'],
                                css: { color: '#999', '-moz-text-over': 'hidden', hello: '7 0px' },
                                pre: [ 'input', '.hello', '#hhh' ],
                                extend: [ '.btn_s2:hover', '#hellllll .btn_s3:hover' ],
                                pos: 'middle'
                            },
                _reObj  = testTar._txt2opt(_task, 'abc-mod-operateCssObj/txt2opt/file', {});

            expect(_reObj).to.eql(_tarObj);
        });

        it('文档文件: 失败: 文件不存在', function() {

            var
                _task   = "nofile.txt",
                _tarObj = {},
                _test   = function() { testTar._txt2opt(_task, '', {}); };

            expect(_test).to.throw(/ERROR/);
        });
    });

    describe('2、6 种类型（节点 img 和 css 都不带 {xxx} 参数）', function() {

        var _root = path.join(__dirname, 'abc-mod-operateCssObj');

        it('单文件夹，v-ele 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/v-ele"),
                                    "img"   : path.join(_root, "images/v-ele.png"),
                                    "css"   : path.join(_root, "css/ccss.css"),
                                    "opt"   : {"type": "v-ele"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _tarOpt     = '.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images/v-ele.png) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:0 -0px;}\r\n.icon_mail_green {width:12px;height:9px;background-position:0 -27px;}\r\n.icon_num_red {width:17px;height:17px;background-position:0 -36px;}',
                _name       = _taskOpt.css;

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，h-ele 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/h-ele"),
                                    "img"   : path.join(_root, "images/h-ele.png"),
                                    "css"   : path.join(_root, "css/ccss.css"),
                                    "opt"   : {"type": "h-ele"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _tarOpt     = '.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images/h-ele.png) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:-0px 0;}\r\n.icon_mail_green {width:12px;height:9px;background-position:-26px 0;}\r\n.icon_num_red {width:17px;height:17px;background-position:-38px 0;}',
                _name       = _taskOpt.css;

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，v-bg 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/v-bg"),
                                    "img"   : path.join(_root, "images/v-bg.png"),
                                    "css"   : path.join(_root, "css/ccss.css"),
                                    "opt"   : {"type": "v-bg"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _tarOpt     = '.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images/v-bg.png) repeat-y;}\r\n.bg_gass {background-position:-0px 0;max-width:75px;}\r\n.bg_glass_sep {background-position:-75px 0;max-width:20px;}\r\n.bg_tab {background-position:-95px 0;max-width:240px;}',
                _name       = _taskOpt.css;

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，h-bg 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/h-bg"),
                                    "img"   : path.join(_root, "images/h-bg.png"),
                                    "css"   : path.join(_root, "css/ccss.css"),
                                    "opt"   : {"type": "h-bg"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _tarOpt     = '.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images/h-bg.png) repeat-x;}\r\n.bg_gass {background-position:0 -0px;min-height:75px;}\r\n.bg_glass_sep {background-position:0 -75px;min-height:34px;}\r\n.bg_tab {background-position:0 -109px;min-height:116px;}',
                _name       = _taskOpt.css;

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，v-box 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/v-box"),
                                    "img"   : path.join(_root, "images/v-box.png"),
                                    "css"   : path.join(_root, "css/ccss.css"),
                                    "opt"   : {"type": "v-box"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _tarOpt     = '.indexSideBox,\r\n.indexSideBox_box,\r\n.indexSideBox_inner {background:url(../images/v-box.png);}\r\n.indexSideBox {width:56px;background-repeat:no-repeat;background-position:-0px 0;padding-top:30px;}\r\n.indexSideBox_box {background-repeat:repeat-y;background-position:-56px 0;width:56px;}\r\n.indexSideBox_inner {background-repeat:no-repeat;background-position:-112px bottom;width:56px;padding-bottom:31px;}',
                _name       = _taskOpt.css;

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，h-box 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/h-box"),
                                    "img"   : path.join(_root, "images/h-box.png"),
                                    "css"   : path.join(_root, "css/ccss.css"),
                                    "opt"   : {"type": "h-box"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _tarOpt     = '.indexHeadBox,\r\n.indexHeadBox_box,\r\n.indexHeadBox_inner {background:url(../images/h-box.png);}\r\n.indexHeadBox {height:56px;background-repeat:no-repeat;background-position:0 -0px;padding-left:30px;}\r\n.indexHeadBox_box {background-repeat:repeat-x;background-position:0 -56px;height:56px;}\r\n.indexHeadBox_inner {background-repeat:no-repeat;background-position:right -112px;height:56px;padding-right:31px;}',
                _name       = _taskOpt.css;

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('多文件夹，6 种类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskList   = [
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/v-ele"),
                                        "img"   : path.join(_root, "images/v-ele.png"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "v-ele"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/h-ele"),
                                        "img"   : path.join(_root, "images/h-ele.png"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "h-ele"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/v-bg"),
                                        "img"   : path.join(_root, "images/v-bg.png"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "v-bg"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/h-bg"),
                                        "img"   : path.join(_root, "images/h-bg.png"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "h-bg"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/v-box"),
                                        "img"   : path.join(_root, "images/v-box.png"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "v-box"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/h-box"),
                                        "img"   : path.join(_root, "images/h-box.png"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "h-box"}
                                    }
                                ],
                _cssObj     = {},
                _tarOpt     = '.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images/v-ele.png) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:0 -0px;}\r\n.icon_mail_green {width:12px;height:9px;background-position:0 -27px;}\r\n.icon_num_red {width:17px;height:17px;background-position:0 -36px;}\r\n\r\n\r\n.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images/h-ele.png) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:-0px 0;}\r\n.icon_mail_green {width:12px;height:9px;background-position:-26px 0;}\r\n.icon_num_red {width:17px;height:17px;background-position:-38px 0;}\r\n\r\n\r\n.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images/v-bg.png) repeat-y;}\r\n.bg_gass {background-position:-0px 0;max-width:75px;}\r\n.bg_glass_sep {background-position:-75px 0;max-width:20px;}\r\n.bg_tab {background-position:-95px 0;max-width:240px;}\r\n\r\n\r\n.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images/h-bg.png) repeat-x;}\r\n.bg_gass {background-position:0 -0px;min-height:75px;}\r\n.bg_glass_sep {background-position:0 -75px;min-height:34px;}\r\n.bg_tab {background-position:0 -109px;min-height:116px;}\r\n\r\n\r\n.indexSideBox,\r\n.indexSideBox_box,\r\n.indexSideBox_inner {background:url(../images/v-box.png);}\r\n.indexSideBox {width:56px;background-repeat:no-repeat;background-position:-0px 0;padding-top:30px;}\r\n.indexSideBox_box {background-repeat:repeat-y;background-position:-56px 0;width:56px;}\r\n.indexSideBox_inner {background-repeat:no-repeat;background-position:-112px bottom;width:56px;padding-bottom:31px;}\r\n\r\n\r\n.indexHeadBox,\r\n.indexHeadBox_box,\r\n.indexHeadBox_inner {background:url(../images/h-box.png);}\r\n.indexHeadBox {height:56px;background-repeat:no-repeat;background-position:0 -0px;padding-left:30px;}\r\n.indexHeadBox_box {background-repeat:repeat-x;background-position:0 -56px;height:56px;}\r\n.indexHeadBox_inner {background-repeat:no-repeat;background-position:right -112px;height:56px;padding-right:31px;}',
                _name       = _taskList[0].css;

            for (var _i = 0, _len = _taskList.length; _i < _len; _i++) {

                var _lstTask    = ab_cTask.createTask(_taskList[_i]);

                testTar.operateCssObj(_lstTask, _cssObj);
            }

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });
    });

    describe('3、6 种类型（节点 img 和 css 都带 {$xxx} 参数）', function() {

        var _root = path.join(__dirname, 'abc-mod-operateCssObj');

        it('单文件夹，v-ele 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/v-ele"),
                                    "img"   : path.join(_root, "images-{$md5}/v-ele{$noThisType}.png?v={$now}"),
                                    "css"   : path.join(_root, "css{$noThisType}/ccss{$md5}.css"),
                                    "opt"   : {"type": "v-ele"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _id         = _lstTask._id,
                _tarOpt     = '.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images-{' + _id + '@$md5}/v-ele{$noThisType}.png?v={' + _id + '@$now}) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:0 -0px;}\r\n.icon_mail_green {width:12px;height:9px;background-position:0 -27px;}\r\n.icon_num_red {width:17px;height:17px;background-position:0 -36px;}',
                _name       = _taskOpt.css.replace("{$md5}", "{" + _id + "@$md5}");

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，h-ele 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/h-ele"),
                                    "img"   : path.join(_root, "images-{$md5}/h-ele{$noThisType}.png?v={$now}"),
                                    "css"   : path.join(_root, "css{$noThisType}/ccss{$md5}.css"),
                                    "opt"   : {"type": "h-ele"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _id         = _lstTask._id,
                _tarOpt     = '.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images-{' + _id + '@$md5}/h-ele{$noThisType}.png?v={' + _id + '@$now}) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:-0px 0;}\r\n.icon_mail_green {width:12px;height:9px;background-position:-26px 0;}\r\n.icon_num_red {width:17px;height:17px;background-position:-38px 0;}',
                _name       = _taskOpt.css.replace("{$md5}", "{" + _id + "@$md5}");

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，v-bg 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/v-bg"),
                                    "img"   : path.join(_root, "images-{$md5}/v-bg{$noThisType}.png?v={$now}"),
                                    "css"   : path.join(_root, "css{$noThisType}/ccss{$md5}.css"),
                                    "opt"   : {"type": "v-bg"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _id         = _lstTask._id,
                _tarOpt     = '.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images-{' + _id + '@$md5}/v-bg{$noThisType}.png?v={' + _id + '@$now}) repeat-y;}\r\n.bg_gass {background-position:-0px 0;max-width:75px;}\r\n.bg_glass_sep {background-position:-75px 0;max-width:20px;}\r\n.bg_tab {background-position:-95px 0;max-width:240px;}',
                _name       = _taskOpt.css.replace("{$md5}", "{" + _id + "@$md5}");

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，h-bg 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/h-bg"),
                                    "img"   : path.join(_root, "images-{$md5}/h-bg{$noThisType}.png?v={$now}"),
                                    "css"   : path.join(_root, "css{$noThisType}/ccss{$md5}.css"),
                                    "opt"   : {"type": "h-bg"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _id         = _lstTask._id,
                _tarOpt     = '.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images-{' + _id + '@$md5}/h-bg{$noThisType}.png?v={' + _id + '@$now}) repeat-x;}\r\n.bg_gass {background-position:0 -0px;min-height:75px;}\r\n.bg_glass_sep {background-position:0 -75px;min-height:34px;}\r\n.bg_tab {background-position:0 -109px;min-height:116px;}',
                _name       = _taskOpt.css.replace("{$md5}", "{" + _id + "@$md5}");

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，v-box 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/v-box"),
                                    "img"   : path.join(_root, "images-{$md5}/v-box{$noThisType}.png?v={$now}"),
                                    "css"   : path.join(_root, "css{$noThisType}/ccss{$md5}.css"),
                                    "opt"   : {"type": "v-box"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _id         = _lstTask._id,
                _tarOpt     = '.indexSideBox,\r\n.indexSideBox_box,\r\n.indexSideBox_inner {background:url(../images-{' + _id + '@$md5}/v-box{$noThisType}.png?v={' + _id + '@$now});}\r\n.indexSideBox {width:56px;background-repeat:no-repeat;background-position:-0px 0;padding-top:30px;}\r\n.indexSideBox_box {background-repeat:repeat-y;background-position:-56px 0;width:56px;}\r\n.indexSideBox_inner {background-repeat:no-repeat;background-position:-112px bottom;width:56px;padding-bottom:31px;}',
                _name       = _taskOpt.css.replace("{$md5}", "{" + _id + "@$md5}");

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('单文件夹，h-box 类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskOpt    = {
                                    "root"  : _root,
                                    "fold"  : path.join(_root, "../abc-test-src/h-box"),
                                    "img"   : path.join(_root, "images-{$md5}/h-box{$noThisType}.png?v={$now}"),
                                    "css"   : path.join(_root, "css{$noThisType}/ccss{$md5}.css"),
                                    "opt"   : {"type": "h-box"}
                                },
                _cssObj     = {},
                _lstTask    = ab_cTask.createTask(_taskOpt),
                _id         = _lstTask._id,
                _tarOpt     = '.indexHeadBox,\r\n.indexHeadBox_box,\r\n.indexHeadBox_inner {background:url(../images-{' + _id + '@$md5}/h-box{$noThisType}.png?v={' + _id + '@$now});}\r\n.indexHeadBox {height:56px;background-repeat:no-repeat;background-position:0 -0px;padding-left:30px;}\r\n.indexHeadBox_box {background-repeat:repeat-x;background-position:0 -56px;height:56px;}\r\n.indexHeadBox_inner {background-repeat:no-repeat;background-position:right -112px;height:56px;padding-right:31px;}',
                _name       = _taskOpt.css.replace("{$md5}", "{" + _id + "@$md5}");

            testTar.operateCssObj(_lstTask, _cssObj);

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });

        it('多文件夹，6 种类型: 成功: 对象一致: operateCssObj({"root": ..., "fold": ..., "img": ..., "css": ...})', function() {

            var
                _taskList   = [
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/v-ele"),
                                        "img"   : path.join(_root, "images/v-ele.png?v={$md5}"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "v-ele"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/h-ele"),
                                        "img"   : path.join(_root, "images/h-ele.png?v={$md5}"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "h-ele"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/v-bg"),
                                        "img"   : path.join(_root, "images/v-bg.png?v={$md5}"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "v-bg"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/h-bg"),
                                        "img"   : path.join(_root, "images/h-bg.png?v={$md5}"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "h-bg"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/v-box"),
                                        "img"   : path.join(_root, "images/v-box.png?v={$md5}"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "v-box"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "../abc-test-src/h-box"),
                                        "img"   : path.join(_root, "images/h-box.png?v={$md5}"),
                                        "css"   : path.join(_root, "css/ccss.css"),
                                        "opt"   : {"type": "h-box"}
                                    }
                                ],
                _cssObj     = {},
                // 下面字符串中的 "[n]" 是需要替换成 id 的
                _tarOpt     = '.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images/v-ele.png?v={[0]@$md5}) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:0 -0px;}\r\n.icon_mail_green {width:12px;height:9px;background-position:0 -27px;}\r\n.icon_num_red {width:17px;height:17px;background-position:0 -36px;}\r\n\r\n\r\n.icon_leaf,\r\n.icon_mail_green,\r\n.icon_num_red {background:url(../images/h-ele.png?v={[1]@$md5}) no-repeat;}\r\n.icon_leaf {width:26px;height:27px;background-position:-0px 0;}\r\n.icon_mail_green {width:12px;height:9px;background-position:-26px 0;}\r\n.icon_num_red {width:17px;height:17px;background-position:-38px 0;}\r\n\r\n\r\n.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images/v-bg.png?v={[2]@$md5}) repeat-y;}\r\n.bg_gass {background-position:-0px 0;max-width:75px;}\r\n.bg_glass_sep {background-position:-75px 0;max-width:20px;}\r\n.bg_tab {background-position:-95px 0;max-width:240px;}\r\n\r\n\r\n.bg_gass,\r\n.bg_glass_sep,\r\n.bg_tab {background:url(../images/h-bg.png?v={[3]@$md5}) repeat-x;}\r\n.bg_gass {background-position:0 -0px;min-height:75px;}\r\n.bg_glass_sep {background-position:0 -75px;min-height:34px;}\r\n.bg_tab {background-position:0 -109px;min-height:116px;}\r\n\r\n\r\n.indexSideBox,\r\n.indexSideBox_box,\r\n.indexSideBox_inner {background:url(../images/v-box.png?v={[4]@$md5});}\r\n.indexSideBox {width:56px;background-repeat:no-repeat;background-position:-0px 0;padding-top:30px;}\r\n.indexSideBox_box {background-repeat:repeat-y;background-position:-56px 0;width:56px;}\r\n.indexSideBox_inner {background-repeat:no-repeat;background-position:-112px bottom;width:56px;padding-bottom:31px;}\r\n\r\n\r\n.indexHeadBox,\r\n.indexHeadBox_box,\r\n.indexHeadBox_inner {background:url(../images/h-box.png?v={[5]@$md5});}\r\n.indexHeadBox {height:56px;background-repeat:no-repeat;background-position:0 -0px;padding-left:30px;}\r\n.indexHeadBox_box {background-repeat:repeat-x;background-position:0 -56px;height:56px;}\r\n.indexHeadBox_inner {background-repeat:no-repeat;background-position:right -112px;height:56px;padding-right:31px;}',
                _name       = _taskList[0].css;

            for (var _i = 0, _len = _taskList.length; _i < _len; _i++) {

                var _lstTask = ab_cTask.createTask(_taskList[_i]);

                testTar.operateCssObj(_lstTask, _cssObj);

                _tarOpt = _tarOpt.replace("[" + _i + "]", _lstTask._id);
            }

            expect(_cssObj[_name]).to.equal(_tarOpt);
            // console.dir(_lstTask);
            // console.dir(_cssObj);
        });
    });
});