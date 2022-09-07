// 全局日期处理模块

import dayjs from 'dayjs'
import Vue from 'vue'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 引入相对时间处理插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs 默认语音是英文，将其配置成中文
dayjs.locale('zh-cn')

// 定义全局过滤器
// Vue.filter('自定义过滤器名称', (需要过滤的文本, 使用过滤器时传递的自定义参数 - 选传) => {})
// 使用方法： {{ 表达式 | 过滤器名称 }}
Vue.filter('relativeTime', value => {
  // dayjs() => 当前的时间 = new Date()
  // .to() => 与谁做相对时间的对比
  // dayjs(value) => 传入的历史时间
  // 当前时间与历史时间做对比，返回相对时间
  return dayjs().to(dayjs(value))
})
