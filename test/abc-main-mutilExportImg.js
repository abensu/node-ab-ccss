var
    path    = require('path'),
    testTar = require('../src/index');

var _root   = "abc-main-mutilExportImg";

testTar.run(path.join(__dirname, _root), "node-ab-ccss-files.txt", "text");