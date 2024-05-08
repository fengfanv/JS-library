var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

//http服务
var public_path = path.join(__dirname, "public")//web容器地址
http.createServer(function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With")
    response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    response.setHeader("Access-control-max-age", "1000")

    //处理CORS复杂请求的预检请求
    if (request.method === 'OPTIONS') {
        console.log('复杂请求的预检请求')
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken ',
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
        })
        response.end()
        return false
    }

    var pathname = url.parse(request.url).pathname
    var file_address = path.join(public_path, decodeURI(pathname))
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
            }
        } else {
            if (pathname == "/") {
                file_address = path.join(public_path, decodeURI('/index.html'))
                pathname = '/index.html'
            }
            var file_type = pathname.split('.')[1]
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
}).listen(80, function () {
    console.log('http服务启动成功！')
})