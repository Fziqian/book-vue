<template>
  <transition name="move">
    <div class="bookMg">
      <div class="title">
        <span @click="goBack" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span>图书管理</span>
      </div>
      <div class="tab">
        <span class="tab-item" @click="toggle(2, $event)" :class="{'active': selectTab === 2}">已取</span>
        <span class="tab-item" @click="toggle(3, $event)" :class="{'active': selectTab === 3}">已还</span>
      </div>
      <scroll class="content-wrapper" ref="contentWrapper">
        <ul class="content">
          <li class="content-title" v-for="item in list">
            <ul>
              <li class="content-item" v-for="itemBook in item.order_goods">
                <img v-lazy="itemBook.productPic" alt="">
                <div class="text">
                  <span class="name">{{itemBook.goods_title}}</span>
                  <span class="time">作者：{{itemBook.extStr}}</span>
                </div>
              </li>
            </ul>
          </li>
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
  import { getBorrowList } from 'api/user'
  import { ERR_OK } from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/no-result/no-result'
  import Loading from 'base/loading/loading'
  // eslint-disable-next-line no-unused-vars
  /* eslint-disable no-unused-vars */

  const BROOW = 2
  const RETURN = 3

  export default {
    data () {
      return {
        selectTab: 2,
        list: [],
        status: 0
      }
    },
    created () {
      this._getBorrowList()
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      _getBorrowList () {
        getBorrowList(20, this.selectTab).then((res) => {
          if (res.data.status === ERR_OK) {
            this.list = res.data.info
            this.status = 1
          } else {
            this.list = []
            this.status = 0
          }
        })
      },
      // tab切换，改变selectTab的值来动态切换
      toggle (type, event) {
        this.selectTab = type
        this._getBorrowList()
      }
    },
    components: {
      Scroll,
      NoResult,
      Loading
    }
  }
</script>
<style>
  @import '../../../common/css/iconfont.css';

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .bookMg{
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index:50;
    top: 0;
    left: 0
  }
  .bookMg>.title{
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
  .bookMg>.title>.back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }
  .bookMg>.tab {
    display: flex;
    width: 100%;
  }
  .bookMg>.tab .tab-item {
    flex: 1;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border-bottom: 2px solid #dddddd;
  }
  .bookMg>.tab .active {
    border-bottom: 2px solid #00a9e4;
  }
  .bookMg>.content-wrapper {
    width: 100%;
    padding: 0px 12px 0 12px;
    box-sizing: border-box;
    position: absolute;
    top: 86px;
    bottom: 50px;
    overflow: hidden;
  }
  .bookMg > .content-wrapper .content {
    padding-bottom: 10px;
  }

  .bookMg > .content-wrapper .content .content-title {
    padding: 16px 0;
    font-size: 14px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .bookMg > .content-wrapper .content .content-title .content-item {
    display: flex;
  }

  .bookMg > .content-wrapper .content .content-title .content-item img {
    display: inline-block;
    flex: 0 0 72px;
    width: 72px;
    height: 98px;
  }

  .bookMg > .content-wrapper .content .content-title .content-item .text {
    display: inline-block;
    flex: 1;
    height: 80px;
    margin-top: 8px;
  }

  .bookMg > .content-wrapper .content .content-title .content-item:nth-of-type(odd) .text {
    background: #fef7dd;
  }

  .bookMg > .content-wrapper .content .content-title .content-item:nth-of-type(even) .text {
    background: #e7f9fe;
  }

  .bookMg > .content-wrapper .content .content-title .content-item .text .name {
    display: block;
    margin-top: 20px;
    margin-bottom: 8px;
    margin-left: 12px;
    font-size: 16px;
    color: #333333;
  }

  .bookMg > .content-wrapper .content .content-title .content-item .text .time {
    display: block;
    font-size: 12px;
    margin-left: 12px;
    color: #666666;
  }

  .bookMg > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 40%;
    transform: translateY(-40%);
  }
</style>
