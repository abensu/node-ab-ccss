var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    fs          = require('fs'),
    testTar     = require('../src/abc-util-setPath'),
    os          = require('os'),
    platform    = os.platform(),
    urlSep      = platform === "win32" ? "\\" : "/",
    child_process = require('child_process');

describe('abc-util-setPath', function() {

    var
        _root   = "abc-util-setPath",
        _tPath  = "path_" + (new Date).getTime(),
        _path   = _root + urlSep + _tPath;

    // 先清除指定文件夹
    if (fs.existsSync(_root)) {

        child_process.execSync('rm -rf ' + _root);
    }

    it('成功: 生成目录: setPath("' + _root + '", "' + _tPath + '")', function() {

        var _reObj = testTar.setPath(_root, _tPath);

        _reObj.should.have.property("data").to.equal(_path);
        _reObj.should.have.property("status").to.equal(1);
        expect(fs.existsSync(_path)).to.equal(true);
    });
});   