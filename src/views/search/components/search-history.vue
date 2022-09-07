<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <!-- 在模板中使用template标签包裹元素， 它的主要功能和目的是让一些兄弟标签形参一个整体，但这个template并不会作为标签显示到真实dom上 -->
      <template v-if="isDeleteShow">
        <span @click="clearAll">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon v-else name="delete"  @click="isDeleteShow = true"/>
    </van-cell>

    <van-cell v-for="(value, index) in searchHistories" :key="index" :title="value" @click="onClickHistory(value, index)">
      <van-icon name="close"  v-if="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isDeleteShow: false,
      searchHistoriesClone: this.searchHistories
    }
  },
  methods: {
    // 点击单元格触发事件
    onClickHistory (value, index) {
      // 通过状态值的不同来确认触发的是查询还是删除
      if (this.isDeleteShow) {
        // 删除历史
        this.searchHistoriesClone.splice(index, 1)
      } else {
        // 进入查询
        this.$emit('search', value)
      }
    },

    // 全部删除
    clearAll () {
      // 通过子传父的形式，让原本的数据来做删除操作
      // 有些时候发现子组件并不能通过某些特殊渠道去修改父组件参数时，不要纠结，直接让父组件自己去做
      this.$emit('clearAll')
    }
  }
}
</script>

<style scoped lang="less"></style>
