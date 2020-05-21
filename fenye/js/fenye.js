var shuzu = [];
$(function() {
	/*生成模拟数据*/
	for (var i = 0; i < 100; i++) {
		shuzu.push(i + 1);
	}
	goPage(1);
});


function goPage(pno) {
	$('.content').find('.son').remove();

	var dataLen = shuzu.length; // 获取所有数据长度
	var totalPage = 0; // 总页数
	var pageSize = 10; // 每页显示行数
	// 计算分多少个页面
	if (dataLen / pageSize > parseInt(dataLen / pageSize)) {
		totalPage = parseInt(dataLen / pageSize) + 1;
	} else {
		totalPage = parseInt(dataLen / pageSize);
	}

	var currentPage = pno; //当前页码
	var startRow = ((currentPage - 1) * pageSize) + 1; // 开始显示的行
	//假设，每个要显示10条数据，一共有100行数据，
	//当为第1页，应该显示1-10行的数据
	//当为第2页，应该显示11-20行的数据
	//当为第3页，应该显示21-30行的数据
	//所以我们应该让第1页时等于1，第2页时等于11，第3页时等于21,
	//根据1,2,3页可以看出，为1页时应该让0*每页显示多少行+1，为2页时应该让1*每页显示多少行+1,为3页时应该让2*每页显示多少行+1
	var endRow = currentPage * pageSize; // 结束显示的行
	endRow = (endRow > dataLen) ? dataLen : endRow;
	
	// 根据页码显示当前页码下数据
	for (var i = 0; i < dataLen; i++) {
		if (i >= startRow && i <= endRow) {
			var div = $('.content');
			div.append("<div class='son'>" + shuzu[i - 1] + "</div>");
		}
	}

	//页脚页码部分
	var tempStr = "<span class='btn'>共" + totalPage + "页</span>";
	if (currentPage > 1) {
		tempStr += "<span class='btn' href=\"#\"onClick=\"goPage(" + 1 + ")\">首页</span>";
		tempStr += "<span class='btn' onClick=\"goPage(" + (currentPage - 1) + ")\">上一页</span>"
	} else {
		tempStr += "<span class='btn'>首页</span>";
		tempStr += "<span class='btn'>上一页</span>";
	}
	// 遍历页码
	for (var pageIndex = 1; pageIndex < totalPage + 1; pageIndex++) {
		if (pageIndex == currentPage) {
			//当前页码
			tempStr += "<a class='btn active' onclick=\"goPage(" + pageIndex + ")\"><span>" + pageIndex + "</span></a>";
		} else {
			tempStr += "<a class='btn' onclick=\"goPage(" + pageIndex + ")\"><span>" + pageIndex + "</span></a>";
		}
	}
	

	if (currentPage < totalPage) {
		tempStr += "<span class='btn' onClick=\"goPage(" + (currentPage + 1) + ")\">下一页</span>";
		tempStr += "<span class='btn' onClick=\"goPage(" + totalPage + ")\">尾页</span>";
	} else {
		tempStr += "<span class='btn'>下一页</span>";
		tempStr += "<span class='btn'>尾页</span>";
	}
	document.getElementById("footer").innerHTML = tempStr;
}
