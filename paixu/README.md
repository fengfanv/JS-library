# 排序算法

目录：

1、[选择排序](#1、选择排序)

2、[插入排序](#2、插入排序)

3、[冒泡排序](#3、冒泡排序)

4、[二分之查找](#4、二分之查找)

5、[二分之插入排序](#5、二分之插入排序)

6、[睡觉排序（娱乐算法）](#6、睡觉排序（娱乐算法）)

7、[猴子排序（娱乐算法）](#7、猴子排序（娱乐算法）)

### 长度 100 速度排行
> 1、二分之插入排序
	
		耗时: 0.19775390625ms
> 2、插入排序 

		耗时: 0.25927734375ms
> 3、选择排序 
	
		耗时: 0.344970703125ms
> 4、冒泡排序 
	
		耗时: 0.802001953125ms

### 长度 1000 速度排行
> 1、插入排序
	
		耗时: 3.22900390625ms
> 2、选择排序

		耗时: 5.160888671875ms
> 3、二分之插入排序
	
		耗时: 5.652099609375ms
> 4、冒泡排序 
	
		耗时: 6.194091796875ms
		
## 算法学习
### 1、选择排序
> ***算法思想：***当前项与后面的比较，找最大的或最小的，与当前项互换。
#### 举个栗子
```javascript
var arr = [C,E,D,B,A,F];

-------0, 1, 2, 3, 4, 5
-------C, E, D, B, A, F //原始数组
i=0 => A, E, D, B, C, F //C找比自己小的，最终找到A，与A互换了位置
i=1 => A, B, D, E, C, F //E找比自己小的，最终找到B，与B互换了位置
i=2 => A, B, C, E, D, F //D找比自己小的，最终找到C，与C互换了位置
i=3 => A, B, C, D, E, F //E找比自己小的，最终找到D，与D互换了位置
i=4 => A, B, C, D, E, F //E找比自己小的，没有找到不变位置
```
#### 上干货
```javascript
function xuanze_sort(arr_test) {
	let arr = arr_test;
	let arrLen = arr.length;
	for(let i=0;i<arrLen-1;i++){
		let minIndex = i;
		for(let j=i+1;j<arrLen;j++){
			if(arr[minIndex]>arr[j]){
				minIndex = j;
			}
		}
		let I_value = arr[i];
		arr[i] = arr[minIndex];
		arr[minIndex] = I_value;
	}
	return arr;
}
```
### 2、插入排序
> ***算法思想：***当前项与前面的比较，把不符合条件的往后移，在当前位置前面找到符合条件的位置插件进去。

> ***注意：***为了满足上面“当前项与前面的比较”，第一次循环从数组坐标1开始。
#### 举个栗子
```javascript
var arr = [C,E,D,B,A,F];

-------0, 1, 2, 3, 4, 5
-------C, E, D, B, A, F //原始数组
i=1 => C, E, D, B, A, F //E与前面的比较，没有比自身大的，不移动位置
i=2 => C, D, E, B, A, F //D与前面的比较，E比D大，E往后移，D插入到移动后空置的位置
i=3 => B, C, D, E, A, F //B与前面的比较，C,D,E比B大，C,D,E往后移，B插入到移动后空置的位置
i=4 => A, B, C, D, E, F //A与前面的比较，B,C,D,E比A大，B,C,D,E往后移，A插入到移动后空置的位置
i=5 => A, B, C, D, E, F //F与前面的比较，没有比自身大的，不移动位置
```
#### 上干货
```javascript
function charu_sort(arr_test){
	let arr = arr_test;
	let arrLen = arr.length;
	for(let i=1;i<arrLen;i++){
		let temp = arr[i];
		let pushIndex = i;
		for(let j=i-1;j>=0;j--){
			if(temp<arr[j]){
				arr[j+1] = arr[j];
				pushIndex = j;
			}
		}
		arr[pushIndex] = temp;
	}
	return arr;
}
```
### 3、冒泡排序
> ***算法思想：***每次大循环下，每个数据项与它相邻的数据比较，如果符合条件这两个数据互换位置。
> 
> 之所以叫冒泡排序是因为在排序时，数据值会像气泡一样从数组的一端漂浮到另一端。

#### 举个栗子
```javascript
var arr = [C,E,D,B,A,F];
-------0, 1, 2, 3, 4, 5
-------C, E, D, B, A, F //原始数组
i=0 => C, D, B, A, E, F //E与D互换，E又与B互换，E又与A互换
i=1 => C, B, A, D, E, F //D与B互换，D又与A互换
i=2 => B, A, C, D, E, F //C与B互换，C又与A
i=3 => A, B, C, D, E, F //A与B互换
i=4 => A, B, C, D, E, F

```
#### 上干货
```javascript
function maopao_sort(arr_test){
	let arr = arr_test;
	let arrLen = arr.length;
	for(let i=0;i<arrLen;i++){
		for(let j=0;j<arrLen-1;j++){
			if(arr[j]>arr[j+1]){
				let j_value = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = j_value;
			}
		}
	}
	return arr;
}
```
### 4、二分之查找
> ***算法思想：***二分之查找，也称折半查找。利用二分思想，每次查找的时候把数据分为两半，缩小搜索范围，在从中间值计算数据位置。

> ***注意：***有序数组快速查找算法，实现二分之插入排序算法的核心。

#### 举个栗子
```javascript
var arr = [5,13,19,21,37,56,64,75,80,88,92];
//找数组中数据值21的坐标
第一次定位 5,13,19,21,37,56,64,75,80,88,92
//       --             --             --
//       low            mid            high
第二次定位 5,13,19,21,37,56,64,75,80,88,92 缩小一半搜索范围
//       --    --    --
//       low   mid   high
第三次定位 5,13,19,21,37,56,64,75,80,88,92 再缩小一半搜索范围
//                -- --
//       (low & mid) high
			
栗子讲解：
//low和high代表数组的两边下标，mid代表数组的中间下标
//若目标值比中间值大，即目标值在mid与high之间，就修改low的值。再对比中间值
//若目标值比中间值小，即目标值在low与mid之间，就修改high的值。再对比中间值
//如果high小于low则说明没有这个值
//当mid的位置的数据值既不大于key值也不小于key值，则说明mid的数据值等于要查找的key值
//因为找数值可能在数据中有多个，所以为了完美，我们继续判断找到这个key的值在数组最后出现的位置
//当mid等于数组最后一位（说明这个值最后出现的位置在数组的末尾）或当前位置下一个不等于要找的值时则这就返回了最后出现的位置（说明当前位置为最后出现的位置）
```
#### 上干货
```javascript
function erFenZhiChaZhao(Arr, key) {
	var low = 0;
	var high = Arr.length - 1;
	while (low <= high) {
		var mid = parseInt(low + (high - low) / 2); //算出中间坐标
		if (key > Arr[mid]) {
			low = mid + 1;
		} else if (key < Arr[mid]) {
			high = mid - 1;
		} else {//当前mid位置的坐标值等于key值
			if ((mid == Arr.length - 1) || (Arr[mid + 1] != key)) {
				return mid;
			} else {
				low = mid + 1;
			}
		}
	}
	return -1;
}
```
### 5、二分之插入排序
> ***算法思想：***二分之插入排序，其实就是利用二分思想优化插入排序的查找数据值位置时程序
#### 举个栗子
```javascript
var arr = [C,E,D,B,A,F];

-------0, 1, 2, 3, 4, 5
-------C, E, D, B, A, F //原始数组
i=1 => C, E, D, B, A, F //E与前面的比较，没有比自身大的，不移动位置
i=2 => C, D, E, B, A, F //D与前面的比较，E比D大，E往后移，D插入到移动后空置的位置
i=3 => B, C, D, E, A, F //B与前面的比较，C,D,E比B大，C,D,E往后移，B插入到移动后空置的位置
i=4 => A, B, C, D, E, F //A与前面的比较，B,C,D,E比A大，B,C,D,E往后移，A插入到移动后空置的位置
i=5 => A, B, C, D, E, F //F与前面的比较，没有比自身大的，不移动位置
```
#### 上干货
```javascript
function erFenZhiPaiXu(Arr) {
	var myArr = Arr;
	var myArrLen = myArr.length;
	for (var i = 1; i < myArrLen; i++) {
		var temp = myArr[i];
		var low = 0;
		var high = i - 1;
		var mid = 0;
		//找出数据合适的插入位置
		while (true) {
			mid = parseInt(low + (high - low) / 2);
			if (temp > myArr[mid]) {
				low = mid + 1;
			} else if (temp < myArr[mid]) {
				high = mid - 1;
			}
			if (temp === myArr[mid]) {
				mid = mid + 1;
				break;
			} else if (low >= high) {
				mid = temp >= myArr[low] ? low + 1 : low;
				break;
			}
		}
		//将数据后移
		for (var j = i; j > mid; j--) {
			myArr[j] = myArr[j - 1];
		}
		myArr[mid] = temp; //数据插入
	}
	return myArr;
}
```

### 6、睡觉排序（娱乐算法）

> ***算法思想：***比如排10个数，他就叫来10个人，给他们一人分配一个数，让他们去睡觉，定个闹钟，分配多少数就睡多少分钟，等睡醒去他那里报到，等大家都醒了排序结束

#### 上干货
```javascript
//随机数数组
function makeArr(num) {
	let arr = [];
	for (let i = 0; i < num; i++) {
		arr.push(Math.floor(Math.random() * num + 1));
	}
	return arr;
}
//睡觉排序
function shuijiao_sort(arr_test) {
	console.log('睡觉之前的数据：');
	console.log(arr_test);
	let arr = arr_test;
	let arrLen = arr.length;
	let newArr = [];
	let add = 0;
	//给每人分配一个数据
	for (let i = 0; i < arrLen; i++) {
		(function (index,value) {
			setTimeout(function () {
				newArr.push(value);
				console.log('分配的第 '+index+' 个睡觉的人醒了！值为：'+value);
				if(newArr.length === arrLen){
					console.log('睡眠排序结束:');
					console.log(newArr);
				}
			}, 100 + value)
		})(i,arr[i]);
	}
}
shuijiao_sort(makeArr(100));
```
### 7、猴子排序（娱乐算法）

>猴子排序引用了无限猴子定理：即一只猴子随机不停的敲击键盘，如果时间足够长，那么它总有可能会打出特定的文本，比如莎士比亚全集。

> ***算法思想：***获取数组长度，随机生成一个长度内的随机数，把随机数坐标上的数与数组上某个位置(换位位置自己定)互换，每次来一轮之后，检查一遍，看是否符合从小到大，或从大到小

```javascript
function houzi_sort(arr_test) {
	console.log('元素数据：');
	console.log(arr_test);
	let arr = arr_test;
	let arrLen = arr.length;
	let count = 0;
	//检验数组是否符合从大到小，或从小到大
	let jianyanArr = function (arr_jianyan) {
		for (let i = 0; i < arrLen - 1; i++) {
			if (arr_jianyan[i] > arr_jianyan[i + 1]) {
				return false;
			}
		}
		console.log('猴子排序完成！共用 '+count+' 次');
		console.log(arr);
		return true;
	}
	//随机排序
	let random = 0;
	while (!jianyanArr(arr)) {
		for (let i = 0; i < arrLen; i++) {
			random = Math.floor(Math.random() * arrLen);
			let value = arr[random];
			arr[random] = arr[0];
			arr[0] = value;
		}
		count++;//计数
	}
}
houzi_sort(makeArr(10));
```