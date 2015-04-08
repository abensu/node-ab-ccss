var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-util-md5'),
    fs          = require('fs');

describe('abc-util-md5', function() {

    var
        _gif    = 'abc-util-md5/gif.gif',
        _file   = 'abc-util-md5/file.txt';

    it('成功: 图片文件 md5 一致: md5("' + _gif + '", function(md5) {...})', function(done) {

        var _reObj = testTar.md5(_gif, function(md5) {

            expect(md5).to.equal("52a3029c6b5038190289efef4f2c06e7");

            done();
        });
    });

    it('成功: 文档文件 md5 一致: md5("' + _file + '", function(md5) {...})', function(done) {

        testTar.md5(_file, function(md5) {

            expect(md5).to.equal("900150983cd24fb0d6963f7d28e17f72");

            done();
        });
    });
});