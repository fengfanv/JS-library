document.addEventListener('plusready', function() {
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。")
	plus.key.addEventListener('backbutton', function(){
		console.log('触发 返回 键')
		
		let pages = plus.webview.all();
		
		let currentPage = plus.webview.currentWebview();
		
		
		console.log(JSON.stringify(pages))
		
		console.log(JSON.stringify(currentPage))
		
		if(pages.length>1){
			
			plus.webview.close(currentPage.id,'pop-out',1000);
			
		}else{
			
			//退出应用
			plus.runtime.quit();
			
		}
	},false);
});
