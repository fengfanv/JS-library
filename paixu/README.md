# 排序算法
[算法速度测试](./paixu.html)

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
function xuanZePaiXu(Arr) {
	var myArr = Arr;
	var myArrLen = myArr.length;
	var minIndex, value;
	for (var i = 0; i < myArrLen - 1; i++) {
		minIndex = i;
		for (var j = i + 1; j < myArrLen; j++) {
			if (myArr[j] < myArr[minIndex]) {
				minIndex = j;
			}
		}
		value = myArr[minIndex];
		myArr[minIndex] = myArr[i];
		myArr[i] = value;
	}
	return myArr;
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
function chaRuPaiXu(Arr) {
	var myArr = Arr;
	var myArrLen = myArr.length;
	var temp, j;
	for (var i = 1; i < myArrLen; i++) {
		temp = myArr[i];
		j = i;
		while (j > 0 && myArr[j - 1] > temp) {
			myArr[j] = myArr[j - 1];
			j--;
		}
		myArr[j] = temp;
	}
	return myArr;
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
function maoPiaoPaiXu(Arr) {
	var myArr = Arr;
	var myArrLen = myArr.length;
	for (var i = 0; i < myArrLen - 1; i++) {
		for (var j = 0; j < myArrLen - 1; j++) {
			if (myArr[j] > myArr[j + 1]) {
				var temp = myArr[j + 1];
				myArr[j + 1] = myArr[j];
				myArr[j] = temp;
			}
		}
	}
	return myArr;
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
		} else {
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
function maoPiaoPaiXu(Arr) {
	var myArr = Arr;
	var myArrLen = myArr.length;
	for (var i = 0; i < myArrLen - 1; i++) {
		for (var j = 0; j < myArrLen - 1; j++) {
			if (myArr[j] > myArr[j + 1]) {
				var temp = myArr[j + 1];
				myArr[j + 1] = myArr[j];
				myArr[j] = temp;
			}
		}
	}
	return myArr;
}
```
