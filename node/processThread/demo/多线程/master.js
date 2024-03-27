const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

// 设置子进程执行程序
cluster.setupMaster({
    exec: "./worker.js",
    slient: true
});

function run() {
    // 记录开始时间
    const startTime = Date.now();
    // 总数
    const totalCount = 500;
    // 当前已处理任务数
    let completedCount = 0;
    // 任务生成器
    const fbGenerator = FbGenerator(totalCount);

    if (cluster.isMaster) {
        cluster.on("fork", function (worker) {
            console.log(`[master] : fork worker ${worker.id}`);
        });
        cluster.on("exit", function (worker, code, signal) {
            console.log(`[master] : worker ${worker.id} died`);
        });

        for (let i = 0; i < numCPUs; i++) {
            const worker = cluster.fork();

            // 接收子进程数据
            worker.on("message", function (msg) {
                // 完成一个，记录并打印进度
                completedCount++;
                console.log(`process: ${completedCount}/${totalCount}`);

                nextTask(this);
            });

            nextTask(worker);
        }
    } else {
        process.on("message", function (msg) {
            console.log(msg);
        });
    }

    /**
     * 继续下一个任务
     *
     * @param {ChildProcess} worker 子进程对象，将在此进程上执行本次任务
     */
    function nextTask(worker) {
        // 获取下一个参数
        const data = fbGenerator.next();
        // 判断是否已经完成，如果完成则调用完成函数，结束程序
        if (data.done) {
            done();
            return;
        }
        // 否则继续任务
        // 向子进程发送数据
        worker.send(data.value);
    }

    /**
     * 完成，当所有任务完成时调用该函数以结束程序
     */
    function done() {
        if (completedCount >= totalCount) {
            cluster.disconnect();
            console.log("👏 👏 👏 👏 👏 👏 👏 👏 👏 👏");
            console.info(`任务完成，用时: ${Date.now() - startTime}ms`);
            console.log("👏 👏 👏 👏 👏 👏 👏 👏 👏 👏");
        }
    }
}

/**
 * 生成器
 */
function* FbGenerator(count) {
    var n = 35;
    for (var i = 0; i < count; i++) {
        yield n;
    }
    return;
}

module.exports = {
    run
};

