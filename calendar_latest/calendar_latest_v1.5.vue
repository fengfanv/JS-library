<!--calendar 1.5版本 支持android和ios的vue模式，但不支持nvue模式。日历展开收起和滚动条上下滚动完成适配。性能方面得到优化。此版本优化了滑动松手后的惯性动画（比上个版本的动画效果更好）-->
<template>
	<view class="calendar">
		<view class="calendar_content" :style="{'height':innerHeight+'px','top':-scrollTop+'px'}">
			<!-- 日历 -->
			<view class="top_date">
				<view class="date_time">{{dateTit}}</view>
				<view class="date_btn">
					<image src="@/static/img/schedule/icon_left.png" class="icon_left" @click="getPrev()">
					</image>
					<image src="@/static/img/schedule/icon_right.png" class="icon_right" @click="getNext()">
					</image>
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
			<view class="calendar_panel">
				<!-- 当前周面板 -->
				<view class="box_panel week_panel" v-show="weekShow">
					<view class="row">
						<view class="day_item" v-for="(dayItem,dayIndex) of weekData.arr" :key="dayIndex"
							:class="[isSelected(dayItem,dayIndex)?'active':'',isToday(dayItem,dayIndex)?'today':'']"
							@click="selectSomeDay(dayItem,dayIndex)">
							<text class="text">{{dayItem.day}}</text>
							<view class="icon" v-show="getDailyData(dayItem)"></view>
						</view>
					</view>
				</view>
				<!-- 当前月面板 -->
				<view class="box_panel"
					:style="{'margin-top':marginTop+'px','height':oneMonthHeight+'px','opacity':monthOpacity}">
					<view class="row" v-for="(item,index) of allArr" :key="index">
						<view class="day_item" v-for="(dayItem,dayIndex) of item" :key="dayIndex"
							:class="[(index==0 && dayItem.day>8)||(index==allArr.length-1 && dayItem.day<8) ? 'grey':'',isSelected(dayItem,dayIndex)?'active':'',isToday(dayItem,dayIndex)?'today':'']"
							@click="selectSomeDay(dayItem,dayIndex)">
							<text class="text">{{dayItem.day}}</text>
							<view class="icon" v-show="getDailyData(dayItem)"></view>
						</view>
					</view>
				</view>
				<!--触摸板，主要用于，收起和展开日历面板-->
				<!-- <button @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">触摸面板(往上滑收起/往下滑展开)</button> -->
				<view class="scroll-view" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
					@touchcancel="touchEnd">
					<slot ref="slot"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		throttle
	} from '@/static/js/getTime.js'
	export default {
		props: {
			//红点列表
			checkDailyList: {
				type: [Object, Array],
				default: () => {
					return []
				}
			},
			//是否展开（是否显示月面板），参数同步 isShowAll
			isOpen: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				calendarContext: null,
				scrollViewContext: null,

				startY: 0, //触摸开始的位置
				touchStartY: 0, //touchstart时的位置
				startTime: 0, //触摸开始时间
				isAnimation: true, //是否可以惯性动画

				isCalendar: true, //是否可以收起或关闭日历组件
				marginTop: 0, //月面板元素的位置
				weekShow: false, //是否显示周，false不显示，true显示
				monthOpacity: 1, //月面板透明度，0透明，1不透明
				isShowAll: false, //是否显示全部（true，月视图，false周视图）

				allArr: [], //某年某月的日历（月视图）数据
				showYear: "", //当前日历数据是哪年哪月的某年
				showMonth: "", //当前日历数据是哪年哪月的某月（1-12）

				focusYear: "", //点击日历上的日期后，点击的是哪年
				focusMonth: "", //点击日历上的日期后，点击的是那月（1-12）
				focusDay: "", //点击日历上的日期后，点击的是哪天（1-31）
				focusWeek: "", //点击日历上的日期后，被点击的那天是星期几 （0-6）

				viewWidth: 0, //日历组件的宽度
				viewHeight: 0, //日历组件的高度
				scrollTop: 0, //scroll-view的scrollTop值
				isTop: true, //scrollTop是否等于0
				isScrollView: true, //scroll-view是否可以滚动
				innerHeight: 0, //scrollview内容高度

				isCanRunTouchMove: true, //是否可以执行touchmove事件，解决touchmove事件触发频率太高，影响手机性能的问题

			};
		},
		created() {
			//初始化日历
			this.getCalendarData();

			//默认仅显示周面板
			this.showPanel(false);
		},
		beforeUpdate() {
			this.isCanRunTouchMove = false;
		},
		updated() {
			this.getDomInfo(); //获取dom大小

			this.isCanRunTouchMove = true;
		},
		methods: {
			//获取 某年某月 的日历（月视图）数据
			getCalendarData(y, m) {
				var date = null;
				if (typeof y == 'undefined' || typeof m == 'undefined') {
					//如果没传，则获取当前日期的
					date = new Date();
					//初始化当前选中的日期及星期
					this.focusYear = date.getFullYear();
					this.focusMonth = (date.getMonth() + 1);
					this.focusDay = date.getDate();
					this.focusWeek = date.getDay();
				} else {
					date = new Date(y + '/' + m + '/' + 1);
				}

				// 当月1号是周几
				var oneDateWeek = new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${1}`).getDay();
				// 当月最后一天是几号
				var totalDate = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();

				// 获取上个月的信息
				var prevYue = (date.getMonth() + 1) == 1 ? 12 : (date.getMonth() + 1) - 1;
				var prevNian = prevYue == 12 ? date.getFullYear() - 1 : date.getFullYear();
				// 获取上个月最后一天是几号
				var prevTotalDate = new Date(prevNian, prevYue, 0).getDate();

				// 生成当月的日历面板上，将会显示的上月的那几天的日期
				var prevDay = prevTotalDate - oneDateWeek;
				var prevArr = [];
				for (var i = 1; i <= oneDateWeek; i++) {
					prevArr.push({
						year: prevNian,
						month: prevYue,
						day: prevDay + i
					})
				}
				// console.log(prevArr);

				// 生成当月的日期
				var currentArr = []
				for (var j = 1; j <= totalDate; j++) {
					currentArr.push({
						year: date.getFullYear(),
						month: (date.getMonth() + 1),
						day: j
					})
				}
				// console.log(currentArr);

				// 获取下个月的信息
				// 获取这个月最后一天是星期几
				var nextDateWeek = new Date(date.getFullYear(), date.getMonth(), totalDate).getDay();
				var nextDay = 6 - nextDateWeek <= 0 ? 0 : 6 - nextDateWeek;
				var nextYue = (date.getMonth() + 1) == 12 ? 1 : (date.getMonth() + 1) + 1;
				var nextNian = nextYue == 1 ? date.getFullYear() + 1 : date.getFullYear();

				// 生成当月的日历面板上，将会显示的下月的那几天的日期
				var nextArr = []
				for (var n = 1; n <= nextDay; n++) {
					nextArr.push({
						year: nextNian,
						month: nextYue,
						day: n
					})
				}
				// console.log(nextArr);

				// 将 prevArr 和 currentArr 和 nextArr 这三个数组合并
				var calendarTotalDays = [];
				calendarTotalDays = prevArr.concat(currentArr, nextArr);
				console.log(calendarTotalDays);

				// 每7天一组
				var allArr = [];
				for (var a = 0; a < calendarTotalDays.length;) {
					allArr.push(calendarTotalDays.slice(a, a += 7))
				}
				console.log(allArr);
				this.allArr = allArr;
				this.showYear = date.getFullYear();
				this.showMonth = date.getMonth() + 1;

			},
			//在日历下点击选中某一天
			selectSomeDay(dayItem, dayIndex) {
				this.focusYear = dayItem.year;
				this.focusMonth = dayItem.month;
				this.focusDay = dayItem.day;
				this.focusWeek = dayIndex;

				//判断是否需要切换月视图面板
				if (this.showMonth != dayItem.month) {
					this.getCalendarData(dayItem.year, dayItem.month);
				}
			},
			//检查当前日期是否被选中
			isSelected(dayItem, dayIndex) {
				if (this.focusYear == dayItem.year && this.focusMonth == dayItem.month && this.focusDay == dayItem.day &&
					this.focusWeek == dayIndex) {
					return true;
				}
				return false;
			},
			//按钮，让日历显示上个月的日历（月视图切换成上个月的）
			switchPrevMonth() {
				let prevMonth = this.showMonth - 1 <= 0 ? 12 : this.showMonth - 1;
				let year = prevMonth == 12 ? this.showYear - 1 : this.showYear;
				this.getCalendarData(year, prevMonth);
				let oneDateIndex = null; //保存这月1号的数据，备用
				//月视图切换（切换到新月份时，切换前是几号，新月份就选几号）
				for (let i = 0; i < this.allArr.length; i++) {
					for (let j = 0; j < this.allArr[i].length; j++) {
						let dayItem = this.allArr[i][j];
						if (dayItem.year == year && dayItem.month == prevMonth && dayItem.day == 1) {
							oneDateIndex = j;
						}
						if (dayItem.year == year && dayItem.month == prevMonth && dayItem.day == this.focusDay) {
							this.selectSomeDay(dayItem, j)
							return true;
						}
					}
				}
				//新月份里没有上个月所选的日期，如上个月选的是31号，这个月里没有31号，则切换成1号
				this.selectSomeDay(this.allArr[0][oneDateIndex], oneDateIndex);
			},
			//按钮，让日历显示下个月的日历（月视图切换成下个月的）
			switchNextMonth() {
				let nextMonth = this.showMonth + 1 >= 13 ? 1 : this.showMonth + 1;
				let year = nextMonth == 1 ? this.showYear + 1 : this.showYear;
				this.getCalendarData(year, nextMonth);
				let oneDateIndex = null; //保存这月1号的数据，备用
				//月视图切换（切换到新月份时，切换前是几号，新月份就选几号）
				for (let i = 0; i < this.allArr.length; i++) {
					for (let j = 0; j < this.allArr[i].length; j++) {
						let dayItem = this.allArr[i][j];
						if (dayItem.year == year && dayItem.month == nextMonth && dayItem.day == 1) {
							oneDateIndex = j;
						}
						if (dayItem.year == year && dayItem.month == nextMonth && dayItem.day == this.focusDay) {
							this.selectSomeDay(dayItem, j)
							return true;
						}
					}
				}
				//新月份里没有上个月所选的日期，如上个月选的是31号，这个月里没有31号，则切换成1号
				this.selectSomeDay(this.allArr[0][oneDateIndex], oneDateIndex);
			},
			//按钮，从当前周，切换成上周
			switchPrevWeek() {
				//周视图切换（切换到新周时，切换前是星期几，新周就选星期几）
				if (this.weekData.index == 0) {
					let haveGreaterThan8 = this.weekData.haveGreaterThan8; //这周里是否有31,30,29,28这样的日期
					//先日历切换成上个月
					let prevMonth = this.showMonth - 1 <= 0 ? 12 : this.showMonth - 1;
					let year = prevMonth == 12 ? this.showYear - 1 : this.showYear;
					this.getCalendarData(year, prevMonth);
					if (haveGreaterThan8 == true) {
						//切换成功后，这时this.weekData.index就从0变成了this.allArr.length-1，但又因为this.allArr.length-1指向的还是当前这个星期，所以需要-2
						let newIndex = this.allArr.length - 2;
						let newDay = this.allArr[newIndex][this.focusWeek];
						this.selectSomeDay(newDay, this.focusWeek);
					} else {
						//切换前的那周的周日，是那个月的一号，那周的第一天，也是那月的第一天，（判断方法就是，判断那周里有没有31,30,29,28这样的日期）（咱们这里的显示标准是美国标准，周日是一周的开始，周六是一周的结束）所以切换到上个月后，this.allArr.length - 1，就是切换到上一周。
						let newIndex = this.allArr.length - 1;
						let newDay = this.allArr[newIndex][this.focusWeek];
						this.selectSomeDay(newDay, this.focusWeek);
					}
				} else {
					let newIndex = this.weekData.index - 1;
					let newDay = this.allArr[newIndex][this.focusWeek];
					this.selectSomeDay(newDay, this.focusWeek);
				}
			},
			//按钮，从当前周，切换成下周
			switchNextWeek() {
				//周视图切换（切换到新周时，切换前是星期几，新周就选星期几）
				if (this.weekData.index == this.allArr.length - 1) {
					let haveOne = this.weekData.haveOne; //当前一周里，是否有1号
					//先切换成上下月
					let nextMonth = this.showMonth + 1 >= 13 ? 1 : this.showMonth + 1;
					let year = nextMonth == 1 ? this.showYear + 1 : this.showYear;
					this.getCalendarData(year, nextMonth);
					if (haveOne == true) {
						//切换成功后，焦点时间和星期，就从this.allArr.length-1变成this.allArr[0]了。为了切换成下周，这里需要使用this.allArr[1]
						let newIndex = 1;
						let newDay = this.allArr[newIndex][this.focusWeek];
						this.selectSomeDay(newDay, this.focusWeek);
					} else {
						//切换前的那周，那周的最后一天，也是那月的最后一天，（判断方法，判断那周里，有没有1号）（咱们这里的显示标准是美国标准，周日是一周的开始，周六是一周的结束）。所以切换到下个月后，this.allArr[0]，就是切换到下一周。
						let newIndex = 0;
						let newDay = this.allArr[newIndex][this.focusWeek];
						this.selectSomeDay(newDay, this.focusWeek);
					}
				} else {
					let newIndex = this.weekData.index + 1;
					let newDay = this.allArr[newIndex][this.focusWeek];
					this.selectSomeDay(newDay, this.focusWeek);
				}
			},
			//检查是否今日
			isToday(dayItem, dayIndex) {
				var d = new Date();
				var currentYear = d.getFullYear(); //年
				var currentMonth = d.getMonth() + 1; //月
				var currentDay = d.getDate(); //日
				var currentWeek = d.getDay(); //星期几
				if (dayItem.year == currentYear && dayItem.month == currentMonth && dayItem.day == currentDay &&
					currentWeek == dayIndex) {
					return true
				}
				return false;
			},
			getPrev() {
				if (this.isShowAll) {
					this.switchPrevMonth()
				} else {
					this.switchPrevWeek()
				}
			},
			getNext() {
				if (this.isShowAll) {
					this.switchNextMonth()
				} else {
					this.switchNextWeek()
				}
			},
			//检测某日，是否有数据
			getDailyData(dayItem) {
				let dayStr = dayItem.year + '-' + (dayItem.month < 10 ? '0' + dayItem.month : dayItem.month) + '-' + (
					dayItem.day < 10 ? '0' + dayItem.day : dayItem.day);
				if (this.checkDailyList.indexOf(dayStr) != -1) {
					return true;
				} else {
					return false;
				}
			},
			touchStart(e) {
				this.startY = e.touches[0].pageY;
				this.touchStartY = e.touches[0].pageY;
				this.startTime = Date.now();
				this.isAnimation = false;
			},
			touchMove(e) {
				if (this.isCanRunTouchMove == false) {
					return false;
				}

				let py = e.touches[0].pageY;
				let move = py - this.startY;
				this.startY = py;

				//move负值（手指从 手机底部 划向 手机顶部）
				//move正值（手指从手机顶部 划向 手机底部）

				this.touchCalendar(move);
				this.touchSroll(move);
			},
			touchEnd(e) {
				//松手后惯性动画
				if (this.isTop == false && this.weekShow == true) {
					let pageY = e.changedTouches[0].pageY;
					let now = Date.now();
					let speed = ((pageY - this.touchStartY) / (now - this.startTime)) * 16 //重点
					if (now - this.startTime > 300) {
						return false;
					}
					this.isAnimation = true;
					let f = 0;
					let animation = ()=> {
						this.isAnimation && setTimeout(animation, 10)
						f = Math.min(Math.abs(speed) / 32, 0.5) //重点
						if (speed > 0.2) {
							speed = speed - f
						} else if (speed < -0.2) {
							speed = speed + f
						} else {
							this.isAnimation = false;
							speed = 0
							return false;
						}

						let target = this.scrollTop - speed;
						if (target <= 0) {
							target = 0;
							this.isAnimation = false;
						} else if (target >= this.scrollTopMax) {
							target = this.scrollTopMax;
							this.isAnimation = false;
						}
						this.setSrollTop(target)
					}
					animation();
				}

				//手指松开后判断月面板是否可以展开
				if (this.marginTop >= -this.oneMonthHeight / 2) {
					//展开（显示月面板）
					this.showPanel(true)
				} else {
					//收起（不显示月面板）
					this.showPanel(false)
				}
				//手指松开后判断是否触顶
				if (this.scrollTop == 0) {
					this.isTop = true;
				}
				//手指松开后恢复值
				this.isScrollView = true;
				this.isCalendar = true;
			},
			//触摸移动页面scrollTop变化
			touchSroll(move) {
				//move负值（手指从 手机底部 划向 手机顶部）
				//move正值（手指从手机顶部 划向 手机底部）

				let scrollTop = this.scrollTop - move;
				if (scrollTop <= 0) {
					//触顶了
					scrollTop = 0;
				} else if (scrollTop >= this.scrollTopMax) {
					//触底了
					scrollTop = this.scrollTopMax;
				} else {
					//既没触底也没触顶
				}

				this.setSrollTop(scrollTop);

			},
			//设置scrollTop
			setSrollTop(scrollTop) {
				if (!this.isCanRunTouchMove) {
					return false;
				}

				if (!this.isScrollView) {
					return false;
				}

				if (scrollTop == 0) {
					//触顶
					this.isTop = true;
					this.isCalendar = false;
				} else if (scrollTop >= (this.scrollTopMax - 150)) {
					//抛出触底事件
					this.scrolltolower();
					this.isTop = false;
				} else {
					this.isTop = false;
				}

				this.scrollTop = scrollTop;

			},
			//触摸移动展开或关闭日历
			touchCalendar(move) {
				//move负值（手指从 手机底部 划向 手机顶部）
				//move正值（手指从手机顶部 划向 手机底部）

				if (this.isTop && move > 0) {
					this.scrollTop = 0;
					this.isScrollView = false;
				}

				if (this.isTop && move < 0 && this.isShowAll) {
					this.scrollTop = 0;
					this.isScrollView = false;
				}

				if (this.isTop == false && move > 0) {
					this.marginTop = this.calendarCloseMarginTop;
					move = 0;
				}

				if (this.isCalendar == false) {
					move = 0;
				}

				//日历展开与收起
				let marginTop = this.marginTop + move;
				let weekShow = this.weekShow;
				let monthOpacity = this.monthOpacity;
				if (marginTop >= 0) {
					marginTop = 0;
				}
				if (marginTop <= this.calendarCloseMarginTop) {
					marginTop = this.calendarCloseMarginTop;
				}
				if (marginTop <= -this.weekData.index * this.oneWeekHeight) {
					//显示周
					weekShow = true;
					//月面板透明度
					monthOpacity = 0.5;
				} else {
					//不显示周
					weekShow = false;
					//月面板透明度
					monthOpacity = 1;
				}
				if (marginTop <= this.calendarCloseMarginTop) {
					//月面板完全收起来了，隐藏月面板
					monthOpacity = 0;
				}
				this.marginTop = marginTop;
				this.weekShow = weekShow;
				this.monthOpacity = monthOpacity;

			},
			showPanel(value) {
				if (value) {
					//展开（显示月面板）
					this.marginTop = this.calendarOpenMarginTop;
					this.weekShow = false; //隐藏周面板
					this.monthOpacity = 1; //月面板透明度
				} else {
					//收起（不显示月面板）
					this.marginTop = this.calendarCloseMarginTop;
					this.weekShow = true; //显示周面板
					this.monthOpacity = 0; //月面板透明度
				}
				this.isShowAll = value
			},
			getDomInfo() {
				if (!this.calendarContext) {
					this.calendarContext = uni.createSelectorQuery().in(this).select(".calendar");
				}
				this.calendarContext.fields({
					size: true
				}, data => {
					// console.log("得到节点信息",data);
					this.viewWidth = data.width;
					this.viewHeight = data.height;
				}).exec();

				if (!this.scrollViewContext) {
					this.scrollViewContext = uni.createSelectorQuery().in(this).select(".scroll-view");
				}

				this.scrollViewContext.fields({
					size: true
				}, data => {
					// console.log("得到节点信息",data);
					this.innerHeight = data.height;
				}).exec();
			},
			//滚动条触底事件
			scrolltolower: throttle(function() {
				this.$emit('scrolltolower'); //暴露触底事件
			}, 2000),
		},
		computed: {
			//获取当前周列表及其它信息
			weekData() {
				for (let i = 0; i < this.allArr.length; i++) {
					for (let j = 0; j < this.allArr[i].length; j++) {
						let dayItem = this.allArr[i][j];
						if (dayItem.year == this.focusYear && dayItem.month == this.focusMonth && dayItem.day == this
							.focusDay && j == this.focusWeek) {
							let haveOne = false; //这周里是否有1号
							let haveGreaterThan8 = false; //这周里是否有大于8的日子（这周里是否有31,30,29,28这样的日子）
							for (let k = 0; k < this.allArr[i].length; k++) {
								if (this.allArr[i][k].day == 1) {
									haveOne = true;
								}
								if (this.allArr[i][k].day > 8) {
									haveGreaterThan8 = true;
								}
							}
							return {
								arr: this.allArr[i], //这周的日期
								index: i, //这周是这个月的第几个星期
								haveOne,
								haveGreaterThan8
							}
						}
					}
				}
				return {
					arr: [],
					index: 0,
					haveOne: false,
					haveGreaterThan8: false,
				}
			},
			//一周的高度
			oneWeekHeight() {
				return uni.upx2px(56); //设计图里的高度，56
			},
			//当前月的高度
			oneMonthHeight() {
				return this.allArr.length * this.oneWeekHeight;
			},
			//当前焦点时间（年-月-日）
			dateTit() {
				return (this.showYear) + '.' + (this.showMonth < 10 ? '0' + this.showMonth : this.showMonth) + '.' + (this
					.focusDay < 10 ? '0' + this.focusDay : this.focusDay);
			},
			//日历的高度
			calendarContentHeight() {
				let baseHeight = uni.upx2px((24 + 40 + 24) + (44 + 10));
				return baseHeight + (this.oneMonthHeight + this.marginTop);
			},
			//日历展开的marginTop
			calendarOpenMarginTop() {
				return 0;
			},
			//日历收起的marginTop
			calendarCloseMarginTop() {
				return this.oneWeekHeight - this.oneMonthHeight;
			},
			//scroll的高度（容器内容高度）
			scrollHeight() {
				return this.calendarContentHeight + this.innerHeight
			},
			//scrollTop的最大值
			scrollTopMax() {
				return this.scrollHeight - this.viewHeight
			}
		},
		watch: {
			dateTit: {
				handler(newValue) {
					if (newValue) {
						this.$emit('getSelectData', newValue);
						//每个月的月面板高度可能不一样，切换日期时，如果需要切换月份，为了避免出现bug，及时更新marginTop距离
						if (this.isShowAll) {
							//月面板展开时的高度
							this.marginTop = this.calendarOpenMarginTop;
						} else {
							//月面板收起时的高度
							this.marginTop = this.calendarCloseMarginTop;
						}
					}
				},
				immediate: true
			},
			isShowAll: {
				handler(newValue) {
					this.$emit('update:isOpen', newValue);
				},
				immediate: false
			},
			isOpen: {
				handler(newValue) {
					this.isShowAll = newValue;
				},
				immediate: true
			},
		}
	}
</script>

<style scoped>
	.calendar {
		width: 100%;
		height: 100%;
		/* flex-shrink: 0; */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		position: relative;
		overflow: hidden;

	}

	.calendar_content {
		width: 100%;
		height: auto;
		position: absolute;
		left: 0;
	}

	/* 日历 */
	.top_date {
		width: 100%;
		box-sizing: border-box;
		padding: 24rpx 32rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.date_time {
		font-size: 32rpx;
		font-family: Arial-BoldMT, Arial;
		font-weight: normal;
		color: #333333;
		line-height: 36rpx;
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
		flex-direction: row;
		justify-content: space-around;
	}

	.week_item {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		background-color: blue;
		line-height: 44rpx;
	}

	.calendar_panel {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: red;
		position: relative;
		overflow: hidden;
	}

	.week_panel {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
	}

	.box_panel {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.box_panel .row {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.box_panel .row .day_item {
		width: 56rpx;
		height: 56rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
	}

	.box_panel .row .day_item .text {
		font-size: 32rpx;
		font-family: Arial-BoldMT, Arial;
		font-weight: normal;
		color: #333333;
		line-height: 36rpx;
		margin-top: 8rpx;
	}

	.box_panel .row .day_item .icon {
		width: 8rpx;
		height: 8rpx;
		background: #FFBA91;
		border-radius: 50%;
	}

	.box_panel .row .active {
		box-sizing: border-box;
		border-radius: 50%;
		border: 2rpx solid #FFBA91;
	}

	.box_panel .row .today {
		background: #FFBA91;
		border-radius: 50%;
	}

	.box_panel .row .today .text {
		color: #FFFFFF !important;
	}

	.box_panel .row .today .icon {
		background: #FFFFFF !important;
	}

	.box_panel .row .grey .text {
		color: #DDDDDD !important;
	}

	.scroll-view {
		width: 100%;
		height: auto;
		min-height: 40rpx;
		flex: 1;
		background-color: aquamarine;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		flex-shrink: 0;
		-webkit-overflow-scrolling: touch;
	}
</style>