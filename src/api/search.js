// 与搜索相关的接口模块
import { request } from '../utils/request.js'

/**
 * 获取联想建议列表 => 一下params参数的写法时有一定条件限制的：有且仅有以下参数，以下参数必传
 *
 * @params query 搜索字符串
 */
export const getSearchSuggestions = query => request({
  method: 'GET',
  url: '/v1_0/suggestion',
  params: {
    q: query
  }
})

/**
 * 获取搜索结果列表
 *
 * @params page 页码，从1开始
 * @params per_page 每页数量
 * @params q 搜索的关键字
 */
export const getSearchResult = params => request({
  method: 'GET',
  url: '/v1_0/search',
  params
})
