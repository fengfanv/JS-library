class CallbackQueue {
    constructor() {
        this.tasks = [];  // 存储任务数组
        this.isProcessing = false;
        // this.completeCallbacks = [];  // 存储完成回调
    }

    // 添加任务到队列
    // 这里设计,将方法入参,单独拎出来，是为了，确保，支持使用队列类的方法，的最后一个参数是一个回调函数，
    // 以至于不用为了一个三个参数的方法专门写一个队列类，为了一个两个参数的方法专门写另外一个队列类。
    enqueue(taskFunc, args, successCallback, errorCallback) {
        const task = {
            func: taskFunc,
            args: args,
            success: successCallback, //这里是，第一种，接收队列类执行结果的方式。使用方式：new CallbackQueue().enqueue(xxxFun,[...],(res)=>{console.log('成功：',res)},(err)=>{console.log('失败：',err)})
            error: errorCallback
        };

        this.tasks.push(task);

        if (!this.isProcessing) {
            this.process();
        }

        // 如下是，第二种，接收队列类执行结果的方式。使用方式：new CallbackQueue().enqueue(xxxFun,[...]).then((res)=>{console.log('成功：',res)).catch((err)=>{console.log('失败：',err)})
        // 注意：两种方式不能同时使用，否则(第二种，链式调用回调)会覆盖(第一种，直接传入的回调)
        // 返回一个简单的对象，可以链式调用
        // 创建一个链式调用对象
        const chainable = {
            then: (callback) => {
                // 这里只是将成功回调存起来，真正的调用在 process 中
                task.success = callback;
                return chainable; // 返回链式调用对象本身
            },
            catch: (callback) => {
                task.error = callback;
                return chainable; // 返回链式调用对象本身
            }
        };

        return chainable;
    }

    // 处理队列
    process() {
        if (this.tasks.length === 0 || this.isProcessing) {
            return;
        }

        this.isProcessing = true;
        this.processNext();
    }

    // 处理下一个任务
    processNext() {
        if (this.tasks.length === 0) {
            this.isProcessing = false;
            // this.runCompleteCallbacks();
            return;
        }

        const task = this.tasks.shift();

        try {
            // 执行任务，传入回调函数
            //第一种方式。队列类调用及响应xxxFun
            task.func(...(task.args || []), (error, result) => {
                if (error) {
                    if (task.error && typeof task.error === 'function') {
                        task.error(error);
                    }
                } else {
                    if (task.success && typeof task.success === 'function') {
                        task.success(result);
                    }
                }

                // 处理下一个任务
                this.processNext();
            });
            // //第二种方式。队列类调用及响应xxxFun。通过apply
            // task.func.apply(this, (task.args || []).concat((error, result) => {
            //     if (error) {
            //         if (task.error && typeof task.error === 'function') {
            //             task.error(error);
            //         }
            //     } else {
            //         if (task.success && typeof task.success === 'function') {
            //             task.success(result);
            //         }
            //     }

            //     // 处理下一个任务
            //     this.processNext();
            // }));

        } catch (error) {
            if (task.error && typeof task.error === 'function') {
                task.error(error);
            }
            this.processNext();
        }
    }

    // // 没有如下onComplete和runCompleteCallbacks方法，队列类也能使用。那之所以还设计，是为了，让队列类友好化，提供一些，可供选择的全局方法。
    // // 之所以说没啥用，是因为，队列类设计重点在，如何设计使用队列类的方法，及，使用队列类方法如何使用队列类。
    // // 添加队列完成回调
    // onComplete(callback) {
    //     this.completeCallbacks.push(callback);
    // }

    // // 运行完成回调
    // runCompleteCallbacks() {
    //     for (let i = 0; i < this.completeCallbacks.length; i++) {
    //         try {
    //             this.completeCallbacks[i]();
    //         } catch (e) {
    //             // 忽略完成回调中的错误
    //         }
    //     }
    // }
}

//----------------------------------------------

// 重新定义任务函数，使用回调风格
function task1(text, callback) {
    console.log('task1 start');
    setTimeout(() => {
        console.log('task1 end');
        callback(null, 'task1 response：' + text);
    }, 3000);
}

function task2(text, callback) {
    console.log('task2 start');
    setTimeout(() => {
        console.log('task2 end');
        callback(new Error('task2 error：' + text));
    }, 3000);
}

//----------------------------------------------
// 使用示例

const taskQueue = new CallbackQueue();

// // 注册队列完成回调
// taskQueue.onComplete(() => {
//     console.log('所有任务执行完毕！');
// });

// 添加任务到队列
taskQueue.enqueue(
    task1,  // 任务函数
    ['123'],  // 参数数组
    (res) => {  // 成功回调
        console.log(`task1('123') 成功：`, res);

        // 可以在回调中继续添加任务
        taskQueue.enqueue(
            task1,
            ['101112'],
            (res2) => {
                console.log(`task1('101112') 成功：`, res2);
            },
            (err2) => {
                console.log(`task1('101112') 失败：`, err2);
            }
        );
    },
    (err) => {  // 失败回调
        console.log(`task1('123') 失败：`, err);
    }
);

// 添加第二个任务
// 使用第二种接收队列类执行结果
const enqueue2 = taskQueue.enqueue(
    task2,
    ['456']
).then((res) => {
    console.log(`task2('456') 成功：`, res);
}).catch((err) => {
    console.log(`task2('456') 失败：`, err);
})

// 添加第三个任务
taskQueue.enqueue(
    task1,
    ['789'],
    (res) => {
        console.log(`task1('789') 成功：`, res);
    },
    (err) => {
        console.log(`task1('789') 失败：`, err);
    }
);