var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    fs          = require('fs'),
    child_process = require('child_process'),
    testTar     = require('../src/abc-util-frename');

describe('abc-util-frename', function() {

    var
        _root       = "abc-util-frename/",
        _oldfpath   = "path/",
        _oldfile    = "file.txt",
        _oldpath    = _root + _oldfpath,
        _oldfilepath = _oldpath + _oldfile,
        _newfpath   = "path1/",
        _newfile    = "file1.txt",
        _newpath    = _root + _newfpath,
        _newfilepath = _newpath + _newfile,
        _nofilepath = _root + "nofold";

    // 先清除重命名过的文件夹
    if (fs.existsSync(_newpath)) {

        child_process.execSync('rm -rf ' + _newpath);
    }

    // 创建目标目录
    if (!fs.existsSync(_oldpath)) {

        fs.mkdirSync(_oldpath);
    }

    // 创建目标目录的空白文件
    if (fs.existsSync(_oldpath)) {

        fs.writeFileSync(_oldfilepath, '');
    }

    it('成功: frename("' + _oldfilepath + '","' + _newfilepath + '")', function() {

        var _reObj = testTar.frename(_oldfilepath, _newfilepath);

        expect(fs.existsSync(_newfilepath)).to.equal(true);
        expect(fs.existsSync(_oldfilepath)).to.equal(false);
    });

    it('失败: 文件已被重命名: frename("' + _newfilepath + '","' + _newfilepath + '")', function() {

        var _reObj = testTar.frename(_newfilepath, _newfilepath);

        expect(_reObj.status).to.equal(0);
    });

    it('失败: 参数数量必须为 2 个: frename()', function() {

        var _reObj = testTar.frename();

        expect(_reObj.status).to.equal(-1);
    });

    it('失败: 参数不能为空或非字符串: frename("", "")', function() {

        var _reObj = testTar.frename("", "");

        expect(_reObj.status).to.equal(-2);
    });

    it('失败: 目标路径不存在: frename("' + _oldfilepath + '","' + _oldfilepath + '")', function() {

        var _reObj = testTar.frename(_oldfilepath, _newfilepath);

        expect(_reObj.status).to.equal(-3);
    });

    it('失败: 路径层数不一致: frename("' + _newfilepath + '","' + _newpath + '")', function() {

        var _reObj = testTar.frename(_newfilepath, _newpath);

        expect(_reObj.status).to.equal(-4);
    });
});