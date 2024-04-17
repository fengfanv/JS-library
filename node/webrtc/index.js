var https = require('https');
var fs = require('fs');
var url = require('url');
var path = require('path');
var ws = require("nodejs-websocket");


var hostname = GET_LAN_IP(); //如192.168.31.95
var sslKey = fs.readFileSync("./ssl/serverCA.key");
var sslCert = fs.readFileSync("./ssl/serverCA.crt");


//http服务
var PUBLIC_PATH = path.join(__dirname, "public");//web容器地址
https.createServer({
    key: sslKey,
    cert: sslCert
}, function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.setHeader("Access-control-max-age", "1000");

    //处理CORS复杂请求的预检请求
    if (request.method === 'OPTIONS') {
        console.log('复杂请求的预检请求')
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken ',
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
        });
        response.end();
        return false;
    };

    var pathname = url.parse(request.url).pathname;
    var file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
    fs.stat(file_address, function (err, stat) {
        if (err) {
            if (pathname == '/api/getData' && request.method == 'GET') {
                console.log('/api/getData', 'get', request.headers, url.parse(request.url).query);

                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ 'a': 111, 'b': 222, 'method': 'get' }))
            } else if (pathname == '/api/postData' && request.method == 'POST') {
                let postData = '';
                request.on('data', function (chunk) {
                    postData += chunk;
                });
                request.on('end', function (chunk) {
                    console.log('/api/postData', 'post', request.headers, postData);
                });

                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ 'a': 111, 'b': 222, 'method': 'post' }))
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' })
                response.end('状态：404，没有这样的文件或目录！')
                // console.log(err)
            }
        } else {
            var file_type = pathname.split('.')[1];
            //https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types  常见MIME类型列表
            var MIME = ''
            if (file_type == 'html' || file_type == 'htm') {
                MIME = 'text/html'
            } else if (file_type == 'css') {
                MIME = 'text/css'
            } else if (file_type == 'js') {
                MIME = 'text/javascript'
            } else if (file_type == 'png') {
                MIME = 'image/png'
            } else if (file_type == 'jpg' || file_type == 'jpeg') {
                MIME = 'image/jpeg'
            } else if (file_type == 'gif') {
                MIME = 'image/gif'
            }
            fs.readFile(file_address, function (err, fileData) {
                if (err) {
                    console.log(err)
                }
                response.writeHead(200, { 'Content-Type': MIME })
                response.end(fileData)
            })
        }
    })
}).listen({ port: 443, host: hostname }, function () {
    console.log('https 启动成功！', hostname, 443)
})


//websocket服务
var wsServer = ws.createServer({
    secure: true,
    key: sslKey,
    cert: sslCert
}, function (connection) {
    //用户连接到了ws服务，初始化用户信息
    var user = new URLSearchParams(connection.path.replace(/^[/|?]/g, "")).get('user');
    connection.user = user;
    console.log('用户连接ws服务', user);

    //监听客户端发来的消息
    connection.on("text", function (data) {
        var msg = JSON.parse(data)
        console.log('接收到消息--------------------')
        console.log('from', msg.from)
        console.log('to', msg.to)
        console.log('data', msg.data)
        console.log('--------------------')
        //转发消息
        wsSend(data, msg.from, msg.to)
    });

    //监听客户端关闭连接
    connection.on("close", function (code, reason) {
        console.log("连接关闭", connection.user);
    });

    //监听连接错误
    connection.on("error", function (error) {
        console.log("连接错误", connection.user, error);
    });

});
wsServer.listen(3000, hostname, function () {
    console.log('websocket 启动成功！', hostname, 3000);
});


//ws发送消息
function wsSend(msg, from, to) {
    if (typeof msg == 'undefined') {
        return false;
    }
    if (typeof from == 'undefined') {
        //没有来源，则说明，这条消息是系统发的
        from = 'system';
    }
    if (typeof to == 'undefined') {
        //没有指定发给谁，则广播给所有用户
        to = 'all';
    }

    if (to == "all") {
        //发给全部的人
        wsServer.connections.forEach(function (connection) {
            connection.sendText(msg);
        });

    } else {
        //发给指定的人
        wsServer.connections.forEach(function (connection) {
            if (connection.user == to) {
                connection.sendText(msg);
            };
        });
    }
};


//获取局域网IP地址
function GET_LAN_IP() {
    const interfaces = require('os').networkInterfaces();
    var IPAddress = 'localhost';
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                IPAddress = alias.address;
            }
        }
    }
    return IPAddress;
}