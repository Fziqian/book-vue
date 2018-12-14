/**
 * Created by sjs-fqy on 2017/7/25.
 */
import axios from 'axios'
import qs from 'qs'
import { urlString } from 'api/url'

function getUserid () {
  if (localStorage.hasOwnProperty('userInfo')) {
    return JSON.parse(localStorage.getItem('userInfo')).id
  }
  return ''
}
function getUseruuid () {
  if (localStorage.hasOwnProperty('userInfo')) {
    return JSON.parse(localStorage.getItem('userInfo')).uuid
  }
  return ''
}

// 获取朋友圈列表
// isThis 是否本幼儿园（0否1是）
// isNew 是否最新（0否按回复数倒排序,1是按发布时间倒排序）
export function getFriendslist (pagesize, isThis, isNew, pageIndex) {
  const url = urlString + '/IHandler/Circle.ashx'
  return axios.post(url, qs.stringify({
    action: 'circle_List',
    id: getUserid(),
    uuid: getUseruuid(),
    pagesize,
    pageIndex,
    is_this: isThis,
    is_new: isNew
  })).then((res) => {
    return Promise.resolve(res)
  })
}

// 朋友圈发布
export function release (content, imgs) {
  const url = urlString + '/IHandler/Circle.ashx'
  let config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  let param = new FormData() // 创建form对象
  for (let i = 0; i < imgs.length; i++) {
    param.append(imgs[i].name, imgs[i]) // 通过append向form对象添加数据
  }
  param.append('action', 'add_Circle') // 添加form表单中其他数据
  param.append('id', getUserid()) // 添加form表单中其他数据
  param.append('uuid', getUseruuid()) // 添加form表单中其他数据
  param.append('content', content) // 添加form表单中其他数据
  return axios.post(url, param, config).then((res) => {
    return Promise.resolve(res)
  })
}

// 朋友圈评论
// circleid 文章id
export function comment (circleid, content) {
  const url = urlString + '/IHandler/Circle.ashx'

  const data = Object.assign({}, {
    action: 'reply_Circle',
    id: getUserid(),
    uuid: getUseruuid(),
    circleid: circleid,
    content: content
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 朋友圈点赞
// circleid 文章id
export function support (circleid, status) {
  const url = urlString + '/IHandler/Circle.ashx'

  const data = Object.assign({}, {
    action: 'upvote_Circle',
    id: getUserid(),
    uuid: getUseruuid(),
    circleid: circleid,
    status: status
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}
