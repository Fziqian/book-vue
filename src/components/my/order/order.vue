<template>
  <transition name="move">
    <div class="order">
      <div class="title">
        <span @click="goBack" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span>订单管理</span>
      </div>
      <div class="tab">
        <span class="tab-item" @click="toggle(0, $event)" :class="{'active': selectTab === 0}">全部</span>
        <span class="tab-item" @click="toggle(1, $event)" :class="{'active': selectTab === 1}">待取</span>
        <span class="tab-item" @click="toggle(4, $event)" :class="{'active': selectTab === 4}">取消</span>
      </div>
      <div class="content-wrapper" ref="contentWrapper" v-show="list.length">
        <scroll class="scroll"
                ref="scroll"
                :data="list"
                :pullup="pullup"
                @scrollToTop="pullRefresh"
                @scrollToRefresh="tip"
                @scrollToEnd="moreList"
        >
          <ul class="content">
            <split></split>
            <li class="content-title" v-for="item in list">
              <div class="desc">
                <div class="content-title-left">
                  <div class="order-num">订单号：{{item.order_no}}</div>
                </div>
                <div class="content-title-right" v-html="getStatus(item.status)"></div>
              </div>
              <ul>
                <li class="content-item" v-for="itemBook in item.order_goods">
                  <img v-lazy="itemBook.productPic" alt="">
                  <div class="text">
                    <span class="name">{{itemBook.goods_title}}</span>
                    <span class="time">作者：{{itemBook.extStr}}</span>
                  </div>
                </li>
              </ul>
              <div class="cancleOrder" @click="showConfirm(item.id)" v-if="item.status === 1">
                <couter :add_time="item.add_time"></couter>
                <span>取消订单</span>
              </div>
            </li>
            <loading v-if="isLoad"></loading>
          </ul>
        </scroll>
      </div>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
      <confirm ref="confirm" @confirm="cancleOrder" text="是否确认取消订单" confirmBtnText="确定"></confirm>
      <div class="loading-container" v-if="!list.length && status ===2">
        <loading></loading>
      </div>
      <div class="no-result-wrapper" v-if="status === 0">
        <no-result title="暂无结果"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import Split from 'base/split/split'
  import { getBorrowList, cancelOrder } from 'api/user'
  import { ERR_OK } from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/no-result/no-result'
  import Loading from 'base/loading/loading'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import Confirm from 'base/confirm/confirm'
  import Couter from 'base/couter/couter'
  // eslint-disable-next-line no-unused-vars
  /* eslint-disable no-unused-vars */
  // 全部
  const ALL = 1
  // 待取书
  const NO_TAKEN = 2
  // 已取书
  const TAKEN = 3

  export default {
    data () {
      return {
        selectTab: 0,
        list: [],
        pagesize: 20,
        status: 2,
        maskText: '',
        orderId: '',
        pullup: true,
        pullText: '下拉刷新',
        pageIndex: 1,
        hasMore: true,
        isLoad: false,
        time: []
      }
    },
    created () {
      this._getBorrowList()
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
        getBorrowList(this.pagesize, this.selectTab, this.pageIndex).then((res) => {
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
      _getBorrowList () {
        getBorrowList(this.pagesize, this.selectTab).then((res) => {
          console.log(res)
          if (res.data.status === ERR_OK) {
            this.list = res.data.info
            this.status = 1
            this._checkMore(res.data)
          } else {
            this.list = []
            this.status = 0
            this._checkMore(res.data)
          }
        }).catch(() => {
          this.list = []
          this.status = 0
        })
      },
      getStatus (status) {
        if (status === 1) {
          return '待取'
        } else if (status === 2) {
          return '已取'
        } else if (status === 3) {
          return '已还'
        } else if (status === 4) {
          return '已取消'
        }
      },
      showConfirm (id) {
        this.orderId = id
        this.$refs.confirm.show()
      },
      cancleOrder () {
        cancelOrder(this.orderId).then((res) => {
          if (res.data.status === ERR_OK) {
            this.maskText = '订单取消成功~'
            this._getBorrowList()
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          } else {
            this.maskText = '订单取消失败~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
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
      Split,
      Scroll,
      NoResult,
      Loading,
      DialogMask,
      Confirm,
      Couter
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

  .order {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .order > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    position: relative;
  }

  .order > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .order > .tab {
    display: flex;
    width: 100%;
  }

  .order > .tab .tab-item {
    flex: 1;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border-bottom: 2px solid #ffffff;
  }

  .order > .tab .active {
    border-bottom: 2px solid #00a9e4;
  }

  .order > .content-wrapper .scroll {
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 86px;
    bottom: 50px;
    overflow: hidden;
  }

  .order > .content-wrapper .content {
    padding-bottom: 10px;
    min-height: 120%;
  }

  .order > .content-wrapper .content .content-title {
    padding: 16px 0;
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .order > .content-wrapper .content .content-title .cancleOrder{
    text-align: right;
    display: flex;
    justify-content: space-between;
  }
  .order > .content-wrapper .content .content-title .cancleOrder .couter{
    border: 0;
    color: #666;
  }
  .order > .content-wrapper .content .content-title .cancleOrder >span{
    padding: 5px;
    border: 1px solid #00a9e4;
    border-radius: 5px;
    color: #00a9e4;
  }


  .order > .content-wrapper .content .content-title .desc {
    display: flex;
    margin-bottom: 20px;
  }

  .order > .content-wrapper .content .content-title .content-title-left {
    display: inline-block;
    flex: 1;
  }

  .order > .content-wrapper .content .content-title .content-title-left div {
    display: block;
    flex: 1;
  }

  .order > .content-wrapper .content .content-title .content-title-right {
    display: inline-block;
    flex: 0 0 50px;
    text-align: right;
    color: #00a9e4;
  }

  .order > .content-wrapper .content .content-title .content-item {
    display: flex;
    margin-bottom: 20px;
  }

  .order > .content-wrapper .content .content-title .content-item img {
    display: inline-block;
    flex: 0 0 72px;
    width: 72px;
    height: 98px;
  }

  .order > .content-wrapper .content .content-title .content-item .text {
    display: inline-block;
    flex: 1;
    height: 80px;
    margin-top: 8px;
  }

  .order > .content-wrapper .content .content-title .content-item:nth-of-type(odd) .text {
    background: #fef7dd;
  }

  .order > .content-wrapper .content .content-title .content-item:nth-of-type(even) .text {
    background: #e7f9fe;
  }

  .order > .content-wrapper .content .content-title .content-item .text .name {
    display: block;
    margin-top: 20px;
    margin-bottom: 8px;
    margin-left: 12px;
    font-size: 16px;
    color: #333333;
  }

  .order > .content-wrapper .content .content-title .content-item .text .time {
    display: block;
    font-size: 12px;
    margin-left: 12px;
    color: #666666;
  }

  .order > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 40%;
    transform: translateY(-40%);
  }
</style>
