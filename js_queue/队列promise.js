class Queue {
    constructor() {
        this.tasks = [];
        this.isProcessing = false;
    }

    enqueue(task) {
        return new Promise((resolve, reject) => {
            const wrappedTask = async () => {
                try {
                    const result = await task();
                    resolve(result); //这里调用resolve和reject形成了闭包
                } catch (error) {
                    reject(error);
                }
            };

            this.tasks.push(wrappedTask);

            if (!this.isProcessing) {
                this.process();
            }
        });
    }

    async process() {
        this.isProcessing = true;
        while (this.tasks.length > 0) {
            const task = this.tasks.shift();
            await task();
        }
        this.isProcessing = false;
    }
}

//----------------------------------------------

// 创建队列实例
const taskQueue = new Queue();

//----------------------------------------------

function task1(text) {
    return new Promise((resolve, reject) => {
        console.log('task1 start')
        setTimeout(() => {
            console.log('task1 end')
            resolve('task1 response：' + text)
        }, 3000)
    })
}

function task2(text) {
    return new Promise((resolve, reject) => {
        console.log('task2 start')
        setTimeout(() => {
            console.log('task2 end')
            reject(new Error('task2 error：' + text))
        }, 3000)
    })
}

//----------------------------------------------

//正确使用：taskQueue.enqueue(() => task1('123'))
//正确使用：taskQueue.enqueue(task1.bind(null, '123'))
//错误使用：taskQueue.enqueue(task1('123'))
taskQueue.enqueue(() => task1('123')).then((res) => {
    console.log(`task1('123')：`, res)
    taskQueue.enqueue(() => task1('101112')).then((res) => {
        console.log(`task1('101112')：`, res)
    }).catch((err) => {
        console.log(`task1('101112')：`, err)
    })
}).catch((err) => {
    console.log(`task1('123')：`, err)
})

taskQueue.enqueue(task2.bind(null, '456')).then((res) => {
    console.log(`task2('456')：`, res)
}).catch((err) => {
    console.log(`task2('456')：`, err)
})

taskQueue.enqueue(() => task1('789')).then((res) => {
    console.log(`task1('789')：`, res)
}).catch((err) => {
    console.log(`task1('789')：`, err)
})