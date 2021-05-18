document.addEventListener('plusready', function() {
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。")

	plus.key.addEventListener('backbutton', function() {
		console.log('触发手机 返回 键')

		//获取 webview 页面栈记录
		let pages = plus.webview.all();
		console.log(JSON.stringify(pages))

		//获取 当前 webview页面
		let currentPage = plus.webview.currentWebview();
		console.log(JSON.stringify(currentPage))

		if (pages.length > 1) {
			plus.webview.close(currentPage.id, 'pop-out', 1000);
		} else {
			//退出应用
			plus.runtime.quit();
		}
	}, false);
});

//创建webview窗口
function createWebview(url, id, style, data) {

	let statusbarHeight = 0;
	//支持沉浸式状态栏需要在 manifest.json 里设置
	//
	//"plus": {
	//	"statusbar": {
	//		"immersed": true /*只这样设置，只有android会生效，苹果需要做一些处理*/
	//	}
	//}
	
	if (plus.navigator.isImmersedStatusbar()) {
		//根据系统判断，获取手机状态栏高度
		if (plus.os.name == 'Android') {
			statusbarHeight = plus.navigator.getStatusbarHeight();
		} else {
			if (document.documentElement.clientHeight >= 812 && document.documentElement.clientWidth == 375) {
				//是iphoneX
				statusbarHeight = 44;
			} else {
				//其它苹果手机
				statusbarHeight = 20;
			}
		}

		if (typeof style == 'undefined') {
			style = {
				top: statusbarHeight,
			}
		} else {
			style.top = statusbarHeight
		}
		
		//这里，是为了，兼容，苹果沉浸式状态栏
		if(plus.os.name == 'Android'){
			style.top = style.top;
		}else{
			style.top = 0-style.top;
		}
		
	}
	//设置状态字体颜色
	plus.navigator.setStatusBarStyle('dark'); //设置状态栏字体颜色，light 白色 dark 黑色

	let thisPage = plus.webview.create(url, id, style, data)
	plus.webview.show(thisPage.id, 'pop-in', 1000)
}
