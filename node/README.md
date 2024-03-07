# Node.js

1、[CommonJS_commonJS](/node/commonJS)

2、[多进程和多线程_processThread](/node/processThread)

3、[创建HTTP服务（不使用第三方库）（使用CORS解决跨域问题）_createWebServer](/node/createWebServer)

4、[node源码利用range头实现Mp4文件流播放（不使用第三方库）_video-stream](/node/video-stream)

5、[node大文件分片上传（不使用第三方库）_file-upload](/node/file-upload)

6、[node制作formdata数据并保存成文件_zipFile](/node/zipFile)

7、[node下载m3u8视频 node合并m3u8视频_nodeM3u8](/node/nodeM3u8)

8、[m3u8视频播放器_m3u8VideoServer](/node/m3u8VideoServer)

9、[node源码获取MP4时长信息_getMp4Info.js](/node/getMp4Info.js)

10、[node里的Buffer_buffer](/node/buffer)

搭建一个简单的http服务（和https服务）(不使用第三方库)

node控制资源下载速度(不使用第三方库)

node源码利用range头实现断点下载(不使用第三方库)

node源码M3u8流格式文件视频播放(不使用第三方库)

node Gzip压缩传输http服务(不使用第三方库)

有关Stream(流)的应用

--

node文件上传(express,multer)

node文件上传(不使用第三方库)

node文件或文件夹上传(不使用第三方库)

--

nodeRequest请求(不使用第三方库)

node模仿Nginx正向代理(不使用第三方库)

--

node搭建websock服务(不使用第三方库)
node搭建RTC音视频服务(不使用第三方库)

--

node进程守护Demo(不使用第三方库)
node多进程性能提升(不使用第三方库)

--

整理mysql文档

---


## node进程守护
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


## node控制资源下载速度

- 案例文件：[nodeServer1](https://github.com/fengfanv/JS-library/tree/master/node/nodeServer1)

- 通过 可读流 控制资源传输速度

## node利用range头实现断点下载

- 案例文件：[videoServerDemo](https://github.com/fengfanv/JS-library/tree/master/node/videoServerDemo)

## node实现文件上传

- 案例文件：[uploadFiles](https://github.com/fengfanv/JS-library/tree/master/node/uploadFiles) 

- 使用模块：multer，express

## node源码实现文件上传

- 案例文件：[YUMA_uploadFiles](https://github.com/fengfanv/JS-library/tree/master/node/YUMA_uploadFiles)  

- 测试结果：

	- .png 正常解析保存

	- .jpg 正常解析保存

	- .mp4 正常解析保存

	- .mp3 正常解析保存

	- .txt 正常解析保存，txt内容有中文也会正常保存

	- .word 正常保存，但是打开时说无法正常读取文件，需要修复，修复后可正常打开

	- //object型数据会在浏览器上formdata解析成[object object]所以obj在传输前要转换成字符串

	- //如果普通数据中有中文，则会在接收数据时解析成乱码（已解决）

	- //文件和普通数据一块传输，数据可以过来

	- //文件不和普通数据一块传输，数据也可以过来

## node源码实现"文件"及"文件夹"上传

- 案例文件：[YUMA_uploadFolder](https://github.com/fengfanv/JS-library/tree/master/node/YUMA_uploadFolder)   

- 移动端：chrome浏览器

- 解决问题：解决上一个“源码实现文件上传”的异步问题

## node模仿nginx正向代理

- 代理服务器转发请求到服务器

- 案例文件：[daili_server.js](https://github.com/fengfanv/JS-library/blob/master/node/daili_server.js) 

## node扫描文件案例

- 案例文件：[wenjiansaomiao](https://github.com/fengfanv/JS-library/tree/master/node/wenjiansaomiao)

## ajax上传文件查看上传进度

- 只需配置前端就可以，后端不用配置

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

//获取文件目录
fs.readdir(path.join(__dirname, "public"),function(err,files){
	console.log(files);
});
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

## node exports
```javascript
//index.js

//引入 public-function
const { format, md5, sha1, isApple } = require('./public-function');
```

```javascript
//public-function.js

const crypto = require('crypto');

//暴露一个 md5 方法
exports.md5 = function (s) {
    //注意参数需要为string类型，否则会报错
    return crypto.createHash('md5').update(String(s)).digest('hex');
}
```