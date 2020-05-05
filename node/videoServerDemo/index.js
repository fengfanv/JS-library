const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

const PUBLIC_PATH = path.join(__dirname, "/\public\/");//项目地址
http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname === '/files/gsl.mp4') {
        //大文件请求，文件下载，断点继传
        //console.log(request.headers.range);
        //response.writeHead(206, { 'Content-Type': 'text/html' })
        
        var range = request.headers.range;
        //一般请求头range格式：Range: bytes=start-end
        //Range: bytes=10- ：第10个字节及最后个字节的数据
        //Range: bytes=40-100 ：第40个字节到第100个字节之间的数据
        console.log(range);
        var file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
        if(range) {
            //利用range头实现断点下载
            
            let stat = fs.statSync(file_address);
            let fileSize = stat.size;
            //有range头才使用206状态码
            let parts = range.replace(/bytes=/, "").split("-");
            let start = parseInt(parts[0]);
            let end = parts[1] ? parseInt(parts[1]) : start + 999999;
    
            // end 在最后取值为 fileSize - 1 
            end = end > fileSize - 1 ? fileSize - 1 : end;
            let chunksize = (end - start) + 1;
            let file = fs.createReadStream(file_address, {start, end});
            let head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4'
            };
            //Range响应头格式
            //Content-Range: bytes 0-100/5000   这个表示相应了0到100个字节的数据，共有5000个字节大小
            //Content-Length: 5000  总文件大小
            response.writeHead(206, head);
            file.pipe(response);
        }else{
            //普通下载没有Range请求头
            let stat = fs.statSync(file_address);
            let fileSize = stat.size;
            let head = {
                'Content-Type': 'video/mp4',
                'Content-Length': fileSize,
            };
            response.writeHead(200, head);
            fs.createReadStream(file_address).pipe(response);
        }
    } else {
        //普通请求处理
        var file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
        fs.stat(file_address, async function (err, stat) {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/html' })
                response.end('状态：404，没有这样的文件或目录！');
                console.log(err);
            } else {
                let file_type = pathname.split('.')[1];
                let MIME = await MIME_FUN(file_type);
                fs.readFile(file_address, function (err, fileData) {
                    if (err) {
                        console.log(err);
                    }
                    response.writeHead(200, { 'Content-Type': MIME })
                    response.end(fileData);
                })
            }
        })
    }

}).listen(8080);
console.log('服务地址', 8080);

function MIME_FUN(file_type) {
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
    } else if (file_type == 'mp4') {
        MIME = 'video/mp4'
    }
    return MIME;
}