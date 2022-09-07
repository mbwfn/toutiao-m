// 全局封装axios请求模块
import axios from 'axios'
import store from '../store/index.js'
// axios.defaults.baseURL = 'http://toutiao.itheima.net/'

// 如果一个项目中存在多个基本url的配置时，该如何设置baseURL呢？
// axios.create() 通过axios实例创建基本请求对象
// 通过export进行按需导出， 当使用时需要用 import {} 来进行引用
export const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
})

/*
  只要是需要登录后访问的接口，都需要token作为请求头
  所以我们需要通过axios的请求拦截器来统一设置已登录后的接口的请求头

  请求拦截器 - 建议放到个人笔记中
*/
request.interceptors.request.use(config => {
  // 判断是否登录 => store中的user是否携带token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }

  return config
}, (error) => {
  // 如果请求出错了，  - 抛出promise的错误异常
  return Promise.reject(error)
})

// export const request2 = axios.create({
//   baseURL: 'http://toutiao222.itheima.net/'
// })
