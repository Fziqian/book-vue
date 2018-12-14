<!--
  User: fanqingyu
  Date: 2017/7/6 14:53
  功能：
-->

<template>
  <scroll class="booklist"
          ref="scroll"
          :data="booklist"
          :pullup="pullup"
          @scrollToTop="pullRefresh"
          @scrollToRefresh="tip"
          @scrollToEnd="moreList"
  >
    <ul class="books" ref="books">
      <li v-show="flagPull">
        <div class="refresh-container">
          <loading :title="pullText"></loading>
        </div>
      </li>
      <li class="noheight" v-show="!flagPull">
      </li>
      <li class="book-item" @click="selectBook(item)" v-for="(item, index) in booklist">
        <img class="status" src="./okBorrow.png" alt="" v-if="item.stock">
        <img class="status" src="./noBorrow.png" alt="" v-if="!item.stock">
        <img class="cover" v-lazy="item.productpic" alt="" ref="img">
        <span class="name">{{item.productName}}</span>
      </li>
      <loading v-if="isLoad"></loading>
    </ul>
    <div class="loading-container" v-if="!booklist.length && status !== 0">
      <loading></loading>
    </div>
    <div class="no-result-wrapper" v-if="status === 0">
      <no-result title="暂无筛选结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getBooklist, addHotBook } from 'api/chooseBook'
  import { getthisBindCard } from 'api/user'
  import { ERR_OK } from 'api/config'
  import { mapMutations } from 'vuex'
  import NoResult from 'base/no-result/no-result'

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      pullup: {
        type: Boolean,
        default: false
      },
      flagPull: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        booklist: [],
        pagesize: 21,
        minid: '',
        status: '',
        pullText: '下拉刷新',
        pageIndex: 1,
        hasMore: true,
        isLoad: false,
        type1: '',
        type2: '',
        type3: ''
      }
    },
    created () {
    },
    mounted () {
      this._getBooklist()
    },
    computed: {},
    methods: {
      tip () {
        this.pullText = '正在刷新'
        this.noRefresh = true
      },
      pullRefresh () {
        this.pageIndex = 1
        this.hasMore = true
        this._getBooklist(this.type1, this.type2, this.type3)
      },
      moreList () {
        if (!this.hasMore) {
          return
        }
        this.isLoad = true
        this.pageIndex++
        getBooklist(this.query, this.type1, this.type2, this.type3, this.pagesize, this.pageIndex).then((res) => {
          console.log(res)
          if (res.data.status === ERR_OK) {
            this.booklist = this.booklist.concat(res.data.info)
            this.status = 1
            this.isLoad = false
            setTimeout(() => {
              this.changeHeight()
            }, 100)
          }
          this._checkMore(res.data)
        })
      },
      _checkMore (data) {
        if (this.pagesize * this.pageIndex >= data.recordCount) {
          this.hasMore = false
          this.isLoad = false
        }
      },
      changeHeight () {
        let childrens = this.$refs.books.querySelectorAll('.book-item')
        for (let i = 0; i < childrens.length; i++) {
          let li = childrens[i]
          let img = li.querySelectorAll('.cover')[0]
          let liWidth = img.offsetWidth
          img.style.minHeight = liWidth / 0.75 + 'px'
          img.style.maxHeight = liWidth / 0.75 + 'px'
        }
      },
      selectBook (item) {
        this.$emit('select', item)
        this.setBookDetail(item)
        addHotBook(item.id).then((res) => {
        })
      },
      _getBooklist (type1, type2, type3) {
        let id = JSON.parse(localStorage.getItem('userInfo')).id
        getthisBindCard(id).then((res) => {
          console.log(res)
        })
        this.pageIndex = 1
        this.hasMore = true
        this.isLoad = false
        this.type1 = type1
        this.type2 = type2
        this.type3 = type3
        getBooklist(this.query, type1, type2, type3, this.pagesize, this.pageIndex).then((res) => {
          if (res.data.status === ERR_OK) {
            this.booklist = res.data.info
            this.status = 1
            this.pullText = '下拉刷新'
            this.$emit('successRefresh')
            setTimeout(() => {
              this.changeHeight()
            }, 100)
            this._checkMore(res.data)
          } else {
            this.booklist = []
            this.status = 0
            this.hasMore = false
            this.isLoad = false
            this.$emit('successRefresh')
          }
        }).catch(() => {
          this.booklist = []
          this.status = 1
        })
      },
      ...mapMutations({
        setBookDetail: 'SET_BOOKDETAIL'
      })
    },
    activated () {
      this.$watch('userInfo', () => {
        this._getBooklist()
      })
    },
//    watch: {
//      // 如果路由有变化，会再次执行该方法
//      '$route': {
//        handler (newValue, oldValue) {
//          if (this.$route.path === '/chooseBooks') {
//            this._getBooklist()
//          }
//        },
//        deep: true
//      }
//    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped>

  .booklist {
    height: 100%;
    overflow: hidden;
  }

  .booklist > .books {
    display: block;
    padding: 0 10px;
    padding-bottom: 12px;
    min-height: 120%;
  }

  .booklist > .books:after {
    display: block;
    content: "clear";
    height: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden;
  }

  .booklist > .books > .book-item {
    position: relative;
    display: block;
    width: 33%;
    float: left;
    padding: 10px;
    box-sizing: border-box;
    padding-bottom: 0;
  }

  .booklist > .books > .noheight {
    height: 46.5px;
    width: 100%;
  }

  .booklist > .books > .book-item > .status {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 32px;
    height: 32px;
  }

  .booklist > .books > .book-item > .cover {
    width: 100%;
  }

  .booklist > .books > .book-item > .name {
    display: block;
    font-size: 12px;
    color: #333333;
    height: 28px;
    line-height: 1.2;
    overflow: hidden;
  }

  .booklist > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 20%;
    transform: translateY(-20%);
  }
</style>
