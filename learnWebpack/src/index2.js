// 解决js，在ie兼容问题
//import '@babel/polyfill';

// import './index.css'

import './index.less';

import './iconfont.css';

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
