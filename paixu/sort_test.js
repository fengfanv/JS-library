function makeArr(num) {
	let arr = [];
	for (let i = 0; i < num; i++) {
		arr.push(Math.floor(Math.random() * num + 1));
	}
	return arr;
}
var arr100 = makeArr(100);
//console.log(arr100);
function xuanze_sort(arr_test) {
	let arr = arr_test;
	let arrLen = arr.length;
	for (let i = 0; i < arrLen - 1; i++) {
		let minIndex = i;
		for (let j = i + 1; j < arrLen; j++) {
			if (arr[minIndex] > arr[j]) {
				minIndex = j;
			}
		}
		let I_value = arr[i];
		arr[i] = arr[minIndex];
		arr[minIndex] = I_value;
	}
	return arr;
}
//console.log(xuanze_sort(arr100));

function charu_sort(arr_test) {
	let arr = arr_test;
	let arrLen = arr.length;
	for (let i = 1; i < arrLen; i++) {
		let temp = arr[i];
		let pushIndex = i;
		for (let j = i - 1; j >= 0; j--) {
			if (temp < arr[j]) {
				arr[j + 1] = arr[j];
				pushIndex = j;
			}
		}
		arr[pushIndex] = temp;
	}
	return arr;
}
//console.log(charu_sort(arr100));

function maopao_sort(arr_test) {
	let arr = arr_test;
	let arrLen = arr.length;
	for (let i = 0; i < arrLen; i++) {
		for (let j = 0; j < arrLen - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				let j_value = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = j_value;
			}
		}
	}
	return arr;
}
//console.log(maopao_sort(arr100));

//let listArr = charu_sort(arr100);

function erfenzhichazhao(arr, key) {
	let arrLen = arr.length;
	let high = arrLen - 1;
	let low = 0;
	let mid = 0;
	while (high >= low) {
		mid = parseInt(low + (high - low) / 2);
		if (key > arr[mid]) {
			low = mid + 1;
		} else if (key < arr[mid]) {
			high = mid - 1;
		} else {
			if (mid === arrLen || arr[mid + 1] !== key) {
				return mid
			} else {
				low = low + 1;
			}
		}
	}
}

//抖音大神，睡觉排序法，
//算法思想：比如排10个数，他就叫来10个人，给他们一人分配一个数，让他们去睡觉，定个闹钟，分配多少数就睡多少分钟，等睡醒去他那里报到，等大家都醒了排序结束
function shuijiao_sort(arr_test) {
	console.log('睡觉之前的数据：');
	console.log(arr_test);
	let arr = arr_test;
	let arrLen = arr.length;
	let newArr = [];
	let add = 0;
	//给每人分配一个数据
	for (let i = 0; i < arrLen; i++) {
		(function (index, value) {
			setTimeout(function () {
				newArr.push(value);
				console.log('分配的第 ' + index + ' 个睡觉的人醒了！值为：' + value);
				if (newArr.length === arrLen) {
					console.log('睡眠排序结束:');
					console.log(newArr);
				}
			}, 100 + value)
		})(i, arr[i]);
	}
}
//shuijiao_sort(makeArr(100));

//抖音大神，猴子算法（随机排序）
//猴子排序引用了无限猴子定理：即一只猴子随机不停的敲击键盘，如果时间足够长，那么它总有可能会打出特定的文本，比如莎士比亚全集。
//算法思想：获取数组长度，随机生成一个长度内的随机数，把随机数坐标上的数与数组上某个位置(换位位置自己定)互换，每次来一轮之后，检查一遍，看是否符合从小到大，或从大到小
function houzi_sort(arr_test) {
	//检验数组是否符合从大到小，或从小到大
	console.log('元素数据：');
	console.log(arr_test);
	let arr = arr_test;
	let arrLen = arr.length;
	let count = 0;
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
//houzi_sort(makeArr(10));

function sum(n){
	if(n>10){
		return 0;
	}
	return n+sum(n+1);
}
//sum(1);

//快速排序
//1、找一个基准数，把基准数从数组中提取出来。
//2、准备左右两个数组，把大于基准数的放大右边数组，小于基准数的放到左边数组
//3、用递归方式让左右两边数组继续这样处理，一直到左右两边都排好序为止（最后让左边数组+基准值+右边数组拼接成最后的结果）
function kuaisu_sort(arr_test){
	let arr = arr_test;

	//4、结束递归（当arr小于等于一项时，则不用处理）
	if(arr.length<=1){
		return arr;
	}
	//1、找基准数，并把基准数提取出来
	let midIndex = Math.floor(arr.length/2);//Math.floor向下取整
	let midValue = arr.splice(midIndex,1)[0];//splice 删除数组中的基准数，并返回被删除的数组项，所有用[0]取这个被删除的数组项
	//2、准备左右两个数组，把大于基准数的放到右边数组，把小于基准数的放到左边数据
	let leftArr = [];
	let rightArr = [];
	let arrLen = arr.length;
	console.log(arr);
	for(let i=0;i<arrLen;i++){
		if(arr[i]>midValue){
			rightArr.push(arr[i]);
		}else{
			leftArr.push(arr[i]);
		}
	}
	//3、用递归方式让左右两边数组继续这样处理，知道左右两边都排好为止（最后让左边数组+基准数+右边数组拼成最后的结果）
	return kuaisu_sort(leftArr).concat(midValue,kuaisu_sort(rightArr))
}

console.log(kuaisu_sort(makeArr(100)));