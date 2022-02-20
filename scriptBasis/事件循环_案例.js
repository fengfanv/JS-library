function run(){
    setTimeout(()=>{
        console.log('setTimeout');
        new Promise((resolve)=>{
            console.log('Promise created');
            resolve()
        }).then(()=>{
            console.log('Promise.then ....');
        }).then(()=>{
            console.log('Promise.then2 ....');
        })
    },0)

    setTimeout(()=>{
        console.log('setTimeout2222');
        new Promise((resolve)=>{
            console.log('Promise created2222');
            resolve()
        }).then(()=>{
            console.log('Promise.then ....2222');
        })
    },0)
}

run();


/*
setTimeout
Promise created
Promise.then ....
Promise.then2 ....
setTimeout2222
Promise created2222
Promise.then ....2222

这个程序，事件循环机制运行了5次

运行代码时，发现了两个，定时器，然后放进了，宏列表（这里有步骤省略，真实步骤：发现定时器，然后把定时器交给了定时器线程，因为设置的时间是0，所以，定时器的线程就直接把，定时器回调，放进了任务列表里的宏列表内，然后回调在任务列表内等待被执行）

执行栈内已没有可运行的代码（同步代码运行完毕），开始检查，任务列表（微列表和宏列表）内是否有可运行的代码，这时发现有，然后开始 事件循环机制

第一次：（微列表内没有东西，宏列表内有2个定时器回调，然后把第一个放进宏列表的定时器，拿到执行栈里，去执行。运行后，发现一个promise.then（Promise.then ....），然后把这个promise.then放进了微列表）
setTimeout
Promise created
第二次：（微列表内有一个promise.then（Promise.then ....），把这个promise.then拿到执行栈里，去执行。运行完后，又发现了一个promise.then（Promise.then2 ....），然后把这个新发现的promise.then放进微列表）
Promise.then ....
第三次：（微列表内有一个promise.then（Promise.then2 ....），所以现在要把这个promise.then拿到执行栈里，去执行）
Promise.then2 ....
第四次：（微列表内没有东西，宏列表内有1个定时器回调，把这个定时器回调，拿到执行栈里，去执行。运行后，发现了一个promise.then（Promise.then ....2222），然后把这个promise.then放进了微列表内）
setTimeout2222
Promise created2222
第五次：（微列表内有一个promise.then（Promise.then ....2222），所以现在要把这个promise.then拿到执行栈里，去执行）
Promise.then ....2222


执行栈 先进后出
任务列表（宏列表或微列表） 先进先出


*/


function run2(){

    console.log('start');

    a().then(()=>{
        console.log('a_then');
    })

    console.log('end');

    function a(){
        console.log('a_function');
        return b().then((res)=>{
            console.log('res',res);
            console.log('b_then');
            return Promise.resolve('aaa返回值');
        })
    }

    function b(){
        console.log('b_function');
        return Promise.resolve('返回值');
    }


}

function run3(){

    console.log('start');

    a().then((res)=>{
        console.log('a_then');
        console.log('res1',res);
    })

    console.log('end');

    function a(){
        console.log('a_function');
        return b().then((res)=>{
            console.log('res',res);
            console.log('b_then');
            
        })
    }

    function b(){
        console.log('b_function');
        return Promise.resolve('返回值');
    }

    b().then(()=>{
        return Promise.resolve('a方法返回值');
    })


}


/*
start
a_function
b_function
end
b_function
res 返回值
b_then

a_then
res1 undefined


*/