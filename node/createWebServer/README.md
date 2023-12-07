## 创建HTTP服务（不使用第三方库）

### 简单请求与复杂请求：
- [跨域资源共享 CORS 详解 - 阮一峰](http://www.ruanyifeng.com/blog/2016/04/cors.html)
- [JavaScript CORS通信 - W3Cschool](https://www.w3cschool.cn/javascript_guide/javascript_guide-z4jy26a3.html)

#### 满足以下两种条件就是**简单请求**：
1、请求方法是这三种方法之一（HEAD，GET，POST）

2、HTTP的请求头信息不超出这几种字段（Accept，Accept-Language，Content-Language，Last-Event-ID，Content-Type），其中Content-Type字段只能是这几种方式之一（application/x-www-form-urlencoded，multipart/form-data，text/plain）

#### 不满上面两种条件就是**复杂请求**:
例如，自定义了请求头字段（如：请求头里增加了Token字段），就会触发复杂请求

如果触发了**复杂请求**。则会在正式请求之前，先发送一个预检请求，会向服务端发送一个请求方式是opstions的请求权限信息的请求，来向服务端要服务端的请求权限信息。拿到服务端的请求权限信息后，客户端会将这个与正式请求的请求头，请求方式，请求域名进行检验。如果满足条件，则发送正式请求，如不满足会触发跨域，不会进行正式请求

经过测试，post方式自定义请求头参数后，会触发复杂请求。get方式自定义请求头后，不会触发复杂请求。

#### Node.js处理复杂请求（解决跨域）
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

    //处理复杂请求的预检请求
    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken ',
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
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