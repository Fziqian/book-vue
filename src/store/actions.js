/**
 * Created by sjs-fqy on 2017/6/29.
 */
import * as types from './mutation-types'
import { saveSearch, clearSearch } from 'common/js/cache'

export const insertBook = function ({commit, state}, book) {
  let books = state.books.slice()
  books.push(book)
  commit(types.SET_BOOKS, books)
}

export const delBook = function ({commit, state}, list) {
  let books = state.books.slice()
  let bookList = books
  console.log('list', list)
  for (let i = 0; i < bookList.length; i++) {
    if (bookList[i].productId) {
      if (list === bookList[i].productId) {
        let index = checkingBook(bookList, bookList[i])
        bookList.splice(index, 1)
      }
    } else {
      if (list === bookList[i].id) {
        let index = checkingBook(bookList, bookList[i])
        bookList.splice(index, 1)
      }
    }
  }
  commit(types.SET_BOOKS, bookList)
}

function checkingBook (books, book) {
  return books.indexOf(book)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

