//播放手机下载的m3u8视频
//请将手机下载的m3u8视频放在 ./public/cacheFiles/ 内 

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PUBLIC_PATH = path.join(__dirname, "public"); //项目地址
http.createServer(function(request, response) {

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.setHeader("Access-control-max-age", "1000");
    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild,sessionToken',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
        });
    };

    let pathname = url.parse(request.url).pathname;
    let filepath = path.join(PUBLIC_PATH, decodeURI(pathname));
    console.log(pathname)

    fs.stat(filepath, function(err, stat) {
        if (err) {
            if (pathname == '/api/getfiles' && request.method == 'GET') {
                //查询目录
                API_getFiles(request, response);
            } else if (pathname == '/api/getvideo' && request.method == 'GET') {
                //获取视频文件
                API_getVideo(request, response);
            } else {
                //404状态码
                State404(pathname, response);
                return false;
            }
        } else {
            if (pathname == "/") {
                filepath = path.join(PUBLIC_PATH, decodeURI('/index.html'));
                pathname = '/index.html';
            }
            let filetype = pathname.split('.')[1];
            let MIME = ''
            if (filetype == 'html' || filetype == 'htm') {
                MIME = 'text/html;'
            } else if (filetype == 'css') {
                MIME = 'text/css;'
            } else if (filetype == 'js') {
                MIME = 'text/javascript;'
            } else if (filetype == 'png') {
                MIME = 'image/png;'
            } else if (filetype == 'jpg' || filetype == 'jpeg') {
                MIME = 'image/jpeg;'
            }
            fs.readFile(filepath, function(err, file_data) {
                if (err) {
                    State404(pathname, response);
                    return false;
                }
                response.writeHead(200, { 'Content-Type': MIME + 'charset=utf-8' })
                response.end(file_data);
            });
        }
    })
}).listen(8080, function() {
    console.log('端口：8080 启动成功！');
});

//http状态码404
function State404(pathname, response) {
    response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end('404 ' + pathname);
}

//获取文件目录
var fileDir = []; //文件目录
function getFileDir() { //获取文件目录
    let arr = [];
    let objPath = path.join(__dirname, '/public/cacheFiles/');
    fs.readdirSync(objPath).forEach(function(file) {
        var pathname = path.join(objPath, file);
        if (fs.statSync(pathname).isDirectory()) {
            //console.log('是文件夹');
        } else {
            if (file.slice(file.length - 4) != '.zip') {
                arr.push({ "name": file, "path": file });
            }

        }
    });
    fileDir = arr;
}

function API_getFiles(reqest, response) {
    response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
    getFileDir();
    response.end(JSON.stringify({
        "status": true,
        "data": fileDir
    }));
}


//获取视频文件
function API_getVideo(reqest, response) {
    let data = querystring.parse(reqest.url.split('?')[1]);
    //let arr = [];
    let objPath = path.join(__dirname, '/public/cacheFiles/');
    // fs.readdirSync(objPath).forEach(function (file) {
    //     var pathname = path.join(objPath, file);
    //     if (fs.statSync(pathname).isDirectory()) {
    //         //console.log('是文件夹');
    //     } else {
    //         arr.push(file);
    //     }
    // });
    //console.log(arr);
    fs.readFile(path.join(objPath, data.path), function(err, fileData) {
        if (err) {
            console.log(err);
        }
        //console.log(fileData.toString());
        //console.log(data.path);
        if (/.m3u8$/.test(data.path)) {
            //console.log('m3u8')
            let newfileData = fileData.toString().replace(new RegExp("(/storage/emulated/0/UCDownloads/VideoData/|file:///storage/emulated/0/UCDownloads/VideoData/|file:///sdcard/UCDownloads/VideoData/|file:///sdcard/Quark/Download/|file:///storage/emulated/0/Quark/Download/|file:///sdcard/Download/QuarkDownloads/)", 'g'), 'http://' + IPAddress + ':8080/cacheFiles/');
            response.writeHead(200, { 'Content-Type': 'application/x-mpegURL' })
            response.end(newfileData);
        } else {
            //console.log('其它文件');
            let fileType = /[.][A-z0-9]+$/.exec(data.path);
            console.log(fileType);
            response.writeHead(200, { 'Content-Type': fileType[0] == '.mp4' ? 'video/mp4' : 'application/octet-stream' })
            response.end(fileData);
        }
        //response.end('ok');
    })
}


//获取本机在局域网中的IP地址
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
console.log('地址：', IPAddress);