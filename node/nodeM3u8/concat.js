var fs = require('fs');
var path = require('path');
var child_process = require('child_process');


//.m3u8文件地址
var m3u8FilePath = path.join(__dirname, 'public', 'mixed.m3u8'); 
//ts文件地址列表
var tsFilePathArr = [];
//黑名单列表（不需要被合并ts文件列表）
var blacklistArr = [
    "c011708578607375.ts",
    "c011708578607376.ts",
    "c011708578607377.ts",
    "c011708578607378.ts",
    "c011708578607379.ts",
    "c011708578607380.ts",
    "c011708578607381.ts"
];
//按顺序从.m3u8里提取ts文件地址(或文件名字)
getTsInM3u8(m3u8FilePath, function (tsUrl) {
    // console.log(tsUrl);
    if (blacklistArr.indexOf(tsUrl) == -1) {
        let tsFilePath = path.join(__dirname, 'public', tsUrl);
        tsFilePathArr.push(tsFilePath);
    }
})
// console.log(tsFilePathArr)


//最终合并输出的.mp4视频文件地址
let outputFilePath = path.join(__dirname, 'public', 'output.mp4'); 


// // 合并方式1 start
// // 直接将所有ts文件合并成一个文件。
// // 这种有问题，合并输出的文件，虽然能播放，但是有画面卡顿 和 进度条加速等奇怪现象，应该是视频帧被破坏导致的。
// // 这种有问题，合并输出的文件，只有少部分播放器能播放
// let writerStream = fs.createWriteStream(outputFilePath, {
//     flags: 'a' //flags:'a' 把内容追加到文件原有内容的后面
// });
// writerStream.on('finish', function () {
//     console.log('保存文件成功');
// });
// writerStream.on('error', function (err) {
//     console.log('保存文件失败', err);
// });

// function concatFile(i) {
//     console.log(`合并中...(${i}/${tsFilePathArr.length - 1})`, tsFilePathArr[i])
//     //ts文件地址
//     var itemTsFilePath = tsFilePathArr[i];
//     //ts文件数据
//     var tsFileData = fs.readFileSync(itemTsFilePath, 'binary');

//     writerStream.write(tsFileData, 'binary', () => {
//         if (i + 1 != tsFilePathArr.length) {
//             concatFile(i + 1)
//         } else {
//             writerStream.end();//标记文件末尾
//             console.log('合并完成')
//         }
//     });
// }
// concatFile(0);//开始合并

// // 合并方式1 end



// // 合并方式2 start
// // 使用 ffmpeg 合并
// // ffmpeg下载地址(https://www.ffmpeg.org/download.html)
// // 使用方法：将所有需要合并的ts文件地址，写入一个.txt文档里，然后用ffmpeg去执行这个.txt文档

// // .txt文档
// /*
// file '文件路径'
// file '文件路径'
// file '文件路径'
// ...
// */

// //.txt文件地址
// var concatTextFilePath = path.join(__dirname, 'public', 'concatText.txt');
// //.txt文件内容
// var concatTextStr = '';
// for (let i = 0; i < tsFilePathArr.length; i++) {
//     concatTextStr += `file '${tsFilePathArr[i]}'\r\n`;
// }
// // console.log(concatTextStr)

// //保存.txt文件
// saveFile(concatTextFilePath, concatTextStr).then((res) => {
//     //ffmpeg.exe的目录地址
//     let ffmpegDirPath = path.join("C:","Users","merka","Desktop","nodeM3u8","ffmpeg-2024-02-22-git-76b2bb96b4-full_build","bin");

//     //执行合并语句
//     //用windows命令行执行。请在ffmpeg.exe目录下，打开windows命令行，然后运行如下语句：
//     // ./ffmpeg -f concat -safe 0 -i C:\\Users\\merka\\Desktop\\nodeM3u8\\public\\concatText.txt C:\\Users\\merka\\Desktop\\nodeM3u8\\public\\output.mp4
//     child_process.exec(`cd ${ffmpegDirPath} && ffmpeg -f concat -safe 0 -i ${concatTextFilePath} ${outputFilePath}`, function (error, stdout, stderr) {
//         if (error) {
//             console.error("合成失败", error);
//         } else {
//             console.log("合成成功", stdout);
//         }
//     });
// })
// // 合并方式2 start


/*
ffmpeg 命令其它用途：
ffmpeg 命令可以 去掉视频中的音频
ffmpeg 命令可以 提取视频中的音频
ffmpeg 命令可以 音 视频 合成
ffmpeg 命令可以 剪切视频
ffmpeg 命令可以 视频截图
ffmpeg 命令可以 视频分解为图片
ffmpeg 命令可以 将图片合成视频
ffmpeg 命令可以 视频拼接(合并多个视频)
ffmpeg 命令可以 将视频转为gif
ffmpeg 命令可以 将视频前30帧转为gif
ffmpeg 命令可以 旋转视频
ffmpeg 命令可以 缩放视频
ffmpeg 命令可以 视频变速
ffmpeg 命令可以 音频变速
ffmpeg 命令可以 视频添加水印
等等...
*/


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



/*
参考文献：
https://www.cnblogs.com/muamaker/p/11589410.html
*/