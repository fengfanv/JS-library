var list = [];
for(let i=0;i<100;i++){
    list.push(i)
}
console.log(list);

function fenye(listLen,pageLen,page){
    //listLen 列表总长度
    //pageLen 每页显示多少条数据
    //page 当前是第几页

    //总页数 或 能分多少页
    var allPageNum = listLen/pageLen>parseInt(listLen/pageLen)?parseInt(listLen/pageLen)+1:parseInt(listLen/pageLen);

    //数据，开始坐标
    var start = page*pageLen;

    //数据，结束坐标
    var end = start+pageLen>listLen?listLen:start+pageLen;


    //打印页码
    var allPageList = [];
    for(let i=0;i<allPageNum;i++){
        allPageList.push(i)
    }
    console.log(allPageList)


    //切割数据
    console.log(list.slice(start,end))

}

// fenye(list.length,10,0) //第一页

// fenye(list.length,10,9) //最后一页

// fenye(list.length,10,10) //没有数据

// fenye(list.length,10,-1) //没有数据

// fenye(list.length,8,0) //第一页

// fenye(list.length,8,12) //最后一页

// fenye(list.length,8,11)
