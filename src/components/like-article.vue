<template>
  <!-- 文章点赞 -->
  <!-- 通过attitude状态来控制图标的样式和颜色 -->

  <!-- attitude === -1 => name: star-o; color: #777;
       attitude === 1 => name: star; color: #ffa500;
       如果没有loading状态，现在下面的图标有没有节流功能？？
  -->
  <van-icon
    :color="attitude === 1 ? '#ff0000' : '#777'"
    :name="attitude === 1 ? 'good-job' : 'good-job-o'"
    @click="changeFollowed"
  />
</template>

<script>
import { addLikeAPI, deleteLikeAPI } from '../api/index.js'
export default {
  name: 'FollowUser',
  props: {
    attitude: { // 用户对文章的态度 -1: 无态度，0-不喜欢，1-点赞 如果不写这行注释，这个变量的状态值将变得不可读，称其为魔鬼数字
      type: Number,
      default: -1
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
        if (this.attitude === 1) {
        // 当前点赞，需要取消点赞
          await deleteLikeAPI(this.artId)
        } else {
        // 当前未点赞，需要添加点赞
          await addLikeAPI(this.artId)
        }
        // 让父组件去完成点赞状态的变化
        // this.$emit('update-follow', !this.isFollowed)
        // this.$emit('input', !this.value)
        this.$emit('update:attitude', this.attitude === 1 ? -1 : 1)
        this.$toast(this.attitude !== 1 ? '文章点赞成功' : '取消文章点赞')
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
