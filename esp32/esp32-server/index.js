//web服务
var webServer = require('./webServer.js');

//websocket服务
var wsServer = require('nodejs-websocket').createServer((connection) => {
    //用户连接websocket服务，初始化用户信息
    var user = new URLSearchParams(connection.path.replace(/^[/|?]/g, "")).get('user')
    connection.user = user
    console.log('用户连接websocket服务', user)

    //监听客户端发来的消息
    connection.on("text", (data) => {
        var msg = JSON.parse(data)
        // console.log('接收到消息--------------------')
        // console.log('from', msg.from)
        // console.log('to', msg.to)
        // console.log('data', msg.data)
        // console.log('--------------------')

        if (msg.to == esp32.name) {
            //通过udp将消息转发给esp32设备
            let code = Buffer.from(msg.data.code, 'utf8')
            udpServer.send(code, 0, code.length, esp32.port, esp32.ip, (error) => {
                if (error) {
                    console.log('upd转发消息失败')
                    return false
                }
                console.log('upd转发消息成功')
            })
        } else {
            wsSend(data, msg.from, msg.to)
        }
    })
    //监听客户端关闭连接
    connection.on("close", (code, reason) => {
        console.log("连接关闭", connection.user)
    })
    //监听连接错误
    connection.on("error", (error) => {
        console.log("连接错误", connection.user, error)
    })
})
wsServer.listen(3000, () => {
    console.log('websocket服务启动成功！')
})

//ws发送消息
function wsSend(msg, from, to) {
    if (typeof msg == 'undefined') {
        return false
    }
    if (typeof from == 'undefined') {
        //没有来源，则说明，这条消息是系统发的
        from = 'system'
    }
    if (typeof to == 'undefined') {
        //没有指定发给谁，则广播给所有用户
        to = 'all'
    }

    if (to == "all") {
        //发给全部的人
        wsServer.connections.forEach((connection) => {
            connection.sendText(msg)
        })
    } else {
        //发给指定的人
        wsServer.connections.forEach((connection) => {
            if (connection.user == to) {
                connection.sendText(msg)
            }
        })
    }
}


//udp服务，端口39990
var udpServer = require('dgram').createSocket('udp4')
udpServer.bind(39990, () => {
    udpServer.setBroadcast(true)
})

udpServer.on('message', (msg, rinfo) => {
    //console.log(`udp server got: ${msg} from ${rinfo.address}:${rinfo.port}`)

    if (rinfo.port == esp32.port) {
        esp32.ip = rinfo.address
    } else if (rinfo.port == esp32cam.port) {

        //发来的数据是 图像数据(视频)
        let buffer = Buffer.from(msg, 'binary')
        var base64Str = 'data:image/jpg;base64,' + buffer.toString('base64')
        wsSend(JSON.stringify({
            data: {
                type: 'video',
                data: base64Str,
                width: 640,
                height: null
            },
            from: esp32cam.name,
            to: 'admin'
        }), esp32cam.name, 'admin')

        // // 发来的数据是 音频数据
        // let buffer = Buffer.from(msg, 'binary')
        // var base64Str = 'data:application/octet-stream;base64,' + buffer.toString('base64') // application/octet-stream == 任何二进制数据类型
        // wsSend(JSON.stringify({
        //     data: {
        //         type: 'audio',
        //         data: base64Str,
        //     },
        //     from: esp32cam.name,
        //     to: 'admin'
        // }), esp32cam.name, 'admin')

        esp32cam.ip = rinfo.address
    }
})
udpServer.on('listening', () => {
    const address = udpServer.address()
    console.log(`udp server listening ${address.address}:${address.port}`)

    //给esp32设备发消息，询问其ip地址
    var code = Buffer.from('get_ip', 'utf8')
    udpServer.send(code, 0, code.length, esp32.port, '255.255.255.255')
    udpServer.send(code, 0, code.length, esp32cam.port, '255.255.255.255')
})
udpServer.on('error', (err) => {
    console.error(`udp server error:${err.stack}`)
    udpServer.close()
})


var esp32 = {
    name: "esp32",
    ip: null,
    port: 39991
}

var esp32cam = {
    name: "esp32cam",
    ip: null,
    port: 39992
}