<template>
  <transition name="move">
    <div class="collection">
      <div class="title">
        <span @click="goBack" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span>收藏</span>
      </div>
      <scroll class="content-wrapper"
              ref="contentWrapper"
              :data="list"
              :pullup="pullup"
              @scrollToTop="pullRefresh"
              @scrollToRefresh="tip"
              @scrollToEnd="moreList"
      >
        <ul class="content">
          <li class="content-title" v-for="item in list" @click="selectBook(item)">
            <img v-lazy="item.productpic" alt="">
            <div class="text">
              <span class="name">{{item.productName}}</span>
              <span class="time">{{item.extstr}}</span>
            </div>
          </li>
          <loading v-if="isLoad"></loading>
        </ul>
      </scroll>
      <div class="loading-container" v-if="!list.length && status !==0">
        <loading></loading>
      </div>
      <div class="no-result-wrapper" v-if="status === 0">
        <no-result title="暂无结果"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import { collList } from 'api/user'
  import { ERR_OK } from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/no-result/no-result'
  import Loading from 'base/loading/loading'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        showCol: false,
        list: [],
        status: 1,
        pagesize: 20,
        pullup: true,
        pullText: '下拉刷新',
        pageIndex: 1,
        hasMore: true,
        isLoad: false
      }
    },
    created () {
      this._getCollectionList()
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      tip () {
        this.pullText = '正在刷新'
        this.noRefresh = true
      },
      pullRefresh () {
        this.pageIndex = 1
        this.hasMore = true
      },
      moreList () {
        if (!this.hasMore) {
          return
        }
        this.isLoad = true
        this.pageIndex++
        collList(this.pagesize, this.pageIndex).then((res) => {
          if (res.data.status === ERR_OK) {
            this.list = this.list.concat(res.data.info)
            this.status = 1
            this.isLoad = false
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
      _getCollectionList () {
        collList(this.pagesize, this.pageIndex).then((res) => {
          if (res.data.status === ERR_OK) {
            this.list = res.data.info
            this.status = 1
            this._checkMore(res.data)
          } else {
            this.list = []
            this.status = 0
            this._checkMore(res.data)
          }
        })
      },
      selectBook (item) {
        this.setBookDetail(item)
        this.$router.push({
          path: '/mine/bookDetail=' + item.id
        })
      },
      ...mapMutations({
        setBookDetail: 'SET_BOOKDETAIL'
      })
    },
    components: {
      Scroll,
      NoResult,
      Loading
    }
  }
</script>
<style scoped>
  @import '../../../common/css/iconfont.css';

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .collection {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .collection > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: relative;
  }

  .collection > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .collection > .content-wrapper {
    width: 100%;
    padding: 0px 12px 0 12px;
    box-sizing: border-box;
    position: absolute;
    top: 42px;
    bottom: 50px;
    overflow: hidden;
  }

  .collection > .content-wrapper .content {
    padding-bottom: 10px;
    min-height: 120%;
  }

  .collection > .content-wrapper .content .content-title {
    padding: 16px 0;
    font-size: 14px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .collection > .content-wrapper .content .content-title {
    display: flex;
  }

  .collection > .content-wrapper .content .content-title img {
    display: inline-block;
    flex: 0 0 72px;
    width: 72px;
    height: 98px;
  }

  .collection > .content-wrapper .content .content-title .text {
    display: inline-block;
    flex: 1;
    height: 80px;
    margin-top: 8px;
  }

  .collection > .content-wrapper .content .content-title:nth-of-type(odd) .text {
    background: #fef7dd;
  }

  .collection > .content-wrapper .content .content-title:nth-of-type(even) .text {
    background: #e7f9fe;
  }

  .collection > .content-wrapper .content .content-title .text .name {
    display: block;
    margin-top: 20px;
    margin-bottom: 8px;
    margin-left: 12px;
    font-size: 16px;
    color: #333333;
  }

  .collection > .content-wrapper .content .content-title .text .time {
    display: block;
    font-size: 12px;
    margin-left: 12px;
    color: #666666;
  }

  .collection > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 40%;
    transform: translateY(-40%);
  }
</style>
