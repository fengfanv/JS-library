# uni-app使用教程

### Vue的语法，微信小程序的Api

[uniapp简介](https://uniapp.dcloud.io/frame)
[uniapp条件编译](https://uniapp.dcloud.io/platform)
[uniapp组件](https://uniapp.dcloud.io/use?id=%e7%bb%84%e4%bb%b6)
#### uniapp开发规范
```
为了实现多端兼容，综合考虑编译速度、运行性能等因素，uni-app 约定了如下开发规范：

1、页面文件遵循 Vue 单文件组件 (SFC) 规范
2、组件标签靠近小程序规范，详见uni-app 组件规范
3、接口能力（JS API）靠近微信小程序规范，但需将前缀 wx 替换为 uni，详见uni-app接口规范
4、数据绑定及事件处理同 Vue.js 规范，同时补充了App及页面的生命周期
5、为兼容多端运行，建议使用flex布局进行开发
6、uni-app 内置了小程序的所有组件，比如： picker,map 等，需要注意的是原生组件上的事件绑定，需要以 vue 的事件绑定语法来绑定，如 bindchange="eventName" 事件，需要写成 @change="eventName"
```

#### uni-app 标准模板文件目录
```
├── components //用于放可重复使用的组件
│   ├── comtest.vue
├── pages //用于存放业务页面
│   ├── index
│   	├── index.vue
├── static //用于存放项目静态资源，如：图片 *注意：静态资源只能放在此处
├── App.vue //用于配置全局生命周期函数的监听和全局样式
├── main.js //vue入口文件
├── manifest.json //配置应用名称，appid，logo，版本等打包信息
├── pages.json //配置页面路由，导航条，选项卡等页面类信息
```

#### 基本使用
```html
<template>
	<view class="content">
		<!--条件编译，快捷键：输入“if”然后按tab-->
		<!-- #ifdef MP-WEIXIN -->
		<text>当前为微信小程序端</text>
		<!-- endif -->
		
		<!-- #ifdef APP-PLUS -->
		<text>当前为APP端</text>
		<!-- endif -->
		
		<!--for渲染和绑定事件-->
		<view v-for="(item,index) in news" :key="index" :data-postid="item.post_id" @tap="openinfo" >
			<view>
				<image :src="item.cover"></image>
			</view>
			<view>
				标题：{{item.title}}
			</view>
			<view>
				作者：{{item.author_name}}
			</view>
			<view style="border-bottom: 1px solid #ccc;">
				上传时间：{{item.created_at}}
			</view>
		</view>
		
		<!--微信小程序的原生组件-->
		<rich-text :nodes="content"></rich-text>
		
		
		<!--绑定style和class案例-->
		<view class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }">222</view>
		<view class="static" v-bind:class="[isActive ? activeClass : '', errorClass]">444</view>
		<view class="static" v-bind:class="[{ active: isActive }, errorClass]">555</view>
		
		<view v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">666</view>
		<view v-bind:style="[{ color: activeColor, fontSize: fontSize + 'px' }]">777</view>
		
	</view>
</template>
<script>
	export default{
		data(){
			return {
				news:[],
				title:"",
				content:""
			}
		},
		onLoad(){
			let _this = this;
			uni.request({//请求数据
				url:"https://unidemo.dcloud.net.cn/api/news",
				method:"GET",
				data:{},
				success:function(data){
					_this.news = data.data;
					/*写入缓存*/
					uni.setStorage({
						"key":"news",
						"data":JSON.stringify(data.data)
					});
					
				},
				fail:function(err){
					
				}
			})
			
			//使用条件编译
			//这段代码在app环境下才会被编译
			// #ifdef APP-PLUS
			var appid = plus.runtime.appid;
			console.log('应用的 appid 为：' + appid);
			// #endif
		},
		methods:{
			//绑定tap事件的方法
			openinfo(e){
				console.log(e)
				uni.navigateTo({
					url:'../info/info?postid='+e.currentTarget.dataset.postid
				})
			}
		}
	}
</script>
<style>
	.content{
		background:red;
	}
</style>
```