# 学习Vue
vue-cli，vuex，vue-router

## jquery与vue区别
```
vue数据操作dom
jquery直接修改dom
```

## MVVM模式
```
MVVM 是 Model-View-ViewModel 的缩写

Model 代表数据模型，业务逻辑相关的数据对象
View 代表UI组件，它负责将数据模型转化成UI展现出来
ViewModel 是一个同步 View 和 Model 的对象

在MVVM架构下，View 和 Model 之间并没有直接的联系，
而是通过 ViewModel 进行交互，
Model 和 ViewModel 之间的交互是双向的， 
因此 View 数据的变化会同步到 Model 中，
而 Model 数据的变化也会立即反应到 View 上。
```
## Vue响应式原理
```
用 Object.defineProperty 方法赋予data里各个属性getter/setter来监听数据。当属性发生变动时 通知 订阅者 变化。

Observer：数据监听器，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者，内部采用Object.defineProperty的getter和Setter来实现的。

Compile：模板编译，它的作用对每个元素节点的指令和文本节点进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数。

Watcher：订阅者，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数。

Dep：消息订阅器，内部定义了一个数组，用来收集订阅者（Watcher），数据变动触发notify函数，再调用订阅者的update方法。

当执行 new Vue() 时，Vue 就进入了初始化阶段，
一方面 Vue 会遍历 data 选项中的属性，
并用 Object.defineProperty 赋予它们 getter/setter，实现数据变化监听功能；
另一方面，Vue 的指令编译器 Compile 对元素节点的指令进行扫描和解析，
初始化视图，并订阅 Watcher 来更新视图， 
此时 Wather 会将自己添加到消息订阅器中(Dep)，初始化完毕。
当数据发生变化时，Observer 中的 setter 方法被触发，
setter 会立即调用 Dep.notify()，
Dep 开始遍历所有的订阅者，
并调用订阅者的 update 方法，
订阅者收到通知后对视图进行相应的更新。
```
## Vue双向数据绑定原理
```
采用 数据劫持 结合 发布者-订阅者模式 的方式
通过Object.defineProperty()来劫持data里各个属性的setter，getter，在数据变动时 发布消息 给 订阅者。

如：当把一个普通js对象传给 Vue 实例来作为vue data 时，Vue 将遍历它的属性，
用 Object.defineProperty 方法赋予data里各个属性getter/setter来监听数据。当属性发生变动时 通知 订阅者 变化。
```
## 设置npm镜像源地址
```
npm config set registry https://registry.npm.taobao.org   //设置npm镜像源地址
npm config get registry //获取npm镜像源地址
```
## 获取和设置npm全局 npm_cache地址
```
npm config get cache			//获取地址
npm config set cache [地址]		//设置地址
```
## 获取和设置npm全局 node_global地址
```
npm config get prefix			//获取地址
npm config set prefix [地址]		//设置地址
```
## 安装脚手架
```
npm install vue-cli -g
```
## 卸载脚手架
如果是全局安装的脚手架，卸载时后面跟“-g”
```
npm uninstall vue-cli -g
```
## v-if和v-show
v-if,在html中是否加载（创建）元素
```html
<div v-if="true">已加载</div>
```
v-show,为元素设置display属性
```html
<div v-show="true">已显示</div>
```
## v-for
```html
<span v-for="(item,index) in arr">{{item}},{{index}}</span>
```
## v-text和v-html
因为使用{{data}}这种方式直接在页面内渲染数据，在网页加载慢的时候会出现会直接把{{}}直接渲染出来，所以为了避免这种问题推荐使用以下两种方式

v-text功能等于innerText
```html
<span v-text="data"></span>
```
v-html功能等于innerHTML
```html
<span v-html="data"></span>
```
## v-on 绑定事件
v-on:click等于@click
```html
<div v-on:click="name='新名字'">{{name}}</div>
<div v-on:click="fun()">{{name}}</div>
```
## v-model 双向数据绑定
```html
<input type="text" v-model="name">	//结果：输入的内容
<input type="checkbox" v-model="thisValue">    //结果：true或false
<input type="radio" value="我被选中了" v-model="thisValue">    //结果：value值
```
## v-bind 绑定元素属性
v-bind:href等于:href
```html
<img v-bind:src="url"/>
```
## Vue-API  Vue.config.devtools
获取vue环境当前是开发环境还是生产环境
```javascript
//javascript
console.log(Vue.config.devtools);
//true:开发环境
//false:生产环境
```
## 绑定行内样式
```html
<h1 :style="{'background':background,'font-size':'100px'}">I am Index</h1><!--绑定样式 不包引号则为data里属性-->
<h1 :style="h1Style">I am Index</h1><!--绑定样式 不包引号则为data里属性,,,
data:{
	h1Style:{
		'background':'red'
	}
}-->
```
## 绑定className样式
```html
<h1 :class="'normalWeight'">I am Index</h1> <!--有引号，为className，style样式名-->
<h1 :class="normalWeight">I am Index</h1> <!--没有有引号，为数据的属性名，需要data里有normalWeight这个属性-->
```
## 三元运算符和绑定多个样式
```html
<div v-bind:class="[isActive ? activeClass : '', 'errorClass','content']"></div>
<!--
	渲染结果：如果isActive为true则渲染 activeClass(外面不包引号则为数据属性) 'errorClass'(包引号为style样式名) 'content'这三个样式
			如果isActive为false则渲染 errorClass content这两个样式
-->
```
## vue代码结构
```javascript
export default {
	name:'demo',
	beforeCreate(){
		//初始化了一个Vue空的实例对象，这时只有默认的一些生命周期和默认事件，其它东西都为创建
		//这时data和methods中的数据没有初始化
		console.log("beforeCreate");
	},
	created(){
		//这时data和methods都已初始化好了
		//如果要调用methods中的方法或操作数据，最早只能在created中操作
		console.log("created");
	},
	beforeMount(){
		//这时模板已经在内存中编译好了，但尚未挂载到页面中去，此时页面还是旧的
		console.log("beforeMount");
	},
	mounted(){
		//这时整个vue实例已经初始化完毕，此时组件已经脱离创建阶段进入到运行阶段
		console.log("mounted");
	},
	beforeUpdate(){
		//这时页面中的数据还是旧的，但data中的数据是最新的
	},
	updated(){
		//这时页面中的数据和data中的数据都是最新的
	},
	beforeDestroy(){
		//这时vue实例已从运行阶段，进入到销毁阶段
		//这时data和methods以及过滤器，指令等都处在可用状态
		console.log("beforeDestroy");
	},
	destroyed(){
		//这时组件已经完全销毁，组件中的数据、方法、指令、过滤器等都已经不可用
		console.log("destroyed");
	},
	data () {
	    return {
			aaa: 'home',
			count:0,
			obj:{
				a:1
			}
	    }
	},
	methods:{
		addCount(){
			this.count++
		}
	},
	computed:{//计算属性
		countBB(){
			//调用当前方法返回当前count的值加1后的结果。所以顾名思义“计算属性”
			return this.count+1;
		}
	},
	watch:{//监听属性
		count:function(newValue,oldValue){
			//当count发生变化时执行
			//newValue最新的值
			//oldValue旧的值
		},
		//watch的一个特点是，最初绑定的时候是不会执行的，要等到属性改变时才执行监听
		obj:{
		    handler(newValue,oldValue){
				console.log(newValue);
		    },
		    immediate:true,//初次绑定时，就执行handler方法
		    deep:true,//实现深度监听,一般情况下，给obj重新赋值也就是obj的这个引用发生变化，watch才能监听到，
		    //但开启deep后修改a的值也能监听到，因为vue也给obj.a加上了监听，但是如果obj有好多key，开启后，会损耗性能
		}
		
	}
	
}


```
## 父子传值props
编写
```javascript
Vue.component('base-board', {
  props: ['value'],//使用props方式1
  props:{//使用props方式2
	value:{
	      type:String,//注意，这里String两边没有单引号啥的
	      required:true,//是否必填
	      default:'abc',//默认参数，当数据为 对象 或 数组 时，默认值需要以一个工厂函数返回，如: default:function(){return {"a":1}}
	      validator(a){//自定义检验方法，上面type检验类型，这里可以在加一些自定义判断，如value制必须是‘abc’
	        console.log(a);
	        return a=='abc'
	      }
	}
  },
  template: `
    <div>{{value}}</div>
  `
})
```
使用
```html
<!--v-bind绑属性值-->
<base-board v-bind:value="值"></base-board>
```
#### 子组件调用父组件绑定的方法$emit
编写
```javascript
Vue.component('base-button', {
	data:function(){
		return {}
	},
	props: ['value'],
	template: `
		<div>{{value}}</div>
		<button v-on:click="diaoyong">按钮</button>
	`,
	methods:{
		diaoyong:function(){
			//给这个组件绑定的自定义事件  方法1
			this.$emit('方法名1'[,传递的参数])
		}
	}
})
```
使用
```html
<base-button v-on:方法名1="父组件里方法"></base-button>
```
## 自定义部组件绑v-model属性
编写
```javascript
//javascript
Vue.component('peng-input',{
    data:function(){
        return {}
    },
    props:["value"],
    template:`
		<input
		v-bind:value="value"
		v-on:input="$emit('input',$event.target.value)"
		/>`
})
```
使用
```html
//自定义组件peng-input
<peng-input v-model="input_text"></peng-input>
```
## vue动画
css样式
```css
/*打开过渡时*/
.slide-fade-enter-active {
    transition: all 0.5s;
}
/*关闭过渡时*/
.slide-fade-leave-active {
    transition: all 0.15s linear;
}
/*打开开始时，关闭结束时*/
.slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(100px);
    opacity: 0.5;
}
```
使用
```html
<transition name="slide-fade">
    <span v-if="isPageShow"></span>
</transition>
```
## 创建一个脚手架项目
```
vue init webpack 项目名称
```
## 项目里安装模块
"-g"安装到全局，

"--save"表示在package.json文件中（dependencies）记录下载包的版本信息，**一般项目中安装依赖包时都必须加“--save”**

"--save-dev"下载开发依赖包，上一条命令是下载生产依赖包
```
npm install 模块名
```
## vue开发环境解决跨域问题
1、修改项目“config/index.js”文件
```javascript
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {							//匹配的路径								
        target: "http://xxx.com",		//跨域的地址
        changeOrigin: true,				//允许跨域
        pathRewrite: {
          '^/api': '/xpg'				//路径重写：请求地址'/api/abc'转化成'/xpg/abc'
        }
      }
    },
    //...
  }
  //...
}
```
## 在vue里使用axios
1、在项目内创建一个文件夹request

2、在文件夹内创建一个index.js文件

index.js
```javascript
import axios from 'axios';
import qs from 'qs';

//import store from '@/store' //导入 vuex

// 环境的切换
// if (process.env.NODE_ENV == 'development') {
	//开发环境
// 	axios.defaults.baseURL = '';
// } else if (process.env.NODE_ENV == 'debug') {
	//测试环境
// 	axios.defaults.baseURL = '';
// } else if (process.env.NODE_ENV == 'production') {
	//生产环境
// 	axios.defaults.baseURL = '';
// }

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(function(config){
	// console.log("请求");
	// console.log(config);
	// console.log("请求");
	return config;
},function(error){
	return Promise.error(error);
});

// 响应拦截器
axios.interceptors.response.use(function(response){
		if (response.status === 200) {
			return Promise.resolve(response.data);
		} else {
			return Promise.reject(response);
		}
	},
	// 服务器状态码不是200的情况    
	function(error){
		if (error.response.status) {
			//error.response.status  401,403,404
			return Promise.reject(error.response);
		}
	}
);

export default axios;

```
vue main.js
```javascript
//引入request配置
import a_request from './request'
//创建一个vue原型方法
Vue.prototype.$request = a_request;
```
项目中使用
```javascript
export default {
  name: 'home',
  mounted(){
	//get请求
    this.$request.get('http://localhost/abc',{
      params:{
        a:1
      }
    })
    .then(function(data){
      console.log(data)
    }).catch(function(err){
      console.log(err)
    });
	//post请求
    this.$request.post('http://localhost/testPost',{
      a:1
    })
    .then(function(data){
      console.log(data)
    }).catch(function(err){
      console.log(err)
    })
  },
  data () {
    return {}
  },
  methods:{}
}
```
#### 在vue里使用axios的小窍门
1、把所有接口都写在一个文件内，方便管理接口

1.1、在request文件夹下创建一个query.js文件，写下如下代码
```javascript
//query.js文件
import request from './index.js';

export function queryOrder() {
	
	let params = new URLSearchParams();//解决post方式后台接收不到参数问题
	params.append("orderid", orderid);
	
	return request.post("http://localhost:5000/queryOrder", params)
	.then(function (res) {
		return Promise.resolve(res);
	}).catch(function (err) {
		return Promise.reject(err);
	});
}

export function queryOrder2() {
	//...
}
...
```
1.2、在项目中使用
```html
<template>
  <div></div>
</template>
<script>
import { queryOrder } from "../request/query.js";
export default {
  data: function () {
    return {this.a:1};
  },
  mounted() {
	  queryOrder(this.a).then((res)=>{
		  console.log(res);
	  }).catch((err)=>{
		  console.log(err);
	  })
  },
  methods: {},
};
</script>
<style scoped>
</style>
```
## vue-router使用
1、在项目内创建一个文件夹router

2、在文件夹内创建一个index.js文件

index.js
```javascript
import Vue from 'vue'
import Router from 'vue-router'

import home from '@/components/home'
import index from '@/components/index'
import frame from '@/components/frame'

import a from '@/components/a'
import b from '@/components/b'
import c from '@/components/c'
import d from '@/components/d'

Vue.use(Router)


const router = new Router({
  routes: [
	//重定向的地址
    { path: '/', redirect: '/home' },
	//普通路由地址
	//跳转到home组件
    {
      path: '/home',
      name: 'home',
      component: home
    },
	//跳转到index组件
	{
	  path: '/index/:id',//:id配置路由匹配的参数
	  name: 'index',
	  component: index
	},
	//子路由案例
    {
      path: '/pages',
      component: frame,
      children: [
		//当跳转到   /pages/a会加载这个父组件和子组件
        {
          path: 'a',
          components: {
            content: a
          }
        },
		//当跳转到   /pages/b会加载这个父组件和子组件
        {
          path: 'b',
          components: {
            content: b
          }
        },
		//当跳转到   /pages/c会加载这个父组件和子组件
        {
          path: 'c',
          components: {
            content: c
          }
        },
		//当跳转到   /pages/d会加载这个父组件和子组件
        {
          path: 'd',
          components: {
            content: d
          }
        },
      ]
    }
  ]
})

//全局导航守卫
router.beforeEach((to, from, next) => {
  console.log('to:');//要到哪里去
  console.log(to);
  
  console.log('from:');//从什么地方来
  console.log(from);
  
  if(to.path==='/index'){//当地址为/index时做处理
    if(to.query.id!==undefined){
        console.log('有id值，继续');
        next();
    }else{
        console.log('无id值，跳转login页面');
        next('/login');
    }
  }else{
    next();
  }
})

export default router

```
vue main.js
```javascript
//引入router配置
import router from './router'

new Vue({
  el: '#app',
  router,//挂载到vue里
  components: { App },
  template: '<App/>'
})
```
项目中使用
```javascript
this.$router.push({"path":'/home'});//地址    /home

this.$router.push({"path":'/home',query:{"a","dad"}});//地址    /home?a=dad

this.$route.query  //获取query里面传过来的值

this.$router.go(-1);//和JavaScript里的history.go(-1)功能基本一样

//跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录
this.$router.replace("/home");

this.$router.push({"path":'/index',params:{"id","dad"}});//地址    /home/dad   ,使用这种需要预先配置好，才能使用

this.$route.params  //获取params里面传过来的值

```
## vuex使用
1、在项目内创建一个文件夹store

2、在文件夹内创建一个index.js文件

index.js
```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// state：存储的数据（状态） 在是项目使用 this.$store.state.参数名
// getters：对数据获取之前的再次编译，可以理解为state的计算属性。我们在组件中使用 $sotre.getters.方法名
// mutations：修改数据（状态），并且是同步的。在组件中使用$store.commit('方法名',params)
// actions：官方不建议我们直接调用mutations下方法改数据，所以提供了另一种方法，主要用于调用mutations下的方法，在组件中使用是$store.dispatch('方法名')

const store = new Vuex.Store({
	//数据存在里面
	state: {
		count: 0
	},
	getters:{
		getStateCount:function(state){
			return state.count+1;
		}
	},
	mutations: {
		addCount(state, n = 0) {
			state.count += n;
		}
	},
	actions:{
		addFun:function(context){
			context.commit("addCount",1);
		}
	}
})

export default store;

```
vue main.js
```javascript
//引入
import store from './store'

new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})

```
在项目中使用
```javascript
//直接获取state值
this.$store.state.count;

//从getters获取的数据
this.$store.getters.getStateCount;

//调用mutations里方法修改数据
this.$store.commit("addCount",1);

//调用actions下方法
this.$store.dispatch("addFun");
```
## vue中自定义插件（利用Vue.extend实现一个插件）
文件目录

![](/images/img-1.png)

1、在目录下创建一个plugin文件夹

2、把写完的.vue格式的文件放到里面

3、创建一个index.js文件

4、写代码

**插件配置文件（/plugin/index.js）**
```javascript
//javascript

//引入组件
import loadingFrom from './loading'
import alertFrom from './alert'

export default {
    install:function(Vue,options){
		// 利用扩展实例构造器生成一个Vue的子类
		const loading = Vue.extend(loadingFrom);
		// 生成一个该子类的实例
		const loading_content = new loading();
		// 将这个实例挂载在我创建的div上
		loading_content.$mount(document.createElement('div'));
		// 并将此div加入全局挂载点内部
		document.body.appendChild(loading_content.$el);
		//在vue原型上写方法，调用使
		Vue.prototype.loading_main = {
		    showLoading:function(callback){
		        loading_content.isShow = true;
				//给插件模板里绑一个回调函数，
				//可利用callback向使用的地方返回参数
				//可利用callback执行一些业务操作
				loading_content.callback = callback;
		    },
		    hideLoading:function(callback){
		        loading_content.isShow = false;
				loading_content.callback = callback;
		    }
		}
	}
}
```
**插件模板（/plugin/alert.vue）**
```html
<template>
  <div v-if="isShow">
	组件
	<button @click="onButtonOk()">确认</button>
  </div>
</template>

<script>
export default {
  name: "alert",
  data() {
    return {
      isShow:false,
    }
  },
  methods:{
	onButtonOk(){
		this.callback&&this.callback('你单击了确定按钮');
		//给调用的地方返回一个提示。
	}
    callback(){}//代绑定的callback
  }
};
</script>
<style scoped>

</style>
```
在程序里调用时
```javascript
//javascript
Vue.loading_main.showLoading(function(data){
	//通过绑定callback，返回某些操作后需要返回的信息
	
	//也可以利用callback，执行某些操作
	//比如这是个弹窗插架，你需要在单击插架ok按钮后执行某些操作
	//这时，你可以利用callback来执行这些操作。
});
```
## 其它问题
#### import from与import()区别是什么
```
import from
静态加载，
在代码编译时就运行，
所以不能在写在代码块里，
因为export和import from命令只能在模块的顶层，
如：以下代码，会报错，因为import xxx from 'xxx'命令会被JS引擎静态分析，先于模块内的其他语句执行，套在外面的if不会被执行，所以会报错
if(true){
	import xxx from 'xxx'
}

-----

import() 
动态加载，
会返回一个Promise对象，
一般用于组件懒加载
如：const Index = () => import('../pages/index.vue');

```
#### 在methods的方法内改变data里面object类型数据
```javascript
export default {
	name: "test",
	data() {
		return {
			username:'Ian',
			id:1,
			check: {
				account: "",
				password: ""
			}
		}
	},
	methods: {
		change() {
			this.$set(this.check, "account", "");//改变check下account的值
		}
	}
}
```
#### 想在data的某个属性下使用data中的某个数据
```html
<template>
  <div>hahah</div>
</template>
<script>
var vm = null;//设置
export default {
  name: "index",
  created() {
    vm = this;
  },
  data: function () {
    return {
		name:'aaa',
		content:{
			key:vm.name//通过使用全局变量方法，为content.key赋值
		}
	};
  },
  mounted(){},
  methods:{}
};
</script>
<style scoped>
</style>
```
#### vue服务器渲染（ssr），区分当前是浏览器环境还是node环境
```html
<template>
  <div>hahah</div>
</template>
<script>
var vm = null;
var node = true;
if (process.browser) {
  //浏览器环境
  node = false;
}
export default {
  name: "index",
  created() {
    vm = this;
  },
  data: function () {
    return {};
  },
  mounted(){},
  methods:{}
};
</script>
<style scoped>
</style>
```