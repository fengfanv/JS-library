// 合并手机下载好的m3u8视频
// 需要配合videoServer使用

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

//获取文件目录
let arr = [];//文件列表
let arr2 = [];//文件夹列表
let filesPath = path.join(__dirname, '/videoServer/public/cacheFiles/');
fs.readdirSync(filesPath).forEach(function (file) {
    var pathname = path.join(filesPath, file);
    if (fs.statSync(pathname).isDirectory()) {
        //console.log('是文件夹');
        arr2.push(file);
    } else {
        arr.push({ "name": file, "path": file });
    }
});
console.log(arr)
console.log(arr2)

let successList = [];//合并成功列表
//合并语句
function concat(index) {
    if (index == arr.length) {
        console.log(`${arr.length}个m3u8视频合并结束`)
        console.log(successList)
        return false;
    }

    let item = arr[index];
    let itemPath = item.path;
    let outFileName = itemPath.replace(/\.m3u8$/, '');

    //ffmpeg.exe的目录地址
    let ffmpegDirPath = path.join("C:", "Users", "merka", "Downloads", "ffmpeg-2024-02-22-git-76b2bb96b4-full_build", "ffmpeg-2024-02-22-git-76b2bb96b4-full_build", "bin");

    let m3u8Url = `http://192.168.233.190:8080/api/getvideo?path=${itemPath}`
    let outputFilePath = path.join("C:", "Users", "merka", "Desktop", "dataSet", `${outFileName}.mp4`)

    console.log(m3u8Url)
    console.log(outputFilePath)

    //执行合并语句
    //如： ./ffmpeg.exe -i http://192.168.233.190:8080/api/getvideo?path=xxxxx.m3u8 d:\output.mp4
    child_process.exec(`cd ${ffmpegDirPath} && ffmpeg -i ${m3u8Url} -c copy ${outputFilePath}`, function (error, stdout, stderr) {
    //child_process.exec(`cd ${ffmpegDirPath} && ffmpeg -i ${m3u8Url} ${outputFilePath}`, function (error, stdout, stderr) {
        if (error) {
            console.error("合成失败", error);
            concat(++index)
        } else {
            console.log("合成成功", stdout);
            successList.push(outFileName);
            concat(++index)
        }
    });
}
concat(0)//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<开始合并

/*
参考文献：
https://blog.csdn.net/ddrfan/article/details/108463859
*/


