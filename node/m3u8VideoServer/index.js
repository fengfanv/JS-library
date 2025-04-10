//播放手机下载的m3u8视频
//m3u8视频文件夹：./public/cacheFiles/    （手机下载的m3u8视频）
//视频压缩包文件夹：./zip/     （zipFile压缩文件）
//原始视频压缩包文件夹：./zipSource/     （压缩包源文件，压缩包解压后，将原压缩包转移到这里）
//注意：启动服务器前，无论是否使用以上三个文件夹，但请确保以上三个文件夹都存在


//获取本机在局域网中的IP地址
var IPAddress = 'localhost';
const interfaces = require('os').networkInterfaces();
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            IPAddress = alias.address;
        }
    }
}


const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const { zipFile, parseZipFile } = require('./common/zipFile_v2');

const PUBLIC_PATH = path.join(__dirname, "public"); //网站静态资源池

http.createServer(function (request, response) {

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
    if (pathname == "/") {
        pathname = '/index.html';
    }
    let filepath = path.join(PUBLIC_PATH, decodeURI(pathname));
    console.log(pathname)

    fs.stat(filepath, function (err) {
        if (err) {
            if (pathname == '/api/getvideolist' && request.method == 'GET') {
                //获取视频文件列表
                API_getVideoList(request, response);
            } else if (pathname == '/api/getvideo' && request.method == 'GET') {
                //获取视频文件
                API_getVideo(request, response);
            } else if (pathname == '/api/getziplist' && request.method == 'GET') {
                //获取压缩文件列表
                API_getZipList(request, response);
            } else if (pathname == '/api/parsezip' && request.method == 'GET') {
                //解压压缩文件
                API_parseZip(request, response);
            } else {
                //404状态码
                State_404(pathname, response);
                return false;
            }
        } else {
            let filetype = pathname.split('.')[1];
            let MIME = undefined;
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
            fs.readFile(filepath, function (err, file_data) {
                if (err) {
                    State_404(pathname, response);
                    return false;
                }
                response.writeHead(200, { 'Content-Type': MIME && MIME + 'charset=utf-8' })
                response.end(file_data);
            });
        }
    })
}).listen(8080, function () {
    console.log(`服务器运行在：http://${IPAddress}:8080`);
});

//http状态码404
function State_404(pathname, response) {
    response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end('404 ' + pathname);
}

//获取文件目录
function getFileDir(objPath, callback) { //获取文件目录
    let arr = [];
    fs.access(objPath, fs.constants.F_OK, (err) => {
        if (err) {
            //文件不存在 或没有该文件的访问权限
            console.log(`无法访问：${objPath}`)
            return callback && callback(arr);
        }
        fs.readdirSync(objPath).forEach(function (file) {
            var pathname = path.join(objPath, file);
            if (fs.statSync(pathname).isDirectory()) {
                //console.log('是文件夹');
            } else {
                if (file.slice(file.length - 4) != '.zip') {
                    arr.push({ "name": file, "path": file });
                }
            }
        });
        callback && callback(arr);
    })
}

//获取视频列表
function API_getVideoList(req, response) {
    response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
    getFileDir(path.join(__dirname, '/public/cacheFiles/'), (fileDir) => {
        response.end(JSON.stringify({
            "status": true,
            "data": fileDir
        }));
    });
}


//获取视频文件
function API_getVideo(req, response) {
    let data = querystring.parse(req.url.split('?')[1]);
    let objPath = path.join(__dirname, '/public/cacheFiles/');
    fs.readFile(path.join(objPath, data.path), function (err, fileData) {
        if (err) {
            console.log(err);
        }
        if (/.m3u8$/.test(data.path)) {
            //console.log('m3u8')
            let newFileData = fileData.toString().replace(new RegExp("(/storage/emulated/0/UCDownloads/VideoData/|file:///storage/emulated/0/UCDownloads/VideoData/|file:///sdcard/UCDownloads/VideoData/|file:///sdcard/Quark/Download/|file:///storage/emulated/0/Quark/Download/|file:///sdcard/Download/QuarkDownloads/)", 'g'), `http://${IPAddress}:8080/cacheFiles/`);
            response.writeHead(200, { 'Content-Type': 'application/x-mpegURL' })
            response.end(newFileData);
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

//-----------------------------------------------------------

//获取压缩文件列表
function API_getZipList(req, response) {
    response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
    getFileDir(path.join(__dirname, '/zip/'), (fileDir) => {
        response.end(JSON.stringify({
            "status": true,
            "data": fileDir
        }));
    });
}

//解压文件
function API_parseZip(req, response) {
    let data = querystring.parse(req.url.split('?')[1]);
    let objPath = path.join(__dirname, 'zip', data.path);
    let objSource = path.join(__dirname, 'zipSource', data.path);
    let toDir = path.join(__dirname, ['public', 'cacheFile'].join(path.sep)); //解压到哪里
    parseZipFile(objPath, toDir, function (res) {
        response.end(JSON.stringify({
            "status": true,
            "data": `解压成功：${data.path}`
        }));

        //防止冲突，解压后将压缩文件移动到别的文件夹
        fs.rename(objPath, objSource, (err) => {
            if (err) {
                return console.error('移动失败:', data.path);
            }
            console.log('移动成功:', data.path);
        });
    })
}