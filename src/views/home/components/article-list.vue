<template>
  <div class="article-list-container">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="successText"
      :success-duration="3000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
/*
  van-list组件中个属性的含义
  1.load事件： 当list组件初次渲染时，会触发一次。 当滚动条滚动到当前列表最下方时，也会主动触发
              当触发load事件时，loading属性会变成true，转化为加载中状态
  2 v-model的loading属性：控制加载中的loading状态
                         当在非加载状态是，loading为false， 此时可以通过滚动条的位置来判断是否触发load事件
                         当loading为true时， 表示正在执行异步请求，此时不会触发load事件
  3. finished属性：每次请求完成后，需要手动的将loading设置为false，然后来判断当前接口或条件是否将列表数据获取完全，如果获取完全后，需要主动的将finished属性改为true
                  当finished属性为true时， 就不会再触发load事件
  4. error属性: 通过布尔值来判断当前列表是否请求错误
*/

/*
  发现，每个不同的内容区域所记录的滚动位置是body的滚动位置，并不能独享并记录
  解决办法： 不让body滚动，让每个内容区域独立滚动，这样可以独享滚动条的位置
*/
import { getArticlesAPI } from '../../../api/index.js'
import ArticleItem from '../../../components/article-item.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false, // 当请求报错时，将该状态改为true，弹出错误提升
      timestamp: null, // 请求下一页的时间错
      refreshing: false, // 下拉刷新的loading加载状态
      successText: '更新成功' // 下拉刷新完成提示
    }
  },
  methods: {
    // 自动加载列表数据
    async onLoad () {
      // 当页面滚动到列表最底部的时候，会自动的触发@load事件绑定的onLoad方法
      try {
        // 示例代码，主动让try中的逻辑报错
        // if (Math.random() < 0.6) {
        //   JSON.parse('www')
        // }

        // 1. 异步更新数据 - 调用接口更新列表 - 这里的列表更新不是做赋值，而是添加数组的后续元素
        const res = await getArticlesAPI({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now() // 时间戳， 请求新的推荐数据传递当前的时间戳，如果要请求历史推荐数据，传入指定的时间戳
        })
        console.log(res)
        // 2. 将数据添加到list数组的最后面
        // 需要判断是否携带新的时间戳，如果携带，下一次请求时需要用接口提供的时间戳
        this.list.push(...res.data.data.results)

        // 3. 加载状态结束
        this.loading = false

        // 4. 判断数据是否加载完成，如果完成了那么finish = true
        if (res.data.data.results.length === 0) {
          this.finished = true
        } else {
          // 5. 更新时间戳
          this.timestamp = res.data.data.pre_timestamp
        }
      } catch (error) {
        // 加载状态结束
        this.loading = false

        // 请求失败了，弹出报错
        this.error = true
        console.log(error)
      }
    },

    // 下拉更新列表数据
    async onRefresh () {
      try {
        // 1. 异步获取接口数据
        // 下拉更新列表的数据应该是最新的数据，所以时间戳应该是最新时间
        const res = await getArticlesAPI({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now() // 时间戳
        })
        // 2. 将数据追加到列表的顶部
        this.list.unshift(...res.data.data.results)

        // 3. 关闭下拉刷新的loading状态
        this.refreshing = false

        // 4. 更新下拉刷新的提示文本
        this.successText = `刷新成功，更新了${res.data.data.results.length}条数据`
      } catch (error) {
        // 3. 关闭下拉刷新的loading状态
        this.refreshing = false
        // 当出错的时候，提示文案变成刷新失败
        this.successText = '刷新失败'
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list-container {
  // 如何计算一个盒子应该有的视口高度， ((总视口高度 - 顶部导航的高度 - 底部导航的高度 - 频道列表的高度) / 总视口高度) * 100 => 视口高度
  height: 79vh;
  overflow-y: auto;
}
</style>
