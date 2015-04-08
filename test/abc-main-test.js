var
    chai            = require('chai'),
    assert          = chai.assert,
    expect          = chai.expect,
    should          = chai.should(),
    path            = require('path'),
    fs              = require('fs'),
    child_process   = require('child_process'),
    testTar         = require('../src/index'),
    ab_md5          = require('../src/abc-util-md5');

describe('abc-main', function() {

    it('成功: 读取配置文件，生成图片与 css 文件', function(done) {

        var
            _root       = "abc-main",
            _cssPath    = path.join(_root, "css"),
            _imgPath    = path.join(_root, "images"),
            _pathAndMd5 = {
                                "ccss.css"  : [path.join(_cssPath, "ccss.css"), ""],
                                "v-ele.png" : [path.join(_imgPath, "v-ele.png"), "78e0c29d589eda2c6f73f39c7e40a17d"],
                                "v-bg.png"  : [path.join(_imgPath, "v-bg.png"), "7740fec92894f014829f8bdf8f2080c9"],
                                "v-box.png" : [path.join(_imgPath, "v-box.png"), "f134ad0096c184a9bebe56f479a4c94f"],
                                "h-ele.png" : [path.join(_imgPath, "h-ele.png"), "1e07bfe2cb09b0fa19f6645d7c60a2cc"],
                                "h-bg.png"  : [path.join(_imgPath, "h-bg.png"), "c59a45a204317e6b3985ca105116868f"],
                                "h-box.png" : [path.join(_imgPath, "h-box.png"), "221f42ea03a7fdbd42d5cae48fed2b89"]
                            },
            _total      = 7,
            _times      = 0;

        // 先清除指定文件夹
        if (fs.existsSync(_cssPath)) {

            child_process.execSync('rm -rf ' + _cssPath);
        }

        // 先清除指定文件夹
        if (fs.existsSync(_imgPath)) {

            child_process.execSync('rm -rf ' + _imgPath);
        }

        // 主程进行
        child_process.execSync('node abc-main');

        setTimeout(function() {

            // 测试文件夹是否存在
            if (!fs.existsSync(_cssPath) || !fs.existsSync(_imgPath)) {

                throw "对应文件夹未完整生成";
            }

            // 测试文件 md5 码是否一致
            for (var _filename in _pathAndMd5) {

                (function(_filename) {

                    var
                        __path  = _pathAndMd5[_filename][0],
                        __md5   = _pathAndMd5[_filename][1];

                    if (_filename === "h-ele.png") {

                        __path = path.join(_imgPath, "h-ele-" + __md5 + ".png");
                    }

                    ab_md5.md5(__path, function(md5) {

                        if (__md5 === md5 || _filename === "ccss.css") { // 由于每次生成 css 都有会不同，所以不作内容判断

                            _times++;

                            if (_times === _total) {

                                done();
                            }

                        } else {

                            throw "文件不一致 <- path: " + __path + "/ md5: " + md5;
                        }
                    });

                })(_filename);
            }
        }, 500);
    });
});