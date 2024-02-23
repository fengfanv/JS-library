var http = require('http');
var https = require('https');
var qs = require('querystring');
var url = require('url');

var fs = require('fs');
var path = require('path');



//下载m3u8视频
function down_m3u8_video(m3u8Url) {
    var myURL = url.parse(m3u8Url);
    myURL.href2 = myURL.href.replace(/^(http:\/\/|https:\/\/)/i, '');
    myURL.href2Arr = myURL.href2.split('/');
    myURL.pathnameArr = myURL.pathname.split('/');
    console.log(myURL);

    //.m3u8文件名字
    let m3u8FileName = '';
    for (let i = 0; i < myURL.pathnameArr.length; i++) {
        let item = myURL.pathnameArr[i];
        if (/\.m3u8/i.test(item)) {
            m3u8FileName = item;
            break;
        }
    }

    //将      https://vip.ffzy-play3.com/20230329/10135_3e7ea150/2000k/hls/mixed.m3u8
    //解析成  https://vip.ffzy-play3.com/20230329/10135_3e7ea150/2000k/hls
    let urlPath = '';
    urlPath += myURL.protocol + '//' + myURL.href2Arr.slice(0, myURL.href2Arr.length - 1).join('/');
    // console.log(urlPath);

    //m3u8相关文件保存地址
    let saveFilePath = path.join(__dirname, 'public');

    //下载m3u8文件
    downloadFile(urlPath + '/' + m3u8FileName, path.join(saveFilePath, m3u8FileName)).then((m3u8FilePath) => {
        console.log('m3u8FilePath：', m3u8FilePath)
        //根据.m3u8文件里的ts文件地址，下载ts文件
        getTsInM3u8(m3u8FilePath, function (tsUrl) {
            let tsFileUrl =  urlPath+'/'+tsUrl;
            let tsFilePath = path.join(saveFilePath,tsUrl);
            downloadFile(tsFileUrl,tsFilePath).then((res)=>{
                console.log(res)
            })
        })
    })
}


// down_m3u8_video('https://vip.ffzy-play3.com/20230329/10135_3e7ea150/2000k/hls/mixed.m3u8');//海贼第一集


























//下载文件
function downloadFile(fileUrl, savePath) {
    return new Promise(function (resolve, reject) {

        var myURL = url.parse(fileUrl);
        // console.log(myURL);

        var requestMethod = 'GET'.toUpperCase();//请求方式
        var requestPort = null;//端口号
        if (myURL.port != null) {
            requestPort = myURL.port;
        } else {
            if (myURL.protocol == 'https:') {
                requestPort = 443;
            } else if (myURL.protocol == 'http:') {
                requestPort = 80;
            }
        }

        var options = {
            // hostname: 'www.baidu.com',
            // path: '/getInfo',
            // port: 80,
            // method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Content-Length': Buffer.byteLength(postData),
            // }
        };
        options = JSON.parse(JSON.stringify(myURL));
        options.method = requestMethod;
        options.port = requestPort;
        options.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        }
        // console.log(options);

        var req = null;
        if (myURL.protocol == 'https:') {
            req = https.request(options, responseCallback);
        } else {
            req = http.request(options, responseCallback);
        }

        function responseCallback(res) {
            console.log(`request STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('binary');
            var resData = '';
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
                resData += chunk;
            });
            res.on('end', () => {
                // console.log('No more data in response.');
                // console.log(resData)
                //保存文件
                saveFile(savePath, resData).then((filePath) => {
                    resolve(filePath)
                })
            });
        }

        req.on('error', (e) => {
            console.error(`request error: ${e.message}`);
        });

        if (requestMethod == 'POST') {
            // const postData = JSON.stringify({
            //     'msg': 'Hello World!',
            // });
            // req.write(postData);
        }

        req.end();
    })
}


//提取m3u8文件里的ts文件地址
function getTsInM3u8(filePath, callback) {
    var fileData = fs.readFileSync(filePath, 'binary');
    fileData = Buffer.from(fileData, 'binary').toString('utf8');//二进制转utf8
    // console.log(fileData)

    let arr = fileData.split(/[\r\n]/);

    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (/(\.ts)/i.test(item)) {
            // console.log(item)
            callback(item)
        }
    }
    // console.log(arr)
}

//保存文件
function saveFile(path, data) {
    return new Promise((resolve, reject) => {
        //创建可写流文件
        let writerStream = fs.createWriteStream(path);
        writerStream.write(data, 'binary');
        writerStream.end();//标记文件末尾

        writerStream.on('finish', function () {
            //finish 写入文件结束
            console.log('保存文件成功', path);
            resolve(path)
        });
        writerStream.on('error', function (err) {
            console.log('保存文件失败', path, err);
            // console.log(err.stack);
            reject(err)
        });
    })
}