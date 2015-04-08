var
    cluster         = require("cluster"),
    cpusNum         = require("os").cpus().length,
    path            = require("path"),
    ab_convert2opt  = require("./abc-mod-convert2opt"),
    ab_setPath      = require("./abc-util-setPath").setPath,
    ab_getFile      = require("./abc-util-getFile").getFile,
    ab_setFile      = require("./abc-util-setFile").setFile,
    ab_extend       = require("./abc-util-extend").extend,
    ab_createImg    = require("./abc-mod-createImg").createImg,
    ab_opteCssObj   = require("./abc-mod-operateCssObj").operateCssObj,
    ab_createTask   = require("./abc-mod-createTask").createTask,
    ab_optePreOpt   = require("./abc-mod-operatePreOpt").operatePreOpt;


var
    TASKLIST        = [], // 总缓存列表，保存处理信息
    CSSOBJ          = {}; // 用于生产 css 文件的对象


/**
 * 主函数
 *
 * @param {string} pathTxt : [] 目录/文件名
 */

function main() {

    if (cluster.isMaster) {

        /**
         * 主程阶段
         */

        var
            _argumentsList  = Array.prototype.slice.call(arguments),
            _optType        = _argumentsList.pop(),
            _txtObj         = (_optType === "text") ?
                                ab_convert2opt.txt2opt.apply(null, _argumentsList) :
                                ab_convert2opt.json2opt.apply(null, _argumentsList),
            _taskList       = _txtObj.list,
            _baseOpt        = _txtObj.base,
            _st             = (new Date).getTime(),
            _workerList     = [],
            _clusterIndex   = 0,
            _actCpusNum     = cpusNum;

        console.log("开始处理...");

        // 当基础参数有 include 节点，则优先处理
        if ("include" in _baseOpt && !!_baseOpt.include.length) {

            for (var _i = 0, _len = _baseOpt.include.length; _i < _len; _i++) {

                var 
                    __txtObj,
                    __taskList,
                    __baseOpt;

                if (typeof _baseOpt.include[_i] === "object") {

                    __txtObj = ab_convert2opt.json2opt(_argumentsList[0], _baseOpt.include[_i]);

                } else if (typeof _baseOpt.include[_i] === "string") {

                    __txtObj = ab_convert2opt.txt2opt(_argumentsList[0], _baseOpt.include[_i]);

                } else {

                    throw "ERROR: main: 基础参数的 include 的数据类型不被支持 <- " + (typeof _baseOpt.include);
                }

                // 当 include 的文件不存在时，__txtObj 为 null
                if (__txtObj === null) {

                    continue;
                }

                __baseOpt   = ab_extend(_baseOpt, __txtObj.base);
                __taskList  = __txtObj.list;

                // TASKLIST 填充
                for (var __i = 0, __len = __taskList.length; __i < __len; __i++) {
                    ab_createTask(__baseOpt, __taskList[__i], TASKLIST);
                }
            }
        }

        // TASKLIST 填充
        for (var i = 0, len = _taskList.length; i < len; i++) {
            TASKLIST.push(ab_createTask(_taskList[i], _baseOpt));
        }

        // CSSOBJ 填充
        for (var i = 0, len = TASKLIST.length; i < len; i++) {
            // ab_createImg(TASKLIST[i]); // 仅主程时可调用，不过比较费时
            ab_opteCssObj(TASKLIST[i], CSSOBJ);
        }

        // 根据任务处理的数量，调用适当的 cpu 数量
        _actCpusNum = (_actCpusNum > TASKLIST.length) ? TASKLIST.length : _actCpusNum;

        for (var i = 0; i < _actCpusNum; i++) {

            (function(i) {

                // 收集子程主控
                _workerList.push(cluster.fork());

                // 子程主控发布信息给子程（level 1）
                _workerList[i].send({status: 1, taskListCell: TASKLIST[_clusterIndex], taskIndex: _clusterIndex});

                // 子程主控处理 ab_createImg 子程（level 2）返回的信息
                _workerList[i].on("message", function(msgOpt) {

                    console.log("level 3 => id : " + _workerList[i].id);

                    TASKLIST[msgOpt.taskIndex]._imgMd5 = msgOpt.md5;

                    if (msgOpt.status === 2 && _clusterIndex < TASKLIST.length) {

                        _workerList[i].send({status: 1, taskListCell: TASKLIST[_clusterIndex], taskIndex: _clusterIndex});
                        _clusterIndex ++;

                    } else {

                        _workerList[i].send({status: 0});
                        _actCpusNum --;

                        if (_actCpusNum === 0) { finish(_st); }
                    }
                });

                _clusterIndex ++;

            })(i);
        }

    } else {

        /**
         * 子程阶段
         */

        process.on("message", function(msgOpt) {

            console.log("level 1 => id : " + cluster.worker.id);

            if (msgOpt.status === 1 && !!msgOpt.taskListCell) {

                // ab_createImg(TASKLIST[msgOpt.taskIndex]);
                ab_createImg(msgOpt.taskListCell, msgOpt.taskIndex);

            } else {

                process.exit(); // 子程关闭，等价于 cluster.worker.kill();
            }
        });
    }
};


/**
 * 结束函数
 */

function finish(startTime) {

    // 如果路径存在预处理变量，则修改实际图片路径
    for (var _list = TASKLIST, _i = _list.length; _i--;) {

        var
            _task   = _list[_i],
            _img    = _task.img,
            _imgObj = ab_optePreOpt("path", _img, _list);

        _imgObj.status === 1 && (_task.img = _imgObj.data);
    }

    // 生成 css 文件
    for (var cssfile in CSSOBJ) {

        var
            _fileName       = cssfile,
            _fileCont       = CSSOBJ[cssfile],
            _fileNameObj    = ab_optePreOpt("path", _fileName, TASKLIST),
            _fileContObj    = ab_optePreOpt("txt", _fileCont, TASKLIST);

        _fileNameObj.status === 1 && (_fileName = _fileNameObj.data);
        _fileContObj.status === 1 && (_fileCont = _fileContObj.data);

        ab_setFile(_fileName, _fileCont);
    }

    console.log("已完成！用时：" + ((new Date).getTime() - startTime) + " ms");
    // console.dir(TASKLIST);
    // console.dir(CSSOBJ);
};


/**
 * 绑定
 */

exports.run = main;