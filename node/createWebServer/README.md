## 创建HTTP服务（不使用第三方库）（处理跨域请求）

当(浏览器)前端api接口地址不是同源地址，是跨域地址，则会发生跨域请求。跨域请求涉及CORS相关操作，详细请看下面：

[跨域资源共享 CORS 详解 - 阮一峰](http://www.ruanyifeng.com/blog/2016/04/cors.html)

CORS请求(跨域请求)分为两类：简单请求 和 复杂请求

#### 跨域请求时，满足以下两种条件就是**简单请求**：
1、请求方法是这三种方法之一（HEAD，GET，POST）

2、HTTP的请求头信息不超出这几种字段（Accept，Accept-Language，Content-Language，Last-Event-ID，Content-Type），其中Content-Type字段只能是这几种方式之一（application/x-www-form-urlencoded，multipart/form-data，text/plain）

#### 跨域请求时，不满足上面两种条件就是**复杂请求**:
例如，api接口地址不是同源地址，是跨域地址，并且还自定义了请求头字段（如：在请求头里增加了Token字段），则当前要发送的请求，就属于跨域-复杂请求

如果 某个请求 属于**跨域-复杂请求**，则浏览器内部会在正式请求之前，先向服务端发送一个预检请求（OPTIONS请求），来向服务端要服务端的响应条件信息（请求服务端接口时，需要具备哪些条件）。拿到服务端的响应条件信息后，浏览器会将其与正式请求的请求头，请求方式等信息进行比较。如果满足条件，则发送请求，如不满足，则不发送请求

注意：如果api接口地址是同源地址，不是跨域地址，则不管请求头信息，请求方式有多奇怪，则都会直接发送请求。因为这是同源请求，不是跨域请求，所以不会有(cors跨域资源共享)相关的操作

#### node.js处理跨域复杂请求
```javascript
const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const querystring = require('querystring')

function app(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.setHeader("Access-control-max-age", "1000");

    //处理 跨域-复杂请求 的预检请求
    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild,sessionToken',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
        });
        response.end();
        return false;
    };
    
	//....
}

http.createServer(app).listen(80, () => {
    console.log('端口：80，服务已启动！');
});
```
## 使用http模块搭建一个web网页服务
```javascript
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring')

const PUBLIC_PATH = path.join(__dirname, "/\public\/");//项目地址
http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
    fs.stat(file_address, function (err, stat) {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/html' })
            response.end('状态：404，没有这样的文件或目录！');
            console.log(err);
        } else {
            let file_type = pathname.split('.')[1];
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
                    console.log(err);
                }
                response.writeHead(200, { 'Content-Type': MIME })
                response.end(fileData);
            })
        }
    })

}).listen(8080);
console.log('服务地址',8080);
```
## https模块设置ssl证书
```javascript
const https = require('https');
const fs = require('fs');

/*获取ssl证书物理地址*/
const httpsOption = {
    key: fs.readFileSync("./ssl证书/xxx.key"),
    cert: fs.readFileSync("./ssl证书/xxx.crt")
};
https.createServer(httpsOption,function (request, response) {
	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	
	//返回状态及内容类型1
	response.writeHead(200, {'Content-Type': 'text/plain'});
	
	//返回状态及内容类型2
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain;charset=utf-8');
	
	// 发送响应数据 "Hello World"
	response.end('Hello World\n');
}).listen(443);
```