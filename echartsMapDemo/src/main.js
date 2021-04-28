import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

//引入echarts
const echarts = require('echarts')

echarts.registerMap('china', require('./assets/china.json'))

//引入河北省地图
echarts.registerMap('hebei', require('./assets/hebei.json'))

app.config.globalProperties.$echarts = echarts

app.use(router).mount('#app')

