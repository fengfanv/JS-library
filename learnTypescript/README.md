# 学习TypeScript

### 安装ts
```
npm install typescript -g
```
### 查询ts版本号
```
tsc -v
```
### 初始化项目(生成package.json文件)
```
npm init -y //-y的意思是生成的package文件内容是默认的，这样我们就不用编辑了
```
### 把.ts文件编译成.js文件
```
tsc xxxx.ts //编译一个文件，.ts可填可不填
tsc xxxx.ts xxxx.ts //编译多个ts文件，.ts可填可不填

node xxxx.js //运行编译好的.js文件
```
### 安装ts-node
```
npm install ts-node -g
```
### 使用ts-node直接运行.ts文件
```
ts-node xxxx.ts
```
### 数据类型
```
1、number 数字类型
双精度64位浮点值。它可以用来表示整数和小数。
let a1:number = 0b1010; //二进制
let a2:number = 0o744;  //八进制
let a3:number = 6;      //十进制
let a4:number = 0xf00d; //十六进制

2、bigint 大整数类型
包含所有的‘大’‘整’数
let x:bigint = 123n;
let y:bigint = 0xffffn;
let z:bigint = 3.14;   //报错，bigint类型赋值为整数和小数，会报错。
let k:bigint = 123;    //报错，bigint类型赋值为整数和小数，会报错。

3、object 对象类型（注意这里是全小写）
object类型可以声明(对象、数组、函数)
let x:object = {foo:123};
let y:object = [1,2,3];
let z:object = (n:number) => n + 1;

4、string 字符串类型
使用单引号（'）或双引号（"）来表示字符串类型。
反引号（`）来定义多行文本字符串。
let name:string = "Kang";

5、boolean 布尔类型
表示逻辑值 true 和 false。
let flag:boolean = true;

6、数组
let arr:number[] = [1, 2];      //声明数组方式1，在元素类型后面加上[]
let arr:Array<number> = [1, 2]; //声明数组方式2，使用数组泛型

let arr:Array<number|string> = [1,1,1,'a'];//数组arr的成员类型是number|string

let arr:string[] = new Array('1','2','3');
let arr:any[] = [1, false, 'fine'];

let arr:(number|string)[] = [1,1,1,'a'];   //数组arr的成员类型是number|string

let arr:number[][] = [[1,2,3],[4,5,6]];    //变量arr的类型是number[][]，表示它是一个二维数组，最底层的数组成员类型是number

7、元组
元组类型用来表示 已知元素数量和类型 的数组，各元素的类型不必相同，对应位置的类型需要相同。
let x:[string, number];
x = ['kang', 1];    //运行正常
x = [1, 'kang'];    //报错
console.log(x[0]);  //输出：kang

8、enum 枚举
枚举类型用于定义数值集合。

如，人分为男孩和女孩，人(男孩，女孩)
enum Ren{boy,girl}	  //声明一个枚举类型，名称没有大小写限制
console.log(Ren.girl) //打印：1，对应girl在Ren里的下标

enum Ren{boy='男孩',girl='女孩'}  //声明一个枚举类型
console.log(Ren.girl)            //打印：女孩，对应girl下的参数

9、symbol 类型
let x:symbol = Symbol();    //Symbol()函数的返回值就是symbol类型

10、undefined 和 null
在ts里undefined和null与在js里要表示的意思一样
undefined和null都比较特殊，它们既是值，又是类型
null表示一个空对象引用
undefined表示还没有赋值
ts允许任何类型变量赋值为这两个值（注意，当ts编译时设置strictNullChecks:true，则undefined和null就不能赋值给(除any和unknown以外)的其他类型变量）

11、void
用于标识方法返回值的类型，表示该方法没有返回值。
function hello():void {
    alert("Hello Kang");
}

12、any 和 unknown
声明为 any 的变量可以赋予任意类型的值。
any类型有一个很大的问题，它会“污染”其他变量。它可以赋值给任何其他类型的变量（因为没有类型检查），导致其他变量出错。
如：
let x: any = "hello";
let y: number;
y = x;
y * 123;
在编译完成后运行时报错了。这个错误，本来应该在编写或编译阶段就应该被ts检查出错误，但没有检查出错误，因为(x赋值给了y。变量x的any导致变量y的类型检查功能关闭，所以才导致y没能及时提示出错误)(变量x的any 污染了 变量y)

unknown是加强版的any，所有类型的值都可以分配给声明为unknown类型的变量。
unknown解决了any类型“污染”其他类型变量的问题，unknown类型的变量，不能赋值给(除any和unknown以外的)其他类型变量。
如：
let v: unknown = 123;
let v1: boolean = v;   //报错

unknown对比any，unknown还是严格版的any，在实际使用unknown时会有一些限制。
如：
let a: unknown = 1;
a + 1;      //会报错
if (typeof a === "number") {
  a + 10;   //不报错
}
使用unknown类型的变量，需要经过“类型缩小”(缩小unknown变量的类型范围)，如上面if(typeof a === "number"){...}就属于“类型缩小”操作，即将一个不确定的类型缩小为更明确的类型。


13、联合类型
指多个类型组成的一个新类型，使用符号|表示。
联合类型A|B表示，任何一个类型只要属于A或B，就属于联合类型A|B。
var val:string|number   //变量val就是联合类型string|number，既它的值可以是字符串，也可以是数值。
val = 12 
console.log("数字为",val) 
val = "kang" 
console.log("字符串为",val)

14、交叉类型
指多个类型组成的一个新类型，使用符号&表示。
交叉类型的主要用途是表示对象的合成。
let obj: { foo: string } & { bar: number };
obj = {
  foo: "hello",
  bar: 123,
};
上面示例中，变量obj同时具有属性foo和属性bar

交叉类型常常用来为对象类型添加新属性。
type a = { foo: string }
type b = a & { bar: number }
let data: b = {
    foo: "hello",
    bar: 123,
};
上面示例中，类型b是一个交叉类型，用来在a的基础上增加属性bar

15、type
type用来定义一个类型的别名。别名可以让类型的名字变得更有意义，也能增加代码的可读性，还可以使复杂类型用起来更方便，便于以后修改变量的类型。
type Age = number;
let age: Age = 55;

16、never 空类型
never类型的含义是“不可能有这样的值”
不可以给never类型的变量赋值，否则会报错，因为never表示为“空”，即不包含任何值。
let x: number & string; 等于 let x: never;
上面示例中，变量x同时是数值和字符串，这当然是不可能的，所以ts会认为x的类型是never。

17、值类型
ts规定，单个值也是一种类型，称为“值类型”。
let x:"hello";
x = "hello";//正确
x = "world";//报错

注意：元组与数组区别
1、固定长度：元组的长度是固定的，一旦定义了一个元组类型，你就不能再添加或删除元素。
2、类型化元素：元组的每个位置都有一个特定的类型。这意味着你可以访问元组的特定元素，并且TypeScript会知道该元素的类型。
3、值可改变：虽然元组的长度是固定的，但是元组中的元素值是可以改变的。你可以修改一个已经存在的元组元素的值，只要新值符合该位置的类型要求。

注意：TypeScript 和 JavaScript 没有整数类型。
```
### 日期类型使用
```javascript
var d1:Date = new Date();
console.log(d1);//2020-06-299T11:02:14.369Z，这个时间不是本地的时间，需要设置时区

//传递一个毫秒数
var d2:Date = new Date(2000);
console.log(d2);//时间是从1970,1,1开始。1000毫秒等于1秒
//所以打印：1970-01-01T00:00:02.000Z

//传递一个字符串
var d3:Date = new Date('2020/06/24 11:02:14');
var d4:Date = new Date('2020-06-24 11:02:14');
var d5:Date = new Date('2020-06-24T11:02:14.369Z');
console.log(d3);//打印：2020-06-24T11:02:14.369Z
console.log(d4);//打印：2020-06-24T11:02:14.369Z
console.log(d5);//打印：2020-06-24T11:02:14.369Z

//使用方法3
var d6:Date = new Date(year,month,day,hour,minute,second,ms);
//如：
var d6:Date = new Date(2008,12,20,15,26,0,0);
console.log(d6);//2009-01-20T07:26:00.000Z
```
### 面向对象(类与对象)
```ts
对象：对象是类的一个实例。有状态和行为。
类：类是一个模板，它用来描述某一类对象的状态和行为。

//定义 狗 这种物种(定义 狗 类)
class dog {
    name: string
    say(): void {
        console.log(`汪汪。我叫${this.name}`)
    }
    constructor(name: string) {
        this.name = name
    }
}

//根据 狗 类，生成一个 名叫a的 狗。
var dog_a = new dog('a');//使用 new关键字 创建类的实例(对象)
dog_a.say();//汪汪。我叫a
```
### 类的使用
```javascript
class renlei{
    name:string
    age:number
    constructor(name:string,age:number){
		//这个类的构造方法
        this.name = name;
        this.age = age;
    }
    say(){
        console.log('你好！我叫'+this.name+',今年'+this.age+'岁');
    }
}
let wangleilei:renlei = new renlei('王雷雷',18)
console.log(wangleilei);//renlei { name: '王雷雷', age: 18 }
wangleilei.say();//你好！我叫王雷雷,今年18岁


//编译成js后的样子
var renlei = /** @class */ (function () {
    function renlei(name, age) {
        this.name = name;
        this.age = age;
    }
    renlei.prototype.say = function () {
        console.log('你好！我叫' + this.name + ',今年' + this.age + '岁');
    };
    return renlei;
}());
var wangleilei = new renlei('王雷雷', 18);
console.log(wangleilei);
wangleilei.say();
```
### 类的访问控制修饰符(public，protected，private)
```javascript
class ren{
    public sex:string//公共属性sex，可以在任何地方被访问。
    protected name:string//受保护的属性name，只能在 类ren自己 或 类ren的子类 中使用
    private age:number//私有属性age，只能在类ren中使用
    public readonly tall:number=180//公共的，只读的，tall属性
    public constructor(sex:string,name:string,age:number){
        this.sex=sex
        this.name=name
        this.age=age
    }
    public sayHello(){//公共方法，在哪里都可以访问
        console.log('你好！我叫'+this.name+',今年'+this.age+'岁');
    }
    protected sayLove(){//受保护的方法，只能在 类ren自己 或 类ren的子类 中使用
        console.log('loves you!');
    }
}
let wangleilei:ren = new ren('男','王雷雷',28);
```
### 类的static关键字
```ts
static关键字用于 声明类的静态成员，静态成员属于类本身，不属于类的实例。

通过类名来访问和修改类的静态成员。

子类可以继承父类的静态成员。

子类可以重写继承自父类的静态成员。

class Ren {
    static num: number = 10

    static disp(): void {
        console.log(Ren.num)
    }

    constructor(){
        console.log(Ren.num)//打印12
    }

    say(){
        console.log(Ren.num)//实例方法通过类名，获取类的静态属性
        Ren.disp()//实例方法通过类名，调用类的静态方法
    }
}

console.log(Ren.num)//10
Ren.num = 12//修改静态属性
console.log(Ren.num)//12
Ren.disp()//调用静态方法，12

let obj = new Ren()//打印12
//console.log(obj.num)//报错，obj实例对象上没有num属性
obj.say()


class God extends Ren {
    static disp(): void {//重写所继承的静态方法
        console.log('Ren.disp.num',Ren.num)//12
        console.log('God.disp.num',God.num)//15
    }
}
console.log('God.num',God.num)//12
God.num = 15
console.log('Ren.num',Ren.num)//12
console.log('God.num',God.num)//15
God.disp()
```
### 类的继承
```javascript
TypeScript 一次只能继承一个类，不支持继承多个类，但 TypeScript 支持多重继承（C 继承 B，B 继承 A）

子类除了不能继承父类的私有成员，其它的都可以继承。

class me{
    public name:string
    public age:number
    public constructor(name:string,age:number){
        this.name=name
        this.age=age
    }
    public sayHello(){
        console.log('你好！我叫'+this.name+',今年'+this.age+'岁');
    }
}

//mySon类 继承（复制）了 me类 里的所以属性和方法
class mySon extends me{
    public yangzi:string = '帅'
    public zhuanqian(){
        console.log('我会赚钱');
    }
}

//因为继承了me类的属性和方法，所以可以使用me类中的constructor构造方法
let son:mySon = new mySon('我儿子',10);
//使用继承自me类里面的sayhello方法
son.sayHello();//打印：你好！我叫我儿子,今年10岁
//使用mySon类中的zhuanqian方法
son.zhuanqian();//打印：我会赚钱
```
### 类继承属性和方法的重写
```javascript
子类可以继承父类的属性和方法，并且子类可以重写（或称为覆盖）父类的非私有属性和方法。

如果父类中的属性或方法被声明为private，则它们不能在子类中被访问或重写。如果它们被声明为protected，则它们可以在子类中被访问，但不能在子类之外被访问。如果它们被声明为public或没有明确的访问修饰符（默认为public），则它们可以在任何地方被访问。

在子类中，可以使用super关键字来访问父类的属性和方法。

子类可以重写（实际上是提供自己的实现）父类的构造函数。但是，在子类的构造函数中，通常需要使用super()来调用父类的构造函数，以确保父类的初始化代码得到执行。

class me{
    public name:string
    public age:number
    public constructor(name:string,age:number){
        this.name=name
        this.age=age
    }
    public sayHello(){
        console.log('你好！我叫'+this.name+',今年'+this.age+'岁');
    }
}

//mySon继承（复制）了me的所以属性和方法
class mySon extends me{
    public yangzi:string = '帅'
    constructor(name:string,age:number){//重写类的，构造函数
        super(name,age)//调用父类构造函数
    }
    public sayHello(){//重写me类中的sayHello方法
        super.sayHello();//调用me类中的sayHello方法
        console.log('我是'+this.name+'，我在，mySon类中');
    }
    public zhuanqian(){
        console.log(this.name,'我会赚钱');
    }
}

let son:mySon = new mySon('我儿子',10);
son.sayHello();//使用了mySon中重写后的sayHello()方法
son.zhuanqian();//使用mySon类中的zhuanqian方法
```
### 类继承属性和方法重写注意事项
```ts
class A {
    name: string
    readonly age: number
    private money: number
    protected car: string
    constructor(name: string, age: number, money: number) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
    say(text: string): string {
        let str: string = `我是${this.name}。我今年${this.age}。我有${this.money}元。`;
        console.log(str);
        return str;
    }
}

// class B extends A {
//     name:number //报错。类型“B”中的属性“name”不可分配给基类型“A”中的同一属性。不能将类型“number”分配给类型“string”。
// }

// class B extends A {
//     protected name:string //报错。类“B”错误扩展基类“A”。属性“name”在类型“B”中受保护，但在类型“A”中为公共属性。
// }

// class B extends A {
//     private name:string //报错。类“B”错误扩展基类“A”。属性“name”在类型“B”中是私有属性，但在类型“A”中不是。
// }

// //未报错
// class B extends A {
//     readonly name:string
// }



// class B extends A {
//     money:number //报错。类“B”错误扩展基类“A”。属性“money”在类型“A”中是私有属性，但在类型“B”中不是。
// }

// class B extends A {
//     private money:number //报错。类“B”错误扩展基类“A”。类型具有私有属性“money”的单独声明。
// }



// class B extends A {
//     car:number //报错。类型“B”中的属性“car”不可分配给基类型“A”中的同一属性。不能将类型“number”分配给类型“string”。
// }

// //未报错
// class B extends A {
//     car:string
// }

// //未报错
// class B extends A {
//     public car:string
// }

// //未报错
// class B extends A {
//     protected car:string
// }

// //未报错
// class B extends A {
//     protected readonly car:string
// }

// class B extends A {
//     private car:string //报错。类“B”错误扩展基类“A”。属性“car”在类型“B”中是私有属性，但在类型“A”中不是。
// }




// class B extends A {
//     say:string //报错。类型“B”中的属性“say”不可分配给基类型“A”中的同一属性。不能将类型“string”分配给类型“(text: string) => void”。
// }

// class B extends A {
//     //报错。类型“B”中的属性“say”不可分配给基类型“A”中的同一属性。不能将类型“(name: string, age: number) => string”分配给类型“(text: string) => string”。
//     say(name:string,age:number):string{
//         return '字符串'
//     }
// }

// //未报错
// class B extends A {
//     say(name:string):string{
//         return '字符串'
//     }
// }

// class B extends A {
// // 报错
// // 类型“B”中的属性“say”不可分配给基类型“A”中的同一属性。
// //     不能将类型“(name: number) => string”分配给类型“(text: string) => string”。
// //       参数“name”和“text” 的类型不兼容。
// //         不能将类型“string”分配给类型“number”。
//     say(name:number):string{
//         return '字符串'
//     }
// }

// class B extends A {
// // 类型“B”中的属性“say”不可分配给基类型“A”中的同一属性。
// //     不能将类型“(name: string) => void”分配给类型“(text: string) => string”。
// //       不能将类型“void”分配给类型“string”。
//     say(name:string):void{

//     }
// }
```
### instanceof运算符
```ts
instanceof（instance of）运算符用于判断对象是否是指定的类型

class Person{ } 
var obj = new Person() 
var isPerson = obj instanceof Person; 
console.log("obj 对象是 Person 类实例化来的吗？ " + isPerson);//true
```
### 函数的使用
```javascript
function 方法名(参数名称:参数类型,参数名称:参数类型...):方法返回值类型/void{
	return xxx;
}
//void表示这个方法没有返回值
function a(content:string):void{
	console.log(content);
}
//如：查找a字符串方法
function searcha(content:string):number{
	return content.indexOf('a')
}
console.log(searcha('1ssssa');//打印：5

//声明一个有可选参数的方法,在参数名后面，:前面加一个?
function 方法名(参数名称?:参数类型...):方法返回值类型/void{
	return xxx;
}
//如：
function searcha(content2?:string):string{
    if(content2!=undefined){
        return content2
    }else{
        return '没有传content2'
    }
}

//声明一个有默认参数的方法
function 方法名(参数名称:参数类型=默认参数...):方法返回值类型/void{
	return xxx;
}
//如：
function search(content:string='aaaaa'):string{
	return content;
}
console.log(search());//aaaaa

//声明一个有剩余参数的方法
//剩余参数语法允许我们将一个不确定数量的参数作为一个数组传入。//类似将多个形参转换成数组来进行访问。类似使用js里arguments方式来获取形参。
function 方法名(...参数名称:参数类型):方法返回值类型/void{
	return xxx;
}
//如：
function search(...a:string[]):string{
    let len:number = a.length;
    let as:string = '';
    for(let i:number=0;i<len;i++){
        as+=a[i]
    }
    return as;
}
console.log(search('1','2','3'));//打印：123
```
### 声明函数的方式
```javascript
//1、字面量声明函数
//如：
function a(content:string):string{
	return content;
}

//2、表达式声明函数
//如：
var a = function (content:string):string{
	return content;
}

//3、ES6箭头函数声明
//如：
var a = (content:string):string => {
	return content;
}
```
### 接口
```javascript
接口(interface)与类(class)的区别
类：类是蓝图或模板。类定义了对象的属性和方法，并且包含代码实现细节（即方法的具体代码）。
接口：接口是一个类型定义，它描述了对象应该具有的形状（即属性和方法的签名）。接口不包含任何实现细节，只是声明了对象应该有的结构。

类：类可以被实例化
接口：接口不能被实例化

类：类支持继承
接口：接口也支持继承

//定义对象规范(或结构)
interface ren{
    name:string//在使用时name必须使用
    age:number//在使用时age必须使用
    love?:boolean//可选属性
    sayHi?:(name:string)=>string //可选方法
}
let It:ren = {"name":"弹幕人","age":1};
console.log(It);//{ name: '弹幕人', age: 1 }

//定义方法规范(或结构)
interface myFun{
    (name:string,love:boolean):string
}
let fun:myFun=function(name:string,love:boolean):string{
    if(love==true){
        return name+'是个好人！'
    }else{
        return name+'是个bu好人！'
    }
}
console.log(fun('王雷雷',true));//王雷雷是个好人！
```
### 接口继承
```ts
interface IParent1 { 
    v1:number 
} 
 
interface IParent2 { 
    v2:number 
} 
 
interface Child extends IParent1, IParent2 { } 
var Iobj:Child = { v1:12, v2:23} 
console.log("value 1: "+Iobj.v1+" value 2: "+Iobj.v2)//value 1: 12 value 2: 23
```
### 接口使用
```ts
interface IPoint {
    x:number
    y:number
}
function addPoints(p1:IPoint,p2:IPoint):IPoint {
    var x = p1.x + p2.x
    var y = p1.y + p2.y
    return {x:x,y:y}
}

var newPoint = addPoints({x:3,y:4},{x:5,y:1})
```
### implements关键字
```ts
implements 是用于实现接口的，类必须提供接口中定义的所有方法的具体实现。


class Animal {

}

interface Runnable {
    run(): void;
}
interface Speakable {
    speak(): void;
}

//Dog 类继承了 Animal 类并实现了 Runnable 和 Speakable 两个接口。
class Dog extends Animal implements Runnable, Speakable {
    run() {
        console.log(`The dog is running.`);
    }
    speak() {
        console.log(`The dog barks.`);
    }
}

//如下报错，因为 Dog类 中缺少 speak方法。
//接口Speakable 中规定需要存在该方法。
class Dog extends Animal implements Runnable, Speakable {
    run() {
        console.log(`The dog is running.`);
    }
}
```
### 命名空间
```javascript
命名空间，用来解决重名问题。

假设这样一种情况，当一个班上有两个名叫小明的学生时，为了明确区分它们，我们在使用名字之外，不得不使用一些额外的信息，比如他们的姓氏（王 小明，李 小明）

为了在外部可以调用 命名空间 中的类和接口，需要在类和接口前添加 export 关键字。

namespace fat{
    export class dehua{
        public name:string = '胖德华'
        sayHello(){
            console.log('我是'+this.name);
        }
    }
}
namespace thin{
    export class dehua{
        public name:string = '瘦德华'
        sayHello(){
            console.log('我是'+this.name);
        }
    }
}

let fatDehua:fat.dehua = new fat.dehua()
let thinDehua:thin.dehua = new thin.dehua()
fatDehua.sayHello();//我是胖德华
thinDehua.sayHello();//我是瘦德华
```
### 泛型
```ts
泛型是一种编程语言特性，允许在定义函数、类、接口等时，使用占位符来表示类型，而不是具体的类型。

泛型最重要的功能是，代码重用，这样可以编写 与特定类型无关 的通用代码，提高代码的复用性。

//泛型函数案例
//使用泛型来创建一个可以处理不同类型数据的函数
//如下，identity是一个泛型函数，使用 T 表示泛型类型
function identity<T>(arg: T): T {
    return arg;
}
//使用string代表T
let result = identity<string>("Hello");
console.log(result); //Hello
//使用number代表T
let numberResult = identity<number>(42);
console.log(numberResult); //42

//如下，comb是一个泛型函数，使用 T 表示泛型类型
function comb<T>(arr:T[]):T[] {
  return arr
}

//泛型接口案例
//这里定义了一个泛型接口Pair，它有两个类型参数 T 和 U。
interface Pair<T, U> {
    first: T;
    second: U;
}
//使用string代表T。使用number代表U。
let pair: Pair<string, number> = { first: "hello", second: 42 };
console.log(pair); // { first: 'hello', second: 42 }


//泛型 类 案例
//使用 T 表示泛型类型。
class Box<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }
}

//使用string代表T
let stringBox = new Box<string>("TypeScript");
console.log(stringBox.getValue()); //TypeScript
```
### 泛型约束
```ts
有时候你想限制泛型的类型范围，可以使用泛型约束

interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
    console.log(arg.length);
}

// 正确的使用
logLength("hello"); // 5

// 错误的使用，因为数字没有 length 属性
logLength(42); // 错误

//在这个例子中，定义了一个泛型函数 logLength，它接受一个类型为 T 的参数，但有一个约束条件，即 T 必须实现 Lengthwise 接口，该接口要求有 length 属性。因此，可以正确调用 logLength("hello")，但不能调用 logLength(42)，因为数字没有 length 属性。
```
### 泛型与默认值
```ts
可以给泛型设置默认值，使得在不指定类型参数时能够使用默认类型

function defaultValue<T = string>(arg: T): T {
    return arg;
}

// 使用带默认值的泛型函数
let result1 = defaultValue("hello"); // 推断为 string 类型
let result2 = defaultValue(42);      // 推断为 number 类型

//这个例子展示了带有默认值的泛型函数。函数 defaultValue 接受一个泛型参数 T，并给它设置了默认类型为 string。在使用时，如果没有显式指定类型，会使用默认类型。
//在例子中，第一个调用中 result1 推断为 string 类型，第二个调用中 result2 推断为 number 类型。
```
### 类型断言
```ts
类型断言，是一种手段，允许开发者在代码中“断言”某个值的类型，也就是告诉编译器此处的值是什么类型。
TypeScript一旦发现存在“类型断言”，就不再对该值进行类型推断，而是直接采用断言给出的类型。
这种做法的实质是，允许开发者在某个位置“绕过”编译器的类型推断，让本来通不过类型检查的代码能够通过，避免编译器报错。
这样虽然削弱了TypeScript类型系统的严格性，但是为开发者带来了方便，毕竟开发者比编译器更了解自己的代码。
类型断言 并不是真的改变一个值的类型，而是提示编译器，应该如何处理这个值

type T = 'a'|'b'|'c';
let foo = 'a';
let bar:T = foo;//报错，原因是 TypeScript 推断变量foo的类型是string，而变量bar的类型是'a'|'b'|'c'，前者(string)是后者('a'|'b'|'c')的父类型。父类型不能赋值给子类型，所以就报错了。

//上面报错，可以使用‘断言’解决报错。
let bar:T = foo as T;//这里foo as T表示告诉编译器，变量foo的类型断言为T，所以这一行不再需要类型推断，然后编译器直接把foo的类型当作T，所以就不报错了。

let bar:T = <T>foo;//foo as T是第一种断言语法。这里<T>foo是第二种断言语法。
```
### declare关键字
```ts
declare关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。
它的主要作用，就是让当前文件可以使用其他文件声明的类型。举例来说，自己的脚本使用外部库定义的函数，编译器会因为不知道外部函数的类型定义而报错，这时就可以在自己的脚本里面使用declare关键字，告诉编译器外部函数的类型。这样的话，编译单个脚本就不会因为使用了外部类型而报错。

declare关键字的重要特点是，它只是通知编译器某个类型是存在的，不用给出具体实现。比如，只描述函数的类型，不给出函数的实现，如果不使用declare，这是做不到的。

declare只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构。另外，所有 declare 语句都不会出现在编译后的文件里面。

如，当前脚本使用了其他脚本定义的全局变量x，
x = 123; //报错，因为变量x是其他脚本定义的，当前脚本不知道它的类型，所以编译器报错了。

declare let x:number;//这里使用 declare 命令给出了全局变量x的类型，所以就不报错了。
x = 123;
```
### .d.ts声明文件
```ts
单独使用的模块，一般会同时提供一个单独的类型声明文件（declaration file），把本模块的外部接口的所有类型都写在这个文件里面，便于模块使用者了解接口，也便于编译器检查使用者的用法是否正确。

类型声明文件里面只有类型代码，没有具体的代码实现。它的文件名一般为[模块名].d.ts的形式，其中的d表示 declaration（声明）。
```
### ts编译成js的小bug1
```javascript
//.ts
function aFun(){
    {
		//块级作用域
        let a:string = 'a'
        console.log(a);
    }
    console.log(a);
}
aFun();


//编译成.js后
function aFun(){
    {
		//块级作用域
        var a:string = 'a'//这里let会变成var，在使用中需注意
        console.log(a);
    }
    console.log(a);
}
aFun();
```
### 参考链接

[菜鸟教程 - TypeScript 教程](https://www.runoob.com/typescript/ts-tutorial.html)

[TypeScript 教程 - 阮一峰](https://typescript.p6p.net/)