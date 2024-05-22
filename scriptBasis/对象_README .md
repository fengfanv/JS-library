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
//原型(prototype)是function对象的一个属性，它定义了 构造函数制造出来的对象 的公共祖先。通过 该构造函数产生的对象，可以继承该构造函数原型的属性和方法。原型也是对象。利用原型特点和概念，可以提取共有属性。

//原型是 构造函数构造出来的对象 的共有祖先

//构造函数.prototype 查看构造函数的原型

function Person(){ }

Person.prototype //查看构造函数(Person)的原型

Person.prototype.constructor //原型里的constructor指向构造函数本身

var person1 = new Person() //使用Person构造函数，new一个person1对象

person1.__proto__ //对象可通过(隐式属性 __proto__) 来查看原型。如这里对象(person1)通过隐式属性(__proto__)来查看原型，得到构造函数(Person)的原型(Person.prototype)



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
//缺点：继承了一些没有用的属性，如对象(son)不想继承Father方法内的name属性
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
//缺点：仅是借用(复制粘贴)其它构造函数里的属性，不能继承 其它构造函数 的原型。老师说，这种其实都不算继承。
//缺点2：每次使用构造函数new对象时，会额外的在运行一下借用的构造函数。
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



//继承第三种，共享原型或共有原型（多个构造函数共用一个原型）
//缺点：不能随便改变原型，改原型后，所有继承该原型的构造函数或对象，很被动。因为有的构造函数需要改，有的构造函数不需要改，所以很被动很尴。
Father.prototype.lastName = "Deng";
function Father(){};

Son.prototype = Father.prototype; //Son 和 Father 共用一个原型
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



//继承第四种，圣杯模式，由第三种演变来的，优化了第三种不能随便改原型的问题
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
//1、函数预编译过程中 将 this --> window（或理解函数默认环境里，this指向window） 
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


//3、call/apply/bind 可以改变 函数运行时 this指向


//4、obj1.fun(); 这时fun()内的this指向obj1。
//或理解为，函数fun被对象obj1 “点调用”，则函数fun内的this就指向点调用这个函数的那个人。
//或理解为，谁调用函数fun，则函数fun里的this就是谁。
//除了call/apply/bind强制改this指向 和 对象点调用函数，其余任何情况，函数内this默认指向window。
<script>

var obj = {
	a:function(){
		console.log(this.name)
	},
	name:"abc"
};
var name = "global";
var aFun = obj.a;
obj.a(); //abc     //打印abc 是因为a方法在运行前的预编译阶段将a方法的this指向了对象obj，所以这里打印了obj里的name值
aFun();  //global

</script>


```
## new构造函数时，发生了啥
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
## bind call apply 改变函数‘运行时’的this上下文
```javascript
// 1、bind(this,参数,...)
// bind()方法会创建一个新函数，这个新函数和原函数有相同的函数体，但是this上下文已经被改变为bind()方法的第一个参数。
// bind()方法返回的新函数不会立即执行。

function greet() {
  console.log(this.greeting);
}

const obj = { greeting: 'Hello' };

const boundGreet = greet.bind(obj);
boundGreet(); //Hello


// 2、call(this,参数,...)
// call()方法会立即调用函数，并且指定函数内部的this上下文。

function greet(name) {
  console.log(this.greeting, name);
}

const obj = { greeting: 'Hello' };

greet.call(obj, 'World'); //Hello World


// 3、apply(this,[参数,...])
// apply()方法和call()类似，都会立即调用函数，并指定函数内部的this上下文。

function greet(name1, name2) {
  console.log(this.greeting, name1, name2);
}

const obj = { greeting: 'Hello' };

greet.apply(obj, ['World', 'JavaScript']); //Hello World JavaScript
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