var fs = require("fs");


/**
 * 文件 mime 断言
 *
 * @param {string} filename : [] 文件路径
 * @param {string} filetype : [] 检测类型
 *
 * @return {object}         : [ {"status" : 0, "value" : ""} ] 返回参数对象
 *                              |
 *                              |- 文件不存在:
 *                              |   {"status" : 0, "value" : "文件不存在 <- filename"}
 *                              |
 *                              |- 不支持的文件检测类型:
 *                              |   {"status" : 2, "value" : "不支持的文件检测类型 <- filetype"}
 *                              |
 *                              |- 与所检测类型一致:
 *                              |   {"status" : 1, "value" : true}
 *                              |
 *                              `- 与所检测类型不一致:
 *                                  {"status" : 1, "value" : false}
 */

exports.checkMime = function(filename, filetype) {

    // 参数不等于 2 个就报错
    if (arguments.length !== 2) {

        throw "请传入两个参数：checkMime(filename, filetype)";
    }

    // 以下文件类型（_type2code）参考，有进行删改
    // http://www.cnblogs.com/ppazhang/archive/2012/11/07/2759097.html
    var _type2code = {
            "ico"   : [0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20],
            "mpa"   : [0x00, 0x00, 0x01],
            "tga"   : [
                        [0x00, 0x00, 0x02, 0x00, 0x00],
                        [0x00, 0x00, 0x10, 0x00, 0x00]
                      ],
            "cur"   : [0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x20, 0x20],
            "tag"   : [0x00, 0x00, 0x02],
            "pjt"   : [0x00, 0x00, 0x07],
            "mov"   : [
                        [0x00, 0x00, 0x0F],
                        [0x00, 0x00, 0x77]
                      ],
            "ddb"   : [0x00, 0x01, 0x00],
            "ttf"   : [0x00, 0x01, 0x00],
            "tst"   : [0x00, 0x01, 0x00],
            "xmv"   : [0x00, 0x50, 0x01],
            "smd"   : [0x00, 0xFF, 0xFF],
            "mdf"   : [0x00, 0xFF, 0xFF],
            "img"   : [0x00, 0xFF, 0xFF],
            "raw"   : [0x06, 0x05, 0x00],
            "pcx"   : [0x0A],     
            "pcs"   : [0x0A, 0x05, 0x01],
            "pcb"   : [0x17, 0xA1, 0x50],
            "z"     : [0x1F, 0x9D, 0x8C],
            "bas"   : [0x20, 0x20, 0x20],
            "prg"   : [0x23, 0x44, 0x45],
            "m3u"   : [0x23, 0x45, 0x58],
            "pll"   : [0x24, 0x53, 0x6F],
            "pdf"   : [0x25, 0x50, 0x44],
            "eco"   : [0x2A, 0x50, 0x52],
            "sch"   : [0x2A, 0x76, 0x65],
            "lib"   : [0x2A, 0x24, 0x20],
            "rm"    : [0x2E, 0x52, 0x4D],
            "wmv"   : [0x30, 0x26, 0xB2],
            "wma"   : [0x30, 0x26, 0xB2],
            "wri"   : [0x31, 0xBE, 0x00],
            "psd"   : [0x38, 0x42, 0x50],
            "htm"   : [0x3C, 0x21, 0x44],
            "xml"   : [0x3C, 0x3F, 0x78],
            "msc"   : [0x3C, 0x3F, 0x78],
            "xlp"   : [0x3F, 0x5F, 0x03],
            "lhp"   : [0x3F, 0x5F, 0x03],
            "dwg"   : [0x41, 0x43, 0x31],
            "ldb"   : [0x42, 0x49, 0x4C],
            "bmp"   : [0x42, 0x4D, 0x3E],
            "fnt"   : [0x43, 0x48, 0x41],
            "swf"   : [0x43, 0x57, 0x53],
            "iff"   : [0x46, 0x4F, 0x52, 0x4D],
            "gif"   : [
                        [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
                        [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]
                      ],
            "pdg"   : [0x48, 0x48, 0x02],
            "tiff"  : [
                        [0x49, 0x49, 0x2A],
                        [0x4D, 0x4D, 0x2A]
                      ],
            "cab"   : [0x49, 0x53, 0x63],
            "chm"   : [0x49, 0x54, 0x53],
            "lnk"   : [0x4C, 0x00, 0x00],
            "mds"   : [0x4D, 0x45, 0x44],
            "drv"   : [0x4D, 0x5A, 0x16],
            "dpl"   : [0x4D, 0x5A, 0x50],
            "exe"   : [0x4D, 0x5A, 0x90],
            "dll"   : [0x4D, 0x5A, 0x90],
            "ocx"   : [0x4D, 0x5A, 0x90],
            "olb"   : [0x4D, 0x5A, 0x90],
            "imm"   : [0x4D, 0x5A, 0x90],
            "ime"   : [0x4D, 0x5A, 0x90],
            "com"   : [
                        [0x4D, 0x5A, 0xEE],
                        [0xE9, 0x3B, 0x03]
                      ],
            "nes"   : [0x4E, 0x45, 0x53],
            "zip"   : [0x50, 0x4B, 0x03],
            "ccd"   : [0x5B, 0x43, 0x6C],
            "ani"   : [0x52, 0x49, 0x46, 0x46],
            "wav"   : [0x52, 0x49, 0x46],
            "rar"   : [0x52, 0x61, 0x72],
            "eml"   : [0x52, 0x65, 0x63],
            "ppc"   : [0x52, 0x65, 0x63],
            "pbk"   : [0x5B, 0x41, 0x44],
            "xbe"   : [0x58, 0x42, 0x45],
            "cpx"   : [0x5B, 0x57, 0x69],
            "arj"   : [0x60, 0xEA, 0x27],
            "gtd"   : [0x7B, 0x50, 0x72],
            "rtf"   : [0x7B, 0x5C, 0x72],
            "scm"   : [0x80, 0x53, 0x43],
            "gbc"   : [0x87, 0xF5, 0x3E],
            "png"   : [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
            "nls"   : [0xC2, 0x20, 0x20],
            "eps"   : [0xC5, 0xD0, 0xD3],
            "xls"   : [0xD0, 0xCF, 0x11],
            "max"   : [0xD0, 0xCF, 0x11],
            "ppt"   : [0xD0, 0xCF, 0x11],
            "jpg"   : [0xFF, 0xD8],     
            "mp3"   : [0xFF, 0xFB, 0x50],
            "xsl"   : [0xFF, 0xFE, 0x3C],
            "sub"   : [0xFF, 0xFF, 0xFF]
        };

    var
        _reValObj = {
            "status": 0,
            "value" : ""
        },
        _filename = filename,
        _filetype = filetype.toLocaleLowerCase(),
        _fileBuffer,
        _fileCheckTypeLen;

    // 文件是否存在
    if ( !fs.existsSync(_filename) ) {

        _reValObj.status = 0;
        _reValObj.value = "文件不存在 <-" + _filename;

        return _reValObj;
    }

    // 所检测的文件类型是否被支持
    if ( !(_filetype in _type2code) ) {

        _reValObj.status = 2;
        _reValObj.value = "不支持的文件检测类型 <-" + filetype;

        return _reValObj;
    }

    var
        _bufJSON,
        _bufObj;

    // 获取文件的二进制编码
    _fileBuffer = fs.readFileSync(_filename);

    // 判断检测类型列表是否存在二级数组，再进行对应的匹配处理
    if (typeof _type2code[_filetype][0] === "number") {

        _fileCheckTypeLen   = _type2code[_filetype].length;
        _bufJSON            = JSON.stringify( _fileBuffer.slice(0, _fileCheckTypeLen) );
        _bufObj             = JSON.parse(_bufJSON);
        _reValObj.status    = 1;
        _reValObj.value     = ( JSON.stringify(_bufObj.data) === JSON.stringify(_type2code[_filetype]) );

        return _reValObj;

    } else {

        for (var _i = 0, _len = _type2code[_filetype].length; _i < _len; _i++) {

            _fileCheckTypeLen   = _type2code[_filetype][_i].length;
            _bufJSON            = JSON.stringify(_fileBuffer.slice(0, _fileCheckTypeLen));
            _bufObj             = JSON.parse(_bufJSON);

            if (JSON.stringify(_bufObj.data) === JSON.stringify(_type2code[_filetype][_i])) {

                _reValObj.status    = 1;
                _reValObj.value     = true;

                return _reValObj;
            }
        }
    }

    _reValObj.status    = 1;
    _reValObj.value     = false;

    return _reValObj;
};