import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 根路由 - 当直接访问根路径时，就可以看到首页的组件
    component: () => import('../views/layout/layout.vue'),
    // 设置当前layout的4个子路由
    redirect: '/home', // 在首次进入layout组件时，需要重定向到首页子路由
    children: [
      {
        path: 'home', // 首页
        component: () => import('../views/home/home.vue')
      },
      {
        path: 'qa', // 问答
        component: () => import('../views/qa/qa.vue')
      },
      {
        path: 'video', // 视频
        component: () => import('../views/video/video.vue')
      },
      {
        path: 'my', // 个人中心
        component: () => import('../views/my/my.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/login/login.vue')
  },
  {
    path: '/search',
    component: () => import('../views/search/search.vue')
  },
  /*
    声明式导航的两种路由传参方式
    to="/path?属性名=属性值" => query

    router路由规则列表中设置 path: '/path/:属性名'
    标签中 to="/path/:属性值"
    => params

    通过以上方法，可以实现路由跳转不同组件的参数传递
    问题： 如果说与路由相关的这个组件（component中定义的组件）不仅可以进行路由跳转，也能会被其他的父组件所使用，那么这个传递过来的参数(articleId)该如何设置呢？
    解决方案：在路由规则列表中，设置props属性(props: true), 来开启路由跳转的props传参，把路由的参数映射到组件的props属性中
    注意事项：这种参数的设置方式，只适用于 路由规则列表中设置 path: '/path/:属性名' 的方法，不适用于 '?属性名=属性值'的传参方式

    通过以上这种方式，实现了一个参数既可以用路由传递也可以用组件传递
  */
  {
    path: '/article/:articleId',
    component: () => import('../views/article/article.vue'),
    props: true
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   // 通过在component属性中使用箭头函数的形式加载组件的文件资源。实现按需加载的功能，只有在使用到该路由时，才会进行组件文件的加载。 作用： 能够提高第一次开启页面时的加载效率
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
