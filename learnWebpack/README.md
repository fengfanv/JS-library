# 学习Webpack


## webpack是什么？
```
1、前端项目打包工具
2、主要功能就是，将一些浏览器不支持的拓展语言，转换成浏览器支持的语言，如typeScript，less，sass
```
## webpack能干什么
```
1、webpack能处理js、json资源，不能处理css、img等其它资源

2、webpack将一些ES6模块化语法（如：import from语句），编译成浏览器能运行的语法

3、处理css、less等其它资源，需要使用loader来处理
（loader主要就是帮助webpack解析，webpack不能解析的模块，如css模块）

```
## webpack打包模式
```
1、development   开发模式

2、production    生产模式

两者区别：webpack旧版本，生产模式比开发模式多了个代码压缩。最新版本，生产版本不光多个代码压缩，多了个，先运行了一遍代码，打包后的是运行后的结果

```
## loader与plugins
```
loader（加载器）webpack将文件视为模块，但是webpack原生是只能解析js，json文件，如果想解析，打包，其它文件的话，就会用到loader，所以loader的作用是让webpack拥有了加载和解析非js，json文件的能力

plugin（插件）plugin可以扩展webpack的功能，让webpack具有更多的灵活性，在webpack运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过webpack提供的api改变输出结果
```

## webpack命令行命令
```
//1、获取webpack帮助，最新的语法
webpack -h

//2、开发模式webpack打包命令
旧命令：webpack ./src/index.js -o ./build/built.js --mode=development
翻译： webpack 已./src/index.js为入口文件开始打包，打包后输出到 ./build/built.js 内，打包模式是开发模式
新命令：webpack --entry=./src/index.js --output-path=./build --mode=development

//3、生产模式webpack打包命令
旧命令：webpack ./src/index.js -o ./build/built.js --mode=production
新命令：webpack --entry=./src/index.js --output-path=./build --mode=production

//4、webpack
```

## webpack.config.js配置
```javascript
/**
 * loader：1、下载 2、使用（配置loader）
 * plugins：1、下载 2、引用 3、使用
 */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    //webpack配置
    //入口文件
    entry:"./src/index2.js",
    //输出
    output:{
        //输出文件名
        filename:'built2.js',
        //输出路径
        path:path.join(__dirname,'build'),
    },
    //loader（加载器）的配置，loader主要就是帮助webpack解析，webpack不能解析的模块，如css模块
    //Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。 所以Loader的作用是让webpack拥有了加载和解析非JavaScript文件的能力。
    module:{
        rules:[
            //详细loader配置
            //非js，json文件资源，需要配置loader，来处理，如css需要css-loader和style-loader来处理，less需要less-loader与css-loader和style-loader来共同处理
            //不同文件，需要配置，不同的loader来处理
            {
                //匹配那些文件
                test:/\.css$/,//处理已.css结尾的文件
                //使用那些loader进行处理
                use:[//use数组中loader执行顺序，从右到左，从下到上执行
                    //创建style标签，将js里的css字符串，添加到head里
                    "style-loader",
                    //将css转成js字符串
                    "css-loader",
                ]
            },
            {
                test:/\.less$/,//处理已.less结尾的文件
                use:[
                    //创建style标签，将js里的css字符串，添加到head里
                    "style-loader",
                    //将css转成js字符串
                    "css-loader",
                    //将less转为css
                    "less-loader"
                ]
            }
        ]
    },
    //打包模式
    mode:'development',//开发模式
    //mode:"production"//生产模式
    //plugins（插件）的配置
    //Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
    plugins:[
        //详细plugins的配置
        //html-webpack-plugin
        //功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（js、css）
        //需求：需要一个结构的html文件
        new HtmlWebpackPlugin({
            //引用或复制，./src/index.html 这个html，然后自动引用打包输出的所有资源（js、css）
            template:"./src/index.html"
        })
    ],
}

//运行这个配置的命令：命令行敲 webpack 然后回车就可以了
```
