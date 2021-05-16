const http = require('http')

const fs = require('fs')
const url = require('url')
const path = require('path')
const querystring = require('querystring')

function App(request, response) {
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

    var pathname = url.parse(request.url).path;
    if (/(^.+\/$|^\/$)/.test(pathname)) {
        pathname += 'index.html'
    }
    var filepath = path.join(__dirname, 'public', decodeURI(pathname));
    fs.stat(filepath, function (err, stat) {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/plain' })
            response.end('404');
        } else {
            let dataArr = [];
            fs.createReadStream(filepath).on('data',function(chunk){
                // console.log(chunk);
                dataArr.push(chunk)
            }).on('end',function(){
                console.log(dataArr.length);
                //可以通过这种方法限制限速
                response.writeHead(200,{ 'content-length': stat.size })

                let dataLen = dataArr.length;
                for(let i = 0;i<dataLen;i++){
                    setTimeout(()=>{
                        if(dataLen+1!=dataLen){
                            response.write(dataArr[i]);
                        }else{
                            response.end();
                        }
                    },i*1000)
                }


            }).on('error',function(e){
                console.log(e)
            });

            // fs.readFile(filepath, function (err, res) {
            //     if (err) {
            //         console.log(err);
            //         console.log('读取文件错误~');
            //     }
            //     response.writeHead(200,{ 'content-length': stat.size })
            //     response.end(res);
            // })
        }
    })


}

http.createServer(App).listen(8080, () => {
    console.log('端口：80，服务已启动！');
});

// fs.stat(path.join(__dirname, 'public', 'updata2.apk'), function (err, stat) {

//     console.log(stat)
// })