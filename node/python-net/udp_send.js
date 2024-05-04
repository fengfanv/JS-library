var dgram = require('dgram');

//udp给指定电脑发送消息案例

var udp = dgram.createSocket('udp4');

//给此udp绑定端口号。不绑定端口号，程序在运行时，系统会为其分配一个临时随机端口号
udp.bind(8998);

var send_data = 'hello world你好世界';
var sendData = Buffer.from(send_data, 'utf8');
udp.send(sendData, 0, sendData.length, 6789, '192.168.31.95', function (error) {
    if (error) {
        console.log(error);
        return false;
    }
    udp.close();//发送完毕，关闭upd服务
});

