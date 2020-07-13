const http = require('http');
const querystring = require('querystring');
http.createServer(function(request,response){
    response.setHeader('Content-Type','application/json');
    console.log(request.url);
    let urlarr = request.url.split('?');
    let path = urlarr[0];
    let query = querystring.parse(urlarr[1]);
    // console.log(path);
    // console.log(query);
    let data = query['callback']+'('+JSON.stringify({data:'请求成功！'})+')';//拼接数据
    // console.log(data);
    response.end(data);
}).listen(8000);
console.log('8000启动成功!');
