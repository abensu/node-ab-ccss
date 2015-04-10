var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-util-getPath'),
    os          = require('os'),
    platform    = os.platform(),
    urlSep      = platform === "win32" ? "\\" : "/";

describe('abc-util-getPath', function() {

    describe('1、文件类', function() {

        var
            _noRoot     = "noRoot",
            _noPath     = "noPath",
            _hasRoot    = "abc-util-getPath",
            _hasPath    = "file.txt";

        it('失败: 文件不存在: getPath("' + _noRoot + '", "' + _noPath + '")', function() {

            var _reObj = testTar.getPath(_noRoot, _noPath);

            _reObj.should.have.property("url").to.equal("");
            _reObj.should.have.property("status").to.equal(0);
        });

        it('成功: 文件存在: getPath("' + _hasRoot + '", "' + _hasPath + '")', function() {

            var _reObj = testTar.getPath(_hasRoot, _hasPath);

            _reObj.should.have.property("url").to.equal(_hasRoot + urlSep + _hasPath);
            _reObj.should.have.property("status").to.equal(1);
        });
    });

    describe('2、路径类', function() {

        var
            _noRoot     = "noRoot",
            _noPath     = "noPath",
            _hasRoot    = "abc-util-getPath",
            _hasPath    = "path";

        it('失败: 路径不存在: getPath("' + _noRoot + '", "' + _noPath + '")', function() {

            var _reObj = testTar.getPath(_noRoot, _noPath);

            _reObj.should.have.property("url").to.equal("");
            _reObj.should.have.property("status").to.equal(0);
        });

        it('成功: 路径存在: getPath("' + _hasRoot + '", "' + _hasPath + '")', function() {

            var _reObj = testTar.getPath(_hasRoot, _hasPath);

            _reObj.should.have.property("url").to.equal(_hasRoot + urlSep + _hasPath);
            _reObj.should.have.property("status").to.equal(1);
        });
    });

    describe('3、其他类', function() {

        var
            _http   = "http://test.com",
            _absUrl = platform === "win32" ? "c:\\" : "/usr",
            _exUrl  = "../";

        it('失败: 路径为外链: getPath("' + _exUrl + '", "' + _http + '")', function() {

            var _reObj = testTar.getPath(_exUrl, _http);

            _reObj.should.have.property("url").to.equal("");
            _reObj.should.have.property("status").to.equal(2);
        });

        it('成功: 绝对路径: getPath("' + _absUrl + '")', function() {

            var _reObj = testTar.getPath(_absUrl);

            _reObj.should.have.property("url").to.equal(_absUrl);
            _reObj.should.have.property("status").to.equal(1);
        });
    });
});   