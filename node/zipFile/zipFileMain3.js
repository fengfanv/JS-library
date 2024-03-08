var fs = require('fs');
var path = require('path');

var { zipFile, parseZipFile } = require('./zipFile_v2.js');


//formData普通key:value数据
var keyValueArr = [
    // {
    //     key: "a1",
    //     value: '1234'
    // }
];


//formData文件数据
var dirArr = ["c:", "Users", "merka", "Desktop", "m3u8VideoServer", "public", "cacheFiles"];//文件夹地址。会将文件夹内的所有文件读取成formdata数据。这里会将“cacheFiles”内的所有文件保存成formdata数据。注意：这里被保存的文件路径不包含“cacheFiles”这一级。
var dir = dirArr.join(path.sep);
var filesArr = [];
scan(dir, function (fileDir) {
    // console.log(fileDir)
    var fileDirObj = path.parse(fileDir)
    // console.log(fileDirObj)
    var fileDirArr = fileDirObj.dir.split(path.sep)
    fileDirArr.push(fileDirObj.base)
    // console.log(fileDirArr)
    fileDirObj.fileDirArr = fileDirArr
    fileDirObj.fileArr = fileDirArr.slice(dirArr.length, fileDirArr.length)
    // console.log(fileDirObj)
    filesArr.push(fileDirObj)
})
// console.log(filesArr)


//将文件列表数组，处理成zipFile方法需要的格式
let fileArr2 = [
    // {
    //     fileName:"xxx.mp3",
    //     filePath:"c:/xxx/xxx/xxx.mp3",
    //     fileSize:132929,//单位，字节
    // },
    // {
    //     fileName:"xxx/xxx.mp3",
    //     filePath:"c:/xxx/xxx/xxx.mp3",
    //     fileSize:132929,//单位，字节
    // }
];
for (let i = 0; i < filesArr.length; i++) {
    let item = filesArr[i];

    let itemFileName = item.fileArr.join('/');
    let itemFilePath = item.fileDirArr.join('/');

    fileArr2.push({
        fileName: itemFileName,
        filePath: itemFilePath
    })
}
// console.log(fileArr2);


// zipFile(null, fileArr2, path.join("c:", "Users", "merka", "Desktop", `${Date.now()}.fdco`), function (err, res) {
//     if (!err) {
//         //压缩成功
//         console.log(`压缩成功！`);
//     } else {
//         //压缩失败
//         console.log(`压缩失败！`)
//     }
// });


// parseZipFile(path.join("c:", "Users", "merka", "Desktop", `1709907572648.fdco`),dir,function(res){
//     console.log(res)
// })



//扫描文件夹内所有文件
function scan(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            //fs.statSync(pathname).isDirectory()检查是否是目录
            scan(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}
