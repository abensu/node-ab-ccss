var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    fs          = require('fs'),
    testTar     = require('../src/abc-util-getFile'),
    os          = require('os'),
    platform    = os.platform(),
    urlSep      = platform === "win32" ? "\\" : "/";

describe('abc-util-getFile', function() {

    var
        _root   = "abc-util-getFile",
        _nPath  = "nofile.txt",
        _tPath  = "file.txt",
        _dPath  = "fold";

    it('成功: 读取存在的文件: getFile("' + _root + urlSep + _tPath + '")', function() {

        var _reObj = testTar.getFile(_root + urlSep + _tPath);

        _reObj.should.have.property("data").to.equal("abc");
        _reObj.should.have.property("status").to.equal(1);
    });

    it('失败: 读取不存在的文件: getFile("' + _root + urlSep + _nPath + '")', function() {

        var _reObj = testTar.getFile(_root + urlSep + _nPath);

        _reObj.should.have.property("data").to.equal("");
        _reObj.should.have.property("status").to.equal(0);
    });

    it('失败: 读取存在的文件夹: getFile("' + _root + urlSep + _dPath + '")', function() {

        var _reObj = testTar.getFile(_root + urlSep + _dPath);

        _reObj.should.have.property("data").to.equal("");
        _reObj.should.have.property("status").to.equal(2);
    });
});   