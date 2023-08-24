<template>
	<view class="container-parent" :style="containerStyles">
		<calendar-latest2 @scrolltolower="scrolltolower">
			<text v-for="(item,index) of list" @click="aalert(index)">{{index}}</text>
		</calendar-latest2>
	</view>
</template>
<script>
	import calendarLatest2 from '@/components/calendar_latest2.vue';
	export default {
		components: {
			calendarLatest2,
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				
				list:[],

			}
		},
		onShow() {
			plus.screen.lockOrientation('portrait-primary'); // 正常竖屏
		},
		onLoad(options){
			this.getList();
		},
		methods: {
			aalert(text){
				console.log('text',text);
			},
			//日历组件，触底事件
			scrolltolower(){
				console.log('日历组件触底事件，触发');
				this.getList();
			},
			//模拟接口
			getList(){
				let arr = [];
				let lastValue = this.list.slice(-1)[0] || 0;
				for(let i=lastValue;i<lastValue+40;i++){
					arr.push(i)
				}
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(()=>{
					this.list = this.list.concat(arr)
					uni.hideLoading();
				},3000)
			},
			
		},
		computed: {
			containerStyles() {
				return {
					"width": (this.systemInfo.screenWidth * 0.90) + 'px',
					"height": (this.systemInfo.screenHeight * 0.90) + 'px',
					"margin-top": (this.systemInfo.screenHeight * 0.05) + 'px',
					"margin-left": (this.systemInfo.screenWidth * 0.05) + 'px',
				}
			}
		}
	}
</script>

<style scoped>
	.container-parent {
		background-color: green;
		position: relative;
		display: flex;
	}

	.calendar-item {
		width: 100%;
		height: 200rpx;
		line-height: 200rpx;
		text-align: left;
	}
</style>