document.addEventListener('plusready', function() {
	//设置状态字体颜色
	plus.navigator.setStatusBarStyle('dark');//light 白色 dark 黑色
	
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

//创建webview窗口
function createWebview(url,id,style,data){

	let top = 0;
	//支持沉浸式状态栏需要在，manifest里设置
	/*
	"plus": {
		"statusbar": {
			"immersed": true
		},
	}
	*/
	if(plus.navigator.isImmersedStatusbar()){
		if(typeof style == 'undefined'){
			style = {
				top:plus.navigator.getStatusbarHeight(),
				
			}
		}else{
			style.top=plus.navigator.getStatusbarHeight()
		}
	}
	//设置状态字体颜色
	plus.navigator.setStatusBarStyle('dark');//light 白色 dark 黑色
	
	let thisPage = plus.webview.create(url, id, style, data)
	plus.webview.show(thisPage.id, 'pop-in', 1000)
}



