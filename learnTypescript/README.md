# 学习TypeScript

### 安装TypeScript
```
npm install typescript -g
```
### 查询TypeScript版本号
```
tsc --v
```
### 初始化项目（生成package.json文件）
```
npm init -y //-y的意思是生成的package文件内容是默认的，这样我们就不用编辑了
```
### 把.ts文件编译成.js文件1
```
tsc xxxx.ts //编译一个文件，.ts可填可不填
tsc xxxx.ts xxxx.ts //编译多个ts文件，.ts可填可不填
```
### 声明变量
```javascript
//变量类型
//数值型：number 参数可以是整数，小数，undefined，null，NaN（Not a Number）
var a:number = 10;

//字符串型：string 参数可以是，用单引号或双引号引起来的字符，undefined，null
var b:string = 'This is B';

//布尔型：boolean 参数可以是true，false，undefined，null
//ts里不能用0来表示false和1来表示true
var c:boolean = true;

//枚举型：enum 
//人：男人，女人。//人分为男人和女人
enum REN{nan,nv}	//声明一个枚举类型，名称没有大小写限制
console.log(REN.nv) //打印：1，对应nv在REN里的下标

enum REN{nan='男人',nv='女人'}	//声明一个枚举类型
console.log(REN.nv) //打印：女人，对应nv下的参数

//万能类型：any 参数可以是数值，字符串，布尔等等
var d:any = '万能'
```
### 数组的使用
```javascript
//声明数组参数类型方式1
let arr1:string[] = ['1','2'];
console.log(arr1);
//声明数组参数类型方式2
let arr2:Array<string> = ['1','2'];
console.log(arr2);

//数组声明并赋值方式1（构造函数赋值）
let arr1:string[] = new Array('1','2','3')；
//数组声明并赋值方式2（字面量赋值）
let arr1:string[] = ['1','2']；
```
### 元祖类型
```javascript
//元祖，可以理解为一种数组
var x:[string,number]
//赋值的时候需要参数的类型，对应声明时的类型
//如:
x=['字符串',2];//这样就ok
x=[1,'字符串'];//没有对着声明时的类型的位置，所以报错
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
let ren:renlei = new renlei('王雷雷',18)
console.log(ren);//打印：renlei { name: '王雷雷', age: 18 }
ren.say();//打印：你好！我叫王雷雷,今年18岁

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
var ren = new renlei('王雷雷', 18);
console.log(ren);
ren.say();
```
### 类的修饰符(public,protected,private)
```javascript
class ren{
    public sex:string//公共属性sex
    protected name:string//受保护的属性name，只能在类ren,或类ren的子类中使用
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
let one:ren = new ren('男','王雷雷',28);
```
### 类的继承
```javascript
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

//声明一个有剩余参数的方法（解构）（这个有点蒙蔽，不明白）
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
### 接口，定义对象或方法规范
```javascript
//定义对象规范
interface ren{
    name:string//在使用时name必须使用
    age:number//在使用时age必须使用
    love?:boolean//可选属性
}
let It:ren = {"name":"弹幕人","age":1};
console.log(It);//{ name: '弹幕人', age: 1 }

//定义方法规范
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
### 命名空间
```javascript
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
### Ts编译成Js的小Bug1
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