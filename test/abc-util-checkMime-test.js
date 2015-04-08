var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-util-checkMime'),
    os          = require('os'),
    platform    = os.platform(),
    urlSep      = platform === "win32" ? "\\" : "/";

describe('abc-util-checkMime', function() {

    var
        _root   = "abc-util-checkMime",
        _png    = "png.png",
        _pngType= "png",
        _pngUrl = _root + urlSep + _png,
        _jpg    = "jpg.jpg",
        _jpgType= "jpg",
        _jpgUrl = _root + urlSep + _jpg,
        _gif    = "gif.gif",
        _gifType= "gif",
        _gifUrl = _root + urlSep + _gif,
        _noType = "notype",
        _noFile = "nofile.file";

    it('成功: png 类型检测通过: checkMime("' + _pngUrl + '", "' + _pngType + '")', function() {

        var _reObj = testTar.checkMime(_pngUrl, _pngType);

        expect(_reObj.status).to.equal(1);
        expect(_reObj.value).to.equal(true);
    });

    it('成功: jpg 类型检测通过: checkMime("' + _jpgUrl + '", "' + _jpgType + '")', function() {

        var _reObj = testTar.checkMime(_jpgUrl, _jpgType);

        expect(_reObj.status).to.equal(1);
        expect(_reObj.value).to.equal(true);
    });

    it('成功: gif 类型检测通过: checkMime("' + _gifUrl + '", "' + _gifType + '")', function() {

        var _reObj = testTar.checkMime(_gifUrl, _gifType);

        expect(_reObj.status).to.equal(1);
        expect(_reObj.value).to.equal(true);
    });

    it('失败: 暂不支持的 MIME 类型（无相关记录）: checkMime("' + _gifUrl + '", "' + _noType + '")', function() {

        var _reObj = testTar.checkMime(_gifUrl, _noType);

        expect(_reObj.status).to.equal(2);
    });

    it('失败: 文件不存在: checkMime("' + _noFile + '", "' + _noType + '")', function() {

        var _reObj = testTar.checkMime(_noFile, _noType);

        expect(_reObj.status).to.equal(0);
    });
});