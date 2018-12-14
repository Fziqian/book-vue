<!--
  User: fanqingyu
  Date: 2017/6/6 11:36
  功能：借书架页面
-->

<template>
  <transition name="move">
    <div class="borrowStand">
      <div class="title">
        <span class="back" @click="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">借书架</span>
        <!--<span class="scan"><i class="iconfont icon-ccgl-yundansaomiao-5"></i></span>-->
      </div>
      <scroll class="scroll" v-if="linebooks.length">
        <ul class="content">
          <li v-for="item in linebooks">
            <span class="icon" @click="selectBook(item.id, item.productId)">
              <i class="iconfont icon-duigou" :class="{'active': checkingBook(item.id, item.productId) !== -1}"></i>
            </span>
            <span class="img">
              <img v-lazy="item.productPic" alt="">
            </span>
            <div class="desc">
              <span class="name">{{item.productName}}</span>
              <span class="author">{{item.extstr}}</span>
            </div>
          </li>
        </ul>
      </scroll>
      <div class="foot">
        <div class="selectAll">
          <span @click="_clickAll">
            <i class="iconfont icon-duigou" :class="{'active': selectAll}"></i>全选
          </span>
          <span class="count" @click.prevent="deleteBook()">删除</span>
        </div>
        <div class="pay" @click="comfirm()">提交</div>
      </div>
      <dialog-prompt ref="dialogPrompt" v-show="showAnimate" title="请求中..."></dialog-prompt>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
      <div class="no-result-wrapper" v-if="!linebooks.length">
        <no-result title="暂无结果"></no-result>
      </div>
      <confirm ref="confirm" @confirm="cancleOrder" text="订单有效时限为40分钟，请您在有效时限内取走" confirmBtnText="确定"></confirm>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { mapActions } from 'vuex'
  import { createBorrowList, borrowstandList, delBorrowstand } from 'api/chooseBook'
  import DialogPrompt from 'base/dialog-prompt/dialog-prompt'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import { ERR_OK } from 'api/config'
  import NoResult from 'base/no-result/no-result'
  import Confirm from 'base/confirm/confirm'

  export default {
    data () {
      return {
        showFlag: false,
        selectedbooks: [],
        selectAllbooks: [],
        selectBookIds: [],
        selectAllbookIds: [],
        selectAll: false,
        linebooks: [],
        maskText: '',
        showAnimate: false
      }
    },
    created () {
      this._borrowstandList()
    },
    methods: {
      back () {
        this.$router.back()
      },
      _borrowstandList () {
        borrowstandList().then((res) => {
          if (res.data.status === ERR_OK) {
            this.linebooks = res.data.info
            this._selectAll()
          } else {
            this.linebooks = []
          }
        })
      },
      comfirm () {
        if (!this.selectedbooks.length) {
          this.maskText = '未选中任何书籍，无法提交'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
          return
        }
        this.$refs.confirm.show()
      },
      cancleOrder () {
        this.showAnimate = true
        createBorrowList(this.selectedbooks.toString()).then((res) => {
          if (res.data.status === ERR_OK) {
            this.showAnimate = false
            this.selectedbooks.forEach((id) => {
              this.linebooks.forEach((book) => {
                console.log(book.productId)
                if (id === book.id) {
                  this.delBook(book.productId)
                }
              })
            })
            this.selectAll = false
            this.$router.push({
              path: '/chooseBooks/borrowStand/orderSuccess'
            })
          } else {
            this.showAnimate = false
            this.maskText = res.data.msg
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          }
        })
      },
      selectBook (id, productId) {
        if (this.checkingBook(id) !== -1) {
          this.selectedbooks.splice(this.checkingBook(id), 1)
          this.selectBookIds.splice(this.checkingBook(id), 1)
        } else {
          this.selectedbooks.push(id)
          this.selectBookIds.push(productId)
        }
        if (this.selectedbooks.sort().toString() === this.selectAllbooks.sort().toString()) {
          this.selectAll = true
        } else {
          this.selectAll = false
        }
      },
      checkingBook (id) {
        return this.selectedbooks.indexOf(id)
      },
      _selectAll () {
        if (this.linebooks.length > 0) {
          this.selectedbooks = []
          this.selectBookIds = []
          this.selectAllbooks = []
          this.linebooks.forEach((book) => {
            this.selectAllbooks.push(book.id)
            this.selectAllbookIds.push(book.productId)
          })
        }
      },
      _clickAll () {
        if (this.selectedbooks.sort().toString() === this.selectAllbooks.sort().toString()) {
          this.selectedbooks = []
          this.selectBookIds = []
          this.selectAll = false
        } else {
          this.selectedbooks = []
          this.selectBookIds = []
          this.selectedbooks = this.selectAllbooks
          this.selectBookIds = this.selectAllbookIds
          console.log(this.selectedbooks)
          console.log(this.selectBookIds)
          this.selectAll = true
        }
      },
      deleteBook () {
        if (!this.selectBookIds.length) {
          this.maskText = '未选中任何书籍！'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
          return
        }
        delBorrowstand(this.selectBookIds.toString()).then((res) => {
          console.log(res)
          this.showAnimate = true
          if (res.data.status === ERR_OK) {
            this.showAnimate = false
            this.maskText = '删除成功~'
            this.$refs.dialogMask.show()
            console.log(this.selectBookIds)
            console.log(this.selectedbooks)
            this.selectedbooks.forEach((id) => {
              this.linebooks.forEach((book) => {
                console.log(book.productId)
                if (id === book.id) {
                  this.delBook(book.productId)
                }
              })
            })
//            this.delBook({
//              list: this.selectBookIds
//            })
            setTimeout(() => {
              this.$refs.dialogMask.hide()
              this._borrowstandList()
              this.selectAll = false
            }, 1000)
          } else {
            this.showAnimate = false
            this.maskText = '删除失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          }
        })
      },
      ...mapActions([
        'delBook'
      ])
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': '_borrowstandList'
    },
    components: {
      Scroll,
      DialogMask,
      NoResult,
      DialogPrompt,
      Confirm
    }
  }
</script>

<style>
  @import '../../../common/css/iconfont.css';

  .borrowStand {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 150;
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .borrowStand > .title {
    width: 100%;
    display: flex;
    text-align: center;
    line-height: 42px;
    height: 42px;
    font-size: 18px;
    font-weight: 600;
    position: relative;
    background: #00a9e4;
    color: #fff;
  }

  .borrowStand > .title > .back {
    display: inline-block;
    width: 50px;
    height: 42px;
    position: absolute;
    left: 0;
    text-align: center;
  }

  .borrowStand > .title > .back, .borrowStand > .title > .scan {
    display: inline-block;
    flex: 0 0 50px;
    width: 42px;
    height: 42px;
    line-height: 42px;
  }

  .borrowStand > .title > .back, .borrowStand > .title > .scan > .iconfont {
    color: #fff;
    font-size: 20px;
    font-weight: 500;
  }

  .borrowStand .title .text {
    display: inline-block;
    flex: 1;
    height: 42px;
    text-align: center;
    line-height: 42px;
  }

  .borrowStand .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    line-height: 50px;
    z-index: 30;
    width: 100%;
    height: 50px;
    border-top: 1px solid #ccc;
    text-align: center;
    background: #fff;
  }

  .borrowStand .selectAll {
    display: inline-block;
    flex: 1;
    text-align: left;
  }

  .borrowStand .selectAll > span {
    margin-left: 20px;
    color: #333;
  }

  .borrowStand .selectAll > span > i {
    margin-right: 10px;
    color: #ccc;
  }

  .borrowStand .selectAll > span > .active {
    color: green;
  }

  .borrowStand .pay {
    display: inline-block;
    flex: 0 0 100px;
    background: #00a9e4;
    color: #fff;
  }

  .borrowStand > .text {
    position: fixed;
    top: 42px;
    padding: 12px;
    width: 100%;
    font-size: 16px;
    background: #f4f4f4;
  }

  .borrowStand > .scroll {
    position: fixed;
    top: 42px;
    bottom: 50px;
    width: 100%;
    background: #f4f4f4;
  }

  .borrowStand > .scroll > ul {
    padding: 0 12px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: #fff;
  }

  .borrowStand > .scroll > ul > li {
    display: flex;
    border-bottom: 1px solid #ddd;
    padding: 12px 0;
  }

  .borrowStand > .scroll > ul > li:last-child {
    border-bottom: 0;
  }

  .borrowStand > .scroll > ul > li > .icon {
    flex: 0 0 28px;
    height: 98px;
    line-height: 98px;
    color: #ccc;
  }

  .borrowStand > .scroll > ul > li > .icon > .active {
    color: green;
  }

  .borrowStand > .scroll > ul > li > .img {
    flex: 0 0 72px;
    width: 72px;
    height: 98px;
  }

  .borrowStand > .scroll > ul > li > .img > img {
    width: 72px;
    height: 98px;
  }

  .borrowStand > .scroll > ul > li > .desc {
    flex: 1;
    height: 98px;
    margin-left: 12px;
  }

  .borrowStand > .scroll > ul > li > .desc > span {
    display: block;
  }

  .borrowStand > .scroll > ul > li > .desc > .name {
    margin-top: 30px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  }

  .borrowStand > .scroll > ul > li > .desc > .author {
    font-size: 12px;
    color: #666;
  }

  .borrowStand > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 40%;
    transform: translateY(-40%);
  }
</style>
