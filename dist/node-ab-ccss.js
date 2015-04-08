var ccss = require("node-ab-ccss");


/**
 * 文件型
 */

ccss.run(__dirname, "/node-ab-ccss-files.txt", "text");


/**
 * 参数型（json格式）
 */

// var json = {
//     "base" : {
//         "type"      : "v-ele",
//         "sep"       : 0,
//         "minify-css": true,
//         "minify-img": 50,
//         "include"   : [
//             {
//                 "base": {},
//                 "list": [
//                     {
//                         "fold"  : "/images/v-ele",
//                         "img"   : "/img/v-ele.jpg",
//                         "css"   : "/css/combine.css",
//                         "opt"   : {"type":"v-ele", "sep":0, "comment":"v-ele 注释||路径为/css/v-ele.css", "pre":"#hello", "css":"display:inline-block;", "minify-css":false}
//                     },
//                     {
//                         "fold"  : "/images/h-ele",
//                         "img"   : "/img/h-ele.png",
//                         "css"   : "/css/combine.css",
//                         "opt"   : {"type":"h-ele", "sep":0, "comment":"h-ele 注释"}
//                     }
//                 ]
//             },
//             "node-ab-ccss-files/filegroup02.txt"
//         ]
//     },
//     "list" : [
//         {
//             "fold"  : "/images/v-ele",
//             "img"   : "/img/v-ele.jpg",
//             "css"   : "/css/combine.css",
//             "opt"   : {"type":"v-ele", "sep":0, "comment":"v-ele 注释||路径为/css/v-ele.css", "pre":"#hello", "css":"display:inline-block;", "minify-css":false}
//         },
//         {
//             "fold"  : "/images/h-ele",
//             "img"   : "/img/h-ele.png",
//             "css"   : "/css/combine.css",
//             "opt"   : {"type":"h-ele", "sep":0, "comment":"h-ele 注释"}
//         }
//     ]
// };

// ccss.run(__dirname, json, "json");