var dgram = require('dgram');
var udp_client = dgram.createSocket('udp4');
udp_client.bind(5678); //绑定端口号。不绑定端口号，程序在运行时，系统会为其分配一个临时随机端口号

var send_data = 'hello world';

udp_client.send(send_data, 0, send_data.length, 6789, '192.168.31.95', function (error) {
    if (error) {
        console.log(error);
        return false;
    }
    udp_client.close();//发送完毕，关闭upd服务
});

