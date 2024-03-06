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
    // console.log(boundaryString);

    //formData数据开始
    //受js字符串长度限制，这里最多只能压缩500MB的数据，如果需要保存的数据大于500MB，请分包处理。
    //这里使用node测试，保存的数据在510MB时能保存，保存的数据在514MB时不能保存。
    //MDN官网介绍字符串最大长度：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length
    var formDataStr = Buffer.from(`${boundaryString}\r\n`).toString('binary');

    //处理普通(key:value)数据
    for (let i = 0; i < keyValueArr.length; i++) {
        let item = keyValueArr[i];
        formDataStr += Buffer.from(`Content-Disposition: form-data; name="${item.key}"\r\n\r\n${item.value}\r\n${boundaryString}\r\n`).toString('binary');
    }

    //处理文件类数据
    for (let i = 0; i < filesArr.length; i++) {
        let item = filesArr[i];
        let itemFileName = item.fileName;
        let itemFilePath = item.filePath;
        let itemFileData = fs.readFileSync(itemFilePath, 'binary');
        let startStr = Buffer.from(`Content-Disposition: form-data; name="files${i}"; filename="${itemFileName}"\r\nContent-Type: ${'none'}\r\n\r\n`).toString('binary');
        let endStr = Buffer.from(`\r\n${boundaryString}\r\n`).toString('binary');
        formDataStr += (startStr + itemFileData + endStr);
    }

    //formData数据结束
    formDataStr = formDataStr.replace(/(\r\n)$/, `--`);

    // console.log(formDataStr)
    /*制作formData数据 end*/

    //保存二进制压缩文件
    saveFile(zipFilePath, formDataStr).then((resPath) => {
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

    let fileData = fs.readFileSync(zipFilePath, 'binary')
    parseFormData(fileData, parseToDir).then((res)=>{
        callback && callback(res)
    })
    
}

//解析formdata数据
function parseFormData(formdata, storageFilePath) {
    if (typeof storageFilePath == 'undefined') {
        storageFilePath = __dirname;
    }

    return new Promise(function (resolve, reject) {
        //2020年5月6日通过接收编码为base64的数据在转换成binary编码数据实现文件上传
        var postData = formdata;//将编码为base64的字符串转换为buffer实体，再转换为编码为binary的字符串
        var postData_utf8 = Buffer.from(formdata, 'binary').toString();

        //小提示：.replace(/^\s\s*/, '') 匹配空格
        //1、找到formdata处理后生成的hexname值，已便定位formdata处理过的文件数据和其它参数分别在formdata的那个位置
        //hexname值作用，用来标记数据位置（也叫边界字符串）
        //找formdata里hexname值的小技巧，从尾部找，找到\r\n停止
        var postDataLen = postData.length;
        var i = postDataLen;
        var foundValue = '';
        while (foundValue != '\r\n--' && i > 0) {
            i--;
            foundValue = postData.slice(i, i + 4);
        }
        var hexname = postData.substring(i, postDataLen).replace(/[\r\n]/g, "");
        hexname = hexname.replace(/--$/, ""); //为hexname除去formdata结尾的--
        //至此找到hexname值。其中hexname的后16位，为hex值
        // console.log('hexname',hexname)


        //2、根据上面找到的hexname值，把每一个formdata中的每个参数分割出来（把formdata里面的参数分别提取出来）
        //处理编码为binary
        var Arr1 = postData.split(hexname + '\r\n');
        var dataArr = Arr1.slice(1, Arr1.length);//Arr1第一个数据为空字符串，所以这里做一下处理
        //处理编码为utf8
        var Arr1_utf8 = postData_utf8.split(hexname + '\r\n');
        var dataArr_utf8 = Arr1_utf8.slice(1, Arr1_utf8.length);//Arr1_utf8第一个数据为空字符串，所以这里做一下处理

        //通过hexname分割数据，然后把formdata中的参数转成数组。转成数组后，在过滤一下，防止在不上传文件时，防止切割后的参数体中仍存在hexname的情况
        var dataArrLen = dataArr.length;

        let clearHexnameRegExp = new RegExp(`(${hexname}--|${hexname})`, 'g');//这里为啥hexname后面带有两个--，因为formdata的最后一个hexname后面有两个--
        for (let i = 0; i < dataArrLen; i++) {
            let index = i;
            //处理编码为binary
            dataArr[index] = dataArr[index].replace(clearHexnameRegExp, '');
            //处理编码为utf8
            dataArr_utf8[index] = dataArr_utf8[index].replace(clearHexnameRegExp, '');
        }
        // console.log('formdata参数数量', dataArrLen);

        //3、分析分割后的数据，把formdata中每一个参数的数据状态信息(数据名称、数据类型等)和数据本体提取出来
        var dataBody = {}; //dataBody是用来存放，formdata里每个参数的状态信息和数据体

        //更加详细的解析分割提取formdata里每一个参数的方法
        function eachArr(index) {
            if (index >= dataArrLen) {
                //formData中所有参数处理完成
                resolve(dataBody);
                return false;
            };

            var item = dataArr[index];//这里item现在是formdata中某一个参数的数据状态信息(数据名称、数据类型等)和数据值本身的结合体
            var addIndex = index + 1;

            //处理编码为binary
            var valueData = item;
            //处理编码为utf8
            var valueData_utf8 = dataArr_utf8[index];

            //寻找formdata中某一个参数的数据状态信息(数据名称、数据类型等)与数据本体中间(之间)的位置
            var between = valueData.search('\r\n\r\n');

            //3.1、提取参数的数据状态信息。between坐标之前为数据状态信息(数据名称、数据类型等)

            //把参数的数据状态信息字符串转换成arr，因为一个参数的状态信息不光有数据名称,还有别的数据说明属性，所以要把它换成arr
            //处理编码为binary
            var paramArr = valueData.substring(0, between).replace(/[\r\n]/g, ";").split(';');
            //处理编码为utf8
            var paramArr_utf8 = valueData_utf8.substring(0, between).replace(/[\r\n]/g, ";").split(';');

            var paramArrLen = paramArr.length;
            //把参数的数据状态信息分别提取到对象中
            //提取参数 数据状态信息用utf8编码的，这样可以防止上传文件时，如果文件名称是中文的话无法识别中文的问题
            var param = {};//用于临时存放某个已被处理好的参数(已处理好的数据状态信息和对象和数据体)的容器
            for (let i = 0; i < paramArrLen; i++) {
                let paramArrIndex = i;
                if (paramArr[paramArrIndex].length > 0) {
                    let fuhao = ":";
                    if (paramArr[paramArrIndex].search(":") != -1) {
                        fuhao = ":";
                    } else {
                        fuhao = "=";
                    }
                    //处理编码为binary
                    // let paramArrItemkey = paramArr[paramArrIndex].split(fuhao)[0].replace(/\ +/g, "").replace(/['"]/g, "");
                    // let paramArrItemvalue = paramArr[paramArrIndex].split(fuhao)[1].replace(/\ +/g, "").replace(/['"]/g, "");
                    //处理编码为utf8
                    let paramArrItemkey = paramArr_utf8[paramArrIndex].split(fuhao)[0].replace(/\ +/g, "").replace(/['"]/g, "");
                    let paramArrItemvalue = paramArr_utf8[paramArrIndex].split(fuhao)[1].replace(/\ +/g, "").replace(/['"]/g, "");
                    param[paramArrItemkey] = paramArrItemvalue;
                }
            }


            //3.2、提取参数的数据本体。between坐标之后为数据本体
            //根据提取的数据状态信息，分别使用不同编码方式的数据，来提取数据体
            if (typeof param['Content-Type'] != 'undefined') {
                //提取文件类的数据体，文件类的数据用binary编码的，防止数据写入文件后，文件无法使用
                //处理编码为binary
                let dataBody = valueData.substring(between);
                let data = dataBody.substring(0, 4).replace(/[\r\n]/g, '') + dataBody.substring(4, dataBody.length - 4) + dataBody.substring(dataBody.length - 4).replace(/[\r\n]/g, ''); //为数据体，去除数据头部和尾部的换行符（这句话在优化之前，因为尾部多删除东西了，所以导致上传的word文件无法正常解析，所以导致上传的js文件内容尾部丢失2个字母）
                // console.log(data.match(/^(\r|\n){1}/))
                data = data.replace(/^(\r|\n){1}/, '');//被上传的js文件，的头部，有时候会出现空行，换行符号删不干净的问题，这里再删除一下

                //.png 正常解析保存
                //.jpg 正常解析保存
                //.mp4 正常解析保存
                //.mp3 正常解析保存
                //.txt 正常解析保存(txt内容有中文也可正常保存)
                //.word 正常解析保存(打开被上传后的word文件，word报错无法正常读取文件的问题，2023-09-17已修复)
                //.js 正常解析保存(js文件内容的尾部，丢失2个字母，2023-09-17已修复)

                //这里把文件类数据写入文件
                //跟据config设置文件名称及文件存放地址
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
                //提取普通数据体，普通数据用utf8编码的，防止出现中文字无法识别的问题
                let dataBody_utf8 = valueData_utf8.substring(between);
                let data_utf8 = dataBody_utf8.replace(/[\r\n]/g, ""); //除去空格

                //支持普通数据类型，字符串型数据等。object类型数据会在浏览器上被formdata解析成[object object]，所以obj在传输前要转换成字符串
                //处理编码为utf8，直接将数据存入
                param.data = data_utf8; //将处理好的 普通数据体写入到param中
                eachArr(addIndex);
            }

            //将这个整理好的formdata参数存入到dataBody中
            dataBody[param.name] = param;
        };
        eachArr(0);
    });
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

