/**
 * Created by sjs-fqy on 2017/6/29.
 */

import axios from 'axios'
import { urlString } from 'api/url'
import qs from 'qs'
/**
 * @returns 获取本地用户ID
 */
function getUserid () {
  if (localStorage.hasOwnProperty('userInfo')) {
    return JSON.parse(localStorage.getItem('userInfo')).id
  }
  return ''
}
/**
 * @returns 获取本地用户UUID
 */
function getUseruuid () {
  if (localStorage.hasOwnProperty('userInfo')) {
    return JSON.parse(localStorage.getItem('userInfo')).uuid
  }
  return ''
}

/**
 * 注册
 * @param id 手机号
 * @param pwd 密码
 * @returns {Promise.<TResult>} 状态值
 */
export function sign (id, pwd) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'user_regedit',
    username: id,
    password: pwd,
    mobile: id
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

/**
 * 获取验证码
 * @param mobile 手机号
 * @returns {Promise.<TResult>} 状态码
 */
export function getCode (mobile) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'get_verification_code',
    mobile
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

/**
 * 找回密码--获取验证码
 * @param mobile 手机号
 * @returns {Promise.<TResult>} 验证码
 */
export function getfindPwdCode (mobile) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'get_find_pwd_code',
    mobile
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

/**
 * 找回密码--新密码
 * @param mobile 手机号
 * @param pwd 新密码
 * @returns {Promise.<TResult>} 状态值
 */
export function newPwd (mobile, pwd) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'user_edit_password',
    mobile,
    pwd
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

/**
 * 修改密码--新密码
 * @param oldpwd
 * @param newpwd
 * @returns {Promise.<TResult>}
 */
export function updataPwd (oldpwd, newpwd) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'user_change_password',
    id: getUserid(),
    uuid: getUseruuid(),
    oldpwd,
    newpwd
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 登录
export function login (id, pwd) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'user_login',
    username: id,
    password: pwd
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取用户信息
export function getUserInfo () {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'user_login_token',
    id: getUserid(),
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取省份
export function getProvince () {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'get_province'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取市
export function getCity (provid) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'get_city',
    provid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取区
export function getArea (cityid) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'get_area',
    cityid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 幼儿园
export function getShop () {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'get_shop',
    id: getUserid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 修改保存用户信息
export function saveUserinfo (para, value) {
  const url = urlString + '/IHandler/User_Info.ashx'

  const data = Object.assign({}, {
    action: 'user_edit_simple',
    id: getUserid(),
    uuid: getUseruuid(),
    para,
    value
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 修改头像
export function upAvatar (imgs) {
  const url = urlString + '/IHandler/User_Info.ashx'
  let config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  let param = new FormData() // 创建form对象
  param.append(imgs[0].name, imgs[0]) // 通过append向form对象添加数据
  param.append('action', 'user_headimg_upload') // 添加form表单中其他数据
  param.append('id', getUserid()) // 添加form表单中其他数据
  param.append('uuid', getUseruuid()) // 添加form表单中其他数据
  return axios.post(url, param, config).then((res) => {
    return Promise.resolve(res)
  })
}

// 意见反馈
export function postFeed (title, remarks) {
  const url = urlString + '/IHandler/Feed_Back.ashx'

  return axios.post(url, qs.stringify({
    action: 'add_feed_back',
    id: getUserid(),
    title,
    remarks
  })).then((res) => {
    return Promise.resolve(res)
  })
}

// 收藏列表
export function collList (pagesize, pageIndex) {
  const url = urlString + '/IHandler/product.ashx'

  const data = Object.assign({}, {
    action: 'product_collection_list',
    id: getUserid(),
    pagesize,
    pageIndex
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取图书管理列表/借书单列表
export function getBorrowList (pagesize, status, pageIndex) {
  const url = urlString + '/IHandler/shop_mgr.ashx'

  const data = Object.assign({}, {
    action: 'orderList_all',
    id: getUserid(),
    uuid: getUseruuid(),
    pagesize,
    pageIndex,
    status
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 取消订单
export function cancelOrder (id) {
  const url = urlString + '/IHandler/shop_mgr.ashx'

  const data = Object.assign({}, {
    action: 'order_canel',
    id: getUserid(),
    uuid: getUseruuid(),
    order_id: id
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 绑定借书卡
export function bindCode (id, codeNum) {
  const url = urlString + '/IHandler/User_Ucard.ashx'

  const data = Object.assign({}, {
    action: 'ucard_userid',
    userid: id,
    uuid: getUseruuid(),
    cardno: codeNum
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取个人借书卡信息
export function getBindCard (id) {
  const url = urlString + '/IHandler/User_Ucard.ashx'
  const data = Object.assign({}, {
    action: 'get_ucard_info_userid',
    id: id,
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取所有的借阅卡信息
export function getallBindCard (id) {
  const url = urlString + '/IHandler/User_Ucard.ashx'
  const data = Object.assign({}, {
    action: 'ucard_list',
    id: id,
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取个人借书卡信息
export function getthisBindCard (id) {
  const url = urlString + '/IHandler/User_Ucard.ashx'
  const data = Object.assign({}, {
    action: 'get_ucard_info',
    id: id,
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取下级数量
export function getChildCount () {
  const url = urlString + '/IHandler/User_Info.ashx'
  const data = Object.assign({}, {
    action: 'user_child_count',
    id: getUserid(),
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取人员管理列表
export function getPeopleMg (pagesize) {
  const url = urlString + '/IHandler/User_Info.ashx'
  const data = Object.assign({}, {
    action: 'user_child_list',
    id: getUserid(),
    uuid: getUseruuid(),
    pagesize: pagesize
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取人员搜索
export function searchPeople (query, pagesize, pageIndex) {
  const url = urlString + '/IHandler/User_Info.ashx'
  const data = Object.assign({}, {
    action: 'user_child_list_keyword',
    id: getUserid(),
    uuid: getUseruuid(),
    keyword: query,
    pagesize,
    pageIndex
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 添加到我的下级
export function addPeople (childid, status) {
  const url = urlString + '/IHandler/User_Info.ashx'
  const data = Object.assign({}, {
    action: 'user_child_add',
    id: getUserid(),
    uuid: getUseruuid(),
    childid,
    status
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}
