// 参数-普通任务（首字母为下划线的为内部使用的变量，不能使用）
exports.opt_task =
{
    "root"          : "",       // 根目录路径
    "fold"          : "",       // 需要扫描的目录路径
    "img"           : "",       // 合成图片路径
    "imgFold"       : "",       // 合成图片路径的文件夹路径
    "css"           : "",       // 合成 css 的路径
    "cssFold"       : "",       // 合成 css 的文件夹的路径
    "opt"           : {},       // 实际操作参数对象（结构对应 opt_options）
    "filename"      : [],       // opt_task.fold 中的图片的文件名集合
    "cssname"       : [],       // css 键名集合
    "cssOptStr"     : [],       // "fold" 中各个图片文件名（如 "file#xxx.png"）中的 "#xxx" 内容
    "cssOptObj"     : [],       // css 操作对象（包含 "pos" 的定位信息）
    "images"        : [],       // image 类的集合
    "imagesPath"    : [],       // 图片路径的集合
    "widths"        : [],       // 图片宽度的集合
    "heights"       : [],       // 图片高度的集合
    "maxWidth"      : 0,        // 图片集合的最大宽度
    "maxHeight"     : 0,        // 图片集合的最大高度
    "totalWidth"    : 0,        // 图片集合的总宽度
    "totalHeight"   : 0,        // 图片集合的总高度
    "_id"           : "",       // 唯一标示符（_dateRaw + 16 bit 的随机值），如 “1425477666750a97f955c5f375”
    "_dateRaw"      : 0,        // 当前日期，如 1425477666750
    "_dateNow"      : "",       // 当前日期，如 “20150102103000”
    "_imgMd5"       : "",       // 生成图片的 md5 值
    "_imgSearch"    : "",       // "img" 中 "?xxxx" 的值
    "_cssSearch"    : ""        // "css" 中 "?xxxx" 的值
};

// 参数-操作参数（对应 opt_task.opt 的值）
exports.opt_options =
{
    "type"          : "v-ele",  // 元素的排列类型
    "after"         : "",       // css 类名的后缀（伪类/伪元素）
    "pre"           : "",       // css 类名的前缀（父代）
    "css"           : "",       // 如 "display: none;color: #fff;"
    "sep"           : 0,        // 元素之间的间距
    "comment"       : "",       // css 文件的注释
    "minify-css"    : false,    // 是否将 css 文件中无用的空白符去除，并且注释不生成
    "quality-img"   : 100,      // 图片的质量，100 为 100% 质量输出（暂只支持 jpg 压缩）
    "bgColor-img"   : "",       // 图片的背景色（格式为 rgba），取值如 "255, 0, 0, 1", "0xff, 0xff, 0xff, 0"
    "mutilExportImg": "",       // 生成额外类型的图片，取值如 "image.jpg", ["image.png", "image.jpg"]
    "include"       : ""        // 嵌套对象，与 opt_options 一致
};

// 参数-预处理参数支持的判断（其值与 opt_task 的 key 进行挂钩）
exports.opt_preOpt =
{
    "$now"          : "_dateNow",   // 对应 {$now}
    "$md5"          : "_imgMd5"     // 对应 {$md5}
};