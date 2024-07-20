var fs = require('fs');
var path = require('path');



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




var dirArr = ["D:", "project2", "demo", "m3u8VideoServer", "public", "cacheFiles"];//文件夹地址。会将文件夹内的所有文件读取成formdata数据。这里会将“cacheFiles”内的所有文件保存成formdata数据。注意：这里被保存的文件路径不包含“cacheFiles”这一级。
var dir = dirArr.join(path.sep);




var files = []
scan(dir, function (pathname) {
    files.push(pathname)
})




var fileArr = [
    // {
    //     fileName:"",
    //     fileList:[
    //         'D:\project2\demo\m3u8VideoServer\public\cacheFiles\xxx.m3u8_contents\9'
    //     ]
    // }
]
for (let i = 0; i < files.length; i++) {
    let pathname = files[i]
    let m3u8Pathname = pathname.split(/\\/).slice(-1)[0]
    if (/.m3u8$/i.test(m3u8Pathname)) {
        fileArr.push({
            fileName: m3u8Pathname,
            fileList: []
        })
    }
}
// console.log(fileArr)
console.log('视频数量：', fileArr.length)


for (let i = 0; i < fileArr.length; i++) {
    let m3u8VideoName = fileArr[i].fileName.replace(/\.m3u8$/i, '')
    // console.log(fileArr[i].fileName)
    // console.log(m3u8VideoName)
    // console.log('------------------------------------------')
    for (let j = 0; j < files.length; j++) {
        if (files[j].indexOf(m3u8VideoName) != -1) {
            fileArr[i].fileList.push(files[j])
        }
    }
}


console.log('所有文件总数：', files.length)
var checkNumber = 0
for (let i = 0; i < fileArr.length; i++) {
    checkNumber += fileArr[i].fileList.length
}
console.log('检查后所有文件总数：', checkNumber)



if (files.length != checkNumber) {
    throw new Error('文件数量不匹配')
}



//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//下面开始文件压缩



var { zipFile, parseZipFile } = require('./zipFile_v2.js');



//一个视频，压缩一个文件


//压缩程序
function zipRun(index) {

    console.log('---------------------------------------')

    //formData文件数据
    var filesArr = [];
    for (let i = 0; i < fileArr[index].fileList.length; i++) {
        let fileDir = fileArr[index].fileList[i]
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
    }
    console.log(`第${index + 1}个视频的文件数量：`, filesArr.length)




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


    let zipFileName = `${Date.now()}.fdco`
    console.log(`${fileArr[index].fileName}>>>>>>>${zipFileName}`)
    console.log(`正在压缩.............`)
    zipFile(null, fileArr2, path.join("D:", "project2", "demo", "zipSuccess", zipFileName), function (err, res) {
        if (!err) {
            //压缩成功
            console.log(`压缩成功！`);
            if (index + 1 < fileArr.length) {
                zipRun(index + 1)
            }
        } else {
            //压缩失败
            console.log(`压缩失败！`)
        }

    });

}




// zipRun(0) //开始压缩第一个文件






//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//下面开始文件解压






function parseZip() {

    let zipFolder = ["D:", "project2", "demo", "zipSuccess"];
    let zipFolderDir = zipFolder.join(path.sep);
    let zipFilesArr = []
    scan(zipFolderDir, function (pathname) {
        zipFilesArr.push(pathname)
    })

    console.log(zipFilesArr)
    console.log(zipFilesArr.length)



    function runParseZip(index) {

        console.log('------------------------------------')
        console.log(`第${index + 1}个压缩文件`, zipFilesArr[index])
        console.log('正在解压中.....')
        parseZipFile(zipFilesArr[index], dir, function (res) {
            console.log('解压成功')
            if (index + 1 < zipFilesArr.length) {
                runParseZip(index + 1)
            }
        })
    }

    runParseZip(0)
}
// parseZip()





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




