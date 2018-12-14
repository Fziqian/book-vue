<!--

  User: fanqingyu

  Date: 2017/6/6 9:42

  功能：

-->

<template>
  <transition name="move">
    <div class="homeSearch">
      <search @query="onQueryChange" @search="onSearch" ref="searchBox"></search>
      <div class="list" v-if="query">
        <homelist @readSelectItem="selectBook" ref="homelist" :query="query"></homelist>
      </div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script>
  import Search from 'base/search-box/search-box'
  import Split from 'base/split/split'
  import Homelist from 'components/home/homelist/homelist'

  const READ = 1
  const LISTEN = 2
  export default {
    data () {
      return {
        hotKey: [],
        query: '',
        types: [],
        selectedBook: {}
      }
    },
    created () {
    },
    methods: {
      addQuery (item) {
        this.$refs.searchBox.setQuery(item)
      },
      onQueryChange (query) {
        this.query = query
      },
      onSearch () {
        this.$refs.homelist._getHomelist()
      },
      selectBook (item) {
        if (item.typeId === READ) {
          this.$router.push({
            name: 'readDetail',
            params: {readId: item.id}
          })
        } else if (item.typeId === LISTEN) {
          this.$router.push({
            name: 'listenDetail',
            params: {listenId: item.id}
          })
        }
      }
    },
    components: {
      Search,
      Split,
      Homelist
    }
  }
</script>


<style scoped>
  .homeSearch {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 60;
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .homeSearch > .shortcutWarrper > .history-key {
    padding: 16px 12px;
  }

  .homeSearch > .shortcutWarrper > .history-key > h1 {
    border-left: 4px solid #00a9e4;
    padding-left: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    color: #333333;
  }

  .homeSearch > .shortcutWarrper > .history-key > ul > li {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 5px;
    background: #fafafa;
    border: 1px solid #ccc;
    font-size: 14px;
    color: #666666;
  }

  .homeSearch > .shortcutWarrper > .history-key > ul {
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .homeSearch > .shortcutWarrper > .history-key > .clear {
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

  .homeSearch > .list {
    bottom: 50px;
    position: fixed;
    top: 50px;
    width: 100%;
  }
</style>
