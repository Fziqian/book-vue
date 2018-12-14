/**
 * Created by sjs-fqy on 2017/6/29.
 */
import { loadBookSearch, loadUserInfo } from 'common/js/cache'
const state = {
  userInfo: loadUserInfo(),
  statePeopleMg: '',
  bookDetail: {},
  books: [],
  type1: [],
  type2: [],
  type3: [],
  searchBookHistory: loadBookSearch(),
  nativeAvatar: '',
  nativeName: ''
}

export default state
