# uni-app renderjs

1、[renderjs | uni-app官网](https://uniapp.dcloud.net.cn/tutorial/renderjs.html)

2、[uniapp中使用renderjs的一些细节](http://www.360doc.com/content/22/0902/13/8772388_1046266928.shtml)

3、[renderjs有什么用？聊聊uniapp中用renderjs的一些细节](http://www.info110.com/359075.html)

4、[renderjs使用经验](https://ask.dcloud.net.cn/article/40060)

### 什么是renderjs

`renderjs`是一个运行在视图层的js。它只支持app-vue和web。

### renderjs的主要作用

1、大幅降低逻辑层和视图层的通讯损耗，提供高性能视图交互能力

2、在视图层操作dom，运行 for web 的 js库，如echarts、three.js等

### renderjs功能详解

- 大幅降低逻辑层和视图层的通讯损耗，提供高性能视图交互能力

uni-app的app端逻辑层和视图层是分离的，这种机制有很多好处，但也有一个副作用是在造成了两层之间通信阻塞。尤其是App的Android端阻塞问题影响了高性能应用的制作。

uni-app只有H5端是视图层和逻辑层工作于同一个线程中。app-vue端、app-nvue端，以及小程序端，视图层和逻辑层分别工作在两个不同的线程里。这两个线程，一个专用于视图渲染，叫渲染线程；一个专用于逻辑业务的处理，叫逻辑线程。两个线程带来的好处是：即使视图层的渲染量很大，且逻辑层业务也很繁忙，依然不太担心出现性能问题，两个线程各管各的就行了。这也就是为什么APP端性能上限比H5端的性能上限高的原因。视图层和逻辑层通信阻塞的原因是，两个线程是相互独立的，无法共享内存，由于不能共享内存，视图层和逻辑层之间的数据必须经历(内部)序列化、反序列化和跨线程传送才能完成交换，交换效率十分低下，至少比单线程慢十倍。这就导致类似于touchmove这样原本在单线程上很容易实现的需求，在双线程上反而很难实现的原因。

`renderjs`运行在视图层，可以直接操作视图层的元素，避免通信折损（renderjs和视图层在同一个线程，可共享内存，所以不需要跨线程通信，也就没有通信损耗）。

- 在视图层操作dom，运行for web的js库

官方不建议在uni-app里操作dom，但如果你不开发小程序，想使用一些操作了dom、window的库，其实可以使用`renderjs`来解决。

在app-vue环境下，视图层由webview渲染，而`renderjs`运行在视图层，自然可以操作dom和window。

### renderjs注意事项

* 目前仅支持内联使用。
* renderjs里不要直接引用大型类库，推荐通过动态创建 script 方式引用。
* renderjs可以使用 vue 组件的生命周期(不支持 beforeDestroy、destroyed、beforeUnmount、unmounted)，不可以使用 App、Page 的生命周期
* 视图层和逻辑层通讯方式与 WXS 一致，另外可以通过 this.$ownerInstance 获取当前组件的 ComponentDescriptor 实例。
* 注意逻辑层给数据时最好一次性给到渲染层，而不是不停从逻辑层向渲染层发消息，那样还是会产生逻辑层和视图层的多次通信，还是会卡
* 观测更新的数据在视图层可以直接访问到。
* APP 端视图层的页面引用资源的路径相对于根目录计算，例如：./static/test.js。
* APP 端可以使用 dom、bom API，不可直接访问逻辑层数据，不可以使用 uni 相关接口（如：uni.request），可以使用部分（uni.upx2px）
* H5 端逻辑层和视图层实际运行在同一个环境(线程)中，相当于使用 mixin 方式，所以可以直接访问逻辑层数据。

### renderjs案例

* pages/demo1/demo1 里有 renderjs基本用法案例

* pages/index/index 里有 利用renderjs在app-vue里运行echart的案例

* pages/test/test 里有 利用renderjs开发app-vue高性能组件的案例
