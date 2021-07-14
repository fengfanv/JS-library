// 解决js，在ie兼容问题
//import '@babel/polyfill';

// import './index.css'

import './index.less';

import './iconfont.css';

import print from './print'

function add(a, b) {
  return a + b;
}

// 添加下面这个注释（// eslint-disable-next-line），eslint，在检查语法规则时，不会检查，下面注释的下面的代码（console.log(add(1, 2));）
// eslint-disable-next-line
console.log(add(1, 2));

new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
}).then(() => {
  // eslint-disable-next-line
    console.log('定时器执行完毕');
});

console.log('我新增的一个console')()();


//js文件开启热更新
if(module.hot){
  //检查webpack配置文件，是否开启了热更新
  module.hot.accept('./print.js',()=>{
    //这个方法，会监听，print.js的变化，一旦发生变化，其它模块不会重新打包构建
    //而是会重新运行一下这里的回调函数
    //使用这个方法时，当前这个index2.js文件，就相当于一个入口文件，热更新这个不能给入口文件做，因为这种方法只能给入口文件的下级文件做监听
    print();//发生变化,后重新运行这个文件
  })
}
