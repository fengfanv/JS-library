# 微信小程序及云开发

## 微信小程序

#### 使用 wx:if（框架 -> WXML语法参考）
```html
<view class="login_view" wx:if="{{login}}">
```
#### 使用 wx:for（框架 -> WXML语法参考）
[wx:for文档](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html)
```html
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
```
#### 使用 button 按钮（组件 -> 表单组件）
[button微信文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)
```html
<button open-type="getUserInfo">微信登录</button>
```
#### 使用 input 按钮（组件 -> 表单组件）
[input微信文档](https://developers.weixin.qq.com/miniprogram/dev/component/input.html)
```html
<input class="weui-input" maxlength="10" placeholder="最大输入长度为10" />
```
#### 单向数据绑定和双向数据绑定（指南 -> 小程序框架 -> 简易双向数据绑定）

单向，可在js里通过this.setData()改变value1的值，input里也会跟着变化

但是修改input里的值，不会影响data里value1
```html
<input value="{{value1}}" />
```
双向
```html
<input model:value="{{value1}}" />
```
#### 绑定事件
[事件系统文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)
```html
<view bindtap="handlerName">
    Click here!
</view>
```
给方法绑定数据
```html
<view bindtap="handlerName" data-keyname="11"></view>
<!--keyname就是绑定的数据名字,11是keyname的值-->
```
在方法内取这个数据
```javascript
Page({
	handlerName(e){
		console.log(e.currentTarget.dataset.keyname)
		//11
	}
}
```
阻止事件冒泡

冒泡   从里向外

除 bind 外，也可以用 catch 来绑定事件。与 bind 不同， catch 会阻止事件向上冒泡。
```html
<view id="outer" bindtap="handleTap1">
  outer view
  <view id="middle" catchtap="handleTap2">
    middle view
    <view id="inner" bindtap="handleTap3">
      inner view
    </view>
  </view>
</view>
```
例如在下边这个例子中，点击 inner view 会先后调用handleTap3和handleTap2(因为tap事件会冒泡到 middle view，而 middle view 阻止了 tap 事件冒泡，不再向父节点传递)，点击 middle view 会触发handleTap2，点击 outer view 会触发handleTap1。

#### 请求用户openid

前端代码（API -> 开放接口 -> 登录 -> wx.login）

[前端api文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)


```javascript
page({
	//登录方法
	onlogin(){
		wx.login({
	      success(res) {
	        if (res.code) {
	          //网络请求，请求后端接口
	          wx.request({
	            url: 'https://www.xxx.cn:1000/api/onlogin',
	            method: "get",
	            data: {
	              code: res.code
	            },
	            success: function (data) {
	              //后端请求成功
	            },
				fail:function(err){
				  //后端请求失败
				}
	          })
	        } else {
	          //console.log('登录失败！' + res.errMsg);
	        }
	      }
	    })
	}
})
```
后端代码（服务端 -> 登录 -> auth.code2Session）

[后端api文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)
```javascript
//Node.js
const https = require('https');

//微信用户登录，用code换openid
function getUserOpenid(code) {
    return new Promise(function (resolve, reject) {
        const option = {
            "hostname": "api.weixin.qq.com",
            "protocol": "https:",
            "port": 443,
            "method": "GET",
            "path": "https://api.weixin.qq.com/sns/jscode2session?appid=123456789&secret=123456789&js_code=" + code + "&grant_type=authorization_code"
        };
        const request = https.request(option, function (response) {
            let data = '';
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                resolve(data);
            });
        });
        request.on('error', function (err) {
            reject('换取 openid 失败！')
        });
        request.end();
    })
};

```
#### 写入和读取本地缓存（API -> 数据缓存）
[本地缓存api网址](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html)
```javascript
//如：写入本地缓存
//异步方法，同步见文档
wx.setStorage({
  key:"key",
  data:"value"
})

//如：读取本地缓存
//异步方法，同步见文档
wx.getStorage({
  key: 'key',
  success (res) {
    console.log(res.data)
  }
})

//清楚本地缓存
//异步，同步见文档
wx.clearStorage()
```
#### 选择图片（API -> 媒体 -> 图片 -> wx.chooseImage）
```javascript
page({
	getImage(){
		wx.chooseImage({
		  success (res) {
		    // tempFilePath可以作为img标签的src属性显示图片
		    const tempFilePaths = res.tempFilePaths
		  }
		})
	}
});
```
#### 发送网络请求（API -> 网络 -> 发起请求 -> wx.request）
[wx.request文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)
```javascript
page({
	postMessage(){
		wx.request({
		  url: 'test.php', //仅为示例，并非真实的接口地址
		  data: {
		    x: '',
		    y: ''
		  },
		  header: {
		    'content-type': 'application/json' // 默认值
		  },
		  success (res) {
		    console.log(res.data)
		  }
		})
	}
});
```
#### 上传文件（API -> 网络 -> 上传 -> wx.uploadFile）
[上传文件api](https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html)
```javascript
wx.chooseImage({
  success (res) {
    const tempFilePaths = res.tempFilePaths
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
      filePath: tempFilePaths[0],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success (res){
        const data = res.data
        //do something
      }
    })
  }
})
```
#### 跳转页面&路由（API -> 路由 -> wx.navigateTo）
[wx.navigateTo文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)

//详细见文档，有通过事件方法传值的案例

## 云开发

#### 云数据库基本操作（增删改查）
```javascript
// miniprogram/pages/index/index.js
Page({
    data: {},
    onLoad: function (options) {
		
    },
    //请求云数据库某集合(表)的数据
    getCloudDatabase() {
        //获取数据库引用
        const db = wx.cloud.database();
        const tabel1 = db.collection('tabel1')
        //请求写法方式1
        // tabel1.get({
        //     success:function(res){
        //         console.log(res);
        //     },
        //     fail:function(err){
        //         //请求数据出错！
        //         console.log(err);
        //     }
        // })
        //请求写法方式2,promise方式
        tabel1.get().then(function (res) {
            console.log(res);
        }).catch(function (err) {
            console.log(err);
        })
    },
    //请求数据库中某个集合(表)的某条数据1
    getCloudDatabaseWhere() {
        const db = wx.cloud.database();
        const tabel1 = db.collection('tabel1');
        tabel1.where({ "name": "wangtao" }).get().then(function (res) {
            console.log(res)
        }).catch(function (err) {
            console.log(err);
        })
    },
    //请求数据库中某个集合(表)的某条数据2
    getCloudDatabaseWhere2() {
        const db = wx.cloud.database();
        const list = db.collection('list');
        list.where({ "job": "web" }).get().then(function (res) {
            console.log(res)
        }).catch(function (err) {
            console.log(err);
        })
    },
    //给数据库中某个集合(表)插入一条数据
    addCloudDatabase() {
        const db = wx.cloud.database();
        const tabel1 = db.collection('tabel1');
        tabel1.add({
            data: {
                "name": "lilei"
            }
        }).then(function (res) {
            console.log(res)
        }).catch(function (err) {
            console.log(err);
        })
    },
    //更新数据库中集合（表）的某条记录的数据
    updateCloudDatabase() {
        const db = wx.cloud.database();
        const tabel1 = db.collection('tabel1');
        //这doc是记录中的 _id 
        //这有个问题，只能改变通过代码方式添加的数据，直接在库里建的记录不行
        // tabel1.doc('38d78ca75ed1d6c80008f1df68d7d5fd').update({
        //     data:{
        //         name:'齐天大圣'
        //     }
        // }).then(function(res){
        //     console.log(res);
        // }).catch(function(err){
        //     console.log(err);
        // })

        //更新集合（表）中某个记录的多个key的值
        //这有问题，报错，这个好像只能修改通过代码上传的，直接存云库操作的不行
		//这doc里的字符串是记录随机生成的_id
        tabel1.doc('4c5846c75ed1deb00008b66e08450e4b').set({
            data: {
                name: '孙悟空',
                job: "保唐僧西天取经"
            }
        }).then(function (res) {
            console.log(res);
        }).catch(function (err) {
            console.log(err);
        })

    },
    //删除集合（表）中某条记录
    delList() {
        const db = wx.cloud.database();
        const tabel1 = db.collection('tabel1');
		//这doc里的字符串是记录随机生成的_id
        tabel1.doc('4c5846c75ed1deb00008b66e08450e4b').remove().then(function (res) {
            console.log(res);
        }).catch(function (err) {
            console.log(err);
        })
    }
});
```
#### 云存储基本操作（上传文件下载文件删除文夹）
```javascript
Page({
    data: {
        imageUrl: ''
    },
    onLoad: function (options) {
        
    },
    //获取图片
    getImage() {
        let _this = this;
        wx.chooseImage({
            complete: (res) => {
                console.log(res);
                if (res.tempFiles !== undefined && res.tempFiles.length >= 1) {
                    //有图片
                    //获取图片信息
                    wx.getImageInfo({
                        src: res.tempFiles[0].path,
                        success(res2) {
                            //   console.log(res.width)
                            //   console.log(res.height)
                            //console.log(res2);
                            _this.setData({
                                imageUrl: res.tempFiles[0].path,
                                imageSize: res.tempFiles[0].size,
                                imageType: res2.type
                            })
                        }
                    })
                }
            },
        })
    },
    //上传图片
    uploadImage(){
        let _this = this;
        wx.cloud.uploadFile({
            filePath:_this.data.imageUrl,//被上传的文件地址
            cloudPath:new Date().getTime()+'.'+_this.data.imageType,//这里设置上传后，在云库里的地址，需要设置文件类型，否则无法显示
            success(res){
                console.log(res);
            },
            fail(err){
                console.log(err);
            }
        })
    },
    //下载云存储的文件
    downloadCloudFile(){
        wx.cloud.downloadFile({
            fileID:"cloud://cloud110.636c-cloud110-1302251157/1590820377274.png",
            success(res){
                console.log(res);
            },
            fail(err){
                console.log(err);
            }
        })
    },
    //删除云存储里的文件
    delCloudFile(){
        wx.cloud.deleteFile({
            fileList:['cloud://cloud110.636c-cloud110-1302251157/1590820377274.png'],
            success:function(res){
                console.log(res);
            },
            fail:function(err){
                console.log(err);
            }
        })
    }
});
```
#### 云函数基本操作

1、右键单击 微信开发者工具->资源管理器里项目文件夹 cloudfunctions|xxx环境 然后点击 新建node.js云函数
![](/image/chuangjian1.png)
2、创建完毕后 在右键单击 微信开发者工具->资源管理器里项目文件夹 cloudfunctions|xxx环境 点击 同步云函数列表 、、、(这里是为了防止部署到云上后，前端调用时找不到那个方法的问题)
![](/image/chuangjian2.png)

3、在创建好的云函数index.js文件夹里写业务代码
```javascript
//index.js
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    //event前端传来的数据
    const wxContext = cloud.getWXContext()
    console.log(wxContext);
	
	//return 把数据返回给前端
    return {
        // event,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
        sum:event.a+event.b
    }
}
```
4、部署到云上 右键点击 你创建的这个云函数文件夹 然后选择 上传并部署：云端安装依赖（不上传node_modules）
![](/image/chuangjian3.png)

#### 云函数操作数据库
```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    //配置云数据库
    traceUser:true,
    env:"云端id"
})

//引用数据库
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }

    return new Promise(function(resolve,reject){
		//云函数里操作数据库和在小程序里直接操作数据差不多
		//获取tabel（集合）表的数据
        db.collection('tabel1').get().then(function(res){
            resolve(res)
        }).catch(function(err){
            reject(err)
        })
    })
}
```
#### 云函数里http请求数据(这里是node环境，以前怎么在node里引用模块，写方法，在这里就怎么写)
```javascript
//index.js
// 云函数入口文件
const cloud = require('wx-server-sdk')

const http = reqire('http')

cloud.init()


function getData(option) {
    return new Promise(function (resolve, reject) {
        const request = http.request(option, function (response) {
            let data = '';
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                resolve(data);
            });
        });
        request.on('error', function (err) {
            reject('请求失败！')
        });
        request.end();
    })
};

//请求别的网站数据
getData({
   "hostname": "api.weixin.qq.com",
   "protocol": "http:",
   "port": 10000,
   "method": "GET",
   "path": "wangzhi"
});

// 云函数入口函数
exports.main = async (event, context) => {
    //event前端传来的数据
    const wxContext = cloud.getWXContext()
    console.log(wxContext);

    //return 把数据返回给前端
    return {
        // event,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
        sum:event.a+event.b
    }
}

```