var dgram = require('dgram');

//udp发送广播消息案例

var udp = dgram.createSocket('udp4');

//给此udp绑定端口号。不绑定端口号，程序在运行时，系统会为其分配一个临时随机端口号
udp.bind(8999, '', function () {
    udp.setBroadcast(true);
});

var send_data = 'hello world';

udp.send(send_data, 0, send_data.length, 6789, '255.255.255.255', function (error) {
    if (error) {
        console.log(error);
        return false;
    }
    udp.close();//广播完毕，关闭upd服务
});

