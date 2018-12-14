<!--
  User: fanqingyu
  Date: 2017/6/5 17:36
  功能：绘本详情
-->

<template>
  <transition name="move">
    <div class="bookDetail">
      <div class="title">
        <span class="back" @click="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">绘本详情</span>
      </div>
      <scroll class="scroll" ref="scroll">
        <div class="content-wrapper">
          <div class="content-title">
            <div class="content-left">
              <span class="name">{{bookDetail.productName}}</span>
              <span class="text">适合年龄：{{bookDetail.extstr1}}</span>
              <span class="text">豆瓣评分：{{bookDetail.extstr2}}</span>
              <span class="series" @click="seriesBook">查看该系列其它丛书</span>
              <div class="addcontrol">
                <div class="borrow" @click="addbook" v-html="isBook ? '已加入借书架' : '加入借书架'"></div>
                <div class="content-collect" @click="_collectionBook">
                  <span class="collect" :class="{'active': isCollection}"><i class="iconfont icon-shoucang"></i></span>
                  <span class="text" :class="{'active': isCollection}">收藏</span>
                </div>
              </div>
            </div>
            <div class="cover">
              <img v-lazy="bookDetail.productpic">
            </div>
          </div>
          <div class="content-info">
            <div class="title">绘本详情</div>
            <div class="detail">
              <div class="text">
                <span class="text-left">条码</span>
                <span class="text-right">{{bookDetail.sku}}</span>
              </div>
              <div class="text">
                <span class="text-left">ISBN</span>
                <span class="text-right">{{bookDetail.ZhunZi}}</span>
              </div>
              <div class="text">
                <span class="text-left">作者</span>
                <span class="text-right">{{bookDetail.extstr}}</span>
              </div>
              <div class="text">
                <span class="text-left">出版社</span>
                <span class="text-right">{{bookDetail.Factory}}</span>
              </div>
              <div class="text">
                <span class="text-left">出版时间</span>
                <span class="text-right">{{bookDetail.Validity}}</span>
              </div>
              <div class="text">
                <span class="text-left">尺寸</span>
                <span class="text-right">{{bookDetail.spec}}</span>
              </div>
            </div>
          </div>
          <div class="desc">
            <div class="title">内容简介</div>
            <div class="about">
              {{bookDetail.description}}
            </div>
          </div>
        </div>
      </scroll>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { mapGetters, mapActions } from 'vuex'
  import BorrowControl from 'base/borrowControl/borrowControl'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import { addBorrowstand, collectionBook } from 'api/chooseBook'
  import { ERR_OK } from 'api/config'

  export default {
    props: {},
    data () {
      return {
        showDetail: false,
        book: {},
        num: 0,
        isBook: false,
        maskText: '',
        isCollection: false
      }
    },
    computed: {
      ...mapGetters([
        'bookDetail',
        'books'
      ])
    },
    created () {
      this._isbook()
      this._getBookDetail()
    },
    methods: {
      back () {
        this.$router.back()
      },
      _getBookDetail () {
        if (!this.bookDetail.productid) {
          this.$router.push({
            path: '/mine/myCollection'
          })
        } else {
          if (this.bookDetail.iscollection === 1) {
            this.isCollection = true
          } else {
            this.isCollection = false
          }
        }
      },
      _collectionBook () {
        if (this.isCollection) {
          collectionBook(this.bookDetail.productid, 0).then((res) => {
            if (res.data.status === ERR_OK) {
              this.isCollection = !this.isCollection
              this.maskText = '取消收藏成功'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            } else {
              this.maskText = '取消收藏失败'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            }
          }).catch(() => {
            this.maskText = '取消收藏失败'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          })
        } else {
          collectionBook(this.bookDetail.productid, 1).then((res) => {
            if (res.data.status === ERR_OK) {
              this.isCollection = !this.isCollection
              this.maskText = '收藏成功'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            } else {
              this.maskText = '收藏失败'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            }
          }).catch(() => {
            this.maskText = '收藏失败'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          })
        }
      },
      seriesBook () {
        this.$router.push({
          path: '/mine/seriesBook=' + this.bookDetail.categoryId
        })
      },
      _isbook () {
        let findIndex = this.findIndex(this.books, this.bookDetail)
        if (findIndex !== -1) {
          this.isBook = true
        } else {
          this.isBook = false
        }
      },
      addbook () {
        let findIndex = this.findIndex(this.books, this.bookDetail)
        if (findIndex > -1 && this.bookDetail.addcart !== 0) {
          this.maskText = '借书架已包含这本书'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
        } else {
          addBorrowstand(this.bookDetail.productid).then((res) => {
            if (res.data.status === ERR_OK) {
              this.insertBook(this.bookDetail)
              this.num++
              this.isBook = true
              this.maskText = '添加成功借书架'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            } else if (res.data.status === '2') {
              this.maskText = '借书架已包含这本书'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            }
          }).catch(() => {
            this.maskText = '添加失败'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          })
        }
      },
      findIndex (list, book) {
        return list.findIndex((item) => {
          if (item.productId) {
            return item.productId === book.productid
          } else {
            return item.id === book.productid
          }
        })
      },
      ...mapActions([
        'insertBook'
      ])
    },
    watch: {
      bookDetail: {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            this._isbook()
            this._getBookDetail()
            this.$nextTick(() => {
              this.$refs.scroll.refresh()
            })
          }
        },
        deep: true
      }
    },
    components: {
      Scroll,
      BorrowControl,
      DialogMask
    }
  }
</script>


<style>
  @import '../../../common/css/iconfont.css';

  .bookDetail {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 110;
  }

  .bookDetail > .title {
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

  .bookDetail > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .bookDetail > .scroll {
    position: fixed;
    top: 42px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title {
    padding: 18px 12px;
    display: flex;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left {
    flex: 1;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > span {
    display: block;
    margin-bottom: 12px;
    font-size: 14px;
    color: #333333;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .name {
    font-size: 16px;
    font-weight: bold;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .series {
    padding: 10px 3px;
    width: 150px;
    font-size: 14px;
    color: #00a9e4;
    text-align: center;
    border: 1px solid #00a9e4;
    border-radius: 5px;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .addcontrol > div {
    display: inline-block;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .addcontrol > .content-collect {
    margin-left: 20px;
    font-size: 14px;
  }
  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .addcontrol > .content-collect > .active {
    color: #00a9e4;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .addcontrol > .content-collect > .collect > .iconfont {
    font-size: 14px;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .content-left > .addcontrol > .borrow {
    background: #00a9e4;
    color: #fff;
    padding: 5px;
    font-size: 12px;
    border-radius: 5px;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .cover {
    width: 88px;
    flex: 0 0 88px;
  }

  .bookDetail > .scroll > .content-wrapper > .content-title > .cover > img {
    width: 88px;
  }

  .bookDetail > .scroll > .content-wrapper > .content-info > .title {
    padding: 12px;
    background: #f4f4f4;
    color: #666666;
  }

  .bookDetail > .scroll > .content-wrapper > .content-info > .detail {
    padding: 0 12px;
  }

  .bookDetail > .scroll > .content-wrapper > .content-info > .detail > .text {
    padding: 15px 0;
    font-size: 14px;
    border-bottom: 1px solid #dddddd;
  }

  .bookDetail > .scroll > .content-wrapper > .content-info > .detail > .text:last-child {
    border-bottom: 0;
  }

  .bookDetail > .scroll > .content-wrapper > .content-info > .detail > .text > .text-left {
    display: inline-block;
    width: 64px;
    margin-right: 12px;
    color: #666666;
  }

  .bookDetail > .scroll > .content-wrapper > .desc {
  }

  .bookDetail > .scroll > .content-wrapper > .desc > .title {
    padding: 12px;
    background: #f4f4f4;
    color: #666666;
  }

  .bookDetail > .scroll > .content-wrapper > .desc > .about {
    padding: 12px 12px 30px 12px;
    font-size: 14px;
    line-height: 2;
    text-indent: 20px;
    color: #333333;
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }


</style>
