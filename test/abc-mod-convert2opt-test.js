var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-mod-convert2opt'),
    path        = require('path'),
    fs          = require('fs'),
    os          = require('os'),
    platform    = os.platform(),
    urlSep      = platform === "win32" ? "\\" : "/";

describe('abc-mod-convert2opt', function() {

    var
        _J              = JSON,
        _root           = "abc-mod-convert2opt",
        _f_txt_hasBase  = "opt_txt_hasBase.txt",
        _f_txt_noBase   = "opt_txt_noBase.txt",
        _f_json_hasBase = "opt_json_hasBase.txt",
        _f_json_noBase  = "opt_json_noBase.txt",
        _o              = {
                                "base" : {
                                    "key" : "word"
                                },
                                "list" : [
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "/src/images/class1"),
                                        "img"   : path.join(_root, "/to/images/class1.png"),
                                        "css"   : path.join(_root, "/to/css/class1.css"),
                                        "opt"   : {"key1": "word1"}
                                    },
                                    {
                                        "root"  : _root,
                                        "fold"  : path.join(_root, "/src/images/class2"),
                                        "img"   : path.join(_root, "/to/images/class2.png"),
                                        "css"   : path.join(_root, "/to/css/class2.css"),
                                        "opt"   : {"key2": "word2"}
                                    }
                                ]
                            },
        _o_t_hasBase,
        _o_t_noBase;

    _o_t_hasBase    = _J.stringify(_o),
    _o.base         = {};
    _o_t_noBase     = _J.stringify(_o);

    describe('1、txt2opt', function() {

        it('成功: 对象一致: txt2opt("' + _root + '", "' + _f_txt_hasBase + '")', function() {

            var _reObj = testTar.txt2opt(_root, _f_txt_hasBase);

            expect(_reObj).to.eql(_J.parse(_o_t_hasBase));
        });

        it('成功: 对象一致: txt2opt("' + _root + '", "' + _f_txt_noBase + '")', function() {

            var _reObj = testTar.txt2opt(_root, _f_txt_noBase);

            expect(_reObj).to.eql(_J.parse(_o_t_noBase));
        });
    });

    describe('2、json2opt', function() {

        it('成功: 传入文件，对象一致: json2opt("' + _root + '", "' + _f_json_hasBase + '")', function() {

            var _reObj = testTar.json2opt(_root, _f_json_hasBase);

            expect(_reObj).to.eql(_J.parse(_o_t_hasBase));
        });

        it('成功: 传入文件，对象一致: json2opt("' + _root + '", "' + _f_json_noBase + '")', function() {

            var _reObj = testTar.json2opt(_root, _f_json_noBase);

            expect(_reObj).to.eql(_J.parse(_o_t_noBase));
        });

        it('成功: 传入对象，对象一致: json2opt("' + _root + '", {\"base\": ..., \"list\": ...})', function() {

            var
                _obj    = JSON.parse(fs.readFileSync(path.join(_root, _f_json_hasBase))),
                _reObj  = testTar.json2opt(_root, _obj);

            expect(_reObj).to.eql(_J.parse(_o_t_hasBase));
        });

        it('成功: 传入对象，对象一致: json2opt("' + _root + '", {\"list\": ...})', function() {

            var
                _obj    = JSON.parse(fs.readFileSync(path.join(_root, _f_json_noBase))),
                _reObj  = testTar.json2opt(_root, _obj);

            expect(_reObj).to.eql(_J.parse(_o_t_noBase));
        });
    });
});