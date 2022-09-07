<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
/*
  目标： 通过搜索框的内容进行接口数据的调用渲染搜索结果列表
  1. 从父组件中拿到搜索框内容 props
  2. 开启页面时调用接口获取数据 onLoad, van-list组件的load事件在页面渲染初期会自动调用一次
  3. onLoad方法中，有着怎么的处理数据步骤
  // 通过article-list.vue中的相似处理代码，集成到这个页面上
    1. 调用接口请求数据
    2. 通过push的形式将请求来的数据插入到列表的最后面（不是赋值不是赋值不是赋值）
    3. 将列表加载状态loading改变为false表示加载结束
    4. 判断数据是否加载完成，如果完成了则将finished改为true，如果没完成，那么向下翻页
*/
import { getSearchResultAPI } from '../../../api/index.js'
export default {
  name: 'SearchResult',
  props: {
    seachInput: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 当前翻页页码
      perPage: 10 // 每次请求的数据数量
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 调用接口请求数据
        const res = await getSearchResultAPI({
          page: this.page, // 页码，从1开始, 没调用一次接口，页码需要加一
          per_page: this.perPage, // 每页数量
          q: this.seachInput // 搜索的关键字
        })
        console.log(res.data.data.results)
        // 2. 通过push的形式将请求来的数据插入到列表的最后面（不是赋值不是赋值不是赋值）
        this.list.push(...res.data.data.results)
        // 3. 将列表加载状态loading改变为false表示加载结束
        this.loading = false
        // 4. 判断数据是否加载完成，如果完成了则将finished改为true，如果没完成，那么向下翻页
        // 通过results数组的长度来判断是否查询结束
        if (res.data.data.results.length === 0) {
          // 没有数据了，需要将list设置结束状态
          this.finished = true
        } else {
          // 如果请求来的results数组有数据，那么可能下一页也有数据，我们需要进行翻页
          this.page++ // 将当前页码加一，下一次请求时会用新的页码
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
