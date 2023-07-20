<template>
	<view class="calendar_content">
		<!-- 日历 -->
		<view class="top_date">
			<view class="date_time">{{dateTit}}</view>
			<view class="date_btn">
				<image src="@/static/img/schedule/icon_left.png" class="icon_left" @click="getPrev()"></image>
				<image src="@/static/img/schedule/icon_right.png" class="icon_right" @click="getNext()"></image>
			</view>
		</view>
		<view class="week_date">
			<view class="week_item">日</view>
			<view class="week_item">一</view>
			<view class="week_item">二</view>
			<view class="week_item">三</view>
			<view class="week_item">四</view>
			<view class="week_item">五</view>
			<view class="week_item">六</view>
		</view>

		<view class="show_panel">
			<!-- 当前周面板 -->
			<view class="day_date click_box week_panel" v-if="isShowAllDate==false">
				<view v-for="(val,i) in newWeek" :key="i"
					:class="['day_item',i==0||i==6?'color_grey':'',isNowDay&&nowDay==val?'day_elem':'',newWeek[dayIdx]==val?'click_elem':'']"
					@click="getDays(weekIdx,val,i)">
					<view class="text"
						:class="(weekIdx == 0 && val >8)||(weekIdx==allArr.length-1 && val<8)? 'color_grey':''">{{val}}
					</view>
					<view class="icon" v-for="day in checkDailyList" :key="day" v-if="day == allDailyList[weekIdx][i]">
					</view>
				</view>
			</view>
			<!-- 当前月面板 -->
			<view
				:style="{'margin-top':marginTop==0?0:closeMonthPanelMarginToValue+'px','height':oneMonthHeight+'px','opacity':marginTop==0?1:0,'transition':'0.1s'}">
				<view class="day_date" v-for="(item,index) in allArr" :key="index"
					:class="weekIdx == index? 'click_box':''">
					<view v-for="(elem,idx) in item" :key="elem"
						:class="['day_item',idx==0||idx==6?'color_grey':'',isToday(index,elem,idx)?'day_elem':'',allArr[weekIdx][dayIdx]==elem?'click_elem':'']"
						@click="getDays(index,elem,idx)">
						<view
							:class="['text',(index==0 && elem>8)||(index==allArr.length-1 && elem<8) ? 'color_grey':'']">
							{{elem}}
						</view>
						<view class="icon" v-for="time in checkDailyList" :key="time"
							v-if="time == allDailyList[index][idx]">
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--触摸板，主要用于，收起和展开日历面板-->
		<scroll-view :scroll-y="true" class="touch_panel" @touchstart="touchStart" @touchmove="touchMove"
			@touchend="touchEnd" @scroll="scroll" @scrolltolower="$emit('scrolltolower')">
			<slot></slot>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			checkDailyList: {
				type: [Object, Array],
				default: () => {
					return []
				}
			},
			//是否展开（是否显示月面板），参数同步 isShowAllDate
			isOpen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				nowTit: "",
				nowYear: "",
				nowMonth: "",
				isNowDay: false, //是否为当天
				nowDay: 0, //当天几号
				selectDay: 0,
				dateTit: "",
				newWeek: [], //当在所在的某一周数据

				allArr: [], //当月所有日
				isClickPrev: true,
				isClickNext: true,

				weekIdx: 0, //当日所在月中的第几周
				dayIdx: 0,

				prevMonth1: 0,
				prevYear1: "",
				nowMonth1: "",
				nowYear1: "",
				nextMonth1: "",
				nowYear1: "",

				// 日程分布
				allDailyList: [],

				oldDay: undefined, //在切换到上一个月 或 下一个月，前，保存当月今天是几

				isShowAllDate: false, //false展示当前周，true展示当前月，参数同步isOpen

				startY: 0, //触摸开始的位置y
				marginTop: 0, //月面板元素的位置

				oldScrollTop: 0, //旧的scrollTop值

			};
		},
		created() {
			var date = new Date();
			this.nowYear = date.getFullYear();
			this.nowMonth = date.getMonth() + 1;
			// 当前时间 
			const yue = date.getMonth() + 1;
			const ri = date.getDate();
			this.dateTit = date.getFullYear() + '.' + yue + '.' + ri; //点击时改变的日期

			// 当月1号周几
			var oneDateWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
			// 当月总共几天
			var totalDate = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();

			// 显示上个月几天
			const prevYue = date.getMonth() + 1 == 1 ? 12 : date.getMonth();
			const prevNian = prevYue == 12 ? date.getFullYear() - 1 : date.getFullYear();
			const prevTotalDate = new Date(prevNian, prevYue, 0).getDate();
			// 截取要显示的最后几天
			var prevDay = prevTotalDate - oneDateWeek;
			var prevArr = []
			for (var i = 1; i <= oneDateWeek; i++) {
				prevArr.push(prevDay + i)
			}

			// 显示下个月几天
			var nextDateWeek = new Date(date.getFullYear(), date.getMonth(), totalDate).getDay();
			var nextDay = 6 - nextDateWeek <= 0 ? 0 : 6 - nextDateWeek;

			// 将三个月组成数组
			for (var j = 1; j <= totalDate; j++) {
				prevArr.push(j)
			}
			for (var n = 1; n <= nextDay; n++) {
				prevArr.push(n)
			}

			// 每7天一组
			var allArr = [];
			for (var a = 0; a < prevArr.length;) {
				allArr.push(prevArr.slice(a, a += 7))
			}
			this.allArr = allArr;

			// 当天时间加重颜色
			this.isNowDay = true;
			this.nowDay = ri;
			//当天所在的周
			var idx = 0;
			for (var t = 0; t < allArr.length; t++) {
				allArr[t].forEach(val => {
					if (val == ri) {
						idx = t;
					}
				})
			}
			this.newWeek = allArr[idx];
			// this.newWeekIdx = idx;

			// 默认显示今日数据
			var rr = 0;
			this.newWeek.forEach((r, ii) => {
				if (r == ri) {
					rr = ii;
				}
			})
			this.dayIdx = rr;
			this.weekIdx = idx;
			// console.log(this.weekIdx)
			// console.log(rr,'lkj')
			// 上 当 下 固定月份
			this.prevMonth1 = this.nowMonth - 1 == 0 ? 12 : this.nowMonth - 1;
			this.prevYear1 = this.nowMonth == 12 ? this.nowYear - 1 : this.nowYear;

			this.nowMonth1 = this.nowMonth;
			this.nowYear1 = this.nowYear;

			this.nextMonth1 = this.nowMonth + 1 == 13 ? 1 : this.nowMonth + 1;
			this.nextYear1 = this.nowMonth == 1 ? this.nowYear + 1 : this.nowYear;

			//默认仅显示周面板
			this.showPanel(false);
		},
		methods: {
			// 点击某一天
			getDays(idx, day, week) {

				console.log(idx, day, week, this.isShowAllDate);

				if (idx == 0 && day > 8) {
					//点击的是上个月的
					this.nowMonth = this.prevMonth1;
					this.nowYear = this.prevYear1;
				} else if (idx == this.allArr.length - 1 && day < 8) {
					//点击的是下个月的
					this.nowMonth = this.nextMonth1;
					this.nowYear = this.nextYear1;
				} else {
					//点击的是当月的
					this.nowMonth = this.nowMonth1;
					this.nowYear = this.nowYear1;
				}

				//更新视图
				this.dateTit = this.nowYear + '.' + this.nowMonth + '.' + day;
				this.newWeek = this.allArr[idx];

				this.weekIdx = idx;
				this.dayIdx = week;
			},
			// 上一个月  上一个周
			getPrev() {
				if (this.isShowAllDate) {
					this.getPrevData();
				} else {
					this.weekIdx--;
					// 上一个周
					if (this.weekIdx < 0) {
						// 跳转到上个月最后一周
						this.getPrevData();
					} else {
						var day = this.allArr[this.weekIdx][this.dayIdx];
						this.newWeek = this.allArr[this.weekIdx];
						if (this.weekIdx == 0 && day > 8) {
							this.dateTit = this.prevYear1 + '.' + this.prevMonth1 + '.' + day;
						} else {
							this.dateTit = this.nowYear + '.' + this.nowMonth + '.' + day;
						}
					}
				}
			},
			getNext() {
				if (this.isShowAllDate) {
					this.getNextdata();
				} else {
					this.weekIdx++;
					// 下一个周
					if (this.weekIdx > this.allArr.length - 1) {
						// 跳转到下个月第一周
						this.getNextdata();
					} else {
						var day = this.allArr[this.weekIdx][this.dayIdx];
						this.newWeek = this.allArr[this.weekIdx];
						if (this.weekIdx == this.allArr.length - 1 && day < 8) {
							this.dateTit = this.nextYear1 + '.' + this.nextMonth1 + '.' + day;
						} else {
							this.dateTit = this.nowYear + '.' + this.nowMonth + '.' + day;
						}
					}
				}
			},

			// 获取下一个月数据
			getNextdata() {
				this.prevMonth1 = this.nowMonth1;
				this.prevYear1 = this.nowYear1;

				this.nowMonth1 = this.nextMonth1;
				this.nowYear1 = this.nextYear1;

				this.nextMonth1 = this.nextMonth1 + 1 == 13 ? 1 : this.nextMonth1 + 1;
				this.nextYear1 = this.nextMonth1 == 1 ? this.nextYear1 + 1 : this.nextYear1;

				this.nowMonth = this.nowMonth1;
				this.nowYear = this.nowYear1;

				this.calculation('next');
			},

			//获取上个月的数据
			getPrevData() {
				if (this.isShowAllDate) {
					//在切换前，保存一下，当前选中的是几号
					this.oldDay = this.allArr[this.weekIdx][this.dayIdx];
				}


				this.nextMonth1 = this.nowMonth1;
				this.nextYear1 = this.nowYear1;

				this.nowMonth1 = this.prevMonth1;
				this.nowYear1 = this.prevYear1;

				this.prevMonth1 = this.prevMonth1 - 1 == 0 ? 12 : this.prevMonth1 - 1;
				this.prevYear1 = this.prevMonth1 == 12 ? this.prevYear1 - 1 : this.prevYear1;

				this.nowMonth = this.nowMonth1;
				this.nowYear = this.nowYear1;

				this.calculation("prev");

			},
			// 计算当周 当月数据
			calculation(str) {
				// 当月1号周几
				var oneDateWeek = new Date(this.nowYear1, this.nowMonth1 - 1, 1).getDay();
				// 当月总共几天
				var totalDate = new Date(this.nowYear1, this.nowMonth1, 0).getDate();

				// 显示上个月几天
				const prevTotalDate = new Date(this.prevYear1, this.prevMonth1, 0).getDate();
				// 截取要显示的最后几天
				var prevDay = prevTotalDate - oneDateWeek;
				var prevArr = [];
				for (var i = 1; i <= oneDateWeek; i++) {
					prevArr.push(prevDay + i)
				}

				// 显示下个月几天
				var nextDateWeek = new Date(this.nowYear1, this.nowMonth1 - 1, totalDate).getDay();
				var nextDay = 6 - nextDateWeek <= 0 ? 0 : 6 - nextDateWeek;

				// 将三个月组成数组
				for (var j = 1; j <= totalDate; j++) {
					prevArr.push(j)
				}
				for (var n = 1; n <= nextDay; n++) {
					prevArr.push(n)
				}

				// 每7天一组
				var allArr = [];
				for (var a = 0; a < prevArr.length;) {
					allArr.push(prevArr.slice(a, a += 7))
				}
				this.allArr = allArr;

				// 上一周  下一周   天所在的序号
				if (str == "prev") {
					this.weekIdx = this.allArr.length - 2;
				} else if (str == "next") {
					this.weekIdx = 1;
				}

				//插入代码 start
				// console.log('this.allArr',JSON.parse(JSON.stringify(this.allArr)));
				for (let i = 0; i < this.allArr.length; i++) {
					let weekItem = this.allArr[i]
					let weekItemLen = weekItem.length;
					for (let j = 0; j < weekItemLen; j++) {
						let elem = weekItem[j];
						if ((i == 0 && elem > 8) || (i == this.allArr.length - 1 && elem < 8)) {} else {
							// console.log(elem);
							if (elem == this.oldDay) {
								this.weekIdx = i;
								this.dayIdx = j;
							}
						}
					}
				}
				//插入代码 end

				this.newWeek = allArr[this.weekIdx];
				this.dateTit = this.nowYear + '.' + this.nowMonth + '.' + allArr[this.weekIdx][this.dayIdx];

				// 对比加重颜色那天是否为今日
				var date = new Date();
				if (this.nowYear == date.getFullYear() && this.nowMonth == date.getMonth() + 1) {
					this.isNowDay = true
				} else {
					this.isNowDay = false;
				}
			},
			//检查是否今日
			isToday(index, day, week) {
				var d = new Date();
				var currentYear = d.getFullYear(); //年
				var currentMonth = d.getMonth() + 1; //月
				var currentDay = d.getDate(); //日
				var currentWeek = d.getDay(); //星期几
				if (this.nowYear == currentYear && this.nowMonth == currentMonth && day == currentDay && currentWeek == week) {
					if(index == 0 && day>8){
						return false;
					}
					return true
				}
				return false;
			},
			touchStart(e) {
				this.startY = e.changedTouches[0].pageY;
			},
			touchMove(e) {
				// let py = e.changedTouches[0].pageY;

				// let move = py - this.startY;
				// this.marginTop = this.marginTop + move;

				// if (this.marginTop >= 0) {
				// 	this.marginTop = 0
				// }

				// if (this.marginTop <= this.oneWeekHeight - this.oneMonthHeight) {
				// 	this.marginTop = this.oneWeekHeight - this.oneMonthHeight;
				// }

				// if (this.marginTop <= -this.weekRow * this.oneWeekHeight) {
				// 	//显示周
				// 	this.isShowAllDate = false;
				// } else {
				// 	//不显示周
				// 	this.isShowAllDate = true;
				// }

				// this.startY = py;
			},
			touchEnd(e) {
				// if (this.marginTop >= -this.oneMonthHeight / 2) {
				// 	//展开（显示月面板）
				// 	this.showPanel(true)
				// } else {
				// 	//收起（不显示月面板）
				// 	this.showPanel(false)
				// }
				
				let py = e.changedTouches[0].pageY;
				let move = py - this.startY;
				if(move>this.oneMonthHeight){
					// console.log('想展开');
					if(this.oldScrollTop < 3){
						this.showPanel(true);
					}
				}else if(move<-this.oneMonthHeight/2){
					// console.log('想收起');
					this.showPanel(false);
				}
				this.startY = 0;
				
				e.stopPropagation()
			},
			showPanel(value) {
				if (value) {
					//展开（显示月面板）
					this.marginTop = 0;
				} else {
					//收起（不显示月面板）
					this.marginTop = this.closeMonthPanelMarginToValue;
				}
				this.isShowAllDate = value
			},
			//监听滚动条变化
			scroll(e) {
				let scrollTop = e.target.scrollTop;
				// if (this.oldScrollTop > scrollTop) {
				// 	//往上划
				// 	if (scrollTop < 2) {
				// 		this.showPanel(true)
				// 	}
				// } else {
				// 	this.showPanel(false)
				// }
				this.oldScrollTop = scrollTop;
			},
		},
		computed: {
			//一周的高度
			oneWeekHeight() {
				return uni.upx2px(60); //设计图里的高度，60
			},
			//当前月的高度
			oneMonthHeight() {
				return this.allArr.length * this.oneWeekHeight;
			},
			//当前点击的或当前时间的周，在月面板的第几行
			weekRow() {
				return this.weekIdx
			},
			//月日历板的透明度
			monthPanelOpacity() {
				let value = 1 - (this.marginTop / this.oneMonthHeight);
				value = Math.abs(value);
				if (value <= 0.21) {
					return 0
				}
				return value
			},
			//收起月面板的距离
			closeMonthPanelMarginToValue(){
				return this.oneWeekHeight - this.oneMonthHeight
			}
		},
		watch: {
			dateTit: {
				handler(newValue) {
					if (newValue) {
						this.$emit('getSelectData', newValue)
					}
				},
				immediate: true
			},
			nowMonth1: {
				handler(newValue) {
					if (newValue) {
						var prevMonth1 = this.prevMonth1 < 10 ? '0' + this.prevMonth1 : this.prevMonth1;
						var nowMonth1 = this.nowMonth1 < 10 ? '0' + this.nowMonth1 : this.nowMonth1;
						var nextMonth1 = this.nextMonth1 < 10 ? '0' + this.nextMonth1 : this.nextMonth1;

						var bigArr = [];

						for (var i = 0; i < this.allArr.length; i++) {
							var aArr = [];
							var cArr = [];

							if (i == 0) {
								this.allArr[0].forEach(a => {
									if (a > 8) {
										aArr.push(this.prevYear1 + '-' + prevMonth1 + '-' + a)
									} else {
										var astr = a < 10 ? '0' + a : a;
										aArr.push(this.nowYear1 + '-' + nowMonth1 + '-' + astr)
									}
								})
								bigArr.push(aArr)
							} else if (i != 0 && i != this.allArr.length - 1) {
								var bArr = [];
								this.allArr[i].forEach(b => {
									var bstr = b < 10 ? '0' + b : b;
									bArr.push(this.nowYear1 + '-' + nowMonth1 + '-' + bstr)
								})
								bigArr.push(bArr)
							} else if (i == this.allArr.length - 1) {
								this.allArr[this.allArr.length - 1].forEach(c => {
									if (c < 8) {
										var cstr = c < 10 ? '0' + c : c;
										cArr.push(this.nextYear1 + '-' + nextMonth1 + '-' + cstr)
									} else {
										var cstr = c < 10 ? '0' + c : c;
										cArr.push(this.nowYear1 + '-' + nowMonth1 + '-' + cstr)
									}
								})
								bigArr.push(cArr)
							}

						}
						this.allDailyList = bigArr;
						// console.log(bigArr,"日期数据")

					}
				},
				immediate: true
			},
			isShowAllDate: {
				handler(newValue) {
					this.$emit('update:isOpen', newValue);
				},
				immediate: false
			},
			isOpen: {
				handler(newValue) {
					this.showPanel(newValue)
				},
				immediate: true
			},
			checkDailyList:{
				immediate:true,
				deep:true,
				handler(newValue){
					console.log('日历日程数据：',newValue)
				}
			}
		}
	}
</script>

<style scoped>
	.calendar_content {
		width: 100%;
		height: 100%;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	/* 日历 */
	.top_date {
		width: 100%;
		box-sizing: border-box;
		padding: 24rpx 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.date_time {
		font-size: 32rpx;
		font-family: Arial-BoldMT, Arial;
		font-weight: normal;
		color: #333333;
	}

	.date_btn {
		display: flex;
	}

	.icon_left,
	.icon_right {
		display: block;
		width: 40rpx;
		height: 40rpx;
	}

	.icon_right {
		margin-left: 46rpx;
	}

	.week_date {
		width: 100%;
		margin-bottom: 10rpx;
		display: flex;
		justify-content: space-around;
	}

	.week_item {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		/* background-color: blue; */
	}

	.day_date {
		display: flex;
		justify-content: space-around;
		/* background-color: green; */
		/* flex-shrink: 0; */
	}

	.day_item {
		width: 60rpx;
		height: 60rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* background-color: red; */
	}

	.day_item .text {
		text-align: center;
		font-size: 32rpx;
		font-family: ArialMT;
		color: #333333;
		margin-bottom: 5rpx;
	}

	.day_item .icon {
		width: 8rpx;
		height: 8rpx;
		background: #FF8244;
		border-radius: 50%;
	}

	.day_elem {
		background: #FF8244 !important;
		border-radius: 50%;
	}

	.day_elem .text {
		color: #FFFFFF;
	}

	.day_elem .icon {
		background: #FFFFFF;
	}

	.color_grey,
	.color_grey .text {
		color: #999999 !important;
	}

	.click_box .click_elem {
		border: 2rpx solid #FF8244;
		border-radius: 50%;
	}

	.show_panel {
		width: 100%;
		height: auto;
		position: relative;
		overflow: hidden;
		/*最小高能显示当前周，所以是60*/
		min-height: 80rpx;
		/* background-color: red; */
	}

	.week_panel {
		width: 100%;
		height: auto;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
	}

	.touch_panel {
		width: 100%;
		height: auto;
		min-height: 40rpx;
		flex: 1;
	}
</style>