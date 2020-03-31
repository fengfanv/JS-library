var express = require("express");
var http = require("http");
var fs = require("fs");
var multer = require("multer");
var app = express();

//释放静态文件
app.use(express.static("./public"));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//上传一个文件
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
