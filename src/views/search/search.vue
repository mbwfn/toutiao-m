<template>
  <div class="search-container">
    <!-- 在van-search标签外层嵌套form标签，且action属性不能为空，即可在ios的输入法中显示搜索按钮 -->
    <form action="/">
      <van-search
        v-model="seachInput"
        background="rgb(50, 150, 250)"
        placeholder="请输入搜索关键词"
        show-action
        @cancel="$router.back()"
        @search="onSearch"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 列表标签 -->
    <!-- 搜索结果 首先通过开关状态来判断是否显示搜索结果 -->
    <search-result v-if="isResultShow" :seachInput="seachInput"></search-result>

    <!-- 联想列表 当搜索结果为展开时，再判断搜索框中是否有值，如果有内容则显示联想列表 -->
    <search-suggestion v-else-if="seachInput" :seachInput="seachInput" @search="onSearch"></search-suggestion>

    <!-- 搜索历史 除上面两种情况以外，展示历史 -->
    <search-history v-else :searchHistories="searchHistories" @search="onSearch" @clearAll="searchHistories = []"></search-history>

  </div>
</template>

<script>
/*
  目标1： 配置搜索路由页面， 新建3个子组件（搜索历史，联想建议，搜索结果）
  目标2： 在home.vue的顶部导航中视同vant自带的to属性来实现声明式跳转
  目标3： 查阅文档，设置搜索页面顶部查询框，并将3个业务组件渲染到页面上
*/

/*
  目标4： 3个组件的切换逻辑
  // 先归纳目前手上有哪些东西： 输入框内容 历史列表 联想列表 结果列表
  // 如果结果列表数组中有值时？ => 显示查询结果 => 发现有时候通过关键字搜索出来的数组为[],但是也需要展示结果页面 => 将显示查询结果的组件通过一个开关变量来控制是否显示
  // 如果输入框中有值时， => 是联想建议
  // 其余情况显示搜索历史
  // 当输入框再次聚焦时，会关闭变量开关
*/

/*
  目标5：历史记录的添加和展示
  1. 当输入框的内容触发查询结果时，会将该内容添加到查询历史数组里 （onSearch方法）
  2. 如果原来的查询历史数组中有这个值 ，那么将该元素的位置放到数组的最前面（索引为1的位置）
*/

/*
  目标6：历史记录的切换与删除
  1. 创建一个状态变量，来控制删除状态和非删除状态的切换
  2. 给垃圾桶和完成按钮绑定切换状态变量的点击事件
  3. 当页面处于非删除状态时，点击单元格调用onSearch
  4. 当处于删除状态时，点击单元格删除历史记录数组中的当前元素
  5. 当点击全部删除的按钮时，需要将历史记录数组全部清空
*/

/*
  目标7：搜索历史的持久化
  1. 在数据获取是data(){return 定义的变量} 通过getItem尝试去本地存储中获取数据
  2. 通过watch监听器监听当前需要持久化数据的变化，如果发生改变，通过setItem来进行本地存储
*/

import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import { setItem, getItem } from '../../utils/storage.js'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },

  data () {
    return {
      seachInput: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索历史的数据列表
    }
  },

  watch: {
    searchHistories: {
      deep: true,
      handler () {
        setItem('TOUTIAO_SEARCH_HISTORIES', this.searchHistories)
      }
    }
  },

  methods: {
    // 点击联想，搜索结果
    onSearch (item) {
      /*
        1.1 更新输入框内容
        1.2 开启搜索结果页面
      */
      this.seachInput = item
      this.isResultShow = true

      // 储存搜索历史记录
      // 要求:如果原来的查询历史数组中有这个值 ，那么将该元素的位置放到数组的最前面（索引为1的位置）
      const index = this.searchHistories.indexOf(item)
      // 查询结果元素的索引是否为-1
      if (index !== -1) {
        // 不等于-1时，表示找到了数组中相同的元素
        // 去除当前找到的那个元素
        this.searchHistories.splice(index, 1)
      }
      // 再在数组的最前面添加
      this.searchHistories.unshift(item)
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action{
    color: white;
  }

  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
