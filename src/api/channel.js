// 频道相关接口模块
import { request } from '../utils/request.js'

/**
 * 获取所有频道列表
 */
export const getAllChannels = () => request({
  method: 'GET',
  url: '/v1_0/channels'
})

/**
 * 添加用户频道
 *
 * @params channel 当前添加频道的参数对象 { id: 频道id, seq: 当前频道的排列序号-使用频道列表当前长度即可 }
 */
export const addUserChannel = channel => request({
  method: 'PATCH',
  url: '/v1_0/user/channels',
  data: {
    channels: [channel]
  }
})

/**
 * 删除用户指定频道
 *
 * @params channelId 频道id
 */
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
