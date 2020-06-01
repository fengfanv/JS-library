# Promise案例

#### Promise链式调用运行案例
```javascript
//获取缓存的promise方法
getStorage(key) {
    return new Promise(function (resolve, reject) {
      wx.getStorage({
        key: key,
        success: function (res) {
          console.log('查找',key,'成功');
          resolve(res.data)
        },
        fail: function (err) {
          console.log('查找',key,'失败-报错');
          reject(key);
        }
      })
    })
}
```
#### Promise运行案例A
```javascript
_this.getStorage('a').then(function (data) {
	//11环境
	
	//当a成功取到，执行这里（11环境），然后执行查找b的操作
	//如果a取不到，不执行这里，将执行then第二个方法或catch方法
	//如果没写then第二个方法或catch的话将报错不继续执行
	return _this.getStorage('b');
},function(err){
	//12环境
	//如果a没取到,将执行这里（12环境），这里执行完毕后，
	//虽然这里没有return 应该就不继续往下面执行了
	//但是promise不一样，如果执行这里了，然后后面还有then，且这里（12环境）没有return值
	//则promise会返回一个promise.resolve的结果，这样就会跟着执行下面那个then方法（13环境）
	
	//只要这里一执行，有return和没有return区别是，有return的话你如果返回的是promise.reject
	//则不会执行下面(13环境)，13环境那个then如果没有第二个参数或没有catch在13环境外面的话会
	//报错，报完错就不继续执行,没有return的话promise会默认返回一个promise.resolve的结果，
	//也就是会执行下面13环境那个方法，只是13环境的data没有值，是undefined
	
	//执行了下面then的方法(13环境)就会执行 return _this.getStorage('c'); 
	//如果这个c没有，后面还有then的话，但是后面的then如果没有第二个方法，或后面没有接catch，
	//则会报错，如果c没有后面的then有第二个方法或catch则会继续往下执行
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
#### 如果catch和then两个方法都有会执行那个？
```javascript
_this.getStorage('a').then(function (data) {
	//a获取到了执行这里
},function(err){
	//a没有获取到执行这里
}).catch(function(){
	//a没有获取到执行这里
	//如果a没有获取到，且then没有第二个方法，则执行这里
	//如果then有第二个方法，则不执行这里
})
```
#### catch的使用1
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
}).catch(function(err){
	console.log(err);
	//如果a没获取到这里会执行打印a的错误信息，
	//如果a获取到了执行了return _this.getStorage('b') 但是b没获取到，则这里会执行打印b的错误信息
	//如果a,b都获取到了，c没有获取到则这里会打印c的错误信息
})
```
#### catch的使用2
```javascript
_this.getStorage('a').then(function (data) {
	//11环境
	return _this.getStorage('b');
}).catch(function(err){
	console.log(err);
	//如果a没有获取到，这里会打印a的错误信息
	//但是因为这里没有return 东西，则会返回一个promise.resolve的结果，就会跟着执行下面12环境那个方法
	//12环境方法会获取不到data值，然后会执行return _this.getStorage('c')，如果c也没有获取到
	//则会在最后那个catch里打印c的错误信息
}).then(function (data) {
	//12环境
  console.log('b获取成功，开始获取c');
  return _this.getStorage('c');
}).then(function (data) {
	//13环境
  console.log('c获取成功，开始获取d');
  return _this.getStorage('d');
}).then(function(data){
	//14环境
	//d获取成功
}).catch(function(err){
	console.log(err);
	//a获取不到不会在这个catch打印a的错误信息，会在上面那个catch打印a的错误信息
	
	//a获取到了,b没有获取到，则会在这里打印b的错误信息
	//如果a,b获取到了，c没有获取到，则会在这里打印c的错误信息
	//如果a,b,c获取到了，d没有获取到，则会在这里打印d的错误信息
})

```