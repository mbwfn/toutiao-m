// 文章接口模块
import { request } from '../utils/request.js'

/**
 * 获取频道文章列表
 *
 */
export const getArticles = params => request({
  method: 'GET',
  url: '/v1_0/articles',
  params
})

/**
 * 获取文章详情
 *
 * @params articleId 文章id
 */
export const getArticleById = articleId => request({
  method: 'GET',
  url: `/v1_0/articles/${articleId}`
})

/**
 * 收藏文章
 *
 * @params targetId 文章id
 */
export const addCollect = targetId => request({
  method: 'POST',
  url: '/v1_0/article/collections',
  data: {
    target: targetId
  }
})

/**
 * 取消收藏文章
 *
 * @params targetId 文章id
 */
export const deleteCollect = targetId => request({
  method: 'DELETE',
  url: `/v1_0/article/collections/${targetId}`
})

/**
 * 文章点赞
 *
 * @params targetId 文章id
 */
export const addLike = targetId => request({
  method: 'POST',
  url: '/v1_0/article/likings',
  data: {
    target: targetId
  }
})

/**
 * 取消文章点赞
 *
 * @params targetId 文章id
 */
export const deleteLike = targetId => request({
  method: 'DELETE',
  url: `/v1_0/article/likings/${targetId}`
})
