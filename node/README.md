# node.js



### node处理复杂请求
满足以下两种条件就是**简单请求**:

1、请求方法是这三种方法之一（HEAD，GET，POST）

2、HTTP的请求头信息不超出这几种字段（Accept，Accept-Language，Content-Language，Last-Event-ID，Content-Type），其中Content-Type字段只能是这几种方式之一（application/x-www-form-urlencoded，multipart/form-data，text/plain）

不满上面两种条件就是**复杂请求**:

如：自定义了请求头字段，就会触发复杂请求

--

触发**复杂请求**。会在正式请求之前发送一个预检请求，会向服务端发送一个opstions的请求权限信息的请求，来向服务端要服务端的请求权限信息。拿到服务端的请求权限信息后，客户端会将这个与正式请求的请求头，请求方式，请求域名进行检验。如果满足条件发送正式请求，如不满足会触发跨域，不会进行正式请求

经测试，在post方式自定义请求头参数，会触发复杂请求。get方式自定义请求头不会触发

[为什么会有简单请求与复杂请求？](http://www.ruanyifeng.com/blog/2016/04/cors.html)

[那什么是CORS？CORS是一个W3C标准？](https://www.w3cschool.cn/javascript_guide/javascript_guide-z4jy26a3.html)
```javascript
const http = require('http')

const fs = require('fs')
const url = require('url')
const path = require('path')
const querystring = require('querystring')

function app(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.setHeader("Access-control-max-age", "1000");

	//处理复杂请求的预检请求
    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken ',
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
        });
        response.end();
        return false;
    };
    
	....
}

http.createServer(app).listen(80, () => {
    console.log('端口：80，服务已启动！');
});

```
### node进程守护
```javascript
//进程守护
const fork = require('child_process').fork;

//保存被子进程实例数组
var workers = [];
//这里的被子进程理论上可以无限多
var appsPath = ['./index.js'];
var createWorker = function (appPath) {
    //保存fork返回的进程实例
    var worker = fork(appPath);
    //监听子进程exit事件
    worker.on('exit', function () {
        console.log('worker:' + worker.pid + 'exited');
        delete workers[worker.pid];
        createWorker(appPath);
    });
    workers[worker.pid] = worker;
    console.log('Create worker:' + worker.pid);
};
//启动所有子进程
for (var i = appsPath.length - 1; i >= 0; i--) {
    createWorker(appsPath[i]);
}
//父进程退出时杀死所有子进程
process.on('exit', function () {
    console.log(workers);
    for (var pid in workers) {
        workers[pid].kill();
    }
});
```

### https 使用ssl证书
```javascript
const https = require('https');
const fs = require('fs');
/*获取ssl证书物理地址*/
const httpsOption = {
    key: fs.readFileSync("./ssl证书/xxx.key"),
    cert: fs.readFileSync("./ssl证书/xxx.crt")
};
http.createServer(httpsOption,function (request, response) {
	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	
	//返回状态及内容类型1
	response.writeHead(200, {'Content-Type': 'text/plain'});
	
	//返回状态及内容类型2
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain;charset=utf-8');
	
	// 发送响应数据 "Hello World"
	response.end('Hello World\n');
}).listen(443);
```
### node exports
主文件 index.js
```javascript
//引入 public-function
const { format, md5, sha1, isApple } = require('./public-function');
```
模块文件 public-function.js
```javascript
const crypto = require('crypto');

//暴露一个 md5 方法
exports.md5 = function (s) {
    //注意参数需要为string类型，否则会报错
    return crypto.createHash('md5').update(String(s)).digest('hex');
}
```
### 模块数据使用

1、引用的基本数据类型，是拷贝

2、应用的引用类型数据，是引用

index.js
```javascript
const b = require('./test_b.js');

console.log(b);
/*
{
  name: 'I am b',
  skills: [ 'aaa', 'bbb', 'ccc' ],
  say: [Function: say]
}
*/

b.name = '123'
b.skills.push('ddd')
console.log(b);
/*
{
  name: '123',
  skills: [ 'aaa', 'bbb', 'ccc', 'ddd' ],
  say: [Function: say]
}
*/

b.say();
/*
I am b
[ 'aaa', 'bbb', 'ccc', 'ddd' ]
*/
```
b.js
```javascript
var name = 'I am b';
var skills = ['aaa','bbb','ccc'];

var say = function(){
    console.log(name);
    console.log(skills);
}

exports.name = name;
exports.skills = skills;
exports.say = say;
```
### node控制资源下载速度

案例文件：[nodeServer1](https://github.com/fengfanv/JS-library/tree/master/node/nodeServer1)

通过 可读流 控制资源传输速度

### node利用range头实现断点下载

案例文件：[videoServerDemo](https://github.com/fengfanv/JS-library/tree/master/node/videoServerDemo)

### node实现文件上传

案例文件：[uploadFiles](https://github.com/fengfanv/JS-library/tree/master/node/uploadFiles) 

使用模块：multer，express

### node源码实现文件上传

案例文件：[YUMA_uploadFiles](https://github.com/fengfanv/JS-library/tree/master/node/YUMA_uploadFiles)  

测试结果：

.png 正常解析保存

.jpg 正常解析保存

.mp4 正常解析保存

.mp3 正常解析保存

.txt 正常解析保存，txt内容有中文也会正常保存

.word 正常保存，但是打开时说无法正常读取文件，需要修复，修复后可正常打开

//object型数据会在浏览器上formdata解析成[object object]所以obj在传输前要转换成字符串

//如果普通数据中有中文，则会在接收数据时解析成乱码（已解决）

//文件和普通数据一块传输，数据可以过来

//文件不和普通数据一块传输，数据也可以过来

### node源码实现"文件"及"文件夹"上传

案例文件：[YUMA_uploadFolder](https://github.com/fengfanv/JS-library/tree/master/node/YUMA_uploadFolder)   

移动端：chrome浏览器

解决问题：解决上一个“源码实现文件上传”的异步问题

### node模仿nginx正向代理

代理服务器转发请求到服务器

案例文件：[daili_server.js](https://github.com/fengfanv/JS-library/blob/master/node/daili_server.js) 

### node扫描文件案例

案例文件：[wenjiansaomiao](https://github.com/fengfanv/JS-library/tree/master/node/wenjiansaomiao)


### ajax上传文件查看上传进度

只需配置前端就可以，后端不用配置

```html
<body>
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
				
				//原生ajax实现上传文件显示上传进度--------------------------
				var xhr = new XMLHttpRequest();
				xhr.open('post', '/api/uploadFiles', true);
				xhr.onreadystatechange = function() {
					if (this.readyState == 4) {
						//console.log(this.responseText);打印上传的数据信息
					}
				};
				//1、progress事件：用来返回进度信息
				//	下载的progress事件属于XMLHttpRequest对象//xhr.onprogress=function(){}
				//	上传的progress事件属于XMLHttpRequest.upload对象xhr.upload.onprogress=function(){}
				//2、load事件：传输成功完成。
				//3、abort事件：传输被用户取消。
				//4、error事件：传输中出现错误。
				//5、loadstart事件：传输开始。
				//6、loadEnd事件：传输结束，但是不知道成功还是失败。
				//xhr.upload.onprogress要写在xhr.send方法前面，否则event.lengthComputable状态不会改变，只有在最后一次才能获得，也就是100%的时候
				xhr.upload.onprogress = function(ev) {
					//console.log(ev);//控制台打印
					/*progress { 
						target: XMLHttpRequestUpload, 
						isTrusted: true, 
						lengthComputable: true,//这是一个状态，表示发送的长度有了变化，可计算
						loaded: 15020, //已上传的数据大小，单位字节B，1024B===1KB
						total: 15020,//总大小，单位字节B，
						eventPhase: 0, 
						bubbles: false, 
						cancelable: false, 
						defaultPrevented: false, 
						timeStamp: 1445144855459000, 
						originalTarget: XMLHttpRequestUpload
					}*/
					if (ev.lengthComputable) {
						var precent = 100 * ev.loaded / ev.total;
						console.log(precent);
					};
				};
				xhr.send(form);
				
				//jq,ajax实现上传文件显示上传进度---------------------------
				$.ajax({
					type: "post",
					url: "/api/uploadFiles",
					data: form,
					contentType: false, //必须false才会自动加上正确的Content-Type
					processData: false, //必须false才会避开jQuery对formdata的默认处理
					cache: false, //缓存
					xhr: function() {
						//获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数  
						myXhr = $.ajaxSettings.xhr();
						if (myXhr.upload) { //检查upload属性是否存在  
							//绑定progress事件的回调函数  
							myXhr.upload.addEventListener('progress', function(ev) {
								if (ev.lengthComputable) {
									var precent = 100 * ev.loaded / ev.total;
									console.log(precent);
								}
							}, false);
						};
						return myXhr; //xhr对象返回给jQuery使用  
					},
					success: function(data) {
						console.log(data);
					};
				});
			};
		});
	</script>
</body>
```
### fs模块文件读写
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
### 获取文件目录
```javascript
fs.readdir(path.join(__dirname, "public"),function(err,files){
	console.log(files);
});
```
### http模块源码写服务
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
### 神奇的异步案例
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