const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/events') {
        //设置SSE响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream', //声明事件流格式
            'Cache-Control': 'no-cache', //禁用缓存确保实时性
            'Connection': 'keep-alive' //保持长连接
        });

        //模拟实时数据推送
        let counter = 0;
        const timer = setInterval(() => {
            counter++;
            let msg = `这是第 ${counter} 条消息`;
            res.write(`data:${msg}\n\n`); //SSE数据格式要求以 “data:”开头，且结尾必须有两个换行符

            //5秒后，服务端主动断开连接
            if (counter === 5) {
                clearInterval(timer);
                res.end();
            }
        }, 1000);

        //处理客户端断开连接
        req.on('close', () => {
            clearInterval(timer);
            console.log('客户端断开连接');
        });
    } else {
        if (req.url == '/') {
            req.url = '/index.html';
        }
        let filePath = `${__dirname}${req.url}`;
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                //文件不存在 或没有该文件的访问权限
                res.writeHead(404, {
                    'Content-Type': 'text/plain;charset=utf-8',
                    'Cache-Control': 'no-cache', //禁用缓存
                });
                res.end(`"${req.url}" Not Found`);
            } else {
                fs.createReadStream(filePath).pipe(res); //通过管道，将读取到的文件流，流入res内
            }
        });
    }
});

server.listen(3000, () => {
    console.log('服务器运行在：http://localhost:3000');
});