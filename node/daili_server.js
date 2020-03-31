var http = require('http');
var https = require('https')
var url = require('url');
var querystring = require('querystring')

http.createServer(function(request, response) {
    var ip = request.headers['x-forwarded-for'] || request.ip || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }

    response.setHeader("Access-Control-Allow-Origin", "*");
    var timeStampStart = Date.now();
    var option = {};
    option.hostname = 'www.xxx.com';
    option.protocol = 'https:'
    option.port = 443;
    option.method = request.method;
    option.path = request.url.split('?')[0];
    var reqHeader = request.headers;
    reqHeader.host = 'www.xxx.com';
    reqHeader.origin = 'https://www.xxx.com';
    reqHeader.referer = 'https://www.xxx.com';
    option.headers = reqHeader;
    if (request.method == 'GET') {
        let data = querystring.parse(request.url.split('?')[1]);
        var client = https.request(option, (client_res) => {
            response.writeHead(client_res.statusCode, client_res.headers);
            client_res.on('data', function(d) {
                response.write(d);
            });
            client_res.on('end', function(d) {
                var timeStampEnd = Date.now();
                console.log("\033[42;30m success \033[40;32m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
                response.end(d);
            });
        }).on('error', function(e) {
            var timeStampEnd = Date.now();
            console.log("\033[41;31m error \033[40;31m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
            console.error(e);
        })
        if (querystring.stringify(data).length > 0) {
            client.write(querystring.stringify(data));
        }
    } else {
        var postData = '';
        request.on('data', function(chunk) {
            postData += chunk;
        });
        request.on('end', function() {
            let data = postData.length > 0 ? querystring.parse(postData) : { 'a': 1 }; //?为啥不穿数据就不往下走了？（现在解决办法是不穿数据（数据为空的）用{a：1}来弥补参数）
            var client = https.request(option, (client_res) => {
                response.writeHead(client_res.statusCode, client_res.headers);
                client_res.on('data', function(d) {
                    response.write(d);
                });
                client_res.on('end', function(d) {
                    var timeStampEnd = Date.now();
                    console.log("\033[42;30m success \033[40;32m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
                    response.end(d);
                });
            }).on('error', function(e) {
                var timeStampEnd = Date.now();
                console.log("\033[41;31m error \033[40;31m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
                console.error(e);
            })
            if (querystring.stringify(data).length > 0) {
                client.write(querystring.stringify(data));
            }
        });
    }

}).listen(9999);
console.log('代理地址', 9999);