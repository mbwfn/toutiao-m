import Vue from 'vue'
import App from './App.vue'
// index 文件可以被快捷路径所忽略
// index命名的文件对于功能可读性来说是非常差的
import router from './router/index.js'
import store from './store/index.js'

// 加载 Vant 核心组件库
import Vant from 'vant'

// 加载 Vant 全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

// 注册侧使用 Vant 组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
