function work(index,callback){
    var number = 0;
    for(let i=0;i<10000000000;i++){
        number += i;
    }
    callback && callback(number+''+index);
}

function run(){
    console.log('start');
    for(let i=0;i<10;i++){
        work(i,function(number){
            console.log(number);
        })
    }
    console.log('end');
}


run();

/*
这个程序，是 学习完 事件循环 后做的一个小实验。

这里是想实验在for循环内数据运算比较大时，for循环是否会异步
答：不会异步，console.log('end'); 会在10个循环都运行结束后，才打印，因此也证明，这for循环，堵塞了主进程。印证了for循环不会异步，那些方法会异步，如setTimeout，ajax请求，promise等，详细看事件循环那个文章



*/