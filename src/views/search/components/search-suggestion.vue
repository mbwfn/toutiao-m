<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestion"
      :key="index"
      @click="$emit('search', item)"
    >
      <template #title>
        <span v-html="highlight(item)"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
/*
  目标1：当输入框输入内容时， 请求加载联想建议的数据
  1. 通过监听器watch来监听输入框中的内容 - 通过父组件传递过来
  2. 当触发监听器时，将修改后的输入框内容进行接口调用并查询出新的数据列表
  3. 将数据列表更新铺设到页面上

  问题：
  当输入一个后台不能查询到结果的查询字符串时，会出现两种不同的结果 1: [null] 2: []
  如果后端不给你改，我们需要自己想办法去解决这个问题

  进阶需求：如果查询结果为以上两种形式时，让输入框的内容为查询列表的第一个元素

  在使用该联想功能的过程中发现，无论是删除字符串内容或者是输入字符串内容，只要输入框中有变化就会立马进行接口的访问，带来的问题是当需要删除所有文本并重新输入新文本时，会引发非常多的不必要的请求操作
  解决方案： 能否在某次输入的一定时间内不去做接口的请求 - 防抖 （在一定时间内如果重复触发某个事件，将会重置该时间，知道最后一次触发事件后才会执行）
  1. lodash类库提供了防抖的方案
    _.debounce的方法， _.debounce(function () { 需要进行防抖操作的逻辑代码 }, 防抖的延时时间)
    1. import { debounce } from 'lodash'
    2. 找到需要进行防抖的方法，将原方法写在debounce方法的第一个参数中：如handler: debounce(function () {}, 200)
    3. 注意，debounce中的回调函数必须是普通函数，不可以为箭头函数，因为箭头函数没有函数作用域，会影响this指向
*/

/*
  目标2：联想建议列表中的每一个选项，都需要用富文本的形式进行高亮显示
  1. 通过v-html指令来实现高亮
  2. ABCDABCDABCD => 将里面的A全部变成 <span style="color: red;">A</span>
    2.1 replace 去替换字符串中的A
      replaceAll('A')来替换全部的A
      replace(/A/gi) 正则表达式来匹配全部的A

    2.2 indexOf， findIndex 获取索引，更具索引去替换splice
    2.3 split(将字符串变成数组) => 将符合查询要求的A 变成数组中元素分隔的`,` 然后用join将`,` 转化成拼接每个元素的字符串
      str.split('A').join(需要替换的值)
    ABCDABCDABCD => [ , BCD, BCD, BCD] => <span style="color: red;">A</span>BCD<span style="color: red;">A</span>BCD<span style="color: red;">A</span>BCD
*/

/*
  目标3: 当选中联想选项时，会将搜索框中的结果改为联想选项内容，并进行搜索结果的跳转
  1. 把这个任务交给父组件， 让父组件去做两件事
    1.1 更新输入框内容
    1.2 开启搜索结果页面
*/
import { getSearchSuggestionsAPI } from '../../../api/index.js'
// 1. 引入防抖方法
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    seachInput: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      suggestion: [] // 联想建议列表
      // text: 'hello <span style="color: red;">world</span>'
    }
  },

  watch: {
    // 用基本写法是出现一个问题： 当输入第一个字符时，并没有监听到结果
    // 'seachInput' (newValue) {
    //   console.log(newValue)
    // }

    // 通过深度监听的完整写法，来解决了这个问题
    seachInput: {
      immediate: true, // 首次监听触发
      // debounce防抖操作第一个参数必须是普通函数类型，不可以是箭头函数（箭头函数没有函数作用域会影响this指向）
      handler: debounce(function (newValue) {
        // 调用查询练习列表
        this.loadSearchSuggestions(newValue)
      }, 400)
    }
  },

  methods: {
    // 查询建议数据接口
    async loadSearchSuggestions (newValue) {
      try {
        const res = await getSearchSuggestionsAPI(newValue)
        // 有的时候后端会返回一个[null], 或者[], 可以主动的将这两种情况改为seachInput的值作为第一个元素
        if (res.data.data.options.length === 0 || res.data.data.options[0] === null) {
          // 如果数组中没有值，或者只有一个元素为null时
          res.data.data.options[0] = this.seachInput
        }

        this.suggestion = res.data.data.options
        // 高亮展示是修改数据还是仅影响页面 => 仅改变页面
        console.log(this.suggestion)
      } catch (error) {
        console.log(error)
        this.$toast('获取失败')
      }
    },

    // 高亮展示数据处理方法
    highlight (value) {
      // value 是需要进行高亮处理的字符串
      // 1. 生成富文本格式 - 搜索框关键字的标签形式
      const highlightStr = `<span style="color: red;">${this.seachInput}</span>`
      // 2. 通过替换的方式改写字符串
      // 2.1 使用 replaceAll 来实现
      // const tempStr = value.replaceAll(this.seachInput, highlightStr)

      // 2.2 使用正则表达式 + replace的 组合来实现
      // const reg = new RegExp(this.seachInput, 'gi')
      // const tempStr = value.replace(reg, highlightStr)

      // 2.3 通过split和join的组合使用
      const tempStr = value.split(this.seachInput).join(highlightStr)
      return tempStr
    }
  }
}
</script>

<style scoped lang="less"></style>
