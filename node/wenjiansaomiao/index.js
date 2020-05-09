const fs = require('fs');
const path = require('path');
var dir = `E:\新东方版-新概念英语第1册全288讲【11.4G】`;
// fs.readdirSync(dir).forEach(function (file) {
//     console.log(file);
//     let pathname = path.join(dir, file);
//     console.log(fs.statSync(pathname).isDirectory())
// });

//扫描文件夹内所有文件
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            //fs.statSync(pathname).isDirectory()检查是否是目录
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

//返回所有文件夹列表
exports.getAllAlbums=function(callback){
    fs.readdir("./uploads",function (err,files) {
        if(err){
            callback("读取文件夹失败！",null);
            return;
        }
        var allAlbums=[];
        (function iterator(i) {
            if(i==files.length)
            {
                callback (null,allAlbums);
                return;
            }
            fs.stat("./uploads/"+files[i],function (err,stats) {
                if(err){
                    callback("解析文件夹失败！"+files[i],null);
                    return;
                }
                if(stats.isDirectory())
                {
                    allAlbums.push(files[i]);
                }
                iterator(i+1)
            });
        })(0);
    });
}
//根据文件夹的名字来找到该文件夹下的所有图片文件并且返回
exports.getAllImagesByAlbumname =function(albumname,callback){
    fs.readdir("./uploads/"+albumname,function (err,files) {
        if(err){
            callback("读取文件夹失败！",null);
            return;
        }
        var allImages=[];
        (function iterator(i) {
            if(i==files.length)
            {
                callback (null,allImages);
                console.log(allImages);
                return;
            }
            fs.stat("./uploads/"+albumname+"/"+files[i],function (err,stats) {
                if(err){
                    callback("解析文件失败"+files[i],null);
                    return;
                }
                if(stats.isFile())
                {
                    allImages.push(files[i]);
                }
                iterator(i+1)
            });
        })(0);
    });
}