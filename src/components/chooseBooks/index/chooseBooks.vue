<!--

  User: fanqingyu

  Date: 2017/6/5 9:48

  功能： 选书页面

-->

<template>
  <div class="chooseBooks" ref="chooseBooks">
    <div class="title">
      <span class="text">选书</span>
      <span class="icon" @click="bookSearch()"><i class="iconfont icon-sousou"></i></span>
    </div>
    <div v-if="isvip === 1" class="outer">
      <ul class="tab">
        <li class="tab-item" @click="toggle(1, $event)" :class="{'active': selectTab === 1}">热度</li>
        <li class="tab-item" @click="toggle(2, $event)" :class="{'active': selectTab === 2}">筛选</li>
      </ul>
      <transition name="fade">
        <div class="tip" v-show="!noRefresh">
          <div class="text">
            数据更新成功
          </div>
        </div>
      </transition>
      <div class="list" v-show="selectTab === 1">
        <booklist @select="selectBook" ref="booklist" @successRefresh="successRefresh" :pullup="true" :flagPull="true">
        </booklist>
      </div>
      <scroll class="hot-key" v-show="selectTab === 2" ref="scroll" :data="types">
        <ul class="theme" v-show="types.length" ref="theme">
          <li class="theme-item" v-for="(themeItem, index) in types" :data-parentid="themeItem.id" v-if="index < 2">
            <split></split>
            <h1 class="title">请选择{{themeItem.title}}</h1>
            <ul>
              <li class="item" @click="selectType(themeItem.id, item.id)"
                  :class="{'active': checking(item.id) !== -1}"
                  v-for="(item, index) in themeItem.children" :data-childid="item.id">
                <span>{{item.title}}</span>
                <span class="icon" v-if="checking(item.id) !== -1"
                      :class="{'active': checking(item.id) !== -1}"><i
                  class="iconfont icon-duigou"></i></span>
              </li>
            </ul>
          </li>
          <li class="submit" @click="submit">确认</li>
        </ul>
      </scroll>
      <borrowControl ref="borrowControl" @enterBorrow="enterBorrow"></borrowControl>
      <bookFilter ref="bookFilter"></bookFilter>
    </div>
    <div v-else-if="isvip !== 1" class="zhezhao">
      <p>对不起，您没有VIP借阅卡</p>
      <p>无法选书</p>
      <p>点击此处<span @click="govip">绑定VIP借阅卡</span></p>
    </div>
    <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>


<script>
  /* eslint-disable no-unused-vars */
  import Booklist from 'components/chooseBooks/booklist/booklist'
  import BookFilter from 'components/chooseBooks/bookFilter/bookFilter'
  import Split from 'base/split/split'
  import { getBookTags, getBookTypes, borrowstandList } from 'api/chooseBook'
  import { ERR_OK } from 'api/config'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import Loading from 'base/loading/loading'
  import BorrowControl from 'base/borrowControl/borrowControl'
  import { mapActions, mapMutations } from 'vuex'
  import Scroll from 'base/scroll/scroll'

  const HOT = 1
  const FILTER = 2

  export default {
    data () {
      return {
        showChoose: true,
        books: [],
        types: [],
        type1: [],
        type2: [],
        type3: [],
        maskText: '',
        selectedTypes: [],
        selectTab: 1,
        selectedBook: {},
        noRefresh: true,
        isvip: ''
      }
    },
    created () {
      this._getborrowstandList()
    },
    mounted () {
    },
    methods: {
      successRefresh () {
        this.noRefresh = false
        setTimeout(() => {
          this.noRefresh = true
        }, 1500)
      },
      submit () {
        this.type1 = []
        this.type2 = []
        this.type3 = []
        let parentlist = this.$refs.theme.querySelectorAll('.theme-item')
        for (let i = 0; i < parentlist.length; i++) {
          let parentAttr = parentlist[i].getAttribute('data-parentid')
          if (parentAttr === '1') {
            let childlist = parentlist[i].querySelectorAll('.item')
            for (let j = 0; j < childlist.length; j++) {
              let isclides = childlist[j].className.includes('active')
              if (isclides) {
                this.type1.push(childlist[j].getAttribute('data-childid'))
              }
            }
          } else if (parentAttr === '2') {
            let childlist = parentlist[i].querySelectorAll('.item')
            for (let j = 0; j < childlist.length; j++) {
              let isclides = childlist[j].className.includes('active')
              if (isclides) {
                this.type2.push(childlist[j].getAttribute('data-childid'))
              }
            }
          } else if (parentAttr === '3') {
            let childlist = parentlist[i].querySelectorAll('.item')
            for (let j = 0; j < childlist.length; j++) {
              let isclides = childlist[j].className.includes('active')
              if (isclides) {
                this.type3.push(childlist[j].getAttribute('data-childid'))
              }
            }
          }
        }
        this.setType1(this.type1)
        this.setType2(this.type2)
        this.setType3(this.type3)
        this.$refs.bookFilter.show()
      },
      // tab切换，改变selectTab的值来动态切换
      toggle (type, event) {
        this.selectTab = type
        if (type === FILTER) {
          getBookTypes().then((res) => {
            if (res.data.status === ERR_OK) {
              this.types = res.data.info
            }
          }).catch(() => {
            this.types = []
          })
        }
      },
      // 搜索
      bookSearch () {
        if (this.isvip !== 1) {
          this.maskText = '您不是VIP，无法选书'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
        } else {
          this.$router.push({
            path: '/chooseBooks/bookSearch'
          })
        }
      },
      govip () {
        this.$router.push({
          path: `/mine/vip`
        })
      },
      _getborrowstandList () {
        if (localStorage.hasOwnProperty('userInfo')) {
          this.isvip = Number(JSON.parse(localStorage.getItem('userInfo')).isVip)
          borrowstandList().then((res) => {
            console.log(res)
            if (res.data.status === ERR_OK) {
              this.books = res.data.info
              this.books.forEach((book) => {
                this.insertBook(book)
              })
            }
          })
        } else {
          this.$router.replace({
            path: `/login`
          })
        }
      },
      search () {
        this.isvip = Number(JSON.parse(localStorage.getItem('userInfo')).isVip)
      },
      selectBook (item) {
        this.selectedBook = item
        this.$router.push({
          path: '/chooseBooks/bookDetail=' + item.id
        })
      },
      selectType (parentId, id) {
        if (this.checking(id) !== -1) {
          this.selectedTypes.splice(this.checking(id), 1)
        } else {
          this.selectedTypes.push(id)
        }
      },
      checking (id) {
        return this.selectedTypes.indexOf(id)
      },
      filter () {
        this.selectTab = 1
        this.$refs.booklist._getBooklist()
      },
      enterBorrow () {
        this.$router.push({
          path: '/chooseBooks/borrowStand'
        })
      },
      ...mapActions([
        'insertBook'
      ]),
      ...mapMutations({
        setType1: 'SET_TYPE1',
        setType2: 'SET_TYPE2',
        setType3: 'SET_TYPE3',
        setBooks: 'SET_BOOKS'
      })
    },
    watch: {
      '$route': 'search'
    },
    components: {
      Booklist,
      Split,
      Loading,
      BorrowControl,
      Scroll,
      DialogMask,
      BookFilter
    }
  }

</script>

<style>
  @import '../../../common/css/iconfont.css';

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .chooseBooks {
    background: #fff;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
  }

  .chooseBooks > .title {
    width: 100%;
    text-align: center;
    line-height: 40px;
    height: 40px;
    font-size: 18px;
    font-weight: 600;
    background: #00a9e4;
    color: #ffffff;
    position: fixed;
    top: 0;
    z-index: 50;
  }

  .chooseBooks > .title > .text {
    display: block;
    width: 100%;
    text-align: center;
  }

  .chooseBooks > .title > .icon {
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 40px;
  }

  .chooseBooks > .title > .icon > .iconfont {
    font-size: 20px;
  }

  .chooseBooks > .outer > .tab {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    position: fixed;
    top: 40px;
    z-index: 50;
    background: #fff;
  }

  .chooseBooks > .outer > .tab > .tab-item {
    flex: 1;
    text-align: center;
  }

  .chooseBooks > .outer > .tab > .active {
    color: #00a9e4;
    border-bottom: 2px solid #00a9e4;
  }

  .chooseBooks > .outer > .tip {
    position: fixed;
    top: 81px;
    width: 100%;
    text-align: center;
    z-index: 51;
  }

  .chooseBooks > .outer > .tip > .text {
    font-size: 12px;
    color: #fff;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    background: #00a9e4;
  }

  .chooseBooks > .outer > .list {
    bottom: 50px;
    position: fixed;
    top: 35px;
    width: 100%;
  }

  .chooseBooks > .outer > .hot-key {
    position: fixed;
    top: 80px;
    bottom: 50px;
    width: 100%;
  }

  .chooseBooks > .outer > .hot-key > ul {
    padding-bottom: 16px;
  }

  .chooseBooks > .outer > .hot-key > .theme > .submit {
    text-align: center;
    width: 150px;
    height: 30px;
    margin: 0 auto;
    border: 2px solid #00a9e4;
    border-radius: 15px;
    line-height: 30px;
    font-size: 14px;
    color: #00a9e4;
  }

  .chooseBooks > .outer > .hot-key > ul > .theme-item {
    margin-bottom: 20px;
  }

  .chooseBooks > .outer > .hot-key > .theme > .theme-item > h1 {
    border-left: 4px solid #00a9e4;
    padding-left: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    color: #333333;
    margin-top: 10px;
    margin-left: 10px;
  }

  .chooseBooks > .outer > .hot-key > .theme > .theme-item > ul {
    padding: 0 10px;
  }

  .chooseBooks > .outer > .hot-key > .theme > .theme-item > ul > li {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 4px;
    background: #fafafa;
    border: 1px solid #ccc;
    font-size: 12px;
    color: #666666;
    position: relative;
  }

  .chooseBooks > .outer > .hot-key > .theme > .theme-item > ul > .active {
    background: #fff4e2;
    border: 1px solid #00a9e4;
    color: #666666;
  }

  .chooseBooks > .outer > .hot-key > .theme > .theme-item > ul > li > .icon {
    position: absolute;
    right: -7px;
    top: -7px;
  }

  .chooseBooks > .outer > .hot-key > .theme > .theme-item > ul > li > .active {
    color: #00a9e4;
  }

  .zhezhao {
    width: 100%;
    height: 300px;
    /*background: rgba(0,0,0,0.3);*/
    position: absolute;
    top: 100px;
    left: 0;
    color: #666;
    z-index: 710;
    text-align: center;
    line-height: 50px;
    padding: 12px;
    box-sizing: border-box;
  }
  .zhezhao p{
    height: 50px;
  }
  .zhezhao span{
    color: #00a9e4;
  }


</style>
