const http = require('http')
const fs = require('fs')
const {stat} = require('fs').promises
const videoPath='./test.mp4'

// 入门版
// http.createServer((req,res)=>{
//     if(req.url=="/"){
//         res.writeHead(200,{'Content-Type':'text/html'})
//         res.end(
//             `
//             <video src="/video" width="500" controls></video>
//             `
//         )
//     }else if(req.url=="/video"){
//         fs.createReadStream(videoPath).pipe(res)
//     }
// }).listen(3000,()=>{
//     console.log('listen 3000')
// })


// 进阶版
http.createServer(async (req,res)=>{
    if(req.url=="/"){
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(
            `
            <video src="/video" width="500" controls></video>
            `
        )
    }else if(req.url=="/video"){
        let range = req.headers['range']
        if(range){
            //请求头有range，根据range返回视频
            let stats = await stat(videoPath)
            let r = range.match(/=(\d+)-(\d+)?/)
            let start = parseInt(r[1],10)
            let end = r[2]?parseInt(r[2],10):start+1024*1024
            if(end>stats.size-1){
                end=stats.size-1
            }
            let head = {
                'Content-Type':'video/mp4',
                'Content-Range':`bytes ${start}-${end}/${stats.size}`,
                'Content-Length':end-start+1,
                'Accept-Ranges':'bytes'
            }
            res.writeHead(206,head)
            fs.createReadStream(videoPath,{start:start,end:end}).pipe(res)
        }else{
            //请求头没有range，返回全部视频
            fs.createReadStream(videoPath).pipe(res)
        }
    }
}).listen(3000,()=>{
    console.log('listen 3000')
})