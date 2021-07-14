/**
 * 服务器代码
 * 
 */
const express = require('express');
const app = express();

app.use(express.static('build',{maxAge:1000*3600}))
                                //这里maxAge是让浏览器强制缓存 1000*3600（3600秒，也就是一个小时）
                                //有时间需要看一下这个缓存，浏览器缓存与服务器端有点关系
                                //加了这个参数后，浏览器响应头里会有一个Cache-Control:max-age=3600这个参数
                                //加上这个参数后，浏览器第二次请求资源时，浏览器Network里的每个资源的Size项，都是memory cache这个参数。正常情况下应该是资源的大小，如12B
                                //加了这个参数后，如果在打开这个页面后的一小时内，修改了html，css，js文件，刷新浏览器后，样式为旧的，不是最新的
                                //解决上面缓存问题，给样式文件名里加上时间戳就可以了
app.listen(3000,()=>{
    console.log('服务器3000已启动~');
})