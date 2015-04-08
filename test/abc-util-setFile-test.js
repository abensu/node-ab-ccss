var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    fs          = require('fs'),
    testTar     = require('../src/abc-util-setFile'),
    path        = require('path'),
    child_process = require('child_process');

describe('abc-util-setFile', function() {

    var
        _root   = "abc-util-setFile",
        _time   = String((new Date).getTime()),
        _tPath  = "file_" + _time + ".txt",
        _tCon   = _time,
        _path1  = _root + path.sep + _tPath,
        _path2  = "http://test.com/" + _tPath;

    // 先清除指定文件夹
    if (fs.existsSync(_root)) {

        child_process.execSync('rm -rf ' + _root);
    }

    it('成功: 生成文件存在且内容一致: setFile("' + _path1 + '", "' + _tCon + '")', function() {

        var _reObj = testTar.setFile(_path1, _tCon);

        _reObj.should.have.property("status").to.equal(1);
        expect(fs.existsSync(_path1)).to.equal(true);
        expect(fs.readFileSync(_path1, {"encoding":"utf8"})).to.equal(_tCon);
    });

    it('失败: 路径为外链: setFile("' + _path2 + '", "' + _tCon + '")', function() {

        var _reObj = testTar.setFile(_path2, _tCon);

        _reObj.should.have.property("status").to.equal(0);
    });
});   