/**
 * Created by sjs-fqy on 2017/7/17.
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

// 判断数组是否为空。如果不为空则返回数组字符串
function emptyNull (type) {
  if (type) {
    return type.toString()
  }
  return type
}

// 获取书籍列表
export function getBooklist (keyword, type1, type2, type3, pagesize, pageIndex) {
  const url = urlString + '/IHandler/product.ashx'

  const data = Object.assign({}, {
    action: 'get_product_list',
    id: getUserid(),
    uuid: getUseruuid(),
    shopid: getShopid(),
    category_id1: emptyNull(type1),
    category_id2: emptyNull(type2),
    category_id3: emptyNull(type3),
    keyword,
    pagesize,
    pageIndex
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取书籍分类
export function getBookTypes () {
  const url = urlString + '/IHandler/product.ashx'

  const data = Object.assign({}, {
    action: 'get_product_category_list'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 增加书籍点击量
export function addHotBook (productid) {
  // 后台地址
  const url = urlString + '/IHandler/product.ashx'
  // 需要传入的参数
  const data = Object.assign({}, {
    action: 'product_vistiCounts_add',
    id: productid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 收藏/取消收藏书籍
export function collectionBook (productid, status) {
  const url = urlString + '/IHandler/product.ashx'

  const data = Object.assign({}, {
    action: 'product_collection',
    id: getUserid(),
    productid: productid,
    status: status
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 借书架列表
export function borrowstandList () {
  const url = urlString + '/IHandler/shop_mgr.ashx'

  const data = Object.assign({}, {
    action: 'cartList',
    id: getUserid(),
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 将书籍添加到借书架
export function addBorrowstand (productid) {
  const url = urlString + '/IHandler/shop_mgr.ashx'

  const data = Object.assign({}, {
    action: 'addCart',
    id: getUserid(),
    uuid: getUseruuid(),
    productid: productid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 将书籍移除借书架
export function delBorrowstand (productid) {
  const url = urlString + '/IHandler/shop_mgr.ashx'

  const data = Object.assign({}, {
    action: 'removeCart',
    id: getUserid(),
    uuid: getUseruuid(),
    productid: productid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取热门搜索
export function getHotKey (pagesize) {
  const url = urlString + '/IHandler/product.ashx'

  const data = Object.assign({}, {
    action: 'search_keyword_hot',
    pagesize: pagesize
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 生成借书单
export function createBorrowList (borrowList) {
  const url = urlString + '/IHandler/shop_mgr.ashx'

  const data = Object.assign({}, {
    action: 'order_save',
    cart_id_list: borrowList,
    id: getUserid(),
    uuid: getUseruuid()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}
