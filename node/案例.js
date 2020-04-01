/*导入模块*/
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');//用于处理文件路径的小工具
var cors = require('cors');//引用cors安全，解决跨域问题
var multer  = require('multer');//form文件上传文件处理方法

var bodyParser = require('body-parser');//POST请求需要这个解析数据

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });


 
var app = express();

/*获取ssl证书物理地址*/
const httpsOption = {
    key : fs.readFileSync("../https/2_www.xxx.com.key"),
    cert: fs.readFileSync("../https/1_www.xxx.com_bundle.crt")
};

app.use(express.static('public'));//暴露这个public文件夹下的静态资源，就不用手动写js释放资源了

app.use(cors());//挂载插件

//app.all('/abc', function(req, res){//all方法是get post方法都支持  有两个参数Response 对象 - response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据
																		  //Request 对象 - request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性
//    console.log("请求路径："+req.url);
//    var name = req.url.split('/')[req.url.split('/').length-1];
//    var type = req.url.split('.')[req.url.split('.').length-1];
//    console.log("请求内容：", name);
//	res.send('Hello abc');
//});

app.get('/ce_get', function (req, res) {
   console.log("ce GET 请求");
   res.send('GET 请求！');
});

app.post('/ce_post',cors(), function (req, res) {//还有跨域问题
   console.log("ce POST 请求");
   res.send('POST 请求！');
});

//form提交表单，GET
app.get('/ce_form_get', function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       "name":req.query.name,
       "password":req.query.last
   };
   console.log(response);
   res.end(JSON.stringify(response));
});

//form提交表单，POST
app.post('/ce_form_post', urlencodedParser,function (req, res) {
	console.log(req);
 
   // 输出 JSON 格式
   var response = {
       "name":req.body.name,
       "password":req.body.last
   };
   console.log(response);
   res.end(JSON.stringify(response));
});

//文件上传文件上传文件上传文件上传文件上传文件上传文件上传文件上传
//第一步配置文件上传地址
var storage = multer.diskStorage({//硬盘存储
	destination:function(req, file, cb) {//destination属性用于设置文件的存储目录
		cb(null, 'public/ce/upload')  //uploads  需要手动创建
	}
});
var upload = multer({
	storage:storage
});

// 多图上传
								//前段名字，数量
app.post('/ce_upload', upload.array('image', 1), function(req, res, next){//第一个参数地址，第二个是照片数量，第三个是回调
	var proObj = req.body;//express框架中用req.body接收post客户端的数据；req.query接收get请求
	
	if(req.files.length != 0){ //判断submit提交是否有file值，有的话执行如下操作
	var arr = req.files[0];//取到文件（照片）
		//var obj = new Object();//定义一个对象
		console.log(''+arr.destination+'\n'+arr.filename+'\n'+arr.destination+'\n'+arr.originalname);
		fs.rename(arr.destination + arr.filename, arr.destination + arr.originalname,function(){ //修改文件名称，可更改文件的存放路径。
		
		//fs.rename(oldPath, newPath, [callback(err)])
		//由于该方法属于fs模块，使用前需要引入fs模块（var fs= require(“fs”) ）
		//接收参数：
		//oldPath                原路径
		//newPath              	 新路径
		//callback               回调，传递一个err异常参数
		
			//obj.origin ='http://localhost:80/uploads/'+ arr.originalname;//拼接，把照片地址改成服务器能获取的地址
			//proObj.poster = obj;//把对象赋值给req.body
			res.send({status: 'ok'});
		});
	}
    
});


//mysql操作
var mysql  = require('mysql');  

var connection = mysql.createConnection({
  host     : '',
  user     : 'root',
  password : 'rootwo',
  port: '3306',
  database: 'ce'
}); 
//查询
connection.connect();
var  sql = 'SELECT * FROM user';
connection.query(sql,function (err, result) {
	if(err){
		console.log('[SELECT ERROR] - ',err.message);
		return;
	}
	console.log('--------------------------SELECT----------------------------');
	console.log(result);
	console.log('------------------------------------------------------------\n\n');
});
connection.end();

var zengjia = mysql.createConnection({
  host     : '',
  user     : 'root',
  password : 'rootwo',
  port: '3306',
  database: 'ce'
}); 

//增加
zengjia.connect();
var  addSql = 'INSERT INTO user (id,name,phone,address) VALUES(0,?,?,?)';
var  addSqlParams = ['坦克世界','12456789','北京市西城区'];
zengjia.query(addSql,addSqlParams,function (err, result) {
	if(err){
		console.log('[INSERT ERROR] - ',err.message);
		return;
	}
	console.log('--------------------------INSERT----------------------------');     
	console.log('INSERT ID:',result);        
	console.log('-----------------------------------------------------------------\n\n');  
});
zengjia.end();



var gengxin = mysql.createConnection({     
  host     : '',       
  user     : 'root',              
  password : 'rootwo',       
  port: '3306',                   
  database: 'ce' 
}); 
//更新数据
gengxin.connect();
var modSql = 'UPDATE user SET name = ?,phone = ? WHERE id = ?';
var modSqlParams = ['王大毛', '15177998855',3];
gengxin.query(modSql,modSqlParams,function (err, result) {
	if(err){
		console.log('[UPDATE ERROR] - ',err.message);
		return;
	}
	console.log('--------------------------UPDATE----------------------------');
	console.log('UPDATE affectedRows',result.affectedRows);
	console.log('-----------------------------------------------------------------\n\n');
});
gengxin.end();



var shanchu = mysql.createConnection({
  host     : '',
  user     : 'root',
  password : 'rootwo',
  port: '3306',
  database: 'ce'
});
//删除数据
shanchu.connect();
var delSql = 'DELETE FROM user where id=5';
shanchu.query(delSql,function (err, result) {
	if(err){
		console.log('[DELETE ERROR] - ',err.message);
		return;
	}
	console.log('--------------------------DELETE----------------------------');
	console.log('DELETE affectedRows',result.affectedRows);
	console.log('-----------------------------------------------------------------\n\n');
});
shanchu.end();


   
http.createServer(app).listen(80);
https.createServer(httpsOption,app).listen(443);
console.log('启动成功！');


//http：请求转发器
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


