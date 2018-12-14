/**
 * Created by sjs-fqy on 2017/8/1.
 */
import axios from 'axios'
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
function getShopid () {
  if (localStorage.hasOwnProperty('userInfo')) {
    return JSON.parse(localStorage.getItem('userInfo')).shopid
  }
  return ''
}
// 扫描
export function scan (id, pwd) {
  const url = urlString + '/Ihandler/Js_Api.ashx'
  const localUrl = location.href.split('#')[0]
  console.log(location.href)
  console.log('localUrl', localUrl)
  const data = Object.assign({}, {
    action: 'get_jsapi_para',
    url: localUrl
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 扫描结果请求数据
export function scanISBN (isbn) {
  const url = urlString + '/IHandler/product.ashx'

  const data = Object.assign({}, {
    action: 'get_product_model_isbn',
    id: getUserid(),
    uuid: getUseruuid(),
    shopid: getShopid(),
    isbn
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}
