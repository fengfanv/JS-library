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
    entry: ["./src/index2.js","./src/index.html"],
    //输出
    output: {
        //输出文件名
        filename: 'js/built2[hash:10].js',//输出到build文件下，js文件夹内
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
            filename: "css/built[hash:10].css"//输出的css文件到哪里，或重置css文件名
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
        open: true,
        //开发服务器环境下，开启，热更新，这个热更新意思是，当某个文件发生变化，只会重新打包这个发生变化的文件，不会把项目所有文件都重新打包，这样开发调试时，速度快
        hot:true
    },
    devtool:"source-map"
    //source-map 是一种源代码映射到构建后代码的技术。开发代码时，如当代码里出现错误，可以通过浏览器调试器，在构建后代码出现问题的地方 映射 到源代码位置。如果没有开启这个代码映射，代码出现错误，调试器只会显示构建后代码出现错误的地方，构建后代码是被压缩和做过处理的，这样直接调试代码就不好调
    //启用方法：开启devServer就可以
}

/*
    HMR：hot module replacement 热模块替换 或叫 模块热替换
    作用：一个模块发生变化，只会重新打包这个发生变化的模块，不会重新打包项目所有文件，能够极大的提升构建速度。默认情况下，一个文件发生变化，会重新打包所有文件。如果项目文件少还行，打包速度不会收到影响，但如果有100个,1000个的时候，就会感觉到速度的变化
    样式文件：可以使用热更新功能，因为style-loader内部实现了热更新功能，这也就是为什么在开发环境使用style-loader，生产环境提取文件的原因，这样开发环境下能有更好的性能
    js文件：默认是没有热更新功能，js文件发生变化，重新打包整个项目
    js文件开启热更新：（详见index2.js）
    if(module.hot){
        module.hot.accept('./print.js',()=>{
            //被监听的文件发生变化后，做什么是
        })
    }
    HTML文件：默认没有热更新功能，而且html文件发生变化后，不会触发重新打包项目，解决这个问题：
    在entry里添加html文件的路径，可以解决，修改html但不刷新的问题。但还是没有热更新功能。
    html文件一般不做热更新功能


*/


/*
    webpack打包时，解决文件缓存问题的  “ hash ”  ，面试会问
    每次wbepack构建项目时，webpack都是生成一个随机的 hash
    1、hash：利用每次webpack构建时都会生成一个唯一的hash值
    问题：同时使用一个hash值，当重新构建项目时，有100个文件，只修改了其中一个文件，则这个100个文件的hash都变，这样的话，就会让一些没有被修改的文件，需要缓存的文件，不能缓存，这样会很浪费资源。如果没有修改文件，重新打包，文件的hash值不变
    
    2、chunkhash：这里chunk就是，像项目里边的入口文件就是一个chunk，如这个入口文件引用了很多的js文件，css文件，则引用这些css文件和js文件的入口文件就是chunk，有点类似那种树状图，或咱们人五根手指的chunk就是手掌，然后两条胳膊两条腿的chunk就是人的上身
    //这个就是已chunk分小组，每个chunk都会被分配一个hash值，如果某个chunk下的子集有100个文件，修改了其中一个，则这个chunk下的100文件的hash都会变。但是不会影响其它chunk下的hash。这个比上面的hash好一点，但还不是最好
    问题：和上面有类似的问题，虽然把项目所有文件按chunk分开了，但是如果一个chunk下有100个文件，修改了其中一个文件，则这个chunk下的所有文件的hash都会变化，则这个chunk下的需要缓存的文件，缓存会失效

    3、contenthash：根据文件的内容生成hash值，不同的文件hash值都不一样。100个文件，修改了其中一个，只有被修改的这个文件的hash值会变，不影响别的文件的hash值
    这个最厉害
    

*/


/*
    tree shaking（摇树，树摇）：去除无用代码，让代码更简洁
    如：有a，b两个方法，a被使用了，b没被使用，b就会被删除
    前提：1、必须使用es6模块化，2、开启production（生产环境）
    es6模块化实例：export function a(a,b){return a+b} 


    在package.json配制
    "sideEffects":false 所有代码都没有副作用（都可以进行tree shaking）
    问题：css文件 或 做js兼容的@babel/polyill（副作用）文件删除
    "sideEffects":["*.css","*.less"]这样配置css，less文件不会被tree shaking

*/


/*
    code split（代码分割）：将打包后的一个文件，分割成多个文件，这样的话，加载的时候就可以并行加载，加载更快。
    分割成多个文件后，就可以按需加载，需要用这个文件时，才加载
    代码分割主要是对js代码做处理

    方式1：对入口entry与出口output做处理
    entry: ["./src/index2.js","./src/index.html"],//之前多文件文件入口
    entry: "./src/index2.js",//之前单文件入口
    output: {
        filename: 'js/built2[hash:10].js',//输出到build文件下，js文件夹内
        path: path.join(__dirname, 'build'),
    },
    //之后
    entry: {//多入口
        main:'./src/js/index.js',
        test:'./src/js/test.js',
    },
    output: {
        filename: 'js/[name].[hash:10].js',//按入口名输出多个文件，这个name就是entry的main和test
        path: path.join(__dirname, 'build'),
    },

    //方式2：配置optimization
    这个可以，将node_modules中代码单独打包一个chunk，最终输出
    还可以，自动分析多入口chunk中，有没有公共的文件。如果有会打包成一个单独的chunk
    这个方法可以跟上面方法嵌套使用
    entry:{
        main:'./src/js/index.js',
        test:'./src/js/test.js',
    },
    output: {
        //...
    },
    optimization:{
        splitChunks:{
            chunks:'all'
        }
    }

    //方式3，通过js代码，让某个文件单独打包成一个chunk，
    import动态导入语法，将某个文件单独打包
    如，在入口文件index.js里
    import('./test.js').then((res)=>{
        //文件加载成功,这种情况下，test会被单独打包成一个文件
        console.log(res.count(1,2))
    }).catch((err)=>{
        //文件加载失败
    })

*/

/*
    lazy loading（懒加载和预加载）
    懒加载：当文件需要使用时才加载
    预加载：会在使用之前，提前加载js文件
    正常加载：可以认为是并行加载（同一时间加载多个文件）
    预加载与正常加载区别：预加载是等其它资源加载完毕后，浏览器空闲了，再偷偷加载资源

    如：再index.js文件里加载一个test.js文件
    function a(){
        import('test.js',(res)=>{
            console.log(res.count(1,2));
        })
    }
    上面当需要运行a()方法时，才加载test.js方法。这就实现了懒加载

    function a(){
        import(\/* webpackChunkName:'test',webpackPrefetch:true*\/'test.js',(res)=>{
            console.log(res.count(1,2));
        })
    }
    //在import()方法里加上\/* webpackChunkName:'test',webpackPrefetch:true*\/'test.js'这就话就实现了预加载
    webpackChunkName代表加载的这个文件名字，webpackPrefetch代表开启预加载

*/