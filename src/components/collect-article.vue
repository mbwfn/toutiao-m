<template>
  <!-- 文章收藏 -->
  <!-- 通过isCollected状态来控制图标的样式和颜色 -->

  <!-- isCollected: false => name: star-o; color: #777;
       isCollected: true => name: star; color: #ffa500;
       如果没有loading状态，现在下面的图标有没有节流功能？？
  -->
  <van-icon
    :color="isCollected ? '#ffa500' : '#777'"
    :name="isCollected ? 'star' : 'star-o'"
    @click="changeFollowed"
  />
</template>

<script>
import { addCollectAPI, deleteCollectAPI } from '../api/index.js'
export default {
  name: 'FollowUser',
  props: {
    isCollected: { // 收藏文章状态
      type: Boolean,
      default: true
    },

    artId: { // 文章id
      type: String,
      default: ''
    }
  },

  data () {
    return {
      btnLoading: false // 关注按钮的加载状态
    }
  },
  methods: {
    // 改变关注作者状态
    async changeFollowed () {
      // 判断 btnLoading 是否为true， 如果为true 则表示，还有接口没有执行完成，禁止进行下一步操作
      if (this.btnLoading) return

      // 触发改变状态时间时，开启加载状态
      this.btnLoading = true
      try {
        // 判断is_followed属性当前的状态，然后取反
        if (this.isCollected) {
        // 当前已关注，需要取消关注
          await deleteCollectAPI(this.artId)
        } else {
        // 当前未关注，需要添加关注
          await addCollectAPI(this.artId)
        }
        // 让父组件去完成关注状态的变化
        // this.$emit('update-follow', !this.isFollowed)
        // this.$emit('input', !this.value)
        this.$emit('update:isCollected', !this.isCollected)
        this.$toast(!this.isCollected ? '文章收藏成功' : '取消文章收藏')
      } catch (error) {
        this.$toast('操作失败')
        console.log(error)
      }

      // 整个逻辑执行完成后关闭加载状态
      this.btnLoading = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
