const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const numTasks = 100; // 假设我们有100个计算任务  
let completedWorkers = 0; // 跟踪完成的工作进程数量

// 计算任务：计算浮点数的平方  
function calculateSquare(num) {
    return num * num;
}

// 分配任务给工作进程  
function distributeTasks(workerIndex, tasks, workers) {
    const chunkSize = Math.ceil(tasks.length / numCPUs);
    const start = workerIndex * chunkSize;
    const end = Math.min(start + chunkSize, tasks.length);
    const workerTasks = tasks.slice(start, end);

    workers[workerIndex].send({ type: 'task', data: workerTasks });
}

if (cluster.isMaster) {

    // 当工作进程发送结果时增加完成计数  
    function workerCompleted() {
        completedWorkers++;
        if (completedWorkers === numCPUs) {
            // 所有工作进程都已完成，关闭它们并退出主进程  
            workers.forEach(worker => worker.kill());
            process.exit(0);
        }
    }

    console.log(`主进程 ${process.pid} 正在运行`);

    const tasks = Array.from({ length: numTasks }, (_, i) => i * 0.1); // 生成0.1, 0.2, ..., 9.9的浮点数数组  
    const workers = [];

    // 创建工作进程并分配任务  
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        workers.push(worker);

        worker.on('message', (msg) => {
            if (msg.type === 'result') {
                console.log(`从工作进程 ${worker.process.pid} 收到结果`);
                // 在这里处理结果，例如累加或存储  
                console.log(msg.data); // 打印结果数组  
                workerCompleted(); // 标记一个工作进程已完成
            }
        });

        // 分配任务  
        distributeTasks(i, tasks, workers);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
    });

} else {
    // 工作进程  
    process.on('message', (msg) => {
        if (msg.type === 'task') {
            const results = msg.data.map(calculateSquare);
            process.send({ type: 'result', data: results });
        }
    });
}