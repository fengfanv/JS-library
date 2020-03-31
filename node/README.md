# node
## fs模块文件读写
```javascript
var fs = require("fs");
//读文件
fs.readFile('文件地址', 'utf8', function (err, data) {
	if (err) {
	    return console.log(err);
	}
	console.log("读取成功！");
});

//写文件
fs.writeFile("文件地址", '要保存的数据', function (err) {
	if (err) {
		return console.log(err);
	}
    console.log("保存成功！");
});
```
## http模块源码写服务
```javascript
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring')

const PUBLIC_PATH = path.join(__dirname, "/\public\/");//项目地址
http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
    fs.stat(file_address, function (err, stat) {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/html' })
            response.end('状态：404，没有这样的文件或目录！');
            console.log(err);
        } else {
            let file_type = pathname.split('.')[1];
            var MIME = ''
            if (file_type == 'html' || file_type == 'htm') {
                MIME = 'text/html'
            } else if (file_type == 'css') {
                MIME = 'text/css'
            } else if (file_type == 'js') {
                MIME = 'text/javascript'
            } else if (file_type == 'png') {
                MIME = 'image/png'
            } else if (file_type == 'jpg' || file_type == 'jpeg') {
                MIME = 'image/jpeg'
            } else if (file_type == 'gif') {
                MIME = 'image/gif'
            }
            fs.readFile(file_address, function (err, fileData) {
                if (err) {
                    console.log(err);
                }
                response.writeHead(200, { 'Content-Type': MIME })
                response.end(fileData);
            })
        }
    })

}).listen(8080);
console.log('服务地址',8080);
```
## 神奇的异步案例
```javascript
function execute(count){
    if(count == length){
        return;
    }else{
		arr[count] = null;
        arr[count](++count);
    }
}

function fun1(count){
    setTimeout(function(){
        console.log('fun1')
        execute(count);
    },1000 * 3)
}

function fun2(count){
    setTimeout(function(){
        console.log('fun2')
        execute(count);
    },1000 * 2)
}

function fun3(count){
    setTimeout(function(){
        console.log('fun3')
        execute(count);
    },1000 * 1)
}

var arr = [fun1,fun2,fun3];
var length = arr.length;
execute(0)
```
### node实现文件上传

案例文件 uploadFiles
```html
## html
<input type="file" id="files" />
<button type="button">上传文件</button>
<script src="./jquery.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
	$("button").click(function() {
		var files = document.getElementById('files').files;
		console.log(files);
		if (files.length >= 1) {
			var form = new FormData();
			form.append("files", files[0]);
			$.ajax({
				type: "post",
				url: "/uploadFiles",
				data: form,
				contentType: false, // 注意这里应设为false
				processData: false, //false
				cache: false, //缓存
				success: function(data) {
					console.log(data);
				}
			})
		}
	})
</script>
```
```javascript
## node
var express = require("express");
var http = require("http");
var fs = require("fs");
var multer = require("multer");
var app = express();

app.use(express.static("./public"));

//配置文件上传地址
var uploadFilesConfig = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, __dirname + "/public/uploadFiles/")
	}
});
var upload = multer({
	storage: uploadFilesConfig
});

app.post('/uploadFiles', upload.array('files', 1), function(request, response) {
	if (request.files.length != 0) { //请求是否有file
		var arr = request.files[0]; //提取文件
		console.log(request.files);
		fs.rename(arr.destination + arr.filename, arr.destination + arr.originalname, function() {
			//修改文件名称，可更改文件的存放路径。
			console.log("上传的文件处理成功!");
			response.send('上传成功！')
		});
	}
});
http.createServer(app).listen(80);
```
### node源码实现文件上传

案例文件 YUMA_uploadFiles

测试结果：

.png 正常解析保存

.jpg 正常解析保存

.mp4 正常解析保存

.mp3 正常解析保存

.txt 正常解析保存，txt内容有中文也会正常保存

.word 正常保存，但是打开时说无法正常读取文件，需要修复，修复后可正常打开

//普通数据,字符串型数据，啥的，object型数据会被formdata解析成[object object]所以obj要转换成字符串

//如果普通数据中有中文，则会在接收数据时解析成乱码

//文件和普通数据一块传输，数据可以过来

//文件不和普通数据一块传输，数据也可以过来
```javascript
var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require('url');
var path = require('path');
var querystring = require('querystring')

const PUBLIC_PATH = path.join(__dirname, "/\public\/"); //项目地址
http.createServer(function(request, response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	var pathname = url.parse(request.url).pathname;
	var file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
	fs.stat(file_address, function(err, stat) {
		if (err) {
			if (pathname === '/api/uploadFiles') {
				request.setEncoding('binary'); //设置接收数据的编码格式，这数据不能强转utf8，转后在转回来就用不了了，解决formdata数据乱码问题
				var postData = '';
				request.on('data', function(chunk) {
					postData += chunk;
				});
				request.on('end', function() {
					response.writeHead(200, {
						'Content-Type': 'text/plain'
					});

					//console.log(postData);//这里就是浏览器表单或formdata处理后发过来的数据最原始状态

					//.replace(/^\s\s*/, '')匹配空格
					//1、找到处理后生成的hex值，已便定位formdata处理过的文件数据和其它数据在发送过来的那个位置
					//hex值作用，用来标记数据位置（这个其实叫边界字符串）
					//找上面那个hex值技巧，从尾部找找到\r\n停止
					var len = postData.length;
					var i = len;
					var foundValue = '';
					//console.log('开始找hex值');
					while (foundValue !== '\r\n--') {
						//console.log(foundValue);
						//console.log(i);
						i--;
						foundValue = postData.substr(i, 4);

					}
					var hexname = postData.substring(i, len).replace(/[\r\n]/g, "");
					hexname = hexname.substring(0, hexname.length - 2)
					//console.log(hexname);
					//至此hexname输出的后16为，为hex值

					//2、根据上面找的hex值把数据切割，分出来
					var Arr1 = postData.split(hexname + '\r\n');
					var dataArr = Arr1.slice(1, Arr1.length);

					//console.log(dataArr);
					//console.log(dataArr.length);浏览器发过来几个数据，这个数组就有多长

					//3、分析数据，把数据状态信息和数据本体提取出来
					var dataBody = {}; //用来存数据
					
					dataArr.forEach(function(item, index) {
						//item现在是数据状态信息（数据名称）和数据值本身的结合体，
						var valueData = item.toString();
						var endzuobiao = valueData.search('\r\n\r\n');

						//3.1、根据endzuobiao坐标之前为数据状态信息(数据名称什么的)
						//console.log(valueData.substring(0, endzuobiao));//数据状态信息(数据名称什么的)

						var paramArr = valueData.substring(0, endzuobiao).replace(/[\r\n]/g, ";").split(';');//每个数据的参数信息的arr
						//console.log(paramArr);
						var param = {};//存放每个数据的参数的对象
						paramArr.forEach(function(paramArrItem, paramArrIndex) {
							if (paramArrItem.length > 0) {
								var fuhao = ":"
								if (paramArrItem.search(":") !== -1) {
									fuhao = ":";
								} else {
									fuhao = "=";
								}
								var paramArrItemkey = paramArrItem.split(fuhao)[0].replace(/\ +/g, "").replace(/['"]/g, "");
								var paramArrItemvalue = paramArrItem.split(fuhao)[1].replace(/\ +/g, "").replace(/['"]/g, "");
								param[paramArrItemkey] = paramArrItemvalue;
							}
						});


						//3.2、根据endzuobiao坐标之后为数据本体
						//console.log('start数据本体');
						var data1 = valueData.substring(endzuobiao);
						var data = data1.substring(4, data1.length - 4); //去除数据头尾的换行符
						//console.log(data);
						//console.log('end数据本体');
						if (param['Content-Type'] !== undefined) {
							//console.log('这应该是图片类数据');
							/*
							.png 正常解析保存
							.jpg 正常解析保存
							.mp4 正常解析保存
							.mp3 正常解析保存
							.txt 正常解析保存，txt内容有中文也会正常保存，
							.word 正常保存，但是打开时说无法正常读取文件，需要修复，修复后可正常打开
							*/
							//把图片类数据写入文件
							var filename = Date.now() + param.filename.replace(/['"]/g, "")

							//创建可写为流文件
							let writerStream = fs.createWriteStream(__dirname + '/' + filename);
							writerStream.write(data, 'binary');
							// 标记文件末尾
							writerStream.end();
							// 处理流事件 ==> finish 事件
							writerStream.on('finish', () => {
								//finish所有数据已被写入到底层系统时触发。
								console.log('写入完成');
								param.data = filename; //图片类的文件写入文件地址
							});
							writerStream.on('error', (err) => {
								console.log('写入失败');
								console.log(err.stack);
							});

						} else {
							//普通数据,字符串型数据，啥的，object型数据会被formdata解析成[object object]所以obj要转换成字符串
							//如果普通数据中有中文，则会在接收数据时解析成乱码
							var data111 = data.replace(hexname, ""); //剔除尾部hex标识
							var data222 = data111.replace(/[\r\n]/g, ""); //剔除换行符
							param.data = data222; //普通数据写入数据本体
						}
						//console.log(param);
						dataBody[param.name] = param; //把所有数据存到dataBody中已方便使用

						//console.log('paramArr----------');
					})
					response.end(JSON.stringify(dataBody));
					//正常返回这个数据
					// {
					// 	"files": {//这个files是formdata时数据的名称
					// 		"Content-Disposition": "form-data",
					// 		"name": "files",
					// 		"filename": "ç®å-MCçå¤©ä»»-6903224.mp3",//这个乱码是因为原文件名是中文的，接口接收数据时是已编码格式binary接收的数据，binary无法解析中文
					// 		"Content-Type": "audio/mp3"//只有是图片类这种文件才有这个参数，普通数据没有这个参数
					//		"data":""//这里正常没有data，这时因为writerStream.write()这个是异步的
					// 	},
					// 	"wangzhi": {//这个wangzhi是formdata时数据的名称
					// 		"Content-Disposition": "form-data",
					// 		"name": "wangzhi",//formdata时数据的名称
					// 		"data": "1"//普通数据的数据本体
					// 	}
					// }
					//
				});
			} else {
				response.writeHead(404, {
					'Content-Type': 'text/html'
				})
				response.end('状态：404，没有这样的文件或目录！');
			}
			//console.log(err);
		} else {
			let file_type = pathname.split('.')[1];
			var MIME = ''
			if (file_type == 'html' || file_type == 'htm') {
				MIME = 'text/html'
			} else if (file_type == 'css') {
				MIME = 'text/css'
			} else if (file_type == 'js') {
				MIME = 'text/javascript'
			} else if (file_type == 'png') {
				MIME = 'image/png'
			} else if (file_type == 'jpg' || file_type == 'jpeg') {
				MIME = 'image/jpeg'
			} else if (file_type == 'gif') {
				MIME = 'image/gif'
			}
			fs.readFile(file_address, function(err, fileData) {
				if (err) {
					console.log(err);
				}
				response.writeHead(200, {
					'Content-Type': MIME
				})
				response.end(fileData);
			})
		}
	})


}).listen(80);
console.log('服务地址', 80);



//用node模拟web端formdata处理过得文件数据
var mkpic = function(pic, fn) {
	var mimes = {
		'.png': 'image/png',
		'.gif': 'image/gif',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg'
	};
	var ext = path.extname(pic);
	var mime = mimes[ext];
	if (!mime) return;
	fs.readFile(pic, function(err, data) {
		content = util.format('Content-Disposition: form-data; name="pic"; filename="%s"\r\n', pic);
		content += util.format('Content-Type: %s\r\n\r\n', mime);
		content += data;
		fn(content);
	});
}
var mkfield = function(field, value) {
	return util.format('Content-Disposition: form-data; name="%s"\r\n\r\n%s', field, value);
}
var post = function(param, onsuccess, onfailer) {
	if (param.pic) {
		mkpic(param.pic, function(pic) {
			var data = [pic];
			delete param.pic;
			for (var i in param) {
				data.push(mkfield(i, param[i]));
			}
			var BOUNDARYPREFIX = '------kangyang'
			var max = 9007199254740992;
			var dec = Math.random() * max;
			var hex = dec.toString(36);
			var boundary = BOUNDARYPREFIX + hex;

			var body = util.format('Content-Type: multipart/form-data; boundary=%s\r\n\r\n', boundary) +
				util.format('%s\r\n', boundary) +
				data.join(util.format('\r\n--%s\r\n', boundary)) +
				util.format('\r\n%s--', boundary);

			console.log(body);
		});
	}
}
post({
	"pic": __dirname + '/public/uploadFiles/无标题.png'
})
```

### node模仿nginx正向代理

代理服务器转发请求到服务器

案例文件 daili_server.js
```javascript
var http = require('http');
var https = require('https')
var url = require('url');
var querystring = require('querystring')

http.createServer(function(request, response) {
    var ip = request.headers['x-forwarded-for'] || request.ip || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }

    response.setHeader("Access-Control-Allow-Origin", "*");
    var timeStampStart = Date.now();
    var option = {};
    option.hostname = 'www.xxx.com';
    option.protocol = 'https:'
    option.port = 443;
    option.method = request.method;
    option.path = request.url.split('?')[0];
    var reqHeader = request.headers;
    reqHeader.host = 'www.xxx.com';
    reqHeader.origin = 'https://www.xxx.com';
    reqHeader.referer = 'https://www.xxx.com';
    option.headers = reqHeader;
    if (request.method == 'GET') {
        let data = querystring.parse(request.url.split('?')[1]);
        var client = https.request(option, (client_res) => {
            response.writeHead(client_res.statusCode, client_res.headers);
            client_res.on('data', function(d) {
                response.write(d);
            });
            client_res.on('end', function(d) {
                var timeStampEnd = Date.now();
                console.log("\033[42;30m success \033[40;32m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
                response.end(d);
            });
        }).on('error', function(e) {
            var timeStampEnd = Date.now();
            console.log("\033[41;31m error \033[40;31m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
            console.error(e);
        })
        if (querystring.stringify(data).length > 0) {
            client.write(querystring.stringify(data));
        }
    } else {
        var postData = '';
        request.on('data', function(chunk) {
            postData += chunk;
        });
        request.on('end', function() {
            let data = postData.length > 0 ? querystring.parse(postData) : { 'a': 1 }; //?为啥不穿数据就不往下走了？（现在解决办法是不穿数据（数据为空的）用{a：1}来弥补参数）
            var client = https.request(option, (client_res) => {
                response.writeHead(client_res.statusCode, client_res.headers);
                client_res.on('data', function(d) {
                    response.write(d);
                });
                client_res.on('end', function(d) {
                    var timeStampEnd = Date.now();
                    console.log("\033[42;30m success \033[40;32m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
                    response.end(d);
                });
            }).on('error', function(e) {
                var timeStampEnd = Date.now();
                console.log("\033[41;31m error \033[40;31m " + option.path + " " + (timeStampEnd - timeStampStart) + "ms " + ip + " \033[0m");
                console.error(e);
            })
            if (querystring.stringify(data).length > 0) {
                client.write(querystring.stringify(data));
            }
        });
    }

}).listen(9999);
console.log('代理地址', 9999);

```