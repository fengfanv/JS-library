//将m3u8视频，文件名字，里的特殊字符替换成下划线

const fs = require('fs');
const path = require('path');

//获取文件目录
let arr = [];//文件列表
let arr2 = [];//文件夹列表
let filesPath = path.join(__dirname, '/m3u8VideoServer/public/cacheFiles/');
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

//修改.m3u8文件
for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    let oldName = item.path.split('.m3u8')[0];
    let newName = oldName.replace(/[^(\u4e00-\u9fa5|a-z|0-9|A-Z|_|\.)]/g, '_'); // 中文字(不包含中文符号)，字母，数字，下划线，点，以外的任何字符都替换成 下划线
    console.log(oldName)
    console.log(newName)
    let m3u8OldPath = path.join(filesPath, `${oldName}.m3u8`);
    let m3u8NewPath = path.join(filesPath, `${newName}.m3u8`);
    //修改.m3u8数据体里的内容
    let m3u8Data = fs.readFileSync(m3u8OldPath);
    let regExpStr = oldName.replace(/\(|\)|\[|\]/g,"()");//防止文件名字里出现 ( ，导致下面正则语法报错 Uncaught SyntaxError: Invalid regular expression: /(/: Unterminated group
    let newM3u8Data = m3u8Data.toString().replace(new RegExp(`(${regExpStr})`, 'g'), newName);
    fs.writeFileSync(m3u8OldPath, newM3u8Data);
    //重命名.m3u8文件名字
    fs.renameSync(m3u8OldPath, m3u8NewPath);
}

//修改m3u8文件夹
for (let i = 0; i < arr2.length; i++) {
    let item = arr2[i];
    let oldName = item;
    let newName = oldName.replace(/[^(\u4e00-\u9fa5|a-z|0-9|A-Z|_|\.)]/g, '_');
    let m3u8OldPath = path.join(filesPath, oldName);
    let m3u8NewPath = path.join(filesPath, newName);
    //重命名m3u8文件夹名字
    fs.renameSync(m3u8OldPath, m3u8NewPath);
}

