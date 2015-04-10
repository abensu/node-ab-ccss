var
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    should      = chai.should(),
    testTar     = require('../src/abc-util-getType');

describe('abc-util-getType', function() {

    var
        _str        = "str",
        _num        = 123,
        _nan        = NaN,
        _obj        = {},
        _arr        = [],
        _func       = function() {},
        _reg        = /r/,
        _undefined  = undefined,
        _null       = null;

    it('成功: String: getType("' + _str + '")', function() {

        var _reObj = testTar.getType(_str);

        expect(_reObj).to.equal("string");
    });

    it('成功: Number: getType(' + _num + ')', function() {

        var _reObj = testTar.getType(_num);

        expect(_reObj).to.equal("number");
    });

    it('成功: NaN: getType(NaN)', function() {

        var _reObj = testTar.getType(_nan);

        expect(_reObj).to.equal("nan");
    });

    it('成功: Object: getType({})', function() {

        var _reObj = testTar.getType(_obj);

        expect(_reObj).to.equal("object");
    });

    it('成功: Array: getType([])', function() {

        var _reObj = testTar.getType(_arr);

        expect(_reObj).to.equal("array");
    });

    it('成功: Function: getType(function() {})', function() {

        var _reObj = testTar.getType(_func);

        expect(_reObj).to.equal("function");
    });

    it('成功: RegExp: getType(/r/)', function() {

        var _reObj = testTar.getType(_reg);

        expect(_reObj).to.equal("regexp");
    });

    it('成功: undefined: getType(undefined)', function() {

        var _reObj = testTar.getType(_undefined);

        expect(_reObj).to.equal("undefined");
    });

    it('成功: null: getType(null)', function() {

        var _reObj = testTar.getType(_null);

        expect(_reObj).to.equal("null");
    });
});   