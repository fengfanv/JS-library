# js函数

## 1、定义函数
```javascript
//定义函数第一种，函数声明
function test(){}
console.log(test.name); //test

//定义函数第二种，函数表达式，函数表达式有两种（一种叫命名，一种叫匿名），通常认为的函数表达式 是第二种匿名函数表达式
//1、命名函数表达式声明
var test1 = function abc(){}
console.log(test1.name); //abc
test1()//可正常运行
abc()//Uncaught ReferenceError: abc is not defined
//表达式声明一个函数，会忽略函数的名字，所以函数的abc没啥用，因为没啥用，所以出现了下面这个匿名函数表达式声明

//2、匿名函数表达式声明（函数表达式）
var test2 = function(){}
console.log(test2.name); //test2


function add(a,b){
	//这里a和b代表在调用add方法时，传进来的参数，因为是“代表传进来的参数”所以叫“形式参数”
}

add(1,2);//这里1和2，是实实在在的参数的数据值，所以在这里叫“实际参数”

//在js里，假如形参定义了5个参数，调用方法时传的实参不用非得也是5个，传1个也行，不传也行。但C语言里这种就是不行的

function add(a,b){
	//每个函数里都有一个用来接收调用方法时传进来的实参的列表，叫“agruments”实参列表
	//agruments实参列表，类数组，代表实参，有length属性，这个length属性代表实参的数量。如 执行add(1,2,3,4)后 这里 console.log(agruments.length)会打印，4

	//每个方法都有一个length属性，这个length属性，代表函数形参的数量，这里调用console.log(add.length)会打印，2
}
add(1,2,3,4)

function add(a,b,c){
	/*
	函数内arguments(实参列表)与(函数的形参)是有映射连接的，只是有映射，不是一个东西。
	也就是说，在这里，运行arguments[0] = 4后，形参a的值也会发生变化成4。运行a=8，arguments[0]也会跟着变化成8
	但上面这种映射有特殊情况：
	就是当函数运行时形参里没有对应的实参时，这时是没有映射的。
	如add方法定义有a b c三个形参，但在调用add方法时，就传了两个实参，这时形参a b和arguments(实参列表)有映射，c没有映射。
	如运行arguments[2] = 4手动给arguments增加数据，这时打印c的值，c是undefined。
	如运行c = 10，打印arguments[2]的值，如果arguments[2]没有手动设置值，则会打印undefined

	实参列表arguments除了有length属性，还有个callee()方法，这个callee方法指向函数自己，在这个方法内arguments.callee(1,2,3) 和 add(1,2,3)效果是一样的
	*/

	/*
	实验特殊情况的方法
	function add(a,b){
		console.log(b);
		console.log(arguments[1]);
		b = 1;
		console.log(b);
		console.log(arguments[1]);
		arguments[1] = 2;
		console.log(b);
		console.log(arguments[1]);
	}
	add(1)
	*/
}
add(1,2)

```

## 预编译
```javascript
//1、暗示全局变量(imply global)：即任何变量，如果变量未经声明就赋值，此变量就为全局变量所有。

//注意：未经声明就赋值，不报错，算全局变量

//注意：未经声明就使用，会报错。如a未声明就使用，报错 Uncaught ReferenceError: a is not defined

<script>
function abc(){
    var a = b = 123;
}
console.log(a); // Uncaught ReferenceError: a is not defined
console.log(b); // Uncaught ReferenceError: b is not defined
abc();
console.log(a); // Uncaught ReferenceError: a is not defined
console.log(b); // 123 变量b 未经声明就赋值，变量b 变成全局变量
</script>

//2、一切声明的全局变量，全是window的属性

//window就是全局的作用域


//函数预编译

//函数预编译发生在函数执行的前一刻

function test(a){

	console.log(a);

	var a = 123;

	function a(){}

	console.log(a);

	var b = 8;

	function fun1(){}

	var c = function (){}
}
//函数预编译发生在函数执行的前一刻
test(1);//运行这行代码后，js内部先预编译，然后再执行函数内代码


//预编译第一步，创建AO对象（AO，Activation Object，活动对象，简单的理解，就是我们所认为的作用域，也叫，执行期上下文）
//AO对象长啥样，就是一个对象
/*
这时test方法的AO长这样
AO{

}
*/

//预编译第二步，找函数内的形参和变量声明，将变量和形参的名作为AO对象的属性名，值为undefined。
//这一步的找变量声明，然后将变量名添加到AO对象，值设undefined，就是通常所说的“变量提升”，执行前先声明，执行时，执行到指定行代码才赋值
/*
这里a是形参，也是a变量声明，名一样了，所以在AO对象内添加一个a属性名就行了，然后这里先不用管a函数声明,
函数体内c是函数表达式，但它和普通变量声明没啥区别，只不过它后面赋的值是一个匿名函数，所以在这一步，也要将c添加到AO对象内，值设undefined
这时test方法的AO长这样
AO{
	a:undefined,
	b:undefined,
	c:undefined,
}
*/

//预编译第三步，将实参值和形参统一（将实参值付给形参）
/*
这时test方法的AO长这样
AO{
	a:1,
	b:undefined,
	c:undefined,
}
*/

//预编译第四步、在函数体内，找函数声明，值赋予函数体（找到函数声明后，将函数声明的名字，作为AO对象的属性名，然后值设置函数体）
//这一步的“找函数声明，然后将函数添加到AO对象里”就是通常所说的“函数提升”，函数声明在执行前，会先提升。还有就是之前说的函数声明权重最高，是因为预编译在最后阶段才赋值函数体。
/*
test方法内，fun1是函数声明，c不是，c是函数表达式，所以这里需要将fun1作为AO对象的属性名，然后值设置为函数体（什么是函数体？function fun1(){}的这个代码就是函数体），
这里a函数声明和a形参名和a变量声明名一样，a名字已经在AO对象里了，所以就不用再在AO对象里再添加一个a属性名，直接给AO对象里的a属性重新赋值就行了，重新付了个a的函数体
这时test方法的AO长这样
AO{
	a:function a(){}, 
	b:undefined,
	c:undefined,
	fun1:function fun1(){}
}
*/

//这里，补充一下，预编译第四步，或预编译流程完成前，还会在AO里加入两个参数
//1、实参列表(arguments)
//2、加入一个this，然后让this指向window


//预编译4步完成后，函数AO对象初始化完成，接下来就要执行函数内代码

//执行第一行，console.log(a); //这时AO里a是a函数声明的函数体，则这里打印a函数声明的函数体 //打印：function a(){}

//执行第二行，var a = 123; //这里忽略var a，因为var a已经在预编译阶段，将a属性添加到AO内，所以这里已经声明完了。只执行a = 123，重新给a赋值就可以了

//第三行，function a(){}，已经在预编译时候，添加到了AO对象内，执行阶段就不用处理这行了

//执行第四行，console.log(a); //这里打印：123，因为执行第二行时，a被重新赋值了

//执行第五行，var b = 8;//同第二行一样，给b赋值8

//第六行，function fun1(){}，同第三行一样

//执行第七行，var c = function (){}，c已经在预编译阶段添加到AO里，这里只执行给c赋值一个匿名的函数体


//全局预编译

//全局预编译和函数预编译差不多，但有区别。
//区别1，在全局预编译第一步时，创建的不是AO对象，创建的是GO对象(Global Object)
//区别2，在全局预编译第二步时，只找变量声明，不找形参(因为全局没形参)
//区别3，全局预编译的第三步，是(找函数声明，值赋予函数体)。这里和函数预编译第四步一样。这里不是函数预编译第三步(将实参值和形参统一)，是因为全局没有形参，所以不需要赋值，所以这里也就不需要函数预编译的第三步。

<script>
	var a = 123;
	function a(){};
</script>

//预编译第一步，创建一个GO对象（Global Object，简单的理解，就是我们所认为的全局作用域，也叫，全局执行期上下文）
/*
GO{

}
*/

//预编译第二步，找变量声明，将变量的名作为GO对象的属性名，值为undefined。
//这里就是通常所说的“变量提升”
/*
GO{
	a:undefined
}
*/

//预编译第三步，找函数声明，值赋予函数体（找到函数声明后，将函数声明的名字，作为GO对象的属性名，然后值设置函数体）
//这里就是通常所说的“函数提升”
/*
GO{
	a:function a(){}
}
*/

//全局预编译完成，GO初始化完成，接来下来开始执行代码，这里这个GO对象就是window对象


//执行第一行代码，var a = 123;，因为var a已经在预编译阶段完成，所以在这里，只给a赋值123就可以了
/*
这时GO
GO{
	a:123
}
*/

//第二代码，function a(){};，这个a函数声明已经在预编译阶段，添加到GO里，所以这里在执行阶段不用处理

/*
如预编译时遇到如下代码：
if(a == 123){
	var b = 456;
}
问：预编译时，var b会在预编译阶段，被添加到相关执行上下文内吗？
答：虽然有if判断，但在预编译阶段，b是一定会被添加到相关执行上下文内，然后b的值是undefined。预编译结束后，执行代码了，如果a==123，则给b赋值456
*/
```

## 函数作用域
```javascript
// 作用域定义：变量（变量作用域又称为 上下文） 和 函数生效（能被访问的） 的区域
// 作用域定义：变量 和 函数生效 的区域
// 作用域指的是您有权访问的变量集合


//function 是一种特殊的对象类型，所以它身上，可以有很多属性。这些属性分为两大类，能直接访问的，和不能直接访问的

//如test方法，能直接访问的属性有：
function test(a,b){ }
test.name 
test.length
test.prototype
//上面这些属性是直接能使用的

//function 还有一些属性，是我们“不能直接访问”的属性，如下面这个：
test.[[scope]] //scope 域，这个scope就是作用域，scope 是方法的隐式属性，这个属性仅供js引擎使用。这里面存的是，很多个执行期上下文的集合。

//[[scope]]中存储着，很多个执行期上下文对象的集合，这个集合呈链式链接，这就是我们通常说的作用域链

//执行期上下文(执行期上下文 AO 这里想更好的理解，看上面的预编译)：当函数在执行的前一刻(预编译阶段)，会创建一个被称为执行期上下文内部对象(AO)。

//执行期上下文定义了函数执行时的环境，函数每次执行时都会创建一个独一无二的对应的执行期上下文，所以多次调用函数，会创建多个执行期上下文，当函数执行完毕后，所产生的执行期上下文会被销毁



//接下来看演示
<script>
function a(){
	function b(){
		var b = 234;
	}
	var a = 123;
	b();
}
var glob = 100;
a();
</script>

//1111，这里，全局预编译已经结束，GO初始化完毕，且已经开始运行代码，现在运行到了var glob = 100; 所以给glob赋值100
/*
这时的GO
GO{
	a:function a(){...},
	glob:100
}

这时a方法，虽然还没有运行，但它已经被定义且保存了起来，等待被调用
虽然a方法还没有运行，但这时a方法的属性已经能访问了，所以这时a方法的[[scope]]也已经被生成了，且这时a.[[scope]]里也已经存在东西了，这个东西就是GO

所以这时a.[[scope]] = [
	0:GO
]
*/



//2222，这里，运行到了a()，a方法预编译完成，初始化了一个AO，然后将这个AO放到a方法的[[scope]]的顶部，a方法已经开始运行了，运行到了var a = 123;这行，所以给a赋值123
/*
这时的GO
GO{
	a:function a(){...},
	glob:100
}

这是新增的这个a方法的AO
AO{
	a:123,
	b:function b(){...}
}

//这时a方法的[[scope]]
a.[[scope]] = [
	0:AO    将新生成的这个AO放到了，链的顶部
	1:GO
]

这时如果想找一个变量，会从[[scope]]的顶部第0位开始找，依次向下查找
会先从[[scope]]的顶部找，也就是AO里，如果AO里没有，会再去[[scope]]的下一个里找，如果下一个也没有，如果[[scope]]还有很多内容，则会继续找，直到找到变量。如果找到了[[scope]]底部，还没有找到，则就是没有这个变量(这时会报错，报 要找的变量 还未定义)

这里需要注意一下，a方法已经开始运行，a方法里有个b方法，b方法在(a方法预编译阶段)已经被定义好，准备被调用，所以这时b方法的[[scope]]内也有东西了

//这时a方法内b方法的[[scope]]
b.[[scope]] = [
	0:AO
	1:GO
]
这里一看，你可能会差异，我去！怎么和a的[[scope]]一样，没错，这时b的[[scope]]就是从a方法那里，拿过来的，这个拿过来，是为了方便理解，现在b.[[scope]]里这俩，其实就是他们本体，或是影子，是有引用关系的，不是直接copy过来的
*/



//3333，这里a方法里运行到了 b();这行，b方法预编译后，生成了一个b方法的AO，然后放到b方法的[[scope]]内,然后b方法内运行到了var b = 234;这行，所以给b赋值234
/*
这时的GO
GO{
	a:function a(){...},
	glob:100
}

这时a方法的那个AO
AO{
	a:123,
	b:function b(){...}
}

//这时a方法的那个[[scope]]
a.[[scope]] = [
	0:AO  a方法的AO
	1:GO
]

这时b方法的那个AO
AO{
	b:234
}

//这时b方法的那个[[scope]]
b.[[scope]] = [
	0:AO  b方法的AO
	1:AO  a方法的AO
	2:GO
]

//这里在b[[scope]]内查找一个变量，会先从b自己的AO里找，找不到在去a方法的AO里找，a的AO里也找不到，则再去[[scope]]的最后一个GO里找，GO里如果还找不到，则就没有这个变量。
这也就解释了，为什么子方法可以用父方法内的变量，因为子方法一开始的[[scope]]是从父方法的[[scope]]那拿来的。
这也就解释了，为什么父方法内无法使用子方法的变量，因为父方法的[[scope]]里没有子方法的AO
*/
```
## 闭包
```javascript
<script>
function a(){
	function b(){
		var bbb = 234;
		console.log(aaa);
	}
	var aaa = 123;
	return b;
}
var glob = 100;
var demo = a();
demo();
</script>

//1111 这里，GO初始化成功，且开始运行代码，运行到了var glob = 100;这行，给glob赋值100；

/*
这时的GO
GO{
	a:function a(){...},
	glob:100,
	demo:undefined
}

//这时a方法已经被定义所以，a方法的[[scope]]内已经有东西了
a.[[scope]] = [
	0:GO
]

*/


//2222 这里代码，运行到了var demo = a();这行，a方法开始运行前一刻，a方法预编译后，初始化了一个a方法的AO，并放进了a方法的[[scope]]内。

/*
这时的GO
GO{
	a:function a(){...},
	glob:100,
	demo:undefined
}

这时a方法的AO
AO{
	b:function b(){...},
	aaa:undefined
}

这时a方法的[[scope]]
a.[[scope]] = [
	0:AO   //a方法预编译出来的AO
	1:GO
]

//这时a方法内的b方法已经被定义，所以b方法的[[scope]]内已经有东西了，这里一看，我去怎么和a方法的[[scope]]一样，确实是一样的，b方法在被定以后，会先把它所处的环境，保存到自己的[[scope]]里。说白了就是，b方法会把a方法现在的[[scope]]同步到自己的[[scope]]里
b.[[scope]] = [
	0:AO   //a方法的AO
	1:GO
]

*/

//3333 这里，a方法内开始执行代码，运行到了var aaa = 123;这行，给aaa赋值了123。然后又运行了return b;，把b方法导出了，a方法的return执行完了，也就代表着a方法运行完了，a方法[[scope]]内的 那个a在运行时产生的AO 就应该被消除，但是a方法里 那在运行时产生的AO没有被消除，因为a方法在预编译后，a方法内有个b方法，b方法被定义了，b方法会把a方法的[[scope]]同步到b方法自己的[[scope]]里，a预编译结束时，a的[[scope]]里有了 a方法产生的AO，这也就导致，b方法的[[scope]]里有 那个a方法产生的AO，a虽然把自己[[scope]]里的那个AO给删除了，但是b方法因为被return出去了，b方法[[scope]]里还有 那个a方法在运行前产生的AO，这种情况就是闭包

/*
这时的GO
GO{
	a:function a(){...},
	glob:100,
	demo:function b(){...},
}

这是a方法当时运行时产生的那个AO，现在在b的[[scope]]内
AO{
	b:function b(){...},
	aaa:123
}

这里展现的是a方法的已经运行完的[[scope]]，a方法运行完了，把 那个a当时运行的AO删除的 [[scope]]
a.[[scope]] = [
	0:GO
]

//这里展现的是，从a方法内被return出来的那个b方法的[[scope]]
b.[[scope]] = [
	0:AO   //a方法那个的AO，a自己的[[scope]]里已经删除了这个，但是被这里的b的[[scope]]给保存下来了
	1:GO
]

*/

//4444 这里代码运行到了demo();这行，demo方法就是a方法内的b方法，b方法预编译初始化了一个AO，放进了b方法的[[scope]]内，

/*
这时的GO
GO{
	a:function a(){...},
	glob:100,
	demo:function b(){...},
}

这是a方法当时运行时产生的那个AO，现在在b的[[scope]]内
AO{
	b:function b(){...},
	aaa:123
}

a方法现在的[[scope]]
a.[[scope]] = [
	0:GO
]

//b方法的[[scope]]
b.[[scope]] = [
	0:AO   //b方法预编译产生的AO
	1:AO   //a方法那个的AO，a自己的[[scope]]里已经删除了这个，但是被这里的b的[[scope]]给保存下来了
	2:GO
]

b方法AO
AO{
	bbb:undefined
}

*/


//5555 b方法开始执行代码，执行了var bbb = 234;，给bbb赋值了234，然后又运行了console.log(aaa);，打印了123，为啥能打印123，因为b方法的[[scope]]里有 那个a方法在运行时产生的AO，而在那个AO里有aaa变量，那个变量的值是123

/*
这时的GO
GO{
	a:function a(){...},
	glob:100,
	demo:function b(){...},
}

这是a方法当时运行时产生的那个AO，现在在b的[[scope]]内
AO{
	b:function b(){...},
	aaa:123
}

a方法现在的[[scope]]
a.[[scope]] = [
	0:GO
]

//b方法的[[scope]]
b.[[scope]] = [
	0:AO   //b方法的AO
	1:AO   //a方法那个的AO
	2:GO
]

b方法AO
AO{
	bbb:234
}

*/

//所以闭包定义：一个内部函数被保存到了外部，就产生了闭包。一个函数里面的子函数被保存到了外部，就产生了闭包，闭包导致原有作用域链没释放，容易造成内存泄漏

/*
闭包作用：
1、实现一个数字累加器
function add(){
	var count = 0;
	function demo(){
		count ++;
		console.log(count);
	}
	return demo;
}
var counter = add();
counter();
counter();
counter();

2、可以坐缓存（存储结构）
function numberWorker(){
	var num = 100;
	function a(value){
		num = num+value;
		console.log(num);
	}
	function b(value){
		num = num-value;
		console.log(num);
	}
	return [a,b]
}
var myArr = numberWorker();
myArr[0](1);//加数字
myArr[1](1);//减数字

3、私有化变量（这个变量只能它自己使用，别人操作不了）
function Husband(name,wife){
	var prepareWife = "小张";//私有变量

	this.name = name;
	this.wife = wife;
	this.sayPrepareWife = function(){
		console.log(prepareWife);
	}
}
var husband = new Husband('wangtao','小李');
console.log(husband.wife);//xiaoli
console.log(husband.prepareWife);//undefined，直接访问访问不了，只能通过husband提供的方法才能访问变量，这就是私有变量
husband.sayPrepareWife();//小张

4、模块化开发，防止污染全局变量

*/
```
## 立即执行函数
```javascript
//立即执行函数，此函数没有声明，在一次执行后即释放。适合做初始化工作


function demo(){}
//一个普通的函数，被使用一次后，它不会被删除，而是会等待下一次调用。如果一个普通的函数在程序一生中就被使用一次，之后就不再使用了，它不会被删除，会一直占着内存


(function(a,b,c){})(1,2,3)
//立即执行函数，使用一次后就会被销毁，不会等待下一次调用，不占内存

//立即执行函数能用return
var a = (function(){return 123})();
console.log(a); //123


//立即执行函数有两种形式

//1、(function(){}())
//这种w3c建议使用这种


//2、(function(){})()


//立即执行函数是怎么来的？

//括号 () 是 执行符号
function test(){}
test();//test后面跟着括号，会执行这个方法，这里test ()里的test是表达式，这里表达式后面跟着一个执行符号

function test(){}();//但是这样直接在函数后写括号，会报错，因为只有表达式才能被执行符号执行，function test(){}这一段叫函数声明

var test = function (){}();//这个代码就可以被执行，因为var test = function (){}这里的function (){}叫函数表达式，
//但是 只有表达式才能被执行符号执行 这句话，还有一个问题，就是会忽略函数的名字，如：

var test = function abc(){}();//这里function abc(){}因为前面等号的原因，会变成表达式，且会忽略函数的名字abc

//这里我们知道了，函数声明后面直接加括号会报错，只有表达式后面加括号，函数才会运行，我们可以把函数声明改成表达式，如
+ function abc(){}();//这里函数声明前面加了个加号，函数声明变成了函数表达式，且这个函数名字abc也会被忽略

//既然加号可以让函数声明变成表达式，那括号也可以，所以就出现了现在的 立即执行函数
(function abc(){}())//这里最外层括号先让函数声明，变成了表达式，然后函数后的执行符号运行了表达式。但又因为表达式会忽略函数的名字，所以函数执行完毕后，就再也找不到这个函数，所以就会被销毁，
//既然名字会被忽略，干脆就不用名字了，直接用匿名函数，这也就衍生出现在的立即执行函数
(function(){}())


//但是还有一种特殊情况，函数声明后面写括号，能运行，不报错，如下，执行符号内写东西
function abc(){}(1,2,3)//这样不会报错，而且不会变成表达式

```