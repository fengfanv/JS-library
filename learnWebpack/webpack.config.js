/**
 * loader：1、下载 2、使用（配置loader）
 * plugins：1、下载 2、引用 3、使用
 */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    //webpack配置
    //入口文件
    entry: "./src/index2.js",
    //输出
    output: {
        //输出文件名
        filename: 'js/built2.js',//输出到build文件下，js文件夹内
        //输出路径
        path: path.join(__dirname, 'build'),
    },
    //loader（加载器）的配置，loader主要就是帮助webpack解析，webpack不能解析的模块，如css模块
    //Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。 所以Loader的作用是让webpack拥有了加载和解析非JavaScript文件的能力。
    module: {
        rules: [
            //详细loader配置
            //非js，json文件资源，需要配置loader，来处理，如css需要css-loader和style-loader来处理，less需要less-loader与css-loader和style-loader来共同处理
            //不同文件，需要配置，不同的loader来处理
            {
                //匹配那些文件
                test: /\.css$/,//处理已.css结尾的文件
                //使用那些loader进行处理
                use: [//use数组中loader执行顺序，从右到左，从下到上执行
                    //在html内，创建style标签，将js里的css字符串，添加到head里
                    //"style-loader",//与下面，二选一
                    MiniCssExtractPlugin.loader,//这个loader，可用来取代style-loader，style-loader是将js里css添加到HTML中，这个loader是将js里css输出到一个css文件里
                    //将css转成js字符串，放到js里
                    "css-loader",
                ]
            },
            {
                test: /\.less$/,//处理已.less结尾的文件
                use: [
                    //创建style标签，将js里的css字符串，添加到head里
                    "style-loader",
                    //将css转成js字符串
                    "css-loader",
                    //将less转为css
                    "less-loader"
                ]
            },
            {
                //处理图片资源
                //这个有一个缺点，就是不处理html中img标签引用的资源，只处理css里的图片资源
                test: /\.(jpg|png|gif)/,
                //如果只使用一个loader，可以不用use方式
                //使用url-loader，需要下两个包，一个是url-loader，还有一个是file-loader
                loader: 'url-loader',
                //这个loader的配置
                options: {
                    //limit意思，图片大小小于8kb，就会被base64处理
                    //优点：减少请求数量（减轻服务器压力）
                    //缺点：图片体积会更大（文件请求速度更慢）
                    //打包结果，一开始有两个图片，一个是500kb的，另一个是4kb的，打包后，4kb的会被转为base64
                    limit: 8 * 1024,
                    //outputPath:"images"//输出图片到images文件夹下
                }
            },
            {
                test: /\.html$/,
                // html-loader可以处理html中的img图片，可负责将其中的图片引入，然后交由url-loader进行解析
                loader: 'html-loader',
                options: {
                    esModule: false//处理html中的img图片问题，在webpack5中html-loader中也需要配置，esModule为false,否则还是不生效
                }
            },
            {
                //打包其它资源（除了html/js/css/less等以外的资源）
                exclude: /\.(css|less|html|js|json|jpg|png|gif)$/,
                loader: 'url-loader',
                //outputPath:"media",//输出其它资源到media文夹下
            },
            /*
                语法检查：eslint-loader eslint，语法检查常用eslint，使用时这两个库都需要下载
                注意事项：只检查自己写的代码，不检查第三方库里的代码
                设置检查规则：
                    在package.json中eslintConfig中设置规则
                    常用的语法规则：airbnb 使用这个规则需要下载 eslint-config-airbnb-base eslint-plugin-import eslint
                    在package中添加如下代码
                    "eslintConfig":{
                        "extends": "airbnb-base"
                    }
            */
            /*
             {
                 test: /\.js$/,//检查js文件
                 exclude: /node_modules/,//排除node_modules文件夹内的文件
                 loader: 'eslint-loader',
                 options: {
                     //写的代码不规范，添加如下，可以修复成规范的代码
                     fix: true
                 }
             },
             */
            /*
                注意这里！！！！
                js兼容这块，实验没有成功，从npm网站上搜索相关包，根据官方使用方法，也没有成功
                
                js代码，做兼容处理
                1、使用@babel/preset-env做js语法兼容，如写的代码是es6的语法，在ie上运行，需要准换成ie能识别的代码
                缺点：只能做语法兼容，但兼容promise这种方法不可以
                下载的包：babel-loader @babel/preset-env @babel/core
                //实验结果，没有用转换
                2、解决不支持promise
                使用@babel/polyfill，解决兼容，promise不支持问题
                //这种方法缺点：兼容做的比较暴力。把所有不兼容的，都打在了代码里，导致打包后的文件很大
                //使用方法：在代码里 引用 import '@babel/polyfill'; 这句话
                3、解决上面兼容做的太暴力的问题，
                按需兼容，我用到了那个不兼容，才兼容那个
                //使用包：corejs
                //最新版本不同怎么使用，在npm网站上搜索，相关包的名字
            */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        //预设：指示babel做怎样的兼容处理
                        presets: [
                            [
                                '@babel/preset-env', 
                                {
                                    targets: {
                                        chrome: 60,
                                        firefox: 60,
                                        ie: 9,
                                        safari: 10,
                                        edge: 17
                                    }
                                }
                            ]
                        ]
                    }
                }
            },
        ]
    },
    //打包模式
    mode: 'development',//开发模式
    //mode:"production"//生产模式，生产模式下，会自动压缩js代码
    //plugins（插件）的配置
    //Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
    plugins: [
        //详细plugins的配置
        //html-webpack-plugin
        //功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（js、css）
        //需求：需要一个结构的html文件
        new HtmlWebpackPlugin({
            //引用或复制，./src/index.html 这个html，然后自动引用打包输出的所有资源（js、css）
            template: "./src/index.html",
            //压缩html代码
            minify:{
                //移除空格
                collapseWhitespace:true,
                //移除注释
                removeComments:true
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/built.css"//输出的css文件到哪里，或重置css文件名
        })

    ],
    //开发服务器devServer：可以用来，开发时自动化（自动编译，自动打开浏览器，自动刷新浏览器等）
    //特点：只会在内存中编译打包，不会有任何输出
    //启动devServer指令：npx webpack serve
    devServer: {
        //项目打包后的目录地址
        contentBase: path.join(__dirname, 'build'),
        //启动gzip压缩
        compress: true,
        //端口号
        port: 3000,
        //自动打开浏览器
        open: true
    }
}