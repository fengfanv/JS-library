var dgram = require('dgram');

//创建 udp server
var udp_server = dgram.createSocket('udp4');
udp_server.bind(5678); //为这个udp服务绑定端口号

//监听端口
udp_server.on('listening', function () {
    console.log('udp server linstening 5678');
})

//接收消息
udp_server.on('message', function (msg, rinfo) {
    strmsg = msg.toString();
    udp_server.send(strmsg, 0, strmsg.length, rinfo.port, rinfo.address); //将接收到的消息返回给客户端
    console.log(`udp server received data: ${strmsg} from ${rinfo.address}:${rinfo.port}`)
})

//错误处理
udp_server.on('error', function (err) {
    console.log('some error on udp server')
    udp_server.close();
})



//https://www.cnblogs.com/ay-a/p/9822268.html