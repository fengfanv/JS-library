var fs = require('fs');
var path = require('path');

var { parseZipFile, zipFile } = require('./zipFile_v2.js');

//检查压缩包的边界字符串是否正确，如果不正确，则进行修复

let dir = path.join("e:", "训练数据集");//压缩包文件夹路径

//压缩包文件列表
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
// console.log(fileArr)
// console.log(fileArr.length)


let errArr = [];//压缩包的边界字符串是错误的文件列表

//开始检查
for (let i = 0; i < fileArr.length; i++) {
    let item = fileArr[i];

    let buff = Buffer.alloc(42);
    let fd = fs.openSync(item.filePath);
    fs.readSync(fd, buff, {
        offset: 0,
        length: 42,
        position: 0
    })

    let str = buff.toString();

    if (/^------WebKitFormBoundary[a-z|A-Z|0-9]{16,16}[\r\n]/.test(str) == false) {
        errArr.push(item)
    }

}
console.log(errArr)
console.log(errArr.length)
console.log('----------------------------------------------------------')
console.log('----------------------------------------------------------')
console.log('----------------------------------------------------------')


var repairDir = path.join("C:", "Users", "merka", "Desktop", "修复容器");//用于临时存放解压后文件的文件夹

repairZip(0);//开始修复
function repairZip(index) {
    if (index == errArr.length) {
        console.log(`${errArr.length}个文件 全部修复完毕`);
        return false;
    }

    let item = errArr[index];

    //解压边界字符串是错误的压缩包
    parseZipFile(item.filePath, repairDir, function (res) {
        let repairFileList = [
            // {
            //     fileName: "xxx.mp3",
            //     filePath: "c:/xxx/xxx/xxx.mp3",
            //     fileSize: 132929,//单位，字节
            // }
        ];

        //获取从压缩包里解压出来的文件
        scan(repairDir, function (fileDir) {
            let filePathInfo = path.parse(fileDir);
            let fileInfo = fs.statSync(fileDir);
            repairFileList.push({
                fileName: filePathInfo.name + filePathInfo.ext,
                filePath: fileDir,
                fileSize: fileInfo.size
            })
        })

        //使用新版程序，重新压缩
        zipFile(null, repairFileList, item.filePath, function (err, res) {
            if (!err) {
                console.log(item.fileName, '修复成功')

                //删除 修复容器 里所有文件，为下一次修复做准备
                for (let i = 0; i < repairFileList.length; i++) {
                    fs.unlinkSync(repairFileList[i].filePath)
                }

                //开始修复下一个边界字符串是错误的压缩文件
                repairZip(++index)

            }
        })
    })
}





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