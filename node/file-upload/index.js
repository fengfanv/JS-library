const http = require('http')
const { parsePost } = require('./parse-post-data')
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

async function App(request, response) {
    //处理跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With")
    response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    response.setHeader("Access-control-max-age", "1000")
    //处理跨域-处理复杂请求的预检请求
    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken ',
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
        });
        response.end()
        return false
    };

    var pathname = url.parse(request.url).pathname
    if (/(^.+\/$|^\/$)/.test(pathname)) {
        pathname += 'index.html'
    }

    var filepath = path.join(__dirname, 'public', decodeURI(pathname))
    fs.stat(filepath, function (err, stat) {
        if (err) {
            if (pathname == '/upload' && request.method == 'POST') {
                parsePost(request, { "storageFilePath": "./temp" }).then((body) => {
                    console.log("body", body)
                    let [fname, index, fext] = path.basename(body.file).split('.')
                    //移动文件分片，并为文件分片重命名
                    let fromPath = path.join(__dirname, body.file);
                    let toPath = path.join(__dirname, 'temp', fname, index);
                    moveFile(fromPath, toPath).then(() => {
                        response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
                        response.end(JSON.stringify(body))
                    }).catch((err) => {
                        response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
                        response.end(JSON.stringify({ ...body, err }))
                    })
                }).catch((err) => {
                    console.log('err', err)
                    response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
                    response.end('500')
                })
            } else if (pathname == '/merge' && request.method == 'POST') {
                let fileName = '';
                parsePost(request).then((body) => {
                    console.log("body", body)
                    fileName = body.name;
                    let [fname, fext] = fileName.split('.')
                    let folderPath = path.join(__dirname, 'temp', fname)
                    let filePath = path.join(__dirname, 'temp', fileName)
                    //合并文件分片
                    return mergeFiles(folderPath, filePath)
                }).then((res) => {
                    let [fname, fext] = fileName.split('.')
                    let folderPath = path.join(__dirname, 'temp', fname)
                    //上传成功，删除存放文件分片的文件夹
                    return removeDir(folderPath) 
                }).then((res)=>{
                    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
                    response.end('上传成功!')
                }).catch((err) => {
                    console.log('err', err)
                    response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
                    response.end('500')
                })
            } else {
                response.writeHead(404, { 'Content-Type': 'text/plain;charset=utf-8' })
                response.end('404 ' + pathname)
            }
        } else {
            response.writeHead(200, { 'Content-Length': stat.size })
            fs.createReadStream(filepath).on('data', function (chunk) {
                response.write(chunk)
            }).on('end', function () {
                response.end()
            }).on('error', function (err) {
                console.log(err)
                response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
                response.end('500')
            })
        }
    })
}

http.createServer(App).listen(3000, () => {
    console.log('端口：3000，服务已启动！');
});

//node --max-old-space-size=4096 index.js




//移动文件
function moveFile(from, to) {
    //检查文件是否存在
    function isExist(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, function (err, stats) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }
    //创建文件夹
    function createFolder(path) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, { recursive: true }, (err) => {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }
    //复制文件
    function copyFile(fromPath, toPath) {
        return new Promise((resolve, reject) => {
            let readStream = fs.createReadStream(fromPath)
            let writeStream = fs.createWriteStream(toPath)
            readStream.on('error', (err) => {
                reject(err)
            });
            writeStream.on('error', (err) => {
                reject(err)
            });
            readStream.pipe(writeStream)
            writeStream.on('finish', () => {
                resolve()
            })
        })
    }
    //删除文件
    function deleteFile(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    }
    return new Promise((resolve, reject) => {
        //检测被移动文件是否存在
        isExist(from).then((status) => {
            // 检测目标某个文件夹是否存在，不存在则创建
            let toPath = path.dirname(to)
            return isExist(toPath)
        }).then((status) => {
            if (status) {
                return Promise.resolve()
            } else {
                let toPath = path.dirname(to)
                return createFolder(toPath)
            }
        }).then(() => {
            return copyFile(from, to)
        }).then(() => {
            return deleteFile(from)
        }).then(() => {
            resolve()
        }).catch((err) => {
            reject(err)
        })
    })
}


//合并"某个文件夹"里的文件
function mergeFiles(folderPath, filePath) {
    //读取文件夹内的文件列表
    function readFileList(dirPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    //合并文件分片的顺序不能乱，从小到大排序，否则合并后的文件会报错
                    files = files.sort((a, b) => {
                        return a - b
                    })
                    for (let i = 0; i < files.length; i++) {
                        files[i] = path.join(dirPath, files[i])
                    }
                    resolve(files)
                }
            })
        })
    }

    //导入待合并的文件列表，创建 可读文件流，并且往 可写文件流 里写入数据
    let readStreamToWriteStream = function (files, index, writeStream) {
        return new Promise((resolve, reject) => {
            function run() {
                let readStream = fs.createReadStream(files[index])
                if (index == files.length - 1) {
                    readStream.pipe(writeStream, {
                        end: true
                    })
                } else {
                    readStream.pipe(writeStream, {
                        end: false
                    })
                }
                readStream.on('end', () => {
                    index++
                    if (index != files.length) {
                        run()
                    } else {
                        resolve()
                    }
                })
                readStream.on('error', (err) => {
                    reject(err)
                })
            }
            if (index < files.length) {
                run()
            }
        })

    }

    return new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(filePath);
        writeStream.on('error', (err) => {
            reject(err)
        })
        writeStream.on('finish', () => {
            resolve(filePath)
        })
        readFileList(folderPath).then((files) => {
            return readStreamToWriteStream(files, 0, writeStream)
        }).catch((err) => {
            reject(err)
        })
    })
}




//递归删除文件夹(同步)
function removeDir(path) {
    try {
        const files = fs.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            const filePath = `${path}/${files[i]}`;
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                removeDir(filePath);
            }
        }
        fs.rmdirSync(path);
        return Promise.resolve()
    } catch (err) {
        return Promise.reject(err)
    }
}