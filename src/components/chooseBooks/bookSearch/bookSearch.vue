<!--

  User: fanqingyu

  Date: 2017/6/6 9:42

  功能：

-->

<template>
  <transition name="move">
    <div class="bookSearch">
      <search @query="onQueryChange" @search="onSearch" ref="searchBox"></search>
      <div class="shortcutWarrper" v-show="!query">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" @click="addQuery(item.keyword)">
              <span>{{item.keyword}}</span>
            </li>
          </ul>
        </div>
        <split v-show="searchBookHistory.length"></split>
        <div class="history-key" v-show="searchBookHistory.length">
          <h1 class="title">历史搜索</h1>
          <ul>
            <li class="item" v-for="item in searchBookHistory" @click="addQuery(item)">
              <span>{{item}}</span>
            </li>
          </ul>
          <div class="clear" @click="showConfirm">清空搜索历史</div>
        </div>
      </div>
      <div class="list" v-if="query">
        <booklist @select="selectBook" ref="booklist" :query="query" :flagPull="true" :pullup="true"></booklist>
      </div>
      <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script>
  import Search from 'base/search-box/search-box'
  import Split from 'base/split/split'
  import { getHotKey } from 'api/chooseBook'
  import { ERR_OK } from 'api/config'
  import Booklist from 'components/chooseBooks/booklist/booklist'
  import { mapActions, mapGetters } from 'vuex'
  import Confirm from 'base/confirm/confirm'

  const PAGESIZE = 5

  export default {
    data () {
      return {
        hotKey: [],
        query: '',
        selectedBook: {}
      }
    },
    created () {
      this._getHotKey()
    },
    computed: {
      ...mapGetters([
        'searchBookHistory'
      ])
    },
    methods: {
      _getHotKey () {
        getHotKey(PAGESIZE).then((res) => {
          if (res.data.status === ERR_OK) {
            this.hotKey = res.data.info
          }
        })
      },
      addQuery (item) {
        this.$refs.searchBox.setQuery(item)
      },
      onQueryChange (query) {
        this.query = query
      },
      onSearch () {
        this.$refs.booklist._getBooklist()
        this.saveSearchHistory(this.query)
      },
      selectBook (item) {
        this.saveSearchHistory(this.query)
        this.$router.push({
          path: '/chooseBooks/bookDetail=' + item.id
        })
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'clearSearchHistory',
        'saveSearchHistory'
      ])
    },
    components: {
      Search,
      Split,
      Booklist,
      Confirm
    }
  }
</script>


<style>
  .bookSearch {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 50;
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .bookSearch > .shortcutWarrper > .hot-key, .bookSearch > .shortcutWarrper > .history-key {
    padding: 16px 12px;
  }

  .bookSearch > .shortcutWarrper > .hot-key > h1, .bookSearch > .shortcutWarrper > .history-key > h1 {
    border-left: 4px solid #00a9e4;
    padding-left: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    color: #333333;
  }

  .bookSearch > .shortcutWarrper > .hot-key > ul > li, .bookSearch > .shortcutWarrper > .history-key > ul > li {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 5px;
    background: #fafafa;
    border: 1px solid #ccc;
    font-size: 14px;
    color: #666666;
  }

  .bookSearch > .shortcutWarrper > .history-key > ul {
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .bookSearch > .shortcutWarrper > .history-key > .clear {
    margin: 0 auto;
    width: 200px;
    height: 37px;
    line-height: 37px;
    font-size: 14px;
    color: #666666;
    background: #fafafa;
    border: 1px solid #cccccc;
    border-radius: 5px;
    text-align: center;
  }

  .bookSearch > .list {
    bottom: 50px;
    position: fixed;
    top: 5px;
    width: 100%;
    z-index: -1
  }
</style>
