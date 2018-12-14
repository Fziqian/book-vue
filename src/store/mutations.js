import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_PEOPLE_MG] (state, peopleMg) {
    state.statePeopleMg = peopleMg
  },
  [types.SET_BOOKDETAIL] (state, bookDetail) {
    state.bookDetail = bookDetail
  },
  [types.SET_BOOKS] (state, books) {
    console.log('books', books)
    state.books = books
  },
  [types.SET_TYPE1] (state, type1) {
    state.type1 = type1
  },
  [types.SET_TYPE2] (state, type2) {
    state.type2 = type2
  },
  [types.SET_TYPE3] (state, type3) {
    state.type3 = type3
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchBookHistory = history
  },
  [types.SET_NATIVE_AVATAR] (state, avatar) {
    state.nativeAvatar = avatar
  },
  [types.SET_NATIVE_NAME] (state, name) {
    state.nativeName = name
  }
}

export default mutations
