var fs = require('fs');
var path = require('path');
var { zipFile, parseZipFile } = require('./zipFile_v2.js');


var dir = path.join(__dirname, 'successFile');

//文件列表
let fileArr = [
    // {
    //     fileName:"xxx.mp3",
    //     filePath:"c:/xxx/xxx/xxx.mp3",
    //     fileSize:132929,//单位，字节
    // }
];
scan(dir, function (fileDir) {

    // console.log(fileDir)
    // console.log(fs.statSync(fileDir).size) //文件大小，单位：字节

    let filePathInfo = path.parse(fileDir);
    let fileInfo = fs.statSync(fileDir);

    // console.log(filePathInfo);
    // console.log(fileInfo);

    fileArr.push({
        fileName: filePathInfo.name + filePathInfo.ext,
        filePath: fileDir,
        fileSize: fileInfo.size
    })

})

// console.log("文件个数：",fileArr.length)
// console.log(fileArr)

//文件按从小到大排序
fileArr.sort((a, b) => a.fileSize - b.fileSize);
// console.log(fileArr)

//开始执行压缩文件操作
let index = 0;
let binaryFilePath = path.join("d:", "project", "训练数据集");//二进制压缩文件保存地址   
let binaryFileName = `a${Date.now()}_${index}.fdco`;//二进制压缩文件名(xxx.fdco)  fdco是(FormData Code Object)的缩写，仅是个名字，没有任何特殊功能。这个名字参考的 .pyc 
let zipFileCallback = function (err, res) {
    if (!err) {
        //压缩成功
        console.log(`第${index}文件，压缩成功，压缩文件名是${binaryFileName}`);
    } else {
        //压缩失败
        console.log(`第${index}文件，压缩失败！压缩文件名是${binaryFileName}`)
    }
    if (index + 1 != fileArr.length) {
        index = index + 1;
        binaryFileName = `a${Date.now()}_${index}.fdco`;
        let arr = [fileArr[index]];
        zipFile(null, arr, path.join(binaryFilePath, binaryFileName), zipFileCallback);
    }
}

// // 压缩二进制FormData文件
// let arr = [fileArr[index]];
// zipFile(null, arr, path.join(binaryFilePath, binaryFileName), zipFileCallback);





// // 解析二进制FormData文件
// parseZipFile(path.join("e:", "训练数据集",'1709714910909_0.fdco'),binaryFilePath,function(res){
//     console.log(res);
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

