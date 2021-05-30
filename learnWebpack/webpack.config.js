/**
 * loader：1、下载 2、使用（配置loader）
 * plugins：1、下载 2、引用 3、使用
 */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    //webpack配置
    //入口文件
    entry: "./src/index2.js",
    //输出
    output: {
        //输出文件名
        filename: 'built2.js',
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
                    //创建style标签，将js里的css字符串，添加到head里
                    "style-loader",
                    //将css转成js字符串
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
                    limit: 8 * 1024
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
                loader: 'url-loader'
            }
        ]
    },
    //打包模式
    mode: 'development',//开发模式
    //mode:"production"//生产模式
    //plugins（插件）的配置
    //Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
    plugins: [
        //详细plugins的配置
        //html-webpack-plugin
        //功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（js、css）
        //需求：需要一个结构的html文件
        new HtmlWebpackPlugin({
            //引用或复制，./src/index.html 这个html，然后自动引用打包输出的所有资源（js、css）
            template: "./src/index.html"
        })
    ],
    //开发服务器devServer：可以用来，开发时自动化（自动编译，自动打开浏览器，自动刷新浏览器等）
    //特点：只会在内存中编译打包，不会有任何输出
    //启动devServer指令：npx webpack serve
    devServer:{
        //项目打包后的目录地址
        contentBase:path.join(__dirname,'build'),
        //启动gzip压缩
        compress:true,
        //端口号
        port:3000,
        //自动打开浏览器
        open:true
    }
}