<!--这里<template>，可以理解为，视图层-->
<template>
	<view>
		<!-- “逻辑层”里数据更改，可通过template监听数据的变化 来通知renderjs-->
		<!-- prop是个名字，可以随意改，但要注意 :change:[名字]，这两个名字需要相同-->
		<view :prop="options" :change:prop="test.updateOptions" id="test">
			{{JSON.stringify(options)}}
		</view>
		<button @click="editOptions">“逻辑层”修改数据renderjs监听变化</button>
		<!---->
		<!---->
		<!---->
		<button @click="test.onclick">调用renderjs里的方法</button>
		<!---->
		<!---->
		<!---->
		<button @click="test.onclick2">renderjs调用“逻辑层”里的方法</button>
		<!---->
		<!---->
		<!---->
		<button @click="test.onclick3">renderjs读取“逻辑层”里数据</button>
		<!---->
		<!---->
		<!---->
		<button @click="test.onclick4">renderjs修改“逻辑层”里数据</button>
		<!---->
		<!---->
		<!---->
		<button @click="callRenderjsFun">“逻辑层”里调用renderjs里方法</button>
		<!---->
		<!---->
		<!---->
		<button>“视图层”直接读取renderjs里的变量，答案，无法读取</button>
	</view>
</template>
<!--这里<script>，可以理解为，逻辑层-->
<script>
	export default {
		data() {
			return {
				options: {
					// 这里存放准备传递给renderjs的数据
					token: null,
					num: 1,
				}
			}
		},
		methods: {
			//“逻辑层”修改数据renderJS监听变化
			editOptions() {
				this.options = {
					// 这个地方我用时间戳来修改token，用于触发change，实际需要传递的数据是num
					token: Date.now(),
					num: Math.random()
				}
			},
			//打印“逻辑层”数据
			printLayerData(){
				console.log('逻辑层：this.options',this.options)
			},
			//renderjs调用“逻辑层”方法
			renderjsCallServiceFun(data){
				console.log('逻辑层接收到renderjs发来的数据', data)
			},
			//逻辑层调用renderjs里方法
			callRenderjsFun(){
				console.log('test',this.test)//调用不了，是undefined，调用renderjs里方法只能在template里绑定事件调
			}
		}
	}
</script>
<!--这里<script module="test" lang="renderjs">是renderjs层-->
<script module="test" lang="renderjs">
	export default {
		data(){
			return {}
		},
		mounted(){
			
		},
		methods: {
			//监听“逻辑层”里数据变化
			updateOptions(newValue, oldValue, ownerInstance, instance) {
				console.log('“逻辑层”中的options发生变化');
				console.log('新值', newValue);
				console.log('旧值', oldValue);
				// ownerInstance和this.$ownerInstance一样，可用来向“逻辑层”通信
				// instance和ownerInstance的区别是：
				// instance.$el指向的是触发事件的那个节点；而ownerInstance.$el指向当前vue文件中的根节点；
				// instance的作用目前尚不明确，官方没有给出用法
			},
			onclick(event, ownerInstance){
				// event是事件对象
				// ownerInstance 和 this.$ownerInstance 是一样的，都可用来调用“逻辑层”的方法
				console.log('调用了renderjs里的onclick方法');
			},
			onclick2(event, ownerInstance){
				// event是事件对象
				// ownerInstance 和 this.$ownerInstance 是一样的，都可用来调用“逻辑层”的方法
				
				//方式1
				//callMethod方法，接收两个参数，可以调用“逻辑层”中的方法，第一个参数是方法名，第二个参数是传过去的参数
				// ownerInstance.callMethod('renderjsCallServiceFun', {
				// 	test: 'testFun'
				// })
				
				//方法2
				this.$ownerInstance.callMethod('renderjsCallServiceFun', {
					test: 'testFun'
				})
			},
			onclick3(event, ownerInstance){
				// event是事件对象
				// ownerInstance 和 this.$ownerInstance 是一样的，都可用来调用“逻辑层”的方法
				
				console.log('this.$ownerInstance.$vm.options',this.$ownerInstance.$vm.options)
			},
			onclick4(event, ownerInstance){
				// event是事件对象
				// ownerInstance 和 this.$ownerInstance 是一样的，都可用来调用“逻辑层”的方法
				
				//不能用如下方法，不能在renderjs里直接修改“逻辑层”数据。修改“逻辑层”数据只能通过callMethod修改
				//这里this.$ownerInstance.$vm获取到的只是“逻辑层”里数据的副本，不是引用，直接修改数据只会修改副本数据，“逻辑层”里数据不会发生变化。
				this.$ownerInstance.$vm.options.a1 = 2;
				//打印副本数据变化
				console.log('this.$ownerInstance.$vm.options',this.$ownerInstance.$vm.options)
				//打印“逻辑层”里的数据变化
				this.$ownerInstance.callMethod('printLayerData')
			},
		}
	}
</script>