<template>
  <div class="layout-container">
    <!-- 二级路由组件 -->
    <router-view></router-view>

    <!-- 底部标签导航 tabbar -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item replace to="/home" icon="star-o">
        <template #icon>
          <i class="toutiao toutiao-shouye"></i>
        </template>
      <!-- 如果说，一个标签中嵌套了另一个标签时，那么不建议在这个父标签里直接书写文本 -->
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/qa" icon="home-o">
        <template #icon>
          <i class="toutiao toutiao-wenda"></i>
        </template>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/video" icon="home-o">
        <template #icon>
          <i class="toutiao toutiao-shipin"></i>
        </template>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="search">
        <template #icon>
          <i class="toutiao toutiao-wode"></i>
        </template>
        <span class="text">{{user.token ? '我的' : '未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  data () {
    return {

    }
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    .toutiao {
      font-size: 38px;
    }

    .text {
      font-size: 24px;
    }
  }
}

</style>
