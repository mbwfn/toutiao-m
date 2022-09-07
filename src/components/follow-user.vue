<template>
  <!-- 未关注 -->
  <van-button
    class="follow-btn"
    type="info"
    slot="default"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    v-if="!isFollowed"
    @click="changeFollowed"
    :loading="btnLoading"
  >关注 {{ isFollowed }}</van-button>

  <!-- 已关注 -->
  <van-button
    class="follow-btn"
    round
    size="small"
    v-else
    :loading="btnLoading"
    @click="changeFollowed"
  >已关注 {{ isFollowed }}</van-button>
</template>

<script>
/*
  如何在子组件修改父组件传递过来的简单数据类型 - 不需要在父组件中设置自定义事件进行数据的操作
  方法一： v-model指令来实现数据的双向绑定
  通过props中的默认参数value接收 v-model传递过来的值
  通过$emit('input', 参数) 来修改v-model中传递过来的值

  可以使用model属性中的prop来修改value的名称
  可以使用model属性中的event来修改input默认事件的名称

  如果有多个简单数据类型需要进行子组件的修改，该怎么办呢？
  方法二： 通过.sync 修饰符来实现数据的双向绑定
  父组件设置自定义属性后添加.sync修饰符，子组件正常接收
  子组件通过$emit('update:自定义属性', 参数)来修改父组件传递过来的值
*/
import { deleteFollowAPI, addFollowAPI } from '../api/index.js'
export default {
  name: 'FollowUser',
  // model属性可以去修改组件v-model 和 input修改变量内置方法的默认名称
  // model: {
  //   prop: 'isFollowed', // => 将value 改成 isFollowed
  //   event: 'update-follow' // => 将input 默认事件 改成 update-follow
  // },
  props: {
    isFollowed: {
      type: Boolean,
      default: true
    },

    // value: {
    //   type: Boolean,
    //   default: true
    // },

    autId: { // 用户id
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
      // 触发改变状态时间时，开启加载状态
      this.btnLoading = true
      try {
        // 判断is_followed属性当前的状态，然后取反
        if (this.isFollowed) {
        // 当前已关注，需要取消关注
          await deleteFollowAPI(this.autId)
        } else {
        // 当前未关注，需要添加关注
          await addFollowAPI(this.autId)
        }
        // 让父组件去完成关注状态的变化
        // this.$emit('update-follow', !this.isFollowed)
        // this.$emit('input', !this.value)
        this.$emit('update:isFollowed', !this.isFollowed)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast('你不能关注你自己！')
        } else {
          this.$toast('操作失败')
        }
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
