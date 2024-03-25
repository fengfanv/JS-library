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
```
### 安装ts-node
```
npm install ts-node -g
```
### 使用ts-node直接运行.ts文件
```
ts-node xxxx.ts
```
### ts数据类型
```
1、any 任意类型
声明为 any 的变量可以赋予任意类型的值。

2、number 数字类型
双精度 64 位浮点值。它可以用来表示整数和分数。
let a1: number = 0b1010; // 二进制
let a2: number = 0o744;  // 八进制
let a3: number = 6;      // 十进制
let a4: number = 0xf00d; // 十六进制

3、string 字符串类型
使用单引号（'）或双引号（"）来表示字符串类型。反引号（`）来定义多行文本字符串。
let name: string = "Kang";

4、boolean 布尔类型
表示逻辑值：true 和 false。
let flag: boolean = true;

5、数组类型
let arr: number[] = [1, 2]; // 声明数组方式1，在元素类型后面加上[]
let arr: Array<number> = [1, 2]; // 声明数组方式2，使用数组泛型

let arr: string[] = new Array('1','2','3');
let arr: any[] = [1, false, 'fine'];

6、元组
元组类型用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型需要相同。
let x: [string, number];
x = ['kang', 1];    // 运行正常
x = [1, 'kang'];    // 报错
console.log(x[0]);  // 输出 kang

7、enum 枚举
枚举类型用于定义数值集合。

如，人分为男人和女人，人(男人，女人)
enum Ren{nan,nv}	//声明一个枚举类型，名称没有大小写限制
console.log(Ren.nv) //打印：1，对应nv在Ren里的下标

enum Ren{nan='男人',nv='女人'}	//声明一个枚举类型
console.log(Ren.nv) //打印：女人，对应nv下的参数

8、void
用于标识方法返回值的类型，表示该方法没有返回值。
function hello(): void {
    alert("Hello Kang");
}

9、null 空
和js里要表达的意思一样
null是一个只有一个值的特殊类型。表示一个空对象引用。
用 typeof 检测 null 返回是 object。

10、undefined
用于初始化变量为一个未定义的值

11、never
never 其它类型。

12、联合类型
var val:string|number 
val = 12 
console.log("数字为 "+ val) 
val = "kang" 
console.log("字符串为 " + val)


注意：元组与数组区别
1、固定长度：元组的长度是固定的，一旦定义了一个元组类型，你就不能再添加或删除元素。
2、类型化元素：元组的每个位置都有一个特定的类型。这意味着你可以访问元组的特定元素，并且TypeScript会知道该元素的类型。
3、值可改变：虽然元组的长度是固定的，但是元组中的元素值是可以改变的。你可以修改一个已经存在的元组元素的值，只要新值符合该位置的类型要求。


注意：TypeScript 和 JavaScript 没有整数类型。
```
### 日期类型使用
```javascript
var d1:Date = new Date();
console.log(d1);//2020-06-299T11:02:14.369Z，这个时间不是本地的事件，需要设置时区

//传递一个毫秒数
var d2:Date = new Date(2000);
console.log(d2);//时间是从1970,1,1开始，回1000毫秒等于1秒
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
var dog_a = new dog('a');//使用 new关键字 创建类的对象
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
console.log(wangleilei);//打印：renlei { name: '王雷雷', age: 18 }
wangleilei.say();//打印：你好！我叫王雷雷,今年18岁

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
### 类访问控制修饰符(public，protected，private)
```javascript
class ren{
    public sex:string//公共属性sex，可以在任何地方被访问。
    protected name:string//受保护的属性name，只能在 类ren本身内 或 类ren的子类中 使用
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
    protected sayLove(){//受保护的方法，只能在类ren或类ren的子类中使用
        console.log('loves you!');
    }
}
let wangleilei:ren = new ren('男','王雷雷',28);
```
### 类的static关键字
```ts
static关键字用于声明一个类的静态成员，这意味着这个成员是属于类本身的，而不是类的实例。

静态成员是直接在类上定义的属性/方法，而不是在类的实例上。你可以通过类名来访问和修改它，而不需要创建类的实例。

静态成员不能通过类的实例来访问或调用。
静态成员不能访问类的非静态成员（属性和方法），因为非静态成员需要类的实例来存在。
静态成员在类加载时初始化，而不是在创建类的实例时。
子类可以继承父类的静态成员

class Ren {  
    static num:number; 
    
    static disp():void { 
       console.log("num 值为 "+ Ren.num) 
    } 
 } 
  
 Ren.num = 12  // 初始化静态变量
 Ren.disp()    // 调用静态方法

 var obj:Ren = new Ren()
//  console.log(obj.num)//报错，obj实例对象上没有num属性
```
### 类的继承
```javascript
TypeScript 一次只能继承一个类，不支持继承多个类，但 TypeScript 支持多重继承（C 继承 B，B 继承 A）

子类除了不能继承父类的私有成员(方法和属性)，其他的都可以继承。

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
### 类继承属性方法的重写
```javascript
子类可以继承父类的属性和方法，并且子类可以重写（或称为覆盖）父类的非私有属性和方法。

如果父类中的属性或方法被声明为private，则它们不能在子类中被访问或重写。如果它们被声明为protected，则它们可以在子类中被访问，但不能在子类之外被访问。如果它们被声明为public或没有明确的访问修饰符（默认为public），则它们可以在任何地方被访问。

在子类中，可以使用super关键字来访问父类的属性和方法。

子类不能重写父类的静态成员（静态属性和静态方法）。静态成员属于类本身，而不是类的实例。因此，它们不能被子类继承或重写。但是，子类可以声明自己的静态成员，这些成员与父类的静态成员是独立的。

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
    public sayHello(){//重写me类中的sayHello方法
        super.sayHello();//调用me类中的sayHello方法
        console.log('我是'+this.name+'，我在，mySon类中');
    }
    public zhuanqian(){
        console.log('我会赚钱');
    }
}

//因为继承了me类的属性和方法，所以可以使用me类中的constructor构造方法
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
    constructor(name: string, age: number, money: number) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
    say(text: string):string {
        let str:string = `我是${this.name}。我今年${this.age}。我有${this.money}元。`;
        console.log(str);
        return str;
    }
}

// class B extends A {
//     name:number //报错。类型“B”中的属性“name”不可分配给基类型“A”中的同一属性。不能将类型“number”分配给类型“string”。
// }

// class B extends A {
//     money:number //报错。类“B”错误扩展基类“A”。属性“money”在类型“A”中是私有属性，但在类型“B”中不是。
// }

// class B extends A {
//     say:string //报错。类型“B”中的属性“say”不可分配给基类型“A”中的同一属性。不能将类型“string”分配给类型“(text: string) => void”。
// }

// class B extends A {
//     say(name:string,age:number):string{ //报错。类型“B”中的属性“say”不可分配给基类型“A”中的同一属性。不能将类型“(name: string, age: number) => string”分配给类型“(text: string) => string”。
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
instanceof运算符用于判断对象是否是指定的类型

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
//剩余参数语法允许我们将一个不确定数量的参数作为一个数组传入。//类似将多个形参转换成数组来进行访问。类似调用js里arguments属性。
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
类：类是蓝图或模板。类定义了对象的属性和方法，并且可以包含实现细节（即方法的具体代码）。
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
console.log("value 1: "+Iobj.v1+" value 2: "+Iobj.v2)
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
命名空间一个最明确的目的就是解决重名问题。

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
### ts泛型
```

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