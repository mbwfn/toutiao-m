<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
    ></comment-item>
  </van-list>
</template>

<script>
/*
  目标1： 当请求玩数据后，将文章评论总数传递给父组件
  1. 在onload方法中，请求玩完成后，主动触发父组件的自定义事件，将总数传给父组件
*/
import { getCommentsAPI } from '../../../api/index.js'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    sourceId: { // 源id，文章id或评论id
      type: String,
      default: ''
    }
  },

  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null // 翻页偏移量，如果有id，则根据id找后续的列表数据
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据接口
        /**
         * 获取文章评论列表
         *
         * @params type 评论类型 a文章评论或者c评论回复
         * @params source 源id，文章id或评论id
         * @params offset 翻页偏移量， 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
         * @params limit 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        */
        const res = await getCommentsAPI({
          type: 'a', // 评论类型 a文章评论或者c评论回复
          source: this.sourceId, // 源id，文章id或评论id
          offset: this.offset, // 翻页偏移量， 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 3 // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(res)
        // 2. 将返回的数据拼接到数组的最后面
        this.list.push(...res.data.data.results)

        // 2.5 把文章数量传递给父组件 ( 只要在步骤1的下面，就行)
        this.$emit('onload-success', res.data.data.total_count)

        // 3. 将加载更多 loading 设置为false
        this.loading = false

        // 4. 判断有无后续数据，如果有则更新offset，如果没有则将finished改为true
        if (res.data.data.results.length === 0) {
          this.finished = true // 没有数据，停用load事件
        } else {
          this.offset = res.data.data.last_id // 更新获取下一页的页码数据
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
