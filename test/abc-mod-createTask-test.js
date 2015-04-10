var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-mod-createTask'),
    ab_extend   = require('../src/abc-util-extend').extend,
    ab_opt      = require('../src/abc-opt'),
    ab_opt_task = ab_opt.opt_task,
    ab_opt_opts = ab_opt.opt_options,
    path        = require('path');

describe('abc-mod-createTask', function() {

    var
        _root       = path.join(__dirname, 'abc-mod-createTask'),
        _taskOpt1   = {
                            "root"  : _root,
                            "fold"  : path.join(_root, "src"),
                            "img"   : path.join(_root, "images/img.png"),
                            "css"   : path.join(_root, "css/ccss.css")
                        },
        _taskOpt2   = {
                            "root"  : _root,
                            "fold"  : path.join(_root, "src"),
                            "img"   : path.join(_root, "images{$md5}/img.png?v={$now}"),
                            "css"   : path.join(_root, "{$now}css/ccss.css?v={$md5}")
                        },
        _tarOpt1    = {},
        _tarOpt2    = {};

    it('成功: 对象一致（不带 "{$xxx}"）: createTask(' + JSON.stringify(_taskOpt1) + ')', function() {

        var
            _reObj = testTar.createTask(_taskOpt1),
            _re_lastFileName = /[\\\/]+[^\\\/]+$/;

        _tarOpt1 = ab_extend({}, ab_opt_task);

        // 设置参数
        _tarOpt1.root       = _taskOpt1.root;
        _tarOpt1.fold       = _taskOpt1.fold;
        _tarOpt1.img        = _taskOpt1.img;
        _tarOpt1.imgFold    = _taskOpt1.img.replace(_re_lastFileName, '');
        _tarOpt1.css        = _taskOpt1.css;
        _tarOpt1.cssFold    = _tarOpt1.css.replace(_re_lastFileName, '');
        _tarOpt1.opt        = ab_extend({}, ab_opt_opts);
        _tarOpt1.filename   = [ 'gif', 'jpg', 'png' ];
        _tarOpt1.cssname    = [ 'gif', 'jpg', 'png' ];
        _tarOpt1.cssOptStr  = [ '', '', '' ];
        _tarOpt1.cssOptObj  = [];
        _tarOpt1.imagesPath = [
                                    path.join(__dirname, 'abc-mod-createTask', 'src/gif.gif'),
                                    path.join(__dirname, 'abc-mod-createTask', 'src/jpg.jpg'),
                                    path.join(__dirname, 'abc-mod-createTask', 'src/png.png')
                                ];
        _tarOpt1.widths     = [ 60, 60, 60 ];
        _tarOpt1.heights    = [ 30, 30, 30 ];
        _tarOpt1.maxWidth   = 60;
        _tarOpt1.maxHeight  = 30;
        _tarOpt1.totalWidth = 180;
        _tarOpt1.totalHeight = 90;

        expect(_reObj.images.length).to.equal(_reObj.imagesPath.length);

        delete _reObj.images;
        delete _tarOpt1.images;

        expect(_reObj._id).to.not.equal(_tarOpt2._id);
        expect(_reObj._dateRaw).to.not.equal(_tarOpt2._dateRaw);
        expect(_reObj._dateNow).to.not.equal(_tarOpt2._dateNow);

        delete _reObj._id;
        delete _reObj._dateRaw;
        delete _reObj._dateNow;
        delete _tarOpt1._id;
        delete _tarOpt1._dateRaw;
        delete _tarOpt1._dateNow;

        expect(_reObj).to.eql(_tarOpt1);
    });

    it('成功: 对象一致（带 "{$xxx}: createTask(' + JSON.stringify(_taskOpt2) + ')', function() {

        var
            _reObj = testTar.createTask(_taskOpt2),
            _re_lastFileName = /[\\\/]+[^\\\/]+$/;

        _tarOpt2 = ab_extend({}, ab_opt_task);

        // 设置参数
        _tarOpt2.root       = _taskOpt2.root;
        _tarOpt2.fold       = _taskOpt2.fold;
        _tarOpt2.img        = _taskOpt2.img
                                .replace(/\?[^?]+$/, "")
                                .replace("{$md5}", "{" + _reObj._id + "@$md5}")
                                .replace("{$now}", "{" + _reObj._id + "@$now}");
        _tarOpt2.imgFold    = _tarOpt2.img
                                .replace(_re_lastFileName, '');
        _tarOpt2.css        = _taskOpt2.css
                                .replace(/\?[^?]+$/, "")
                                .replace("{$md5}", "{" + _reObj._id + "@$md5}")
                                .replace("{$now}", "{" + _reObj._id + "@$now}");
        _tarOpt2.cssFold    = _tarOpt2.css
                                .replace(_re_lastFileName, '');
        _tarOpt2.opt        = ab_extend({}, ab_opt_opts);
        _tarOpt2.filename   = [ 'gif', 'jpg', 'png' ];
        _tarOpt2.cssname    = [ 'gif', 'jpg', 'png' ];
        _tarOpt2.cssOptStr  = [ '', '', '' ];
        _tarOpt2.cssOptObj  = [];
        _tarOpt2.imagesPath = [
                                    path.join(__dirname, 'abc-mod-createTask', 'src/gif.gif'),
                                    path.join(__dirname, 'abc-mod-createTask', 'src/jpg.jpg'),
                                    path.join(__dirname, 'abc-mod-createTask', 'src/png.png')
                                ];
        _tarOpt2.widths     = [ 60, 60, 60 ];
        _tarOpt2.heights    = [ 30, 30, 30 ];
        _tarOpt2.maxWidth   = 60;
        _tarOpt2.maxHeight  = 30;
        _tarOpt2.totalWidth = 180;
        _tarOpt2.totalHeight = 90;
        _tarOpt2._imgSearch = "?v={" + _reObj._id + "@$now}";
        _tarOpt2._cssSearch = "?v={" + _reObj._id + "@$md5}";

        expect(_reObj.images.length).to.equal(_reObj.imagesPath.length);

        delete _reObj.images;
        delete _tarOpt2.images;

        expect(_reObj._id).to.not.equal(_tarOpt2._id);
        expect(_reObj._dateRaw).to.not.equal(_tarOpt2._dateRaw);
        expect(_reObj._dateNow).to.not.equal(_tarOpt2._dateNow);

        delete _reObj._id;
        delete _reObj._dateRaw;
        delete _reObj._dateNow;
        delete _tarOpt2._id;
        delete _tarOpt2._dateRaw;
        delete _tarOpt2._dateNow;

        expect(_reObj).to.eql(_tarOpt2);
    });
});