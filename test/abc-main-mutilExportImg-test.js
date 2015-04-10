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

describe('abc-main-mutilExportImg', function() {

    it('成功: 读取 mutilExportImg 指定的配置文件，生成图片与 css 文件', function(done) {

        var
            _root       = "abc-main-mutilExportImg",
            _cssPath    = path.join(_root, "css"),
            _imgPath    = path.join(_root, "images"),
            _pathAndMd5 = {
                                "ccss.css"  : [path.join(_cssPath, "ccss.css"), "938e72929d74442e7f66fdd1c7622d8d"],
                                "v-box.png" : [path.join(_imgPath, "v-box.png"), "f134ad0096c184a9bebe56f479a4c94f"],
                                "v-box-jpg.jpg" : [path.join(_imgPath, "v-box-jpg.jpg"), "f0b4a180b807958ceb5f3dcac4327bba"]
                            },
            _total      = 3,
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
        child_process.execSync('node abc-main-mutilExportImg');

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

                    ab_md5.md5(__path, function(md5) {

                        if (__md5 === md5) {

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