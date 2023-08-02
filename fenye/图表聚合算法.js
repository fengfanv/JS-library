//一个简单的图表数据聚合瘦身精简算法（算法思想来源于 分页）

let arr = [...Array(100).keys()]

let allLen = arr.length;//总数量

let thinLen = 10;//总量瘦身后的数量（总量通过算平均值等方式，聚合数据后的数量，也就是说，有100条数据，需要优化成10条数据）

let itemMinLen = parseInt(allLen/thinLen);//100条数据优化瘦身成10条数据。优化后的10条数据，其中每条数据约占，100条数据里的10条数据。

let itemMaxLen = allLen/thinLen>parseInt(allLen/thinLen)?parseInt(allLen/thinLen)+1:parseInt(allLen/thinLen);//接上文，优化瘦身后的10条数据，每条数据，有时不能，正好占100条里的10条数据。如总量是101条数据时，需要优化成10条数据，101/10=10.1，优化瘦身后的10条，的每组数据不都是聚合了100条里的10条，优化后的10条，的每组数据，中有一组数据需要聚合101条数据里的11条数据

let countItemMax = allLen%thinLen;//总量 除 瘦身量 取余，余几，就说明，聚合瘦身后的数据，需要有几组数据需要聚合 itemMaxLen 的量（被除数/除数=商，余数永远小于除数）

//下边开始，切割数据

console.log('数据总量是：',allLen);
console.log('总量瘦身后的数量是：',thinLen);
console.log('瘦身后的每组数据平均包含总量里的',itemMinLen,'条数据')
console.log('瘦身后的每组数据最大包含总量里的',itemMaxLen,'条数据')
console.log('瘦身后的每组数据中，前',countItemMax,'组数据，每组包含总量的',itemMaxLen,'条数据。剩下的',thinLen-countItemMax,'组数据包含总量的',itemMinLen,'条数据。')

let startSlice = 0;
let endSlice = 0;
for(let i=0;i<thinLen;i++){
    if(itemMinLen != itemMaxLen){
        if(i<countItemMax){
            startSlice = i*itemMaxLen;
            endSlice = startSlice + itemMaxLen;
        }else{
            startSlice = endSlice;
            endSlice = startSlice + itemMinLen;
        }
    }else{
        startSlice = i*itemMaxLen;
        endSlice = startSlice + itemMaxLen;
    }
    console.log(i,startSlice,endSlice)
    console.log(arr.slice(startSlice,endSlice))
}


