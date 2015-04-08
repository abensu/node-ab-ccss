var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-util-trim');

describe('abc-util-trim', function() {

    var
        _str    = "  hello   world  ",
        _tarStr = "hello   world";

    it('成功: 清除前后空字符: trim("' + _str + '")', function() {

        var _reObj = testTar.trim(_str);

        expect(_reObj).to.equal(_tarStr);
    });
});