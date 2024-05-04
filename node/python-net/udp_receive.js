var dgram = require('dgram');

//udp接收数据案例

//创建udp
var udp = dgram.createSocket('udp4');
//给此udp绑定端口号。不绑定端口号，程序在运行时，系统会为其分配一个临时随机端口号
udp.bind(5678);

//监听端口
udp.on('listening', function () {
    console.log('udp server linstening 5678');
})

//接收消息
udp.on('message', function (msg, rinfo) {
    let buffer = Buffer.from(msg, 'binary');
    msgStr = buffer.toString();
    console.log(`udp server received data: ${msgStr} from ${rinfo.address}:${rinfo.port}`)
})

//错误处理
udp.on('error', function (err) {
    console.log('some error on udp server')
    udp.close();
})



//https://www.cnblogs.com/ay-a/p/9822268.html