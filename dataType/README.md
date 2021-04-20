# js数据类型

每天学习，就会每天成长

```
基本数据类型： String，Number，Boolean，null，undefined，Symbol

保存位置： 栈内存

---

引用数据类型：Object，Array，Function

保存位置：栈内存（栈内存里保存引用数据类型在堆内存中的引用地址），堆内存（数据本体）
```
## typeof 检测数据类型
```javascript
typeof "字符串" //"string"

typeof 123 //"number"

typeof true //"boolean"

typeof null //"object"

typeof undefined //"undefined"

typeof Symbol(1) //"symbol"

typeof {} //"object"

typeof [] //"object"

typeof function(){} //"function"
```
## Object.prototype.toString.call 检测数据类型
```javascript
Object.prototype.toString.call("字符串") //"[object String]"

Object.prototype.toString.call(123) //"[object Number]"

Object.prototype.toString.call(true) //"[object Boolean]"

Object.prototype.toString.call(null) //"[object Null]"

Object.prototype.toString.call(undefined) //"[object Undefined]"

Object.prototype.toString.call(Symbol(1)) //"[object Symbol]"

Object.prototype.toString.call({}) //"[object Object]"

Object.prototype.toString.call([]) //"[object Array]"

Object.prototype.toString.call(function(){}) //"[object Function]"

```
## 强制类型转换（不全）
```javascript
//1、强制数据类型转换成 字符串
String(1) //"1"

String(true) //"true"

String(null) //"null"

String(undefined) //"undefined"

String(Symbol(1)) //"Symbol(1)"

String({}) //"[object Object]"

String([]) //""

String([1,2,3,{}]) //"1,2,3,[object Object]"

String(function(){return 10}) //"function(){return 10}"


//2、强制数据类型转换成 数值
Number("1") //1

Number("a") //NaN

Number(true) //1

Number(null) //0

Number(undefined) //NaN

Number(Symbol(1)) //报错：Cannot convert a Symbol value to a number

Number({}) //NaN

Number([]) //0

Number([1]) //1

Number(["1"]) //1

Number(["a"]) //NaN

Number([1,2]) //NaN

Number(function(){}) //NaN


//3、强制数据类型转换成 布尔
/*
	使用Boolean()方法 强制数据类型转换成 布尔
	
	以下八种情况，会被转换成，false
	
	0、-0、NaN、null、undefined、空字符串、false、document.all()
	
	除了以上八种情况，都会被转换成，true

*/

```
## 隐式类型转换
```javascript
//隐式转换规则
/*
1、转成string类型： 字符串连接符（ +） ，两边有一边是字符串，则另一边会被转换成字符串

2、转成number类型：算术运算符（ +、-、*、/、%、++、--），关系运算符（ >、<、>=、<=、==、!=、===、!===），会被转换成数值

3、转成boolean类型：逻辑非运算符（ !）
*/

//1、字符串连接符 与 算术运算符 隐式转换规则
console.log(1 + 'true') //"1true"

console.log(1 + true) //2

console.log(1 + undefined) //NaN

console.log(1 + null) //1

/*
	解析：以上问题，容易将 字符串连接符（ +，两边有一边是字符串），与算数运算符（ +，两边都是数字）的隐式转换搞混淆
	
	1、字符串连接符（+）：会把其它数据类型通过调用String()方法转成字符串，然后在拼接字符串

	2、算数运算符（+）：会把其它数据类型通过调用Number()方法转成数值，然后在做加法运算
	
*/

//这里 + 是字符串连接符：String(1) + 'true' => '1true'
console.log(1 + 'true') //"1true"

//这里 + 是算数运算符：1 + Number(true) => 1 + 1 => 2
console.log(1 + true) //2

//这里 + 是算数运算符：1 + Number(undefined) => 1 + NaN => NaN
console.log(1 + undefined) //NaN

//这里 + 是算数运算符：1 + Number(null) => 1 + 0 => 1
console.log(1 + null) //1


//2、关系运算符，会把其它数据类型转成number，然后在进行比较
console.log("2" > 10) //false

console.log("a" > 10) //false

console.log("2" > "10") //true

console.log("abc" > "b") //false

console.log("abc" > "aad") //true

console.log(NaN == NaN) //false

console.log(undefined == null) //true

//解析：

//当关系运算符两边有一边是字符串的时候，会将字符串通过Number()转换，然后在比较
//Number('2') > 10 => 2 > 10 => false
console.log("2" > 10) //false
//Number('a') > 10 => NaN > 10 => false
console.log("a" > 10) //false

//当关系运算符两边都是字符串的时候，这时两边都转成number，然后在比较
//此时并不是调用Number()转数值，而是按照字符串对应的unicode编码，转成数字
//使用 '字符串'.charCodeAt() 这个方法来查看字符串unicode编码
//'2'.charCodeAt() > '10'.charCodeAt() => 50 > 49 => true
console.log("2" > "10") //true
console.log('10'.charCodeAt()) //49，这里charCodeAt方法，默认返回字符串中，第一个字符的编码，如果想查第二个字符，可传字符的下标，字符下标默认从0开始，也就是charCodeAt(1)会返回字符串里第二个字符的unicode码

//多个字符，从左往往右，依次比较
//先比较a与b，a与b不等，然后调用charCodeAt方法，'a'.charCodeAt() > 'b'.charCodeAt() => 97 > 98 => false
console.log("abc" > "b") //false
console.log("abc" < "b") //true
//先比较a与a，两者相等，则继续比较第二个字符，b与a，然后调用charCodeAt方法，'b'.charCodeAt() > 'a'.charCodeAt() => 98 > 97 => true
console.log("abc" > "aad") //true

//特殊情况，数据类型是undefined与null，则得出固定结果
console.log(undefined == undefined) //true
console.log(undefined == null) //true
console.log(null == null) //true

//特殊情况2，NaN与任何数据比较都是NaN
console.log(NaN == NaN) //false


//3、复杂数据类型（Object,Array）转number
var a = {
	value:0,
	toString:function(){
		this.value++
		return this.value;
	}
};
if(a == 1 && a == 2 && a == 3){
	console.log('haha') //haha
}

/*
	解析：复杂数据类型（Object，Array），转number，会先调用 valueOf()方法 获取其原始值，如果原始值不是number类型，则会调用toString()方法，转成字符串，然后在将字符串 转成 数值运行
*/
//这里，先将左边的数组转成string，然后两边的字符串转成unicode的下标数值，最后进行比较
console.log([1,2] == '1,2') //true
console.log([1,2].valueOf()) //[1,2]
console.log([1,2].toString()) //'1,2'

var a = {};
console.log(a == "[object Object]") //true
console.log(a.valueOf()) //{}
console.log(a.toString()) //"[object Object]"
console.log(a.valueOf().toString()) //"[object Object]"



//4、逻辑非隐式转换 与 关系运算符隐式转换搞混淆
//大坑
console.log([] == 0) //true
console.log(![] == 0) //true
//神坑
console.log([] == ![]) //true
console.log([] == []) //false
//史诗级坑
console.log({} == !{}) //false
console.log({} == {}) //false

/*
	解析：关系运算符（ >、<、>=、<=、==、!=、===、!===），将其它数据类型转成数字
	逻辑非（ !），将其它数据类型，使用Boolean()转成布尔类型
*/


//这里空数组会先调用valueOf方法，valueOf方法在这里返回的不是数值，是个空数组，然后又调用toString()，将空数组转换成了一个空串，因为这里是 == 关系运算符，所以又调用Number()方法，将空串转为了0，最后比较
//Number([].valueOf().toStirng()) == 0 => 0 == 0 => true
console.log([] == 0) //true


//这里 逻辑非（ !）的优先级 高于关系运算符，空数组在这里会因为逻辑非，先把空数组通过Boolean()方法，直接强转布尔，空数组转布尔，得到true，然后因为逻辑非，true取反 得到false，最后false == 0，最后返回结果
/*
变化过程：
1、![] == 0
2、!Boolean([]) == 0 //因为逻辑非（ ！）优先级 高于 关系运算符，所以空数组因为 逻辑非，直接被强转布尔
3、!true == 0
4、false == 0
5、Number(false) == 0
6、0 == 0
*/
console.log(![] == 0) //true


//这里右边的空对象因为 逻辑非 的优先级高于 关系运算符，右边的空对象在这里会 因为 逻辑非的原因，先把空对象通过 Boolean()方法，直接转成布尔，空对象强转布尔，得到true，逻辑非取反，得到false，然后在调用Number转数值，得到0
//这里左边的空对象会因为关系运算符的原因，会被转成数值，会先调用valueOf，得到空对象，不是数值，则继续调用toString，得到"[object Object]"，然后把这个字符串，通过Number转成数值，得到NaN
/*
变化过程：
1、{}.valueOf().toString() == !Boolean({})
2、"[object Object]" == !true
3、"[object Object]" == false
4、Number("[object Object]") == Number(false)
5、NaN == 0
*/
console.log({} == !{}) //false


//引用类型数据存储在 堆中，栈中存的是地址，所以他们的结果是false
//这里相当于创建了像个空对象比较，两个空对象，地址不一样，所以不相等
console.log({} == {}) //false
var a = {};
console.log(a == a) //true


//这里左边的空数组 会被转成数值，[].valueOf().toString()，得到空串，空串通过Number转数值，得到0
//这里右边的空数组，因为逻辑非优先级高于关系运算符的原因，会先被强转布尔，空数组强转布尔，得到得到true，然后取反，得到false，false在转数值，得到0
console.log([] == ![]) //true
//这里相当于创建了像个空数组比较，两个空数组，地址不一样，所以不相等
console.log([] == []) //false
```