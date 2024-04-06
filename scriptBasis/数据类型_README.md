# js数据类型

每天学习，就会每天成长

```
基本数据类型： String，Number，Boolean，null，undefined，Symbol

保存位置： 栈内存

---

引用数据类型：Object，Array，Function

保存位置：栈内存（栈内存里保存引用数据类型在堆内存中的引用地址），堆内存（数据本体）
```
## 检测数据类型方法1，typeof
```javascript
typeof "字符串" //"string"

typeof 123 //"number"

typeof NaN //"number"

typeof true //"boolean"

typeof undefined //"undefined"

typeof function(){} //"function"

typeof {} //"object"

typeof [] //"object"

typeof null //"object"

typeof Symbol(1) //"symbol"

typeof typeof undefined //"string" 先运算typeof undefined得出"undefined"，然后运算typeof "undefined"，最后得出"string"

typeof alert //"function"

typeof alert("哈哈") //"undefined" alert方法运行后，alert方法默认return一个undefined回来，function不写return都默认返回undefined，typeof undefined，最后得出"undefined"

typeof a123 //"undefined"，这里a123是未经声明的，typeof 未经声明的变量，不不报错，打印undefined。一个未经声明的变量，直接使用会报错，但typeof比较特殊不会报错。Object.prototype.toString.call(a123)，这个变量如果是未经声明的，会报错
```
## 检测数据类型方法2，Object.prototype.toString.call
```javascript
Object.prototype.toString.call("字符串") //"[object String]"

Object.prototype.toString.call(123) //"[object Number]"

Object.prototype.toString.call(true) //"[object Boolean]"

Object.prototype.toString.call(undefined) //"[object Undefined]"

Object.prototype.toString.call(function(){}) //"[object Function]"

Object.prototype.toString.call({}) //"[object Object]"

Object.prototype.toString.call([]) //"[object Array]"

Object.prototype.toString.call(null) //"[object Null]"

Object.prototype.toString.call(Symbol(1)) //"[object Symbol]"

Object.prototype.toString.call(a123) //报错，提示a123未定义。如果是typeof一个未经定义的变量的，不会报错，会打印undefined
```

## 显式数据类型转换
```javascript
/*
问：什么是 显式类型转换？
答：直接明了的调用方法转换数据类型，通过js提供的数据类型转换方法，将一个类型转成另一个类型。
*/

String()

Number()

Boolean()

parseInt()

parseFloat()

toString()


//1、强制数据类型转换成 字符串
String(1) //"1"

String(true) //"true"

String(undefined) //"undefined"

String(function(){return 10}) //"function(){return 10}"

String({}) //"[object Object]"

String([]) //""
String([1,2,3,{}]) //"1,2,3,[object Object]"

String(null) //"null"

String(Symbol(1)) //"Symbol(1)"


//2、强制数据类型转换成 数值
Number("") //0
Number("1") //1
Number("a") //NaN
Number("-123") //-123
Number("123abc") //NaN
Number("false") //NaN
Number("[1]") //NaN
Number("null") //NaN
--
Number(true) //1
Number(false) //0
--
Number(undefined) //NaN
--
Number(function(){}) //NaN
--
Number({}) //NaN
--
Number([]) //0
Number([1]) //1
Number(["1"]) //1
Number(["a"]) //NaN
Number([1,2]) //NaN
--
Number(null) //0
--
Number(Symbol(1)) //报错：Cannot convert a Symbol value to a number


//3、强制数据类型转换成 布尔
/*
	使用Boolean()方法 强制数据类型转换成 布尔
	
	以下八种情况，会被转换成，false
	
	0、-0、NaN、null、undefined、空字符串、false、document.all()
	
	除了以上八种情况，都会被转换成，true

*/


//4、parseInt(string, radix)解析字符串,返回一个十进制的整数
parseInt("2") //2
parseInt("1.6") //1
parseInt("123a") //123
parseInt("a123") //NaN
--
parseInt("10",16) //16 这时第一个参数里的10不是十进制的数字10。而是16进制的两位 1和0。十六进制，逢16进1，最后转成十进制得出16。((1*16)+0)=16
parseInt(10,16) //16
parseInt("b",16) //11 这时第一个参数里的b被认为是16进制的，b在16进制里代表十进制的11
parseInt("2a",16) //42 这时第一个参数里的2a被认为是16进制的。16进制，逢16进1，这个参数的第一位2 是进行了两次，逢16进1，才变成2的（或理解为，有2个16），如果再来一次逢16进1，那这里就会变成3。参数的第二位a在16进制里代表十进制10，所以最后得出：((2*16)+10)=42

parseInt("2ab",16) //683
//参数倒着看第一个b，在16进制里代表十进制11
//参数倒着看第二个a，因为16进制逢16进1，所以说明这个a代表已经累计进行了10次，逢16进1（或理解为，有10个16）。所以这里是 (10*16)=160
/*三位的16进制数 0（倒数第三位） 0（倒数第二位） 0（倒数第一位）
倒数第二位 代表 "倒数第一位"累计进行了多少次逢16进1，如果"倒数第二位"是4，则说明"倒数第一位"进行了4次，逢16进1，也就是有4个16
如果"倒数第二位"累计了16次，也就是有16个16了，则这时"倒数第三位"会发生变化（这时倒数第三位，会进一(加一)）
//所以 倒数第三位2，的意思是 "倒数第二位" 累计进行了 2次“16个16”，也就是有 2组“16个16”。(2*(16*16))=256
*/
//(11)+(16*10)+(2*(16*16))=683
//最后得出：11+160+256=683

//5、parseFloat(string)解析字符串，返回一个浮点数
parseFloat("10") //10
parseFloat("10.33") //10.33
parseFloat("34 45 66") //34
parseFloat("40y") //40
parseFloat("a40") //NaN

```
## 隐式类型转换
```javascript
/*
问：什么是 隐式类型转换？
答：js偷偷给你转换数据类型。参数在运算时，被转换成能够运行的能得到结果的数据类型，如1*"2"=2，这个字符串2在在运算时，被偷偷转换成了数值型。
隐式数据类型转换时，也是调用的显式类型转换的方法。
*/



//1、转成string类型： 字符串连接符（ + ） ，两边有一边是字符串，则另一边会被转换成字符串

//2、转成number类型：算术运算符（ +（加号）、-（减号）、*、/、%、++、--、+（正）、-（负） ），关系运算符（ >、<、>=、<=、==、!=、===、!=== ），会被转换成数值

//3、转成boolean类型：逻辑非运算符（ ! ）



//1、加号在js里有两种身份（字符串连接符、算术运算符）加号的隐式类型转换规则
console.log(1 + 'true') //"1true"

console.log(1 + true) //2

console.log(1 + undefined) //NaN

console.log(1 + null) //1

console.log(+ true) //1

/*	
	1、字符串连接符（+）： 加号两边有一边是字符串，则会把其它数据类型通过调用String()方法转成字符串，然后在拼接字符串

	2、算数运算符（+）的加号：加号两边没有字符串数据，则会通过Number()方法，把非数值类型转成数值，然后在做加法运算

	3、算数运算符（+/-）的正负号：加号前边没有东西，加号后边有参数，这时加号是算数运算符，是参数的正负号，转换方法与上边一样，调用Number强制数据类型转换
*/

//这里 + 是字符串连接符：String(1) + 'true' => '1true'
console.log(1 + 'true') //"1true"

//这里 + 是算数运算符的加号：1 + Number(true) => 1 + 1 => 2
console.log(1 + true) //2

//这里 + 是算数运算符的加号：1 + Number(undefined) => 1 + NaN => NaN
console.log(1 + undefined) //NaN

//这里 + 是算数运算符的加号：1 + Number(null) => 1 + 0 => 1
console.log(1 + null) //1

//这里 + 是算数运算符的正负号：Number(true) => 1
console.log(+ true) //1





//2、关系运算符，会把其它数据类型转成number，然后在进行比较
console.log("2" > 10) //false

console.log("a" > 10) //false

console.log("2" > "10") //true

console.log("abc" > "b") //false

console.log("abc" > "aad") //true

console.log(NaN == NaN) //false

console.log(true > false) //true

console.log(1 > 2 < 3) //true

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
console.log("2" > "10") //true '2'.charCodeAt() > '10'.charCodeAt() => 50 > 49 => true
console.log('10'.charCodeAt()) //49，这里charCodeAt方法，默认返回字符串中，第一个字符的编码，如果想查第二个字符，可传字符的下标，字符下标默认从0开始，也就是charCodeAt(1)会返回字符串里第二个字符的unicode码

//多个字符，从左往往右，依次比较
console.log("abc" > "b") //false	//先比较a与b，a与b不等，然后调用charCodeAt方法，'a'.charCodeAt() > 'b'.charCodeAt() => 97 > 98 => false

console.log("abc" > "a") //true
//第一个字符比较："a" 和 "a"。它们相同，所以继续比较下一个字符。
//第二个字符比较："b" 和没有字符了（因为 "abc" 比 "a" 长）。在这种情况下，JavaScript 会假定缺少的字符的 unicode 值为 0。所以 "b" 的 unicode 值（98）比 0 大，因此 "abc" 中的字符更大。

console.log("abc" < "b") //true

console.log("abc" > "aad") //true	//先比较a与a，两者相等，则继续比较第二个字符，b与a，两者不等，则调用charCodeAt方法，'b'.charCodeAt() > 'a'.charCodeAt() => 98 > 97 => true

console.log("aba" > "ab") //true
//第一个字符比较："a" 和 "a"。它们相同，所以继续比较下一个字符。
//第二个字符比较："b" 和 "b"。它们相同，所以继续比较下一个字符。
//第三个字符比较："a" 和没有字符了（因为 "aba" 比 "ab" 长）。在这种情况下，JavaScript 会假定缺少的字符的 unicode 值为 0。所以 "a" 的 unicode 值（97）比 0 大，因此 "aba" 中的字符更大。

console.log(true > false) //true
//Number(true) => 1，Number(false) => 0，1>0 => true

console.log(1 > 2 < 3) //true
//从左往右运算，先运算1>2 => false，变成Number(false)<3 => 0<3 => true

//特殊情况，数据类型是undefined与null，则得出固定结果
console.log(undefined > 0); //false
console.log(undefined < 0); //false
console.log(undefined == 0); //false

console.log(null > 0); //false
console.log(null < 0); //false
console.log(null == 0); //false

console.log(undefined == undefined) //true
console.log(null == null) //true
console.log(undefined == null) //true

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


//这里右边的空对象因为 逻辑非 的优先级高于 关系运算符，右边的空对象在这里会 因为 逻辑非的原因，会先把空对象通过 Boolean()方法，直接转成布尔，空对象强转布尔，得到true，逻辑非取反，得到false
//这里左边的空对象因为右边对象被逻辑非变成false和关系运算符的原因，会被转成数值，会先调用valueOf，得到空对象，不是数值，则继续调用toString，得到"[object Object]"
//这时左边对象变成字符串"[object Object]"，右边对象变成布尔值false。如上文所说（当关系运算符两边有一边是字符串的时候，会将字符串通过Number()转换，然后在比较），所以这里变成Number("[object Object]") == Number(false)，最后NaN == 0结果是false
/*
变化过程：
1、{} == !Boolean({})
2、{} == !true
3、{} == false
4、{}.valueOf().toString() == false
5、"[object Object]" == false
6、Number("[object Object]") == Number(false)
7、NaN == 0
*/
console.log({} == !{}) //false


//引用类型数据存储在 堆中，栈中存的是地址，所以他们的结果是false
//这里相当于创建了两个空对象比较，两个空对象，地址不一样，所以不相等
console.log({} == {}) //false
var a = {};
console.log(a == a) //true


//这里左边的空数组 会被转成数值，[].valueOf().toString()，得到空串，空串通过Number转数值，得到0
//这里右边的空数组，因为逻辑非优先级高于关系运算符的原因，会先被强转布尔，空数组强转布尔，得到得到true，然后取反，得到false，false在转数值，得到0
console.log([] == ![]) //true
//这里相当于创建了两个空数组比较，两个空数组，地址不一样，所以不相等
console.log([] == []) //false
```
## 逻辑运算符（&&，||，!）
```javascript
//1、逻辑非（ ！），返回的一定是，布尔值
//使用逻辑非（ ！）时，如果参数是布尔值，会取反。如果参数不是布尔值，是其它数据类型，会先调用Boolean()方法将参数强制转成 布尔值，然后在取反

console.log(!true)  //false

//!0 => !Boolean(0) => !false => true
console.log(!0) //true

//!2 => !Boolean(2) => !true => false
console.log(!2) //false

//!undefined => !Boolean(undefined) => !false => true
console.log(!undefined) //true

//!null => !Boolean(null) => !false => true
console.log(!null) //true

//!NaN => !Boolean(NaN) => !false => true
console.log(!NaN) //true


//2、逻辑运算符 通常用于布尔值(或使用布尔值)，这种情况下，它们返回一个布尔值
//逻辑与 和 逻辑或 运算符会返回一个指定 参数的值，因此，这些 逻辑运算符 也可用于非布尔值，这时 它们也会返回一个非布尔型值，如下是，逻辑与 和 逻辑或 用于非布尔值的运算过程(或案例)

//逻辑与（&&），参数1 && 参数2，若 参数1 可转换为 true，则返回 参数2；否则，返回 参数1
//逻辑与，是从左往右计算的，运算时，是简便运算，即如果第一个参数决定了结果，就不再计算第二个运算数
//undefined && {} => Boolean(undefined) && {} => false && {}
console.log(undefined && {}) //undefined
//{} && {a:1} => Boolean({}) && {a:1} => true && {a:1}
console.log({} && {a:1}) //{a:1}

//逻辑或（||），参数1 || 参数2，若 参数1 可转换为 true，则返回 参数1；否则，返回 参数2
//逻辑或，是从左往右计算的，运算时，是简便运算，即如果第一个参数决定了结果，就不再计算第二个运算数
//undefined || {} => Boolean(undefined) || {} => false || {}
console.log(undefined || {}) //{}
//{} || {a:1} => Boolean({}) || {a:1} => true || {a:1}
console.log({} || {a:1}) //{}

//实战应用1
let a = function(){
    console.log('I am A')
}
a && a() //'I am A'

//实战应用2
let c = 10
let b = c || 20
console.log(b) //10

let c = undefined
let b = c || 20
console.log(b) //20
```
## 特殊运算符
```javascript
// ,逗号运算符
var a = (2-1,3-1,4-1);
//打印3
//逗号运算符，会先计算逗号前面的，然后再计算逗号后面的，最后返回最后面的

```
## 数据拷贝
```javascript
var obj1 = {
	name:"abc",
	age:132,
	card:["visa","master"],
	wife:{
		name:"bdb",
		son:{
			name:"aaa"
		}
	}
}

//1、判断数据是不是原始值，是原始值，直接拷贝

//2、不是原始值，判断是对象还是数组

//3、建立相应的空对象或空数组，然后将对象或数组按照新的引用值，再次调用方法

function deepClone(origin,target){
	
	for(let key in origin){
		if(typeof origin[key] == 'object'){
			//引用类型
			if(origin[key] == null){
				target[key] = null;
			}else if(Array.isArray(origin[key])){
				target[key] = [];
				deepClone(origin[key],target[key])
			}else{
				target[key] = {};
				deepClone(origin[key],target[key])
			}
		}else{
			//基础值
			target[key] = origin[key]

		}
	}

}

```