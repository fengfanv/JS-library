# Promise案例

## Promise链式调用运行案例
```javascript
//获取缓存的promise方法
getStorage(key) {
    return new Promise(function (resolve, reject) {
        wx.getStorage({
            key: key,
            success: function (res) {
                console.log('查找成功', key);
                resolve(res.data)
            },
            fail: function (err) {
                console.log('查找失败', key);
                reject(key);
            }
        })
    })
}
```
## Promise运行案例A
```javascript
_this.getStorage('a').then(function (data) {
    //11环境

    //当a成功取到，执行这里（11环境），然后执行查找b的操作
    //如果a取不到，不执行这里，将执行then的第二个方法或catch方法
    //如果没写then第二个方法或catch的话，将报错不继续执行
    return _this.getStorage('b');
}, function (err) {
    //12环境
    //如果a没取到，将执行这里（12环境），这里执行完毕后，
    //虽然这里没有写return，理论上应该就不继续往下执行了
    //但是promise不一样，如果这里执行了，然后后面还有then，且这里（12环境）没有写return
    //则promise会默认返回一个Promise.resolve的结果，这样就会导致执行下面那个then方法（13环境）

    //只要这里一执行，有return和没有return的区别是，
	//有return的话，你如果返回的是Promise.reject，则不会执行下面（13环境），
    //13环境那个then如果没有第二个方法或没有catch在13环境外面的话，会报错，报完错就不继续执行，
	//没有return的话，promise会默认返回一个Promise.resolve的结果，
    //这也就导致会执行下面13环境那个方法，只不过就是13环境的data没有值罢了，是undefined

    //如果执行了下面（13环境）的then方法，则就会执行 return _this.getStorage('c')
    //如果这个c取不到值，但后面还有then的话，后面的then如果没有第二个方法，或后面没有接catch，则会报错，
	//如果c取不到值，但后面的then有第二个方法或catch，则会继续往下执行
}).then(function (data) {
    //13环境
    console.log('b获取成功，开始获取c');

    return _this.getStorage('c');
}).then(function (data) {
    //14环境
    console.log('c获取成功，开始获取d');

    return _this.getStorage('d')
}).then(function (data) {
    //15环境
    console.log('d获取成功');
});
```
## catch和then第两个方法，都有，会执行那个？
```javascript
_this.getStorage('a').then(function (data) {
    //a获取到了，执行这里
}, function (err) {
    //a没有获取到，执行这里
}).catch(function () {
    //a没有获取到，执行这里
    //如果a没有获取到，且then没有第二个方法，则执行这里
    //如果then有第二个方法，则不执行这里
})
```
## catch的使用1
```javascript
_this.getStorage('a').then(function (data) {
    //11环境
    return _this.getStorage('b');
}).then(function (data) {
    //12环境
    console.log('b获取成功，开始获取c');
    return _this.getStorage('c');
}).then(function (data) {
    //13环境
    console.log('c获取成功');
}).catch(function (err) {
    console.log(err);
    //如果a没获取到，这里会执行打印a的错误信息，
    //如果a获取到了，执行return _this.getStorage('b')，但是b没获取到，则这里会执行打印b的错误信息
    //如果a和b都获取到了，c没有获取到，则这里会打印c的错误信息
})
```
## catch的使用2
```javascript
_this.getStorage('a').then(function (data) {
    //11环境
    return _this.getStorage('b');
}).catch(function (err) {
    console.log(err);
    //如果a没有获取到，这里会打印a的错误信息，
    //但是因为这里没有写return，所以这里会默认返回一个Promise.resolve的结果，所以会跟着执行下面（12环境）那个方法，
    //这样的话（12环境）的那个方法会获取不到data值，然后会执行return _this.getStorage('c')，如果c也没有获取到，
    //则会在最后那个catch里打印c的错误信息
}).then(function (data) {
    //12环境
    console.log('b获取成功，开始获取c');
    return _this.getStorage('c');
}).then(function (data) {
    //13环境
    console.log('c获取成功，开始获取d');
    return _this.getStorage('d');
}).then(function (data) {
    //14环境
    console.log('d获取成功');
}).catch(function (err) {
    console.log(err);
    //a获取不到，不会在这个catch里打印a的错误信息，会在上面那个catch里打印a的错误信息

    //a获取到了，b没有获取到，则会在这里打印b的错误信息
    //如果a和b获取到了，但c没有获取到，则会在这里打印c的错误信息
    //如果a和b和c获取到了，但d没有获取到，则会在这里打印d的错误信息
})
```
## Promise.then的return
```javascript
new Promise((resolve,reject)=>{
    resolve()
}).then((data)=>{
    return 1
}).then((data)=>{
    console.log(data) // 1
})

//上面代码 等同于 下面代码

new Promise((resolve,reject)=>{
    resolve()
}).then((data)=>{
    return Promise.resolve(1)
}).then((data)=>{
    console.log(data) // 1
})

```
## async与await
```javascript
function promise2() {
    return new Promise((resolve) => {
        console.log('promise2');
        resolve();
    })
}
async function async1() {
    console.log('async1 1');
    await promise2();
    console.log('async1 2');
	console.log('async1 3');
	await promise2();
	console.log('async1 4');
	console.log('async1 5');
}
async1();
console.log('script end');

// async1 1
// promise2
// script end
// async1 2
// async1 3
// promise2
// async1 4
// async1 5
```
#### 上面的代码 等同于 下面的代码
```javascript
function promise2() {
    return new Promise((resolve) => {
        console.log('promise2');
        resolve();
    })
}
function async1() {
    console.log('async1 1');
    promise2().then(()=>{
		console.log('async1 2');
		console.log('async1 3');

		return promise2()
	}).then(()=>{
		console.log('async1 4');
		console.log('async1 5');
	})
}
async1();
console.log('script end');

// async1 1
// promise2
// script end
// async1 2
// async1 3
// promise2
// async1 4
// async1 5
```
#### 不等同于 下面的代码
```javascript
function promise2() {
    return new Promise((resolve) => {
        console.log('promise2');
        resolve();
    })
}
function async1() {
    console.log('async1 1');
    promise2().then(()=>{
		console.log('async1 2');
		console.log('async1 3');
	})
    
    promise2().then(()=>{
		console.log('async1 4');
		console.log('async1 5');
	})
}
async1();
console.log('script end');

// async1 1
// promise2
// promise2
// script end
// async1 2
// async1 3
// async1 4
// async1 5
```