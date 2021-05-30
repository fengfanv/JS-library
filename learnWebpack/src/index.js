/**
 * webpack 入口文件
 * 
 * 1、运行指令：
 * //这个命令，是视频里的命令，他的webpack版本是4,这里安装的webpack版本是5，下面的命令会有
 * 一些不兼容，新语法里没发指定./build/built.js这个，只能指定一个文件目录，然后在文件目录下生出一个main.js文件
 * 可以通过命令行webpack -h 获取webpack最新的语法
 * 开发环境打包（旧命令行）：webpack ./src/index.js -o ./build/built.js --mode=development
 * 翻译：webpack 已./src/index.js为入口文件开始打包，打包后输出到 ./build/built.js 内，打包环境是开发环境
 * 
 * 新命令行（5版本的命令行）：webpack --entry=./src/index.js --output-path=./build --mode=development
 * 
 * 打包后，运行打包后的文件 node ./build/main.js    输出3
 * 
 * 生产环境打包（旧命令行）：webpack ./src/index.js -o ./build/built.js --mode=production
 * 新命令行：webpack --entry=./src/index.js --output-path=./build --mode=production
 * 
 * 开发环境与生产环境打包区别，开发环境，代码没压缩。生产环境，代码压缩了。当然webpack5的话更狠，这里直接就剩下一个console.log(3),
 * 
 * 
 * 结论，
 * webpack能处理js、json资源，不能处理css、img等其它资源
 * 生产环境和开发环境，将一些ES6模块化语法（如：import from语句），编译成浏览器能运行的语法
 * 生产环境比开发环境，多一个压缩代码
 * 
 * 看完第4集了
 */

import data from './data.json'

console.log(data)

import './index.css'

function add(a,b){
    return a+b;
}

console.log(add(1,2));