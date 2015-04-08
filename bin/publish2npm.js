var
    fs              = require("fs"),
    path            = require("path"),
    child_process   = require('child_process');


var
    fold    = "node-ab-ccss",
    src     = "../src",
    files   = [];


// 先清除指定文件夹
if (fs.existsSync(fold)) {

    child_process.execSync('rm -rf ' + fold);
}

// 生成指定文件夹
fs.mkdirSync(fold);

// 移动文件
for (var flist = fs.readdirSync(src), i = flist.length; i--;) {

    if (flist[i] !== "node_modules" && !/^\./.test(flist[i])) {

        fs.linkSync(path.join(src, flist[i]), path.join(fold, flist[i]));
    }
}

// 发布
child_process.exec("npm publish " + fold, function(error, stdout, stderr) {

    if (error) {

        throw error;
    }

    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    child_process.execSync('rm -rf ' + fold);
});