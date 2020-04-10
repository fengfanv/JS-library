const Koa = require('koa');
const querystring = require('querystring');
const koa_router = require('koa-router');
const koa_views = require('koa-views');
const koa_static = require('koa-static');
const koa_bodyparser = require('koa-bodyparser');
const fs = require('fs');
const app = new Koa();

//解析post数据
app.use(koa_bodyparser());

const router = new koa_router({
    //prefix:'/kang'//前缀层级，如访问user页面，配置后应访问/kang/user
});

//释放静态文件
app.use(koa_static(__dirname+'/'))

//挂载ejs模板
app.use(koa_views(__dirname + '/view', {
    extension: 'ejs'//说明模板引擎为ejs
}))

//配置普通路由
// router
//     .get('/', function (ctx, next) {
//         ctx.body = 'hello world!';
//     })
//     .get('/user',function (ctx, next) {
//         ctx.body = 'hello user!';
//     });
//挂载普通路由
// app
//     .use(router.routes())
//     .use(router.allowedMethods());


//配置子路由home
let home = new koa_router();
home.get('/a', async function (ctx) {
    //路由接收参数
    let data = ctx.request.query;
    ctx.body = '我是home下a页面。接收到：' + JSON.stringify(data);

}).get('/b', async function (ctx) {
    //设置cookie
    //检查cookie是否设置过
    if (!ctx.cookies.get('name')) {
        //没有设置过则设置
        ctx.cookies.set(
            'name', 'kang', {
            domain: 'localhost',//cookie可用域名
            maxAge: 1000 * 60 * 60 * 24,//cookie有效时长，单位：毫秒
            expires: new Date('2020-12-10'),//过期时间
            path: '/home',//cookie生效路径
            httpOnly: false,//浏览器端js是否可以读取cookie
            overwrite: false,//cookie是否可以重写
            secure: false//HTTPS连接中，浏览器是否可以传递到服务端进行会话验证
        }
        )
    }
    ctx.body = '我是home下b页面'
})

//配置子路由user
let user = new koa_router();
user.get('/a', async function (ctx) {
    //渲染ejs模板
    let title = '我是ejs模板渲染的title'
    await ctx.render('index.ejs', { 'title': title })
    //ctx.body = '我是user下a页面';
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






app.use(async function (ctx) {
    //第三课
    // let url = ctx.url;
    // //从request中接收get请求
    // let request = ctx.request;
    // let req_query = request.query;
    // let req_querystring = request.querystring;

    // //直接从上下文中获取get请求
    // let ctx_query = ctx.query;
    // let ctx_querystring = ctx.querystring;

    // ctx.body = {
    //     url,
    //     req_query,
    //     req_querystring,

    //     ctx_query,
    //     ctx_querystring
    // }

    //第4课
    //console.log(ctx.url,ctx.method);
    // if (ctx.url === '/' && ctx.method === 'GET') {
    //     //显示页面
    //     let html = `
    //     <h1>post请求</h1>
    //     <form method="post" action="/getpost">
    //         <p>用户名:</p>
    //         <input name="name"/>
    //         <p>性别:</p>
    //         <input name="age"/>
    //         <br/>
    //         <button type="submit">提交</button>
    //     </form>
    //     `;
    //     ctx.body = html;
    // } else if (ctx.url === '/getpost' && ctx.method === 'POST') {
    //     //let data = await parsePostData(ctx);
    //     //data = JSON.stringify(querystring.parse(data));
    //     let data = JSON.stringify(ctx.request.body);
    //     ctx.body = '<h1>接收到参数:</h1>'+data
    // } else {
    //     ctx.body = '404，没有这个页面！'
    // }

    //第7课
    let url = ctx.request.url;
    let html = await route(url);
    ctx.body = html;
});


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

function render(page) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./page/' + page, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data)
        });
    })
}

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
