# 学习koa
koa-router,koa-bodyparser,koa-static,koa-views,ejs模板

## 创建一个普通服务
```javascript
const Koa = require('koa');
const app = new Koa();
app.use(async function (ctx) {
	if (ctx.url === '/' && ctx.method === 'GET') {
		ctx.body = '这是一个web页面！'
	} else {
        ctx.body = '404，没有这个页面！'
    }
});
app.listen(3000, function () {
    console.log('启动成功');
});
```
## 接收get请求参数
```javascript
const Koa = require('koa');
const querystring = require('querystring');
const app = new Koa();
app.use(async function (ctx) {
	if (ctx.url === '/' && ctx.method === 'GET') {
		let data = JSON.stringify(querystring.parse(ctx.request.query))
		ctx.body = '这是一个web页面！'+data
	} else {
        ctx.body = '404，没有这个页面！'
    }
});
app.listen(3000, function () {
    console.log('启动成功');
});
```
## 接收post请求参数
```javascript
const Koa = require('koa');
const querystring = require('querystring');
const koa_bodyparser = require('koa-bodyparser');
const app = new Koa();

//挂载koa_bodyparser后直接从ctx.request.body里直接获取数据
app.use(koa_bodyparser());

app.use(async function (ctx) {
	if (ctx.url === '/' && ctx.method === 'GET') {
	    //显示页面
	    let html = `
	    <h1>post请求</h1>
	    <form method="post" action="/getpost">
	        <p>用户名:</p>
	        <input name="name"/>
	        <p>年龄:</p>
	        <input name="age"/>
	        <br/>
	        <button type="submit">提交</button>
	    </form>
	    `;
	    ctx.body = html;
	} else if (ctx.url === '/getpost' && ctx.method === 'POST') {
		//1、手写接收post数据方法
	    let data = await parsePostData(ctx);
	    data = JSON.stringify(querystring.parse(data));
		
		//2、挂载koa_bodyparser直接从body里获取数据
	    //let data = JSON.stringify(ctx.request.body);
	    ctx.body = '<h1>接收到参数:</h1>'+data
	} else {
	    ctx.body = '404，没有这个页面！'
	}  
});
//手写接收post数据方法
function parsePostData(ctx) {
    return new Promise(function (resolve, reject) {
        try {
            var postdata = "";
            ctx.req.addListener('data', function (data) {
                postdata += data;
            })
            ctx.req.addListener('end', function () {
                resolve(postdata);
            })
        } catch (err) {
            reject('我出错了！')
        }
    })
}

app.listen(3000, function () {
    console.log('启动成功');
});
```
## 手敲路由
```javascript
const Koa = require('koa');
const app = new Koa();
const fs = require('fs');

app.use(async function (ctx) {
	let url = ctx.request.url;
	let html = await route(url);
	ctx.body = html;
});

//匹配路由方法
async function route(url) {
    let page = '404.html';
    switch (url) {
        case '/':
            page = 'index.html'
            break;
        case '/index':
            page = 'index.html'
            break;
        case '/user':
            page = 'user.html'
            break;
        case '/404':
            page = '404.html'
            break;
        default:
            break;
    }
    let html = await render(page);
    return html;
}
//渲染页面方法
function render(page) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./page/' + page, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data)
        });
    })
}

app.listen(3000, function () {
    console.log('启动成功');
});
```
## 使用koa-router模块，搭建路由
```javascript
const Koa = require('koa');
const koa_router = require('koa-router');
const app = new Koa();

//1、配置普通路由
router.get('/', function (ctx, next) {
        ctx.body = 'hello world!';
    }).get('/user',function (ctx, next) {
        ctx.body = 'hello user!';
    });
//挂载普通路由
app.use(router.routes())
   .use(router.allowedMethods());//匹配路由配置时指定的方式。如/路径，只有get方式才能访问到，post就请求不到
   
//2、配置层级（父子）路由

//配置子路由home
let home = new koa_router();
home.get('/a', async function (ctx) {
    //路由接收参数
    let data = ctx.request.query;
    ctx.body = '我是home下a页面。接收到：' + JSON.stringify(data);

}).get('/b', async function (ctx) {
    ctx.body = '我是home下b页面'
})

//配置子路由user
let user = new koa_router();
user.get('/a', async function (ctx) {
    ctx.body = '我是user下a页面';
}).get('/b', async function (ctx) {
    ctx.body = '我是user下b页面';
})
//在主路由上挂载子路由home
//如访问home下a页面，则/home/a
router.use('/home', home.routes(), home.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
//在项目上挂载路由
app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, function () {
    console.log('启动成功');
});
```
## koa中使用cookie
```javascript
const Koa = require('koa');
const app = new Koa();
app.use(async function (ctx) {
	if (ctx.url === '/home' && ctx.method === 'GET') {
		if (!ctx.cookies.get('name')) {
		    //没有设置名为name的cookie
		    ctx.cookies.set(
		        'name', 'kang', {
		        domain: 'localhost',//cookie可用域名
		        maxAge: 1000 * 60 * 60 * 24,//cookie有效时长，单位：毫秒
		        expires: new Date('2020-12-10'),//过期时间
		        path: '/home',//cookie生效路径
		        httpOnly: false,//浏览器端js是否可以读取cookie
		        overwrite: false,//cookie是否可以重写
		        secure: false//HTTPS连接中，浏览器是否可以传递到服务端进行会话验证
		    })
		}
		ctx.body = ',cookie设置完成'
	} else {
        ctx.body = '404，没有这个页面！'
    }
});
app.listen(3000, function () {
    console.log('启动成功');
});
```
## koa中使用ejs模板

1、安装ejs模块，不用引入

2、安装koa-views模块

index.js
```javascript
const Koa = require('koa');
const koa_views = require('koa-views');
const app = new Koa();
//挂载ejs模板
app.use(koa_views(__dirname + '/view', {
    extension: 'ejs'//说明模板引擎为ejs
}))

app.use(async function (ctx) {
	if (ctx.url === '/' && ctx.method === 'GET') {
		
		//渲染ejs模板
		let title = '我是ejs模板渲染的title'
		await ctx.render('index.ejs', { 'title': title })
		
	} else {
        ctx.body = '404，没有这个页面！'
    }
});
app.listen(3000, function () {
    console.log('启动成功');
});
```
view/index.ejs
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    <h1>模板字符串：<%= title %></h1>
</body>
</html>
```
## 使用koa-static释放静态文件
```javascript
const Koa = require('koa');
const koa_static = require('koa-static');
const app = new Koa();

//释放当前目录下public内的文件
app.use(koa_static(__dirname+'/public'))

app.listen(3000, function () {
    console.log('启动成功');
});
```
