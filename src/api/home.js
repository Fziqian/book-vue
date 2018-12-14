/* eslint-disable no-unused-vars */
/**
 * Created by sjs-fqy on 2017/7/27.
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

// 获取首页列表
export function getHomeList (pagesize, pageIndex, typeId, categoryId, query) {
  const url = urlString + '/IHandler/Article.ashx'

  const data = Object.assign({}, {
    action: 'get_article_list',
    type_id: typeId,
    category_id: categoryId,
    pagesize,
    pageIndex,
    keyword: query
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取绘本详情
export function getHomeDetail (id) {
  const url = urlString + '/IHandler/Article.ashx'

  const data = Object.assign({}, {
    action: 'get_article_model',
    id: getUserid(),
    article_id: id
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取首页分类
export function getHomeType (typeId) {
  const url = urlString + '/IHandler/Article.ashx'

  const data = Object.assign({}, {
    action: 'get_article_category_list',
    id: getUserid(),
    type_id: typeId
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 增加绘本播放量
export function addPlayNum (id) {
  const url = urlString + '/IHandler/Article.ashx'

  const data = Object.assign({}, {
    action: 'article_click_add',
    article_id: id
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 增加绘本轨迹
export function addPlayLine (articleId, playPosition) {
  const url = urlString + '/IHandler/Article.ashx'

  const data = Object.assign({}, {
    action: 'article_record',
    id: getUserid(),
    article_id: articleId,
    play_position: playPosition
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取绘本轨迹
export function getPlayLine (pagesize, minid) {
  const url = urlString + '/IHandler/Article.ashx'

  const data = Object.assign({}, {
    action: 'article_record_list',
    id: getUserid(),
    pagesize: pagesize,
    minid: minid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 保存用户修改的分类顺序
export function saveTypeList (categoryIds, typeId) {
  const url = urlString + '/IHandler/Article.ashx'
  return axios.post(url, qs.stringify({
    action: 'article_category_sort_id',
    userid: getUserid(),
    category_ids: categoryIds,
    type_id: typeId
  })).then((res) => {
    return Promise.resolve(res)
  })
}
