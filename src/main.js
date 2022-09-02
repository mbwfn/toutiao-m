import Vue from 'vue'
import App from './App.vue'
// index 文件可以被快捷路径所忽略
// index命名的文件对于功能可读性来说是非常差的
import router from './router/index.js'
import store from './store/index.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
