<template>
  <div class="my-container">
    <!-- 以登录状态 -->
    <div class="header user-info" v-if="user.token">
      <!-- 头像基本信息区域 -->
      <!-- {{ this.$store.state.user }} -->
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            :src="userInfo.photo"
            fit="cover"
            round
          />

          <span class="name">{{ userInfo.name }}</span>
        </div>

        <van-button round  size="mini">编辑资料</van-button>
      </div>

      <!-- 头条，关注，粉丝，获赞 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>

        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>

        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>

        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录状态 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="goLogin">
        <img class="mobile-img" src="../../assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 - 收藏 历史 -->
    <!-- 如果遇到某个属性的值为布尔类型，当需要设置它为true时，可以省略赋值操作 :clickable="true" => clickable -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item icon="clock-o" text="历史" />
    </van-grid>

    <!-- 单元格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell title="退出登录" class="logout-cell"  v-if="user.token" @click="onLogout"/>
  </div>
</template>

<script>
/*
  目标： 跳转登录并实现登录后的跳转
  1. 绑定未登录页面上的按钮点击事件，通过路由的跳转方式，切换到登录路由
  2. 当我们输入完成正确的登录信息后，关闭登录页面并跳转到之前跳转登录的那个路由（原路返回）
  3. 如果放弃登录，也需要返回原来的路由页面
*/

/*
  目标：已登录和未登录状态的页面展示切换
  1. 确认页面上有哪些成分是需要做切换操作的
  2. 确定用哪个变量来作为切换操作的状态值 - 根据store中的user用户token来进行判断
  获取store中的state属性有2种方式
    1. $store.state.属性名
    2. 使用vuex内置方法 mapState() 放到当前组件的计算属性中，直接按需引入state中属性
*/

/*
  目标：用户退出登录
  1. 退出登录其实就是删除/修改 全局状态管理器中的user
  2. 需要为退出按钮添加一个二次确认弹框 - 在以后的工作中只要涉及到退出，删除，修改会影响项目原始数据的操作，一般情况下都需要二次确认逻辑
*/

/*
  渲染数据到页面
  1. 阅读接口文档，创建接口
  2. 在created或mounted中调用接口并进行赋值操作
  3. 将获取到数据的变量部署至页面上

  只要是需要登录后访问的接口，都需要token作为请求头
  所以我们需要通过axios的请求拦截器来统一设置已登录后的接口的请求头
*/

import { mapState } from 'vuex'
import { getUserInfoAPI } from '../../api/index.js'
export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {}
    }
  },

  computed: {
    ...mapState(['user'])
  },

  created () {
    // 获取用户登录信息 - 判断用户是否登录，如果登录了采取获取
    if (this.user.token) {
      this.loadUserInfo()
    }
  },

  methods: {
    // 获取用户基本信息
    async loadUserInfo () {
      try {
        const res = await getUserInfoAPI()
        this.userInfo = res.data.data
      } catch (error) {
        console.log(error)
      }
    },

    // 跳转登录
    goLogin () {
      this.$router.push({
        path: '/login'
      })
    },

    // 退出登录
    onLogout () {
      // 弹框二次确认
      this.$dialog.confirm({
        title: '确认退出吗？'
      }).then(() => {
        // 点击确认时触发的方法
        // 当确认退出时，将清除登录状态 - 将user设置为空对象
        this.$store.commit('setUser', {})
      }).catch(() => {
        // 点击取消时触发的方法
        console.log('取消执行逻辑')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 360px;
    background-image: url('../../assets/banner.png');
    background-size: cover;
  }

  .user-info {
    padding: 76px 32px 0 32px;
    box-sizing: border-box;

    .base-info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 130px;
          height: 130px;
          border: 4px solid #fff;
          margin-right: 32px;
        }

        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }

    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-btn {
      display: flex;
      flex-direction: column; // 主轴设置为竖直方向

      .mobile-img {
        width: 130px;
        height: 130px;
        margin-bottom: 16px;
      }

      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .grid-nav {
    .van-grid-item {
      height: 140px;
      // 穿透样式
      :deep(.van-icon-star-o) {
        color: red;
      }

      :deep(.van-icon-clock-o) {
        color: #ff9d1d;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
    margin-top: 12px;
  }
}
</style>
