var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-util-extend');

describe('abc-util-extend', function() {

    var
        _J      = JSON,
        _void   = {},
        _obj1   = {"num": 1, "str": "text"},
        _obj2   = {"arr": ["arr"]},
        _obj3   = {"obj": {"str": "text"}},
        _tarObj = {"num": 1, "str": "text", "arr": ["arr"], "obj": {"str": "text"}};

    it('成功: 对象一致（暂不支持 RegExp 类型）: extend(' + _J.stringify(_void) + ', ' + _J.stringify(_obj1) + ', ' + _J.stringify(_obj2) + ', ' + _J.stringify(_obj3) + ')', function() {

        var _reObj = testTar.extend(_void, _obj1, _obj2, _obj3);

        expect(_reObj).to.eql(_tarObj);
    });
});