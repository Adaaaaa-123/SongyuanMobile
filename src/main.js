import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import "lib-flexible/flexible"
import Vant from 'vant'
import './index.less';
import '@/permission' // permission control
import echarts from 'echarts' //引入echarts
Vue.prototype.$echarts = echarts //挂载在原型，组件内使用直接this.$echarts调用

Vue.use(Vant)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
