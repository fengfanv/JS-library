var dgram = require('dgram');
var udp_client = dgram.createSocket('udp4');
//绑定端口号。不绑定端口号，程序在运行时，系统会为其分配一个临时随机端口号
udp_client.bind(8999, '', function () {
    udp_client.setBroadcast(true);
});

var send_data = 'hello world';

udp_client.send(send_data, 0, send_data.length, 6789, '', function (error) {
    if (error) {
        console.log(error);
        return false;
    }
    udp_client.close();//广播完毕，关闭upd服务
});

