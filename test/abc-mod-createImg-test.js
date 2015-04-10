var
    chai            = require('chai'),
    assert          = chai.assert,
    expect          = chai.expect,
    should          = chai.should(),
    path            = require('path'),
    fs              = require('fs'),
    child_process   = require('child_process'),
    testTar         = require('../src/abc-mod-createImg'),
    ab_optCssObj    = require('../src/abc-mod-operateCssObj'),
    ab_cTask        = require('../src/abc-mod-createTask'),
    ab_md5          = require('../src/abc-util-md5');

describe('abc-mod-createImg', function() {

    var
        _tarRootPath    = path.join(__dirname, "abc-mod-createImg"),
        _tarImgPath     = path.join(_tarRootPath, "images"),
        _time           = (new Date).getTime();

    // 先清除指定文件夹
    if (fs.existsSync(_tarImgPath)) {

        child_process.execSync('rm -rf ' + _tarImgPath);
    }

    it('成功: 图片（md5）一致: createImg()', function(done) {

        var
            _taskList   = [
                                {
                                    "root"  : _tarRootPath,
                                    "fold"  : path.join(_tarRootPath, "../abc-test-src/v-ele"),
                                    "img"   : path.join(_tarRootPath, "images/" + _time + "/v-ele.png"),
                                    "css"   : path.join(_tarRootPath, "css/ccss.css"),
                                    "opt"   : {"type": "v-ele"}
                                },
                                {
                                    "root"  : _tarRootPath,
                                    "fold"  : path.join(_tarRootPath, "../abc-test-src/h-ele"),
                                    "img"   : path.join(_tarRootPath, "images/" + _time + "/h-ele.png"),
                                    "css"   : path.join(_tarRootPath, "css/ccss.css"),
                                    "opt"   : {"type": "h-ele"}
                                },
                                {
                                    "root"  : _tarRootPath,
                                    "fold"  : path.join(_tarRootPath, "../abc-test-src/v-bg"),
                                    "img"   : path.join(_tarRootPath, "images/" + _time + "/v-bg.png"),
                                    "css"   : path.join(_tarRootPath, "css/ccss.css"),
                                    "opt"   : {"type": "v-bg"}
                                },
                                {
                                    "root"  : _tarRootPath,
                                    "fold"  : path.join(_tarRootPath, "../abc-test-src/h-bg"),
                                    "img"   : path.join(_tarRootPath, "images/" + _time + "/h-bg.png"),
                                    "css"   : path.join(_tarRootPath, "css/ccss.css"),
                                    "opt"   : {"type": "h-bg"}
                                },
                                {
                                    "root"  : _tarRootPath,
                                    "fold"  : path.join(_tarRootPath, "../abc-test-src/v-box"),
                                    "img"   : path.join(_tarRootPath, "images/" + _time + "/v-box.png"),
                                    "css"   : path.join(_tarRootPath, "css/ccss.css"),
                                    "opt"   : {"type": "v-box"}
                                },
                                {
                                    "root"  : _tarRootPath,
                                    "fold"  : path.join(_tarRootPath, "../abc-test-src/h-box"),
                                    "img"   : path.join(_tarRootPath, "images/" + _time + "/h-box.png"),
                                    "css"   : path.join(_tarRootPath, "css/ccss.css"),
                                    "opt"   : {"type": "h-box"}
                                }
                            ],
            _cssObj     = {},
            _tarOpt     = {
                                "v-ele.png" : "78e0c29d589eda2c6f73f39c7e40a17d",
                                "v-bg.png"  : "7740fec92894f014829f8bdf8f2080c9",
                                "v-box.png" : "f134ad0096c184a9bebe56f479a4c94f",
                                "h-ele.png" : "1e07bfe2cb09b0fa19f6645d7c60a2cc",
                                "h-bg.png"  : "c59a45a204317e6b3985ca105116868f",
                                "h-box.png" : "221f42ea03a7fdbd42d5cae48fed2b89"
                            },
            _times      = 0;

        // 生成图片
        for (var _i = 0, _len = _taskList.length; _i < _len; _i++) {

            var _lstTask = ab_cTask.createTask(_taskList[_i]);

            ab_optCssObj.operateCssObj(_lstTask, _cssObj);

            testTar.createImg(_lstTask);
        }
        
        // 测试 md5
        for (var _i = 0, _len = _taskList.length; _i < _len; _i++) {

            (function(_i) {

                var
                    _imgPath    = _taskList[_i].img,
                    _baseName   = path.basename(_imgPath);

                ab_md5.md5(_imgPath, function(md5) {

                    expect(md5).to.equal(_tarOpt[_baseName]);

                    if (_times === _len - 1) {

                        done();

                    } else {

                        _times++;
                    }
                });

            })(_i);
        }
    });
});