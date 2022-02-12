# js对象

## 1、定义对象
```javascript
//1、对象字面量
var obj = {
	name:"xiaowang"
}

//2、构造函数

//2.1、系统自带的构造函数 new Object();
var obj = new Object();
//2.2、自定义构造函数
function Peroson(){
	this.name = "xiaowang";
}
var obj = new Person();



var person = {
	name:"wangtao"
}
//使用一个对象属性
person.name//这样使用对象属性，系统内部会把这句话转成person['name']这种形式，然后再执行

```

## 包装类
```javascript
//一个纯字符串，它不是对象，应该是没有属性的，但它却可以使用某些属性，或方法，如：
'123'.length
'123'.substr(1)

//纯字符串，数字能使用属性，是因为在执行代码的时候，隐式的处理了一下这个数据，让这个数据变成了对象，如
'123'.length //new String('123').length
'132'.substr(1) //new String('132').substr(1)

//而这个new String，new Number就是包装类

//只有undefined和null没有包装类


``` 

## 原型
```javascript
//原型是function对象的一个属性，它定义了 构造函数制造出的对象 的公共祖先。通过该 构造函数产生的对象 ，可以继承该原型的属性和方法，原型也是对象

// 对象.prototype 原型

//原型用法
//利用原型特点和概念，可以提取共有属性

Person.prototype

Person.prototype.constructor //指向构造函数

function Person(){

}

var person1 = new Person();

//获取对象的原型
person1.__proto__ //Person.prototype





//因为Person.prototype也是对象，所以Person.prototype的__proto__是Object.prototype
Person.prototype.__proto__ == Object.prototype
//又因为Object.prototype也是对象，所以Object.prototype也有__proto__，但是为了解决Object.prototype.__proto__还是Object.prototype的问题，js将Object.prototype的__proto__设置成了null
Object.prototype.__proto__ == null


//创建一个没有原型的对象
//通过Object.create(原型)方法，create括号里放的是对象的原型
var obj = Object.create(null);//对象原型里设置成null，创建出来的obj对象是没有原型的


 

```
## 继承
```javascript
//继承第一种，原型链继承
//缺点：继承了一些没有用的属性，如对象son不想继承Father方法内的name属性
Grand.prototype.lastName = "Deng";
function Grand(){}
var grand = new Grand();

Father.prototype = grand;
function Father(){
	this.name = " tao"
}
var father = new Father();

Son.prototype = father;
function Son(){
	this.hobbit = "smoke"
}
var son = new Son();



//继承第二种，借用构造函数
//缺点：不能继承 借用的构造函数 的原型
function Person(name,age,sex){
	this.name = name;
	this.age = age;
	this.sex = sex;
}

function Student(name,age,sex,grade){
	Person.call(this,name,age,sex)//用Student里的this，来替换Person里的this。
	//借用Person构造函数，为自己添加三个属性
	this.grade = grade;
}

var student = new Student("wang",18,"男","一年级");



//继承第三种，共享原型或共有原型（多个构造函数用一个原型）
//缺点：不能随便改变原型，改完原型，继承该原型的构造函数或对象，很被动，有的构造函数需要改，有的构造函数不需要改
Father.prototype.lastName = "Deng";
function Father(){};

Son.prototype = Father.prototype;
function Son(){};
var son = new Son();
var father = new Father();

console.log(son.lastName);//Deng
console.log(father.lastName);//Deng

//改原型
Son.prototype.sex = "男";

console.log(son.sex);//男
console.log(father.sex);//男
//Son改原型，Father受到了影响



//继承第四种，圣杯模式，主要是从第三种演变来的，优化了第三种不能随便改原型的问题
function inherit(Target,Origin){
	function F(){};
	F.prototype = Origin.prototype;
	Target.prototype = new F();
	Target.prototype.constructor = Target;
}

Father.prototype.lastName = "Deng";
function Father(){};

function Son(){};

inherit(Son,Father);
var father = new Father();
var son = new Son();

//这里两个实例都可以打印出原型上lastName属性
console.log(father.lastName);//Deng
console.log(son.lastName);//Deng

//改原型
Son.prototype.sex = "男";

console.log(father.sex);//undefined
console.log(son.sex);//男
//改变Son原型后，Father的原型不会收到影响，解决了第三种的问题



```
## 对象枚举（遍历对象属性）
```javascript
Person.prototype.lastName = "wang";
function Person(){
	this.name = "wang tao";
	this.age = 123;
	this.sex = "male";
	this.height = 180;
	this.weight = 75;
}
var obj = new Person();


//对象.hasOwnProperty(属性名) 检查某个属性是否是对象自身属性，是自身属性返回true，不是返回false


//in操作符，检查某个对象能否访问某个属性
console.log('name' in obj);//true，obj对象自身属性，返回true
console.log('lastName' in obj);//true，obj对象原型上的属性，能访问，返回true
console.log('wife' in obj);//false，obj对象自身和原型和原型链上都没有这个属性，不能访问，返回false


//instanceof操作符，检查 某个对象 是不是由 某个构造函数 构建出来的。或理解 某个对象的原型链上 有没有 某个构造函数的原型
console.log(obj instanceof Person);//true，obj对象是由Person构造函数所构建出来的


//for in
//缺点：原型或原型链上所有的自建属性都会被遍历出来

for(var key in obj){
	if(obj.hasOwnProperty(key)){
		console.log('key:',key,'value:',obj[key]);
	}
}



```
## this
```javascript
//1、函数预编译过程中（或理解函数默认环境里，this指向window） this --> window
function test(){
	var a = 123;
	function b(){
		console.log(this);
	}
	b();
}
test()
//打印： Window {window: Window, self: Window, document: document, name: '', location: Location, …}


//2、全局作用域里 this --> window
<script>
console.log(this);
</script>
//打印： Window {window: Window, self: Window, document: document, name: '', location: Location, …}


//3、call/apply/bind 改变函数运行时this指向


//4、obj1.fun(); 这时fun()内的this指向obj1，或理解为：函数fun被对象obj1 “点调用”，则函数内的this指向调用这个函数的那个人。
//除了call/apply/bind强制改this指向 和 对象点调用函数，其余任何情况，函数内this默认指向window。



```
## new构造函数，发生了啥
```javascript
function Person(){
	this.name = "123";
	this.sex = "男";
}
function newObject(){
	//1、创建一个空对象，然后设置空对象的原型为构造函数的原型
	var obj = Object.create(Person.prototype)


	//2、将构造函数内this绑定的，属性和方法，赋给新创建的对象
	Person.call(obj);


	//3、返回这个对象
	return obj
}
```
## 对象使用技巧
```javascript
//1、对象链式调用
function project(){
	//抽烟
	this.smoke=function(){
		console.log(this.name," am smoking...")
		return this;//方法执行完，这里返回this，就能实现链式调用的
	}
	//喝酒
	this.drink=function(){
		console.log(this.name," am drinking...")
		return this;
	}
	//烫头
	this.perm=function(){
		console.log(this.name," am perming...")
		return this;
	}
}
//定义一个人
var person = {
	name:"wang tao"
}
//为person对象，添加能干的事情（让person对象继承方法）
project.call(person);
//开始链式调用
person.smoke().drink().perm()




```