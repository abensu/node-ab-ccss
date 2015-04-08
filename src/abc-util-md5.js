var
	crypto 	= require("crypto"),
	fs 		= require("fs");

/**
 * 生成 md5 码（异步执行）
 *
 * @info:
 *		仅对文件有效
 *
 * @param {string} filename 	: [] 文件路径
 * @param {function} callbcak 	: [ function(md5) ] 回调函数
 */

exports.md5 = function(filename, callback) {

	// 退出 <- 文件不存在
	if (!fs.existsSync(filename)) {

		throw "ERROR: md5: 文件不存在 <- " + filename;
	}

	var
		_md5sum 	= crypto.createHash("md5"),
		_stream 	= fs.ReadStream(filename);

	_stream.on("data", function(data) {

		_md5sum.update(data);
	});

	_stream.on("end", function() {

		var _md5 = _md5sum.digest('hex');

		callback(_md5);
	});
};