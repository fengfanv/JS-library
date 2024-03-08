var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var dir = path.join(__dirname, "successFile");//视频文件目录


//获取文件夹里的视频文件
// scan(dir, function (fileDir) {

//     let mp4Duration = getMP4Duration(fileDir);

//     let fileDirObj = path.parse(fileDir);
//     let fileName = fileDirObj.name+fileDirObj.ext;

//     console.log(fileName,formatTime(mp4Duration))

// })


//console.log(getMP4Duration(path.join("c:", "Users", "merka", "Desktop", "test.js"))) //打印(文件检查完毕，文件中没有mvhd字段) 说明代码是正确的


//node读取mp4视频时长
function getMP4Duration(filePath) {

    let start_position = 0;
    let buff = Buffer.alloc(10000);
    let fileInfo = fs.statSync(filePath); //获取文件信息
    let fd = fs.openSync(filePath); //文件描述符 fd 是一个非负整数，它代表了操作系统中打开的文件的一个引用或句柄。你可以使用这个文件描述符来引用和操作该文件，例如读取、写入或关闭文件。
    let isLoop = true;
    while (isLoop) {

        //下面这句话的意思是，从文件里 读取一小块 到buff里。
        //下面这句话的意思是，从文件里 读取一小块 然后将(这一小块)保存到buff里。
        //下面这句话的意思是，在(filePath)这个文件里 从(position)位置开始读，读取(length:10000)个字节(数)，到(buff)里 (或读取(length个字节数的数据)保存到buff里)
        //这里为啥不直接读取整个视频文件，反而是一小块一小块的读取？答：我们可以直接把整个文件放到buffer中，但是要考虑到视频文件有可能在10GB级别，放到内存既不明智也不现实，我们不妨利用循环，从文件头部一直向后扫描，直到找到moov字段为止。
        fs.readSync(fd, buff, {
            offset: 0,
            length: 10000,
            position: start_position
        })

        let time = getTime(buff);
        if (time != 0 && time != 1) {
            isLoop = false;//退出循环
            return time;
        } else {
            start_position = start_position + 9900;
        }

        if(start_position>fileInfo.size){
            //fileInfo.size 文件大小，单位：字节

            isLoop = false;//退出循环
            console.log('文件检查完毕，文件中没有mvhd字段')
            return false;
        }
    }

    //为啥能获取视频时长，请搜索“mp4文件格式解析”
    function getTime(buffer) {
        if (buffer.indexOf(Buffer.from('mvhd')) != -1) {//mvhd是(movie header)的缩写，意思是视频总体信息
            //如果buffer中含有mvhd字段，就获取时长，否则返回false
            var start = buffer.indexOf(Buffer.from('mvhd'));
        } else {
            return false;
        }
        const box_size = buffer.readUInt32BE(start);
        const box_type = buffer.readUInt32BE(start + 4);
        const create_time = buffer.readUInt32BE(start + 8);
        const modi_time = buffer.readUInt32BE(start + 12);
        const timeScale = buffer.readUInt32BE(start + 16);      //文件媒体在1秒时间内的刻度值，可以理解为1秒长度的时间单元数。>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>时间的粒度，1000表示1000个单位为1s
        const duration = buffer.readUInt32BE(start + 20);       //该track的时间长度，用duration和timeScale值可以计算track时长。比如audio track的timeScale=8000,duration=560128,则时长为70.016s；video track的timeScale=600,duration=42000,则时长为70s。  时间粒度的个数。
        const movieDuration = Math.floor(duration / timeScale); //视频时长，单位秒
        return movieDuration;
    }

    /*
    参考链接：
    https://juejin.cn/post/7104516350210473998
    https://juejin.cn/post/7105585510273581093
    https://www.cnblogs.com/ztteng/articles/3048152.html
    */
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

//格式化时间
function formatTime(num){

    num=num*1000;//将 秒 转成 毫秒

	var days = parseInt(num / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
	var hours = parseInt(num / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
	var minutes = parseInt(num / 1000 / 60 % 60, 10);//计算剩余的分钟
	var seconds = parseInt(num / 1000 % 60, 10);//计算剩余的秒数

	days = checkTime(days);
	hours = checkTime(hours);
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);

    return days+"天" + hours+"小时" + minutes+"分"+seconds+"秒";

    //将0-9的数字前面加上0，例1变为01
    function checkTime(i){ 
        if(i<10){
            i = "0" + i;
        }
        return i;
    }
}
