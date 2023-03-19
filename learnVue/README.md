# 学习Vue
vue-cli，axios，vue-router，vuex

## jquery与vue区别
```
vue数据操作dom
jquery直接修改dom
```
## 更新变化
```
1、双向数据绑定使用的技术不一样
//vue2用的是Object.defineProperty()，仅能监听对象属性的变化，对象有多个属性，需要给对象的每个属性都绑定这个方法

//vue3用的是Proxy，Proxy可以直接监听对象变化，而不是属性，还可以监听数组的变化

2、创建实例的方式不一样
//vue2
new Vue({
	el:"#app",
	data(){return {}}
})

//vue3
Vue.createApp({
	data(){return {}}
}).$mount("#app");

3、声明周期函数变化
beforeDestroy -> beforeUnmount
destroyed -> unmounted

4、组件内新增一个emits定义方式
可以用这个来验证子传父时，验证数据是否正确

5、脚手架创建项目命令变化 
2版本：vue init webpack 项目名
最新版：vue create 项目名

6、启动项目的命令发生变化
npm run dev -> npm run serve

7、脚手架项目 目录变化
static -> public
删除了config，build配置脚手架文件，可用vue.config.js代替了

8、vue3版本引用vue-router和vuex的创建方式发生变化
vue3引用的vue-router创建是通过createRouter创建的，之前是直接new Router()
vue3引用的vuex创建是通过createStore创建的，之前是vuex.store方法创建

9、新出了一个组合式api
组合式api方式，主要就是已setup()方法体现，让我们不必向以前那样写代码，
如：数据必须写在data里，操作data数据里方法得写在methods里的，
这样写，操作的数据少还行，要是多了，会导致代码很难阅读，
数据和方法没有写在一起，代码很不内聚，
为了解决这个问题，出了这个组合式api，这个就是比较省事，在setup方法，
里定义数据，定义方法，然后暴露出去，就可以使用
补充：之前数据定义在data，操作数据的方法定义在methods里，这种方式叫选项式api
```
## MVVM设计模式
```
MVVM是一种框架设计模式（软件架构模式），vue，react都是基于这种设计模式

MVVM把 UI用户界面 与 业务逻辑 分开，这样开发者只需关注
业务逻辑，不需要操作dom

MVVM 是 Model-View-ViewModel 的缩写

Model 业务逻辑相关的数据对象
View 视图层，负责将数据转化成UI展现出来
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
通过Object.defineProperty()来劫持data里各个属性的setter，getter，
在数据变动时 发布消息 给 订阅者。

如：当把一个普通js对象传给 Vue 实例来作为vue data 时，Vue 将遍历它的属性，
用 Object.defineProperty 方法赋予data里各个属性getter/setter来监听数据。
当属性发生变动时 通知 订阅者 变化。
```

1、Object.defineProperty 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
```javascript
var obj = {}
Object.defineProperty(obj, "a", {
  set: function (newValue) {
    console.log("监听到给a赋值:" + newValue);
  },
  get: function () {
    console.log("监听到要读取a的值");
    return 9999;//这里不写return，下面obj.a时将会打印undefined
  }
})
obj.a = 9999;//将触发set方法
console.log(obj.a);//将触发get方法
```

2、Proxy
```javascript
var obj = {}
//new一个Proxy然后返回一个代理对象
var proxyObj = new Proxy(obj,{
	set:function(target,attr,value){
		console.log('111');
		target[attr] = value;
	},
	get:function(target,attr,receiver){
		console.log('222');
		return target[attr];
	}
})

proxyObj.name = 123;//触发set方法
console.log(proxyObj.name);//get方法
```
## 设置npm镜像源地址
```
npm config set registry https://registry.npm.taobao.org   //设置npm镜像源地址
npm config get registry //获取npm镜像源地址
```
## 获取和设置npm全局 npm_cache地址
```
npm config get cache		//获取地址
npm config set cache [地址]	//设置地址
```
## 获取和设置npm全局 node_global地址
```
npm config get prefix		//获取地址
npm config set prefix [地址]	//设置地址
```
## npm安装模块

"-g"表示安装到全局

"--save"表示安装包时，会把包的信息记录到package.json文件中（dependencies）下

"--save-dev"表示安装包时，会把包的信息记录到package.json文件中（devDependencies）下

在安装包时，不加 -g，--save，--save-dev，默认会执行 --save 的操作，将包的信息记录到（dependencies）下

保证项目正常运行或生产环境下需要的包信息，会被记录到（dependencies）下

项目开发时需要的一些工具包，如单元测试包，会被记录到（devDependencies）下。项目生产打包时，不会将（devDependencies）下的包 打包进去

```
npm install 模块名
```
## 查看版本
```
vue -V
```
## 安装脚手架2版本
```
npm install vue-cli -g //安装脚手架2版本脚手架的命令
```
## 卸载脚手架2版本
如果是全局安装的脚手架，卸载时后面跟“-g”
```
npm uninstall vue-cli -g //卸载脚手架2版本的命令
```
## 脚手架2版本创建一个项目
```
vue init webpack 项目名称
```
## 脚手架3或更高版本安装
```
npm install @vue/cli -g
```
## 脚手架3或更高版本卸载
```
npm uninstall @vue/cli -g
```
## 脚手架3或更高版本创建一个项目
```
vue create 项目名称
```
## 脚手架2版本开发环境解决跨域问题
1、修改项目“config/index.js”文件
```javascript
'use strict'

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
## 脚手架3或更高版本开发环境解决跨域问题
1、最新版本脚手架不提供build、config等配置项目的文件夹，此版本用vue.config.js代替
```javascript
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',//解决打包后访问不到资源文件的问题
		
    devServer: {//解决跨域问题
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:80/', //设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true, //允许跨域
                pathRewrite: {
                    '^/api': '/' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://localhost:8090/users'，直接写‘/api/users’即可
                }
            }
        }
    }
}
```
## Vue-API  Vue.config.devtools
获取vue2环境当前是开发环境还是生产环境
```javascript
//javascript
console.log(Vue.config.devtools);
//true:开发环境
//false:生产环境
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
for in 与 for of 区别： for in 可以渲染数组或对象 for of 只能渲染数组，for in遍历的是键或坐标，for of遍历的是值

<span v-for="(item, index) in arr">{{ item }},{{ index }}</span>

<span v-for="(item, index) of 99" v-if="item != 2">{{ item }}</span>
<!-- 注意：这个循环是从1开始的 -->
<!-- 注意2：v-for 与 v-if 写在一个元素里，这时v-for的优先级高于v-if，在这里v-if会失效 -->

<!--解决上面的问题，v-for写在template模板标签上，这个template模板标签是个空的占位符，不会被渲染到页面上-->
<template v-for="(item, index) of 99">
  <span v-if="item != 2">{{ item }}</span>
</template>
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
<div v-on:click="fun">{{name}}</div>
<div v-on:click="fun(),fun2()">{{name}}</div>
<!--绑定多个事件，方法名后面在这里必须加上括号-->
```
事件修饰符
```html
1、stop修饰符 阻止事件向父级事件冒泡
e.stopPropagation()
<div @click="handle1">
  <button @click.stop="handle">我是按钮</button>
  <!--点击这个按钮只会触发handle方法，不会触发handle1方法-->
</div>

2、prevent修饰符 阻止元素默认行为
e.preventDefault()
<button type="submit" @click.prevent="handle">我是按钮</button>
<!--这时点击 我是按钮 只会单纯触发handle方法。不会有form表单的提交行为-->

3、self修饰符 只有点击自己的时候才会被执行
<div @click.self="handle1">
  aaaaa
  <!--点击aaa时只会触发handle1方法，不会触发handle方法-->
  <button @click="handle">我是按钮</button>
  <!--这时点击 我是按钮 handle1方法不会被触发-->
</div>

4、capture修饰符 改成捕获模式，默认冒泡模式
<div @click.capture="handle1">
  <button @click="handle">我是按钮</button>
  <!--经测试，点击我是按钮，会先触发handle1方法，然后在触发handle方法-->
  <!--经测试，如果capture绑定在handle方法上，这时点击我是按钮，会先触发handle方法，然后在触发handle1方法-->
</div>

5、once修饰符 事件只执行一次
<button @click.once="handle">我是按钮</button>
<!--这时点击我是按钮，会先触发一次handle1方法，在次点击就不会触发方法-->
```
## v-model 双向数据绑定
```html
<input type="text" v-model="name"><!--结果：输入的内容-->
<input type="checkbox" v-model="thisValue"><!--结果：true或false-->
<input type="radio" value="我被选中了" v-model="thisValue"><!--结果：value值-->
```
v-model修饰符
```html
1、lazy修饰符 用户按回车 或 失去焦点时才将数据写到data中
<input type="text" v-model.lazy="text">
<!--用户按回车 或 input框失去焦点时才将数据写入data-->

2、number修饰符 将用户输入的数值字符串转成成数值
<input type="text" v-model.number="num">

3、trim修饰符 去除字符串两边多余的空格
<input type="text" v-model.trim="text">
```
## v-bind 绑定元素属性
v-bind:href等于:href
```html
<img v-bind:src="url"/>
```
## 绑定行内样式
```html
<h1 :style="{'background':background,'font-size':'100px'}">I am Index</h1>
<!--绑定样式 不包引号则为data里属性-->
<h1 :style="h1Style">I am Index</h1>
<!--绑定样式 不包引号则为data里属性
data: {
    h1Style: {
      background: "red"
    }
}
-->
```
## 绑定class样式
```html
<h1 :class="'normalWeight'">I am Index</h1>
<!--有引号，为class，style样式名-->

<h1 :class="normalWeight">I am Index</h1>
<!--没有有引号，为数据的属性名，需要data里有normalWeight这个属性-->
```
## 三元运算符和绑定多个样式
```html
方式1 通过数组
<div v-bind:class="[isActive ? activeClass : '', 'errorClass','content']"></div>
<!--如果isActive为true则渲染 activeClass(外面不包引号则为数据属性) 'errorClass'(包引号为style样式名) 'content'这三个样式。如果isActive为false则渲染 errorClass content这两个样式-->

方式2 通过对象
<div v-bind:class="{color1:true,background1:true}"></div>
<!--这时这个div会被添加一个名为color1的class样式，和一个为名为background1的class样式。如果color1为false，则不会添加名为color1的样式-->
```
## vue代码结构
```javascript
export default {
  name: "demo",
  beforeCreate() {
    //初始化了一个Vue空的实例对象，这时只有默认的一些生命周期和默认事件，其它东西都为创建
    //这时data和methods中的数据没有初始化
    console.log("beforeCreate");
  },
  created() {
    //这时data和methods都已初始化好了
    //如果要调用methods中的方法或操作数据，最早只能在created中操作
    console.log("created");
  },
  beforeMount() {
    //这时模板已经在内存中编译好了，但尚未挂载到页面中去，此时页面还是旧的
    console.log("beforeMount");
  },
  mounted() {
    //这时整个vue实例已经初始化完毕，此时组件已经脱离创建阶段进入到运行阶段
    console.log("mounted");
  },
  beforeUpdate() {
    //这时页面中的数据还是旧的，但data中的数据是最新的
  },
  updated() {
    //这时页面中的数据和data中的数据都是最新的
  },
  beforeDestroy() {
    //这时vue实例已从运行阶段，进入到销毁阶段
    //这时data和methods以及过滤器，指令等都处在可用状态
    console.log("beforeDestroy");
  },
  destroyed() {
    //这时组件已经完全销毁，组件中的数据、方法、指令、过滤器等都已经不可用
    console.log("destroyed");
  },
  beforeUnmount() {
    //vue3生命周期，用来代替2生命周期beforeDestroy，调用app.unmount()可触发该生命周期
    console.log("beforeDestroy");
  },
  unmounted() {
    //vue3生命周期，用来代替2生命周期destroyed，调用app.unmount()可触发该生命周期
    console.log("unmounted");
  },
  data() {
    return {
      aaa: "home",
      count: 0,
      obj: {a: 1},
    };
  },
  methods: {
    addCount() {
      this.count++;
    },
  },
  computed: {
    //计算属性
    countBB() {
      //调用当前方法返回当前count的值加1后的结果。所以顾名思义“计算属性”
      return this.count + 1;
    },
  },
  watch: {
    //监听属性
    count: function (newValue, oldValue) {
      //当count发生变化时执行
      //newValue最新的值
      //oldValue旧的值
    },
    //watch的一个特点是，最初绑定的时候是不会执行的，要等到属性改变时才执行监听
    obj: {
      handler(newValue, oldValue) {
        console.log(newValue);
      },
      immediate: true, //初次绑定时，就执行handler方法
      deep: true, //实现深度监听,一般情况下，给obj重新赋值也就是obj的这个引用发生变化，watch才能监听到，
      //但开启deep后修改a的值也能监听到，因为vue也给obj.a加上了监听，但是如果obj有好多key，开启后，会损耗性能
    },
  },
};
```
## methods与computed与watch的区别
```
1、methods 方法
methods有些时候，可以干和computed一样的事，但在使用methods方法时，每次使用都需要重新执行方法，这点没有computed好。而使用computed数据的时候，所依赖的数据没有发生变化，会读取缓存
methods方法需要主动去调用

2、computed 计算属性
当某一个数据受多个数据影响时，这时用计算属性
计算数据性有缓存。如这个数据被计算后，会被存入缓存里。如依赖的数据没有发生变化，使用数据时是直接从缓存里拿。只有当依赖的别的数据有发生变化时，这个数据才会被重新计算
computed不适合做异步操作
computed方法内必须得写return

3、watch 监听
当某一条数据影响多条数据的时候，使用watch
watch某些时候，可以干和computed一样的事，但在是需要额外的在data里定义一个属性来接收值，watch监听的数据发生变化，每次变化都需要重新执行方法，这点没有computed好
watch监听的数据发生变化，每次变化都需要执行函数
watch比较适合做异步的操作，如某个数据发生变化后，想让这个数据变化的2秒后，控制一个弹窗弹出一个提示
```
## computed里的get，set

vue computed默认写法下是没有set方法的，只有get方法

```html
<template>
  <div>result：{{result}}</div>
</template>
<script>
export default {
  data() {
    return {
      a: 20,
      b: 100,
    };
  },
  mounted(){
    console.log(this.result);
    /*
    打印如下内容：
    1、get方法执行了（这个其实在调用console.log(this.result)之前就被打印出来了，也就是vue加载好后就调用了get方法，然后把结果存入了vue缓存里）
    2、120
    */
   this.result = '10 20';
   /*
    打印如下内容：
    1、set方法执行了
    2、get方法执行了

    vue检测到result被修改，于是调用set方法，打印 set方法执行了，并且把 10 和 20 分别赋值给 a 和 b，vue检测到计算result所依赖的 a 和 b 被修改了，于是重新触发get方法，打印 get方法执行了，并且把计算出来的新的 result 的值渲染到页面上
    */
  },
  computed:{
    result:{
      get(){
        console.log('get方法执行了');
        return this.a + this.b;
      },
      set(value){
        console.log('set方法执行了');
        let arr = value.split(' ')
        this.a = arr[0]
        this.b = arr[1]
      }
    }
  }
};
</script>
<style scoped>
</style>
```
## 父组件和子组件生命周期函数执行顺序
```
加载渲染过程：
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

子组件更新过程：
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

父组件更新过程：
父 beforeUpdate -> 父 updated

销毁过程：
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed
```
## vue组件
```javascript
//vue2写法
Vue.component('base-board', {
  template: `<div>1111</div>`
});

//vue3写法
const app = Vue.createApp({
  template: `
    <h1>Vue3实例</h1>
    <a1 /><!--全局组件-->
    <base-board /><!--局部组件-->
  `,
  components: {
    baseBoard //这里局部组件需要在这里绑定一下，才能使用。这里虽然是驼峰写法，但在html中使用时，需要转换成<base-board />这里因为在js变量中不能使用 “ - ”，html组件可以使用。这样做可以有个区分
  }
})
//全局组件，只要定义了，处处可以使用，性能不高，但是使用起来简单。为什么性能不高，全局组件就是你一旦定义了，就会占用系统资源，不管你用不用

app.component('a1', {
  template: `<h1>我是全局组件</h1>`
});
//局部组件，定义了，不占资源。只有使用了才占资源
const baseBoard = {
  template: `<div>局部组件</div>`
};
app.$mount('#app');//挂载vue3实例
```
## 组件单向数据流
```
单向数据流概念：父级 prop 的更新会向下流动到子组件中，但是反过来则不行
有单向数据流，可以防止从子组件意外改变父级组件的状态，从而防止你应用的 数据流 难以理解

一个被多次复用的子组件，子组件改变了引用的父组件数据，没有单项数据流机制，其它子组件的数值也跟着变化，这会让页面内这个多次被复用的子组件的数据耦合在一起，没办法独立使用
```
## 父子传值props

编写
```javascript
Vue.component('base-board', {
  props: ['value'],//使用props方式1
  props: {//使用props方式2
    value: {
      type: String,//注意，这里String两边没有单引号啥的
      required: true,//是否必填
      default: 'abc',//默认参数，当数据为 对象 或 数组 时，默认值需要以一个工厂函数返回，如: default:function(){return {"a":1}}
      validator(a) {//自定义检验方法，上面type检验类型，这里可以在加一些自定义判断，如value制必须是‘abc’
        console.log(a);
        return a == 'abc'
      }
    }
  },
  template: `<div>{{value}}</div>`
})
```
使用
```html
<!--v-bind绑属性值-->
<base-board v-bind:value="值"></base-board>
```
## 子组件调用父组件绑定的方法$emit

编写
```javascript
Vue.component('base-button', {
  data: function () {
    return {}
  },
  props: ['value'],
  emits: ['方法名1'],//vue3新增，也不是必须写，这是一个类似props的东西，主要是定义子传父事件的。vue2不需要。
  emits: {//emits写法2，对子传父的值进行自定义校验，如果这时这个value小于10，则会被警告
    '方法名1'(value) {
      return value > 10 ? true : false
    }
  },
  template: `
		<div>{{value}}</div>
		<button v-on:click="diaoyong">按钮</button>
	`,
  methods: {
    diaoyong: function () {
      //给这个组件绑定的自定义事件  方法1
      this.$emit('方法名1'[, 传递的参数])
    }
  }
})
```
使用
```html
<base-button v-on:方法名1="父组件里方法"></base-button>
```
## 在父组件中使用子组件中的方法或数据

子组件
```html
<template>
  <div>我是子组件</div>
</template>
<script>
export default {
  props: ["value"],
  data: function () {
    return {
      a: 120,
    };
  },
  methods: {
    alert(name, value) {
      console.log("触发子组件中的方法");
      console.log(name, value);
    },
  },
};
</script>
<style scoped>
</style>
```
父组件
```html
<template>
  <div>父组件</div>
  <baseButton ref="baseButton" />
</template>
<script>
//引入子组件
import baseButton from "./components/BaseButton.vue";
export default {
  data: function () {
    return {};
  },
  components: {
    baseButton,
  },
  mounted() {
    this.$baseButton = this.$refs.baseButton;

    this.$baseButton.alert("父组件", 1); //调用子组件里方法
    console.log(this.$baseButton.a); //打印 120
  },
};
</script>
<style scoped>
</style>
```
## 组件slot（插槽）

编写
```javascript
//一个插槽
Vue.component('baseButton', {
  template: `
  <div>
      <p>我是组件</p>
      <slot></slot>
  </div>`
})

//多个插槽
Vue.component('baseButton', {
  template: `
  <div>
      <p>我是组件</p>
      <slot name="one"></slot> //多个插槽需要在slot标签上指定name来区分，
      <slot name="two"></slot>
  </div>`
})
```
使用
```html
<!--一个插槽-->
<base-button>
  <input type="text" :value="inputValue" />
</base-button>

<!--多个插槽-->
<base-button>
  <template v-slot:one>
    <input type="text" :value="inputValue" />
  </template>
  <template v-slot:two>
    <input type="text" :value="inputValue + 2" />
  </template>
</base-button>
```
## 组件Non-props属性

给子组件v-bind绑数据，子组件如果不props接收数据，绑的数据会变成子组件的属性，子组件接收了数据就不会变成子组件的属性。这也就是为什么可以给组件或标签绑定style样式。
```html
<!--假如value1这时是1，且组件没有接收这个index值，这时组件的跟标签是div-->
<base-button :index="value1"></base-button>
```
渲染结果
```html
<div index="1"></div>
```
## 自定义部组件绑v-model属性
编写
```javascript
Vue.component('peng-input', {
  data: function () {
    return {}
  },
  props: ["value"],
  template: `
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
## 组件.sync修饰符
子组件
```html
<template>
  <div>我是子组件</div>
  <button @click="updateData">更新数据</button>
</template>
<script>
export default {
  props: ["value"],
  data: function () {
    return {};
  },
  methods: {
    updateData(){
      //因为value是通过.sync绑定进来的，所以可以使用下面，这种方式更新value
      this.$emit('update:value',123)
    }
  },
};
</script>
<style scoped>
</style>
```
父组件
```html
<template>
  <div>父组件</div>
  <!--通过.sync修饰符，子组件可以更方便的修改父组件里数据。不用通过之前接收事件的方式更新数据-->
  <child-component :value.sync="faterValue" />
</template>
<script>
//引入子组件
import childComponent from "./components/childComponent.vue";
export default {
  components: {
    childComponent,
  },
  data() {
    return {
      faterValue:456
    };
  }
};
</script>
<style scoped>
</style>
```
## 组件name属性，自己调用自己
```html
子组件
<template>
  <div>
    <!--子组件里调用navList自己调用自己-->
    <nav-list :haveChild="false"/>
  </div>
</template>
<script>
export default {
  name:"navList",
  props:{
    haveChild:{
      type:Boolean,
      default:false
    }
  },
  data: function () {
    return {};
  },
};
</script>
<style scoped>
</style>
```
父组件
```html
<template>
  <div>
    <!--父组件里调用navList子组件-->
    <nav-list :haveChild="true"/>
  </div>
</template>
<script>
import navList from '@/components/navList.vue'
export default {
  components:{
    navList
  },
  data: function () {
    return {};
  },
};
</script>
<style scoped>
</style>
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
.slide-fade-enter,
.slide-fade-leave-to {
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

## 在vue里使用axios
1、在项目内创建一个文件夹request

2、在文件夹内创建一个index.js文件

index.js
```javascript
import axios from 'axios';

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
axios.interceptors.request.use(function (config) {
  // console.log(config);
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.status === 200) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response);
  }
},
  // 服务器状态码不是200的情况    
  function (error) {
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
//vue2配置方式
//引入request配置
import a_request from './request'
//创建一个vue原型方法
Vue.prototype.$request = a_request;

//vue3配置方式
import a_request from './request'
const app = createApp(App)
app.config.globalProperties.$request = a_request
app.use(router).mount('#app')
```
项目中使用
```javascript
export default {
  name: 'home',
  mounted() {
    //get请求
    this.$request.get('http://localhost/abc', {
      params: {
        a: 1
      }
    })
      .then(function (data) {
        console.log(data)
      }).catch(function (err) {
        console.log(err)
      });
    //post请求
    this.$request.post('http://localhost/testPost', {
      a: 1
    })
      .then(function (data) {
        console.log(data)
      }).catch(function (err) {
        console.log(err)
      })
  },
  data() {
    return {}
  },
  methods: {}
}
```
axios自定义请求头参数

注意：post方式自定义请求头信息，会触发**复杂请求**。复杂请求会在post请求之前，会向服务端发送一个OPTIONS的请求权限信息的请求，来向服务端要服务端的请求权限信息。拿到服务端的请求权限信息后，浏览器会将这个与post方式的请求头，请求方式，请求域名进行检验。如果满足条件发送post请求，如不满足会触发跨域，不会进行post请求

[Nodejs处理 复杂请求](https://github.com/fengfanv/JS-library/tree/master/node#node处理复杂请求)
```javascript
export default {
  name: "home",
  mounted() {
    //get请求
    this.$request
      .get("http://localhost/abc", {
        params: {
          a: 1,
        },
        headers: {
          token: "I_am_token",
        },
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        console.log(err);
      });

    //post请求
    this.$request
      .post(
        "http://localhost/testPost",
        {
          a: 1,
        },
        {
          headers: {
            token: "I_am_token",
          },
        }
      )
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  },
};
```
在vue里使用axios的小窍门

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
//vue2版本
import Vue from 'vue'
import Router from 'vue-router'

import home from '@/components/home'
import index from '@/components/index'

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
      component: home,
	  beforeEnter (to, from, next) {
		//路由配置中增加钩子
		//beforeEnter调用顺序是在beforeEach和beforeResolve之间
		console.log(' app route before enter')
	    next()
	  }
    },
    //跳转到index组件
    {
      path: '/index/:id',//:id配置路由匹配的参数
      name: 'index',
      component: index
    }
  ]
})

//1、全局路由前置守卫
router.beforeEach((to, from, next) => {// 跳转前执行
  console.log('to:');//要到哪里去
  console.log(to);

  console.log('from:');//从什么地方来
  console.log(from);

  if (to.path === '/index') {//当地址为/index时做处理
    if (to.query.id !== undefined) {
      console.log('有id值，继续');
      next();
    } else {
      console.log('无id值，跳转login页面');
      next('/login');
    }
  } else {
    next();
  }
})

//2、全局路由解析守卫
router.beforeResolve((to, from, next) => {
  console.log('before resolve invoked')
  next()
})


//3、全局路由后置钩子
router.afterEach((to, from) => { // 跳转后执行，不需要 next
  console.log('after each invoked')
})

export default router


//vue3版本
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
```
vue main.js
```javascript
//vue2版本
//引入router配置
import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  router,//挂载到vue里
  components: { App },
  template: '<App/>'
})


//vue3版本
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```
项目中使用
```javascript
this.$router.push({"path":'/home'});//地址    /home

this.$router.push({"path":'/home',query:{"a","dad"}});//地址    /home?a=dad

this.$route.query  //获取query里面传过来的值

this.$router.go(-1);//和JavaScript里的history.go(-1)功能基本一样

//跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录
this.$router.replace("/home");

this.$router.push({"name":'index',params:{"id","dad"}});//地址    /home/dad   ,使用这种需要预先配置好，才能使用

this.$route.params  //获取params里面传过来的值
```
## 路由守卫触发流程
```
路由守卫触发的流程一般分为两类：

1、是不同组件（组件A跳转到组件B）的路由跳转流程

11 导航被触发（A–>B）
22 调用A组件内路由守卫beforeRouteLeave(to,from,next)
33 调用全局路由前置守卫router.beforeEach(to,from,next)
44 调用B路由独享守卫 beforeEnter(to,from.next)
55 解析异步路由组件B
66 调用B的组件内路由守卫beforeRouteEnter(to,from,next)
77 调用全局路由解析守卫 router.beforeResolve(to,from,next)
88 导航被确认
99 调用全局路由钩子router.afterEach(to,from)
100 渲染B组件DOM


2、是复用组件的路由跳转流程（组件A包含动态路由参数，只改变组件A的动态路由参数触发的路由跳转流程，示例： name/:id, 只改变id的值来触发路由跳转）

11 导航被触发（改变动态路由参数）
22 调用全局路由前置守卫 router.beforeEach(to,from,next)
33 调用复用组件的组件内路由守卫 beforeRouteUpdate(to,from,next)
44 调用全局路由解析守卫router.beforeResolve(to,from,next)
55 导航被确认
66 调用全局路由钩子 router,afterEach(to,from)
77 更新DOM
```
## vuex使用
1、在项目内创建一个文件夹store

2、在文件夹内创建一个index.js文件

index.js
```javascript
//vue2版本
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// state：存储的数据（状态） ，我们在项目中使用 this.$store.state.参数名
// getters：可以将getters理解为store的计算属性，getters的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。我们在项目中使用 $sotre.getters.方法名
// mutations：官网建议专门用来修改数据（状态），只支持同步的方法。我们在项目中使用 $store.commit('方法名',params)
// actions：官方不建议我们直接调用mutations下方法改数据，所以提供了另一种方法，主要用于调用mutations下的方法，actions里可以使用异步操作，我们在项目中使用 $store.dispatch('方法名',params)
// modules：由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store对象就会变得很臃肿。为了解决这个问题，Vuex允许我们将store分割成模块（module）。每个模块拥有自己的state、mutation、action、getter，一般用于权限管理

const store = new Vuex.Store({
  //数据存在里面
  state: {
    count: 0
  },
  getters: {
    getStateCount: function (state) {
      return state.count + 1;
    }
  },
  mutations: {
    addCount(state, n = 0) {
      state.count += n;
    }
  },
  actions: {
    addFun: function (context,value) {
      context.commit("addCount", value);
    }
  }
})
export default store


//vue3版本
import { createStore } from 'vuex'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
})
```
vue main.js
```javascript
//vue2版本
//引入
import Vue from 'vue'
import App from './App'
import store from './store'

new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})


//vue3版本
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App).use(store).mount('#app')
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
this.$store.dispatch("addFun",1);
```
### vuex里modules的使用

index.js
```javascript
import { createStore } from 'vuex'
import app from './app_modules'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app
  }
})
```
app_modules.js
```javascript
export default {
    namespaced: true, //开启命名空间，默认情况下，模块内部的 action 和 mutation 是注册在全局命名空间内的，这样可以使得多个模块能够对同一个 action 或 mutation 作出响应。Getter同样也是默认注册在全局命名空间，所以必须要注意，不要在不同的、无命名空间的模块中定义两个相同的 getter 从而导致错误。namespaced: true使其成为带命名空间的模块，当模块被注册后，它的所有 getter、action、mutation都会自动根据模块注册的路径调整命名
    state() {
        return {
            //在页面中使用 this.$store.state.app.count
            count: 0
        }
    },
    mutations: {
        //在页面中使用 this.$store.commit('app/set_value',18)
        set_value(state, value) {
            state.count = value
        }
    },
    actions: {
        //在页面中使用 this.$store.dispatch('app/set_value_async',18)
        set_value_async({ state, commit, rootState }, value) {
            state.count = value;
        },
        //在页面中使用 this.$store.dispatch('app/set_value_1',18)
        set_count_1({ state, commit, dispatch, rootState }, value) {
          //调用当前模块里的其它dispatch，调用时不用写 app/set_value_async，写 set_value_async 就可以
          dispatch('set_value_async',18)
          //调用其它模块里的dispatch，调用时需要写全 xxx/set_value
          dispatch('xxx/set_value',18,{root:true})
        }
    },
    getters: {
        //在页面中使用 this.$store.getters['app/get_value']
        get_value(state, getters, rootState) {
            return state.count + 'a'
        }
    }
}
```
## keep-alive组件缓存

```
keep-alive是vue内置的一个组件，而这个组件的作用就是能够缓存不活动的组件，我们能够知道，一般情况下，组件进行切换的时候，默认会进行销毁，如果有需求，某个组件切换后不进行销毁，而是保存之前的状态，那么就可以利用keep-alive来实现

使用keep-alive后，组件或页面内能使用的钩子函数：

1、activated
第一次进入某个页面的时候，页面或组件内，钩子触发的顺序是 beforeCreate -> created -> BeforeMount -> mounted -> activated
第二次进入（打开过这个页面，跳到别的页面去了，现在又跳回来了），页面或组件内，钩子触发的顺序是 activated（当再次前入进，这个缓存的页面或组件时候，只触发activated）

2、deactivated ：离开页面的时候会触发deactivated，不会触发页面或组件的卸载生命周期钩子（如beforeUnmount，unmounted）
```

使用
```
vue3内使用keep-alive组件缓存

//app.vue文件的配置
<router-view v-slot="{ Component }">
	<keep-alive>
		<component :is="Component"  v-if="$route.meta.keepAlive" :key="$route.path"/>
	</keep-alive>
	<component :is="Component"  v-if="!$route.meta.keepAlive"/>
</router-view> 

//router/index.js的配置
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    //重定向的地址
    { path: '/', redirect: '/a' },
    {
        path: '/a',
        name: 'a',
        component: () => import ('../pages/a.vue'),
        meta: {
            keepAlive: true //根据meta属性里的keepAlive，来判断，这个页面用不用，进行组件缓存
        }
    },
    {
        path: '/b',
        name: 'b',
        component: () => import ('../pages/b.vue'),
        meta: {
            keepAlive: false
        }
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router

```

## vue3组合式api
```html
<template>
  <div class="main">
    <div>{{name}}</div>
	
    <hr>
    <h1>title：</h1>
    <div>{{title}}</div>
	
    <hr>
    <h1>正常数组：</h1>
    <ul>
      <li v-for="(item, index) of arr" :key="index">{{ item }}</li>
    </ul>
	
    <hr>
    <h1>删除1后的数组：</h1>
    <ul>
      <li v-for="(item,index) of arrWhichDeleteNumber1" :key="index">{{item}}</li>
    </ul>
    <button @click="getArrData">获取数组数据</button>
  </div>
</template>

<script>
import { ref,toRefs, onMounted, watch, computed} from "vue";
export default {
  name: "组合式api测试",
  components: {},
  props: {
    title:{
      type:String,
      default:""
    }
  },
  data() {
    return {
		
    };
  },
  //执行setup时，组件实例尚未被创建，这时组件内data，computed，methods还不能使用
  //在setup方法里，因为setup方法是运行在解析数据方法之前，所以setup方法里的this和普通vue里this是不一样的，因此在setup方法里调用this，是无法操控组件里数据和方法
  setup(props, context) {
    
    console.log(context.attrs) //Attribute(非响应式对象)
    console.log(context.slots)//插槽 (非响应式对象)
    console.log(context.emit)//触发事件 (方法)

    //let title = props.title;//虽然这里的props是响应式的，但是已这种方式导出，再渲染到页面上，如title值发生变化时，这里是无法监听到变化的

    let {title} = toRefs(props);//上面的问题可以用toRefs方法解决，这个方法是把对象里所有的参数，都通过ref进行响应式变量声明，声明后，当props里参数发生变化后，在这里导出，页面上就能动态变化

    let name = 'kang';

    // let arr = []; //1
    let arr = ref([]);//ref方法，将参数声明成响应式变量，导出后的数据，是动态的，当数据发生变化时，导出的数据也会跟着变化。反之直接声明的变量，是静态的数据，导出后，数据发生变化，页面上不会跟着变化
    
    
    let getArrData = function () {
      arr.value = arr.value.concat([1, 2, 3]);
    };

    //setup里使用声明周期函数
    //onBeforeMount(); //选项式api里的beforeMount声明周期函数
    //使用方式1
    //onMounted(getArrData); //选项式api里的mounted声明周期函数，在setup方法里使用mounted生命周期函数，在mounted时调用getArrData方法
    //使用方式2
    onMounted(() => {
      getArrData()
    })
    //onBeforeUpdate(); //选项式api里的beforeUpdate声明周期函数
    //onUpdated; //选项式api里的updated声明周期函数
    //onBeforeUnmount; //选项式api里的beforeUnmount声明周期函数
    //onUnmounted; //选项式api里的unmounted声明周期函数
    //还有好几个，详见vue3api文档

    //在setup方法里使用watch
    watch(
      arr,
      function (newValue, oldValue) {
        console.log("arr数据发生变化：", arr.value);
      },
      { deep: true }
    );

    //在setup方法里使用computed
    let arrWhichDeleteNumber1 = computed(() => {
      let arrStr = arr.value.join(',');
      let workStr = arrStr.replace(/(1|,)/g,'');
      return workStr.split('');
    });

    return {
      title,
      name,
      arr,
      getArrData,
      arrWhichDeleteNumber1,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
</style>

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
//引入组件
import loadingFrom from './loading'
import alertFrom from './alert'

export default {
  install: function (Vue, options) {
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
      showLoading: function (callback) {
        loading_content.isShow = true;
        //给插件模板里绑一个回调函数，
        //可利用callback向使用的地方返回参数
        //可利用callback执行一些业务操作
        loading_content.callback = callback;
      },
      hideLoading: function (callback) {
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
<style scoped></style>
```
在程序里调用时
```javascript
Vue.loading_main.showLoading(function (data) {
  //通过绑定callback，返回某些操作后需要返回的信息

  //也可以利用callback，执行某些操作
  //比如这是个弹窗插架，你需要在单击插架ok按钮后执行某些操作
  //这时，你可以利用callback来执行这些操作。
});
```
## 其它问题
#### vue里render渲染函数
```html
内容待补充
```
#### import与import()区别是什么
```
1、import

静态加载，在代码编译时就运行，不能在写在代码块里，export和import命令只能在模块的顶层

如：以下代码，会报错，因为import xxx from 'xxx'命令会被JS引擎静态分析，先于模块内的其他语句执行，套在外面的if不会被执行，所以会报错
if (true) {
  import xxx from 'xxx'
}


2、import() 
动态加载，会返回一个Promise对象，一般用于组件懒加载

如：const Index = () => import('../pages/index.vue');
```
#### export & import 数据引用

1、基本数据类型，不能修改，是拷贝值

2、引用类型数据，可以修改，是引用值

a.js
```javascript
import * as b from './b.js';

console.log(JSON.stringify(b));
/*
{
	name: "I am b",
	say: say(),
	skills: ["aaa","bbb","ccc"]
}
*/

b.name = 'bbb';//报错，报错内容就是不让改
b.skills.push('ddd')

console.log(JSON.stringify(b))
/*
{
	name: "I am b",
	say: say(),
	skills: ["aaa","bbb","ccc","ddd"]
}
*/

b.say()
/*
I am b
["aaa", "bbb", "ccc", "ddd"]
*/
```
b.js
```javascript
var name = 'I am b'
var skills = ['aaa','bbb','ccc']
var say = function(){
    console.log(name);
    console.log(skills);
}
export {name,skills,say}
```

#### 在methods的方法内改变data里面object类型数据
```javascript
export default {
  name: "test",
  data() {
    return {
      username: 'Ian',
      id: 1,
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
var vm = null; //设置
export default {
  name: "index",
  created() {
    vm = this;
  },
  data: function () {
    return {
      name: "aaa",
      content: {
        key: vm.name, //通过使用全局变量方法，为content.key赋值
      },
    };
  },
  mounted() {},
  methods: {},
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
  mounted() {},
  methods: {},
};
</script>
<style scoped>
</style>
```