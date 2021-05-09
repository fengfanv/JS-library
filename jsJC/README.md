# js继承

### 1、原型链继承

缺点：引用类型的属性被所有实例共享，实例之间会互相影响
```javascript
//1、第一种，借助原型链继承

function Person(){
//技能
this.skills = ['唱歌','跳舞','弹钢琴'];
this.text = '我很ok';
}
Person.prototype.say = function(){
console.log(this);
console.log('I can do',this.skills.toString());
}

function Chinese(name,age){
this.name = name;
this.age = age;
}
Chinese.prototype = new Person();
Chinese.prototype.constructor = Chinese;

let chinese_a = new Chinese('a',18);


console.log(chinese_a.hasOwnProperty('skills')); //false ，通过 hasOwnProperty 方法检测skills属性是否为自身属性
console.log(chinese_a.hasOwnProperty('name')); //true

console.log(Chinese.prototype.isPrototypeOf(chinese_a));//true ，检测 Chinese.prototype 是否存在于 chinese_a 的原型链中，存在则返回true，如果Chinese.prototype不为对象类型 或 不存在于原型链中 则返回false
console.log(Person.prototype.isPrototypeOf(chinese_a));//true

console.log(chinese_a.skills);//["唱歌", "跳舞", "弹钢琴"]
console.log(chinese_a.say());//I can do 唱歌,跳舞,弹钢琴

/**
* 第一次打印解析，
* 1、虽然我们能使用 Person 构造方法里的属性，但这个属性并不属于自身，是继承得来的
*/

let chinese_b = new Chinese('b',20);

chinese_b.skills.push('写作');
console.log(chinese_a.skills);//["唱歌", "跳舞", "弹钢琴", "写作"]

chinese_b.text = '我是b，我很ok！';
console.log(chinese_a.text);//我很ok
console.log(chinese_b.text);//我是b，我很ok！
/**
* 第二次打印解析，
* 1、新建 chinese_b 对象，然后操作 继承的属性(skills,text)
* 操作后发现，引用类型的数据，发生变化，所有实例的数据都发生变化
* 基本数据类型的，发生变化，不影响别的实例数据
*/

/**
* 缺点，引用类型的属性被所有实例共享，实例之间会互相影响
*/
```
### 2、改变构造方法this指向继承

缺点：只能继承父对象的实例属性和方法，不能继承父对象原型属性和方法
```javascript
//2、第二种，借助 改变构造函数this指向 继承

function Person() {
//技能
this.skills = ['唱歌', '跳舞', '弹钢琴'];
this.text = '我很ok';
}
Person.prototype.say = function () {
console.log(this);
console.log('I can do', this.skills.toString());
}

function Chinese(name, age) {
Person.call(this);
this.name = name;
this.age = age;
}
Chinese.prototype.work = function(){
console.log('I am',this.name);
}

let chinese_a = new Chinese('a',18);
let chinese_b = new Chinese('b',20);
chinese_a.skills.push('写作');
console.log(chinese_a.skills);//["唱歌", "跳舞", "弹钢琴", "写作"]
console.log(chinese_b.skills);//["唱歌", "跳舞", "弹钢琴"]
//console.log(chinese_a.say());//chinese_a.say is not a function

console.log(chinese_a.hasOwnProperty('skills'));//true
console.log(Person.prototype.isPrototypeOf(chinese_a));//false
console.log(Person.prototype.isPrototypeOf(chinese_b));//false

/**
* 缺点，只能继承父对象的实例属性和方法，不能继承父对象原型属性和方法
* （无法理解）无法实现函数复用，每个子对象都有父对象实例的副本，性能欠优
*/
```
### 3、组合式继承（原型链继承+改构造函数this指向继承）

优点：结合两种方式的继承，解决了之前两种方式不足的地方

缺点：Person会被调用两次，第一次是Chinese.prototype = new Person(),第二次是Person.call(this);

```javascript
//第三种，组合式继承（原型链继承+构造函数改this指向）

function Person() {
    //技能
    this.skills = ['唱歌', '跳舞', '弹钢琴'];
    this.text = '我很ok';
}
Person.prototype.say = function () {
    console.log(this);
    console.log('I can do', this.skills.toString());
}

function Chinese(name, age) {
    Person.call(this);
    this.name = name;
    this.age = age;
}

Chinese.prototype = new Person();
Chinese.prototype.constructor = Chinese;
//这里先绑，在定义
Chinese.prototype.work = function () {
    console.log('I am', this.name);
}

let chinese_a = new Chinese('a', 18);
let chinese_b = new Chinese('b', 20);
chinese_a.skills.push('写作');
console.log(chinese_a.skills);//["唱歌", "跳舞", "弹钢琴", "写作"]
console.log(chinese_b.skills);//["唱歌", "跳舞", "弹钢琴"]

console.log(chinese_a.say())//I can do 唱歌,跳舞,弹钢琴,写作
console.log(chinese_a.work())//I am a

console.log(chinese_a.hasOwnProperty('skills'));//true
console.log(Person.prototype.isPrototypeOf(chinese_a));//true

/**
 * 优点：结合两种方式的继承，解决了之前两种方式不足的地方
 * 缺点，Person会被调用两次，第一次是Chinese.prototype = new Person()
 * 第二次是Person.call(this);
 */

```
