var fs = require('fs');
var path = require('path');


//压缩FormData二进制文件
exports.zipFile = function (keyValueArr, filesArr, zipFilePath, callback) {
    //keyValueArr formData普通key:value数据
    // keyValueArr = [
    //     {
    //         key: "a1",
    //         value: '1234'
    //     },
    //     ...
    // ]
    //filesArr    formData文件数据
    // filesArr = [
    //     {
    //         fileName: "xxx.mp3",
    //         filePath: "c:/xxx/xxx/xxx.mp3"
    //     },
    //     {
    //         fileName: "xxx/xxx.mp3",
    //         filePath: "c:/xxx/xxx/xxx.mp3"
    //     },
    //     ...
    // ]
    //zipFilePath  压缩的二进制文件保存地址 C:\\merkan\\aaa\\xxxx.ext
    //callback     回调函数
    if (Array.isArray(keyValueArr) == false) {
        keyValueArr = [];
    }

    if (Array.isArray(filesArr) == false) {
        filesArr = [];
    }

    if (!zipFilePath) {
        return false;
    }

    /*制作formData数据 strat*/

    //hash值
    var hashValue = randomStr16();

    //边界字符串
    var boundaryString = `------WebKitFormBoundary${hashValue}`;

    //formData数据开始
    var formDataBuff = Buffer.from(`${boundaryString}\r\n`);

    //处理普通(key:value)数据
    for (let i = 0; i < keyValueArr.length; i++) {
        let item = keyValueArr[i];
        let itemBuff = Buffer.from(`Content-Disposition: form-data; name="${item.key}"\r\n\r\n${item.value}\r\n${boundaryString}\r\n`);
        formDataBuff = Buffer.concat([formDataBuff, itemBuff], formDataBuff.length + itemBuff.length);
    }

    //处理文件类数据
    for (let i = 0; i < filesArr.length; i++) {
        let item = filesArr[i];
        let itemFileName = item.fileName;
        let itemFilePath = item.filePath;
        let itemFileData = fs.readFileSync(itemFilePath);
        let startBuff = Buffer.from(`Content-Disposition: form-data; name="files${i}"; filename="${itemFileName}"\r\nContent-Type: ${'none'}\r\n\r\n`);
        let endBuff = Buffer.from(`\r\n${boundaryString}\r\n`);
        formDataBuff = Buffer.concat([formDataBuff, startBuff, itemFileData, endBuff], formDataBuff.length + startBuff.length + itemFileData.length + endBuff.length);
    }

    //formData数据结束
    //将formdata尾部\r\n替换成--
    let tempFormDataBuff = Buffer.alloc(formDataBuff.length - 2);
    formDataBuff.copy(tempFormDataBuff, 0, 0, formDataBuff.length - 2);//将formDataBuff内的0至formDataBuff.length-2的数据复制到tempFormDataBuff中
    let formDataEndBuff = Buffer.from('--');
    formDataBuff = Buffer.concat([tempFormDataBuff, formDataEndBuff], tempFormDataBuff.length + formDataEndBuff.length);

    /*制作formData数据 end*/

    //二进制数据保存成文件
    saveFile(zipFilePath, formDataBuff).then((resPath) => {
        callback && callback(null, resPath);
    }).catch((err) => {
        callback && callback(err);
    })
}


//读取解析FormData文件
exports.parseZipFile = function (zipFilePath, parseToDir, callback) {
    //zipFilePath  压缩的二进制FormData文件地址 C:\\merkan\\aaa\\xxxx.ext
    //parseToDir   压缩文件，解压到哪里，解压到那个文件夹下 C:\\merkan\\aaa
    //callback     回调函数

    let fileData = fs.readFileSync(zipFilePath)
    parseFormData(fileData, parseToDir).then((res) => {
        callback && callback(res)
    })

}


//解析formdata数据
function parseFormData(formdataBuff, storageFilePath) {
    if (typeof storageFilePath == 'undefined') {
        storageFilePath = __dirname;
    }

    return new Promise(function (resolve, reject) {

        var postData = formdataBuff;

        //1、找formdata里边界字符串，已便定位formdata中每条数据分别被放在formdata中的哪里
        //找边界字符串，方式1
        // var boundaryStringBuff = Buffer.alloc(40);//已知 边界字符串 是一个40个字符 由英文标点符号和数字和字母组成的字符串，大小为40个字节
        // postData.copy(boundaryStringBuff, 0, 0, 40);
        //找边界字符串，方式2
        let boundaryStringLen = postData.indexOf(Buffer.from('\r\n'));
        var boundaryStringBuff = Buffer.alloc(boundaryStringLen);
        postData.copy(boundaryStringBuff, 0, 0, boundaryStringLen);

        //2、根据上面找到的 边界字符串，把formdata中的每个参数分割出来（把formdata里面的参数分别提取出来）
        var dataArr = [];
        var boundaryStringIndexArr = [];//每个边界字符串在formdata中的位置
        var isLoop = true;
        var start_position = 0;
        while (isLoop) {
            let index = postData.indexOf(boundaryStringBuff, start_position);
            if (index != -1) {
                boundaryStringIndexArr.push(index);
                // start_position = index + 40;
                start_position = index + boundaryStringLen;//这里把40改成boundaryStringLen，是因为边界字符串因为之前randomStr16的bug，可能会导致边界字符串长度大于40，所以才改成这样。
            } else {
                start_position += 1;
            }
            if (start_position > postData.length) {
                isLoop = false;
            }
        }
        // console.log('boundaryStringIndexArr',boundaryStringIndexArr);
        if (boundaryStringIndexArr.length > 1) {
            //已知，如果formdata里有数据，则边界字符串至少有2个以上
            //formdata里不包含数据时，是这个样子(------WebKitFormBoundaryk6lbnizWoclsvxPJ--)，仅存在一个边界字符串。
            for (let i = 0; i < boundaryStringIndexArr.length - 1; i++) {
                let start = boundaryStringIndexArr[i];
                let end = boundaryStringIndexArr[i + 1];
                let itemSize = end - start;
                let itemBuff = Buffer.alloc(itemSize);
                postData.copy(itemBuff, 0, start, end);//将postData里start位置到end位置的数据，复制到itemBuff中。
                dataArr.push(itemBuff);
            }
        }
        // console.log(dataArr.length)

        // for(let i=0;i<dataArr.length;i++){
        //     // let itemBuff = dataArr[i];
        //     //验证每条数据前有 边界字符串和\r\n
        //     // let firstBuff = Buffer.alloc((40+2));
        //     // itemBuff.copy(firstBuff,0,0,(40+2));
        //     // console.log(firstBuff.toString())
        //     //验证每条数据尾部有 \r\n
        //     // let endBuff = Buffer.alloc(2);
        //     // itemBuff.copy(endBuff,0,itemBuff.length-2,itemBuff.length);
        //     // console.log(endBuff.toString()=='\r\n')
        // }

        //3、分析分割后的数据，把formdata中每一个参数的数据状态信息(数据名称、数据类型等)和数据本体提取出来
        var dataBody = {}; //dataBody是用来存放，formdata里每条数据的状态信息和数据体
        if (dataArr.length == 0) {
            //没有数据，直接返回
            resolve(dataBody);
        } else {
            //有数据，则开始分析formdata里每条数据
            eachArr(0);
        }

        //eachArr是更加详细的解析分割提取formdata里每一个参数的方法
        function eachArr(index) {
            if (index >= dataArr.length) {
                //formdata中所有参数处理完成
                resolve(dataBody);
                return false;
            };

            var item = dataArr[index];//这里item现在是formdata中某一条数据的 数据状态信息(数据名称、数据类型等) 和 数据值本体 的结合体。
            var addIndex = index + 1;

            //首先清除formdata每条数据 首部的(边界字符串和\r\n)(------WebKitFormBoundarywoc0ZgNQ2b4ntunb\r\n)
            //然后再清除formdata每条数据 尾部的(\r\n)
            // var valueData = Buffer.alloc(item.length - (40+2) - 2);//(40+2)是首部边界字符串和\r\n的长度。2是尾部\r\n的长度。//console.log(Buffer.from(`\r\n`).length)//2
            // item.copy(valueData, 0, (40+2), item.length - 2);//提取去除了(首部边界字符串及\r\n)和(尾部\r\n)后的数据。
            var valueData = Buffer.alloc(item.length - (boundaryStringLen+2) - 2);//这里把(40+2)改成(boundaryStringLen+2)，是因为边界字符串因为之前randomStr16的bug，可能会导致边界字符串长度大于40，所以才改成这样。
            item.copy(valueData, 0, (boundaryStringLen+2), item.length - 2);

            //每条数据的(首部边界字符串及\r\n)和(尾部\r\n)去除后
            //将每条数据的 数据状态信息(数据名称、数据类型等) 和 数据值本体 分离开来
            //数据状态信息 与 数据值本体 之间通过 \r\n\r\n 分隔开来
            var fenGeFuIndex = valueData.indexOf(Buffer.from('\r\n\r\n'));//获取分隔符(\r\n\r\n)坐标位置
            var valueDataHeader = Buffer.alloc(fenGeFuIndex - 0);//数据状态信息(数据名称、数据类型等)
            valueData.copy(valueDataHeader, 0, 0, fenGeFuIndex);
            var valueDataSelf = Buffer.alloc(valueData.length - fenGeFuIndex - 4);//数据值本体    (valueData.length-fenGeFuIndex是减去(数据状态信息)的大小)(又减4是减去分隔符(\r\n\r\n)的大小)
            valueData.copy(valueDataSelf, 0, fenGeFuIndex + 4, valueData.length);


            //解析每条数据的 数据状态信息
            //把每条数据的 数据状态信息字符串转换成arr，因为一个参数的状态信息不光有数据名称，还有别的数据说明属性，所以要把它换成arr。
            //提取每条数据的 数据状态信息 用utf8编码的，这样可以防止上传文件时，如果文件名称是中文的话无法识别中文的问题。
            var valueDataHeaderUtf8 = valueDataHeader.toString('utf-8');//将 数据状态信息 转成uft8编码的字符串。
            var paramArr_utf8 = valueDataHeaderUtf8.replace(/[\r\n]/g, ";").split(';');
            //把每条数据的 数据状态信息 分别提取到对象中
            var param = {};//用于临时存放某个已被处理好的参数(已处理好的数据状态信息和对象和数据体)的容器
            for (let i = 0; i < paramArr_utf8.length; i++) {
                let paramArrIndex = i;
                if (paramArr_utf8[paramArrIndex].length > 0) {
                    let fuhao = ":";
                    if (paramArr_utf8[paramArrIndex].search(":") != -1) {
                        fuhao = ":";
                    } else {
                        fuhao = "=";
                    }
                    //处理编码为utf8
                    let paramArrItemkey = paramArr_utf8[paramArrIndex].split(fuhao)[0].replace(/\ +/g, "").replace(/['"]/g, "");
                    let paramArrItemvalue = paramArr_utf8[paramArrIndex].split(fuhao)[1].replace(/['"]/g, "");
                    param[paramArrItemkey] = paramArrItemvalue;
                }
            }

            //根据提取的 数据状态信息，处理 数据本体
            if (typeof param['Content-Type'] != 'undefined') {
                //提取文件类的数据本体
                let data = valueDataSelf;

                //这里把文件类数据写入文件
                //跟据config设置的文件名称及文件存放地址
                let primaryFileName = param.filename.replace(/['"]/g, "");//原文件名
                //storageFilePath  自定义配置的上传文件的文件存放地址
                var filename = param.filename.replace(/['"]/g, "");
                //检查上传的文件类数据，是否有文件夹
                if (new RegExp('/+').test(filename)) {
                    //有文件夹
                    //根据配置的config.storageFilePath设置文件存放地址
                    let filePath = storageFilePath + '/' + filename;
                    //1、分析文件地址
                    //所上传的文件夹里面的文件，经过前端formdata处理后的文件路径为：lpr/images/picture.jpg
                    let pathArr = filename.split('/');
                    let pathArrLen = pathArr.length;
                    if (pathArrLen >= 2) {
                        //有文件夹，检测文件夹是否存在，没有则创建
                        function checkDir(checkDirIndex) {

                            if (checkDirIndex == pathArrLen - 1) {
                                //pathArr最后一个是文件，检查到最后一个了，所以开始执行写入文件操作
                                saveFile(filePath, data).then((path) => {
                                    param.data = filePath;
                                    //执行回调
                                    eachArr(addIndex);
                                }).catch((err) => {
                                    param.errMessage = '写入文件失败';
                                    //执行回调
                                    eachArr(addIndex);
                                })
                                return false;
                            }

                            //检测文件夹是否存在
                            let checkDirIndexAdd = checkDirIndex + 1;
                            let dirPath = storageFilePath + '/' + pathArr.slice(0, checkDirIndexAdd).join('/');
                            fs.stat(dirPath, function (pathErr) {
                                if (pathErr) {
                                    //没有文件夹则创建
                                    fs.mkdir(dirPath, function (createDirErr) {
                                        if (createDirErr) {
                                            console.log('folder创建文件夹失败', dirPath, createDirErr);
                                            return false;
                                        }
                                        checkDir(checkDirIndexAdd);
                                    });
                                    return false;
                                }
                                //有文件夹，不用创建，直接检测下一个
                                checkDir(checkDirIndexAdd);
                            });
                        }
                        checkDir(0);
                    } else {
                        //没有文件夹，直接保存文件
                        saveFile(filePath, data).then((path) => {
                            param.data = filePath;
                            //执行回调
                            eachArr(addIndex);
                        }).catch((err) => {
                            param.errMessage = '写入文件失败';
                            //执行回调
                            eachArr(addIndex);
                        })
                    }
                } else {
                    //没有文件夹，直接保存文件
                    let filePath = storageFilePath + '/' + filename;
                    saveFile(filePath, data).then((path) => {
                        param.data = filePath;
                        //执行回调
                        eachArr(addIndex);
                    }).catch((err) => {
                        param.errMessage = '写入文件失败';
                        //执行回调
                        eachArr(addIndex);
                    })
                }
            } else {
                //提取 普通数据体，普通数据用utf8编码的，防止出现中文字无法识别的问题
                let dataBody_utf8 = valueDataSelf.toString('utf-8');//转换成utf8编码字符串
                let data_utf8 = dataBody_utf8.replace(/[\r\n]/g, "");//除去换行符

                //处理编码为utf8，直接将数据存入
                param.data = data_utf8; //将处理好的 普通数据体写入到param中
                eachArr(addIndex);
            }

            //将这个整理好的formdata参数存入到dataBody中
            dataBody[param.name] = param;
        }
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

//生成随机字符串16位
function randomStr16() {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let nums = "";
    for (let i = 0; i < 16; i++) {
        let index = Math.round(Math.random() * chars.length);
        if (index < 0 || index >= chars.length) {
            index = 0;
        }
        nums += chars[index];
    }
    return nums;
}

//保存文件
function saveFile(path, data) {
    return new Promise((resolve, reject) => {
        //创建可写流文件
        let writerStream = fs.createWriteStream(path);
        writerStream.write(data, 'binary');
        writerStream.end();//标记文件末尾

        writerStream.on('finish', function () {
            // finish 写入文件结束
            // console.log('保存文件成功', path);
            resolve(path)
        });
        writerStream.on('error', function (err) {
            // console.log('保存文件失败', path, err);
            // console.log(err.stack);
            reject(err)
        });
    })
}
