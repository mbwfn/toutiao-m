// 全局状态管理器
import Vue from 'vue'
import Vuex from 'vuex'

// 引入缓存的方法
import { setItem, getItem } from '../utils/storage.js'

Vue.use(Vuex)
// 今天，主要使用state与mutations中的方法和属性来进行token的存储
/*
  持久化数据缓存的步骤
  1. 在获数据的时候通过getItem从缓存中拿数据，若没有缓存，则设置空数据结构
  2. 在更新数据时通过setItem讲更新后的数据缓存到本地
*/
// 统一设置缓存名称变量
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  // 1. 储存数据的位置 - 类比于vue文件的data(){}
  state: {
    // 声明一个对象， 储存当前登录用户的token数据
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY)) || {}
    user: getItem(TOKEN_KEY) || {}
  },

  // 2. 是state中的变量的计算属性 - 类比computed
  getters: {
  },

  // 3. 当外界组件需要修改state中变量的属性值时，必须通过mutations中设置的修改方法来进行修改，不允许直接修改state中的变量 - 类比于methods中的方法
  // ref 与 refs 的组件使用时， $refs来获取子组件的变量值，但是不可以进行直接的修改， 需要调用子组件中设置的修改方法来进行修改
  mutations: {
    /*
      state(固定参数): 全局状态管理器中state定义的所有变量
      data: 其他组件传递过来的参数
    */
    setUser (state, data) {
      console.log(state, data)
      state.user = data
      // 将数据备份到本地存储中
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },

  // 4. 当在处理组件传递过来的参数时，涉及到异步操作，必须先进过actions中定义的方法完成所有异步处理，才可以进入到mutations中
  // 一个异步操作在全局状态管理器中的流转状态: 子组件中 => actions(做完了一步操作) => mutations(主动修改state) => state发送改变
  actions: {
  },

  // 5. 模块化，当一个项目中有很多个不同业务的状态需要全局管理时，可以把以上4个方法属性按照需求拆分到其他的js文件中，最后在modules里面进行整合。
  modules: {
  }
})
