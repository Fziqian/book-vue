<!--
  User: fanqingyu
  Date: 2017/7/5 16:39
  功能：
-->
<template>
  <transition name="move">
    <div class="peopleSearch">
      <search @query="onQueryChange" @search="onSearch"></search>
      <div class="content-wrapper" ref="contentWrapper" v-if="result.length > 0">
        <peopleList @select="selectPeople"
                    :isSlider="false"
                    :query="query"
                    :peoples="result"
                    :hasMore="hasMore"
                    :isLoad="isLoad"
                    @moreList="moreList"
        ></peopleList>
      </div>
      <div class="no-result-wrapper" v-if="!result.length">
        <no-result title="暂无搜索结果"></no-result>
      </div>
      <peopleDetail ref="peopleDetail" :isAdd="true"></peopleDetail>
    </div>
  </transition>
</template>

<script>
  import Search from 'base/search-box/search-box'
  import PeopleList from 'components/my/peopleList/peopleList'
  import PeopleDetail from 'components/my/peopleDetail/peopleDetail'
  import NoResult from 'base/no-result/no-result'
  import { ERR_OK } from 'api/config'
  import { searchPeople } from 'api/user'
  import { mapMutations } from 'vuex'

  const PAGESIZE = 20
  export default {
    data () {
      return {
        query: '',
        result: [],
        pageIndex: 1,
        hasMore: true,
        isLoad: false
      }
    },
    created () {
    },
    methods: {
      moreList () {
        this.isLoad = true
        this.pageIndex++
        console.log(this.pageIndex)
        searchPeople(this.query, PAGESIZE, this.pageIndex).then((res) => {
          if (res.data.status === ERR_OK) {
            this.result = this.result.concat(res.data.info)
            this.status = 1
            this.isLoad = false
          }
          this._checkMore(res.data)
        })
      },
      _checkMore (data) {
        if (PAGESIZE * this.pageIndex >= data.recordCount) {
          this.hasMore = false
          this.isLoad = false
        }
      },
      selectPeople (item) {
        this.setUser(item)
        this.$refs.peopleDetail.show()
      },
      onQueryChange (query) {
        this.query = query
      },
      onSearch () {
        searchPeople(this.query, PAGESIZE).then((res) => {
          if (res.data.status === ERR_OK) {
            this.result = res.data.info
            this._checkMore(res.data)
          } else {
            this.result = []
            this._checkMore(res.data)
          }
        })
      },
      ...mapMutations({
        setUser: 'SET_USER_INFO'
      })
    },
    components: {
      Search,
      PeopleList,
      PeopleDetail,
      NoResult
    }
  }
</script>

<style>
  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .peopleSearch {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }
  .peopleSearch > .content-wrapper {
    width: 100%;
    position: absolute;
    top: 49px;
    bottom: 50px;
    overflow: hidden;
  }
</style>
