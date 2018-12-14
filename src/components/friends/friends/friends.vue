<!--

  User: fanqingyu

  Date: 2017/6/5 9:56

  功能：

-->

<template>
  <div class="friends">
    <div class="title">
      <div class="title-tab">
        <span class="text active">同学圈</span>
        <!--<span class="text" @click="toggleTitle(0, $event)" :class="{'active': friends === 0}">其它幼儿园</span>-->
      </div>
      <span class="icon" @click="release()"><i class="iconfont icon-paizhao"></i></span>
    </div>
    <ul class="tab">
      <li class="tab-item" @click="toggleTab(1, $event)" :class="{'active': news === 1}">最新</li>
      <li class="tab-item" @click="toggleTab(0, $event)" :class="{'active': news === 0}">最热</li>
    </ul>
    <transition name="fade">
      <div class="tip" v-show="!noRefresh">
        <div class="text">
          数据更新成功
        </div>
      </div>
    </transition>
    <div class="content-wrapper">
      <scroll class="content-list"
              ref="scroll"
              :data="friendList"
              :pullup="pullup"
              @scrollToTop="pullRefresh"
              @scrollToRefresh="tip"
              @scrollToEnd="moreFriendList"
      >
        <ul>
          <li>
            <div class="refresh-container">
              <loading :title="pullText"></loading>
            </div>
          </li>
          <li class="item" v-for="item in friendList">
            <div class="item-l">
              <img :src="item.avatar" alt="">
            </div>
            <div class="item-r">
              <div class="name-time">
                <span class="name">{{item.nick_name}}</span>
                <span class="time" v-html="_changeTimeType(item.createtime)"></span>
              </div>
              <div class="words">{{item.remarks}}</div>
              <div class="pic">
                <ul class="clear">
                  <li class="pic-item" v-for="imgItem in item.img_file"
                      @click="previewImage(item.img_file, imgItem.original_path)">
                    <div class="img" :style="{backgroundImage: 'url(' + imgItem.original_path + ')'}">
                    </div>
                  </li>
                </ul>
              </div>
              <div class="buttons">
                <span :class="{'support': item.is_upvote === '1'}" @click="_support(item.id, item.is_upvote, $event)">
                  <i class="iconfont icon-dianzan"></i>
                  <span class="num">{{item.upvote_num}}</span>
                </span>
                <span class="comment" @click="comment(item.id)">
                  <i class="iconfont icon-xiaoxi"></i>
                </span>
                <span class="share">
                  <!--<i class="iconfont icon-fenxiang"></i>-->
                </span>
              </div>
              <div class="comment-content" v-show="item.circle_detail.length > 0">
                <ul>
                  <li class="comment-content-item" v-for="itemAns in item.circle_detail">
                    <span><i class="name">{{itemAns.answer_nick_name}}</i>&nbsp;:&nbsp;{{itemAns.AnswerContent}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <loading v-if="isLoad"></loading>
        </ul>
        <div class="loading-container" v-show="!friendList.length && status === 1">
          <loading></loading>
        </div>
      </scroll>
    </div>
    <!--<div v-else-if="isvip !== 1" class="zhezhao">-->
      <!--<p>对不起，您没有VIP借阅卡</p>-->
      <!--<p>无法查看朋友圈动态</p>-->
      <!--<p>点击此处<span @click="govip">绑定VIP借阅卡</span></p>-->
    <!--</div>-->
    <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    <div class="no-result-wrapper" v-if="status === 0 && !friendList.length">
      <no-result title="暂无数据"></no-result>
    </div>
    <comment-sub ref="commentSub" :commentId="commentId" @changeContent="changeContent"></comment-sub>
    <release ref="release" @changeContent="changeContent"></release>
  </div>

</template>


<script>
  /* eslint-disable no-unused-vars */

  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import CommentSub from 'components/friends/comment/comment-sub'
  import Release from 'components/friends/release/release'
  import { getFriendslist, support } from 'api/friends'
  import { ERR_OK } from 'api/config'
  import { dateStr } from 'common/js/time'
  import { mapGetters } from 'vuex'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import ContentClass from 'common/js/contentClass'
  import NoResult from 'base/no-result/no-result'
  import wx from 'weixin-js-sdk'
  import { scan } from 'api/scan'

  export default {
    data () {
      return {
        friends: 1,
        news: 1,
        pagesize: 20,
        friendList: [],
        maskText: '',
        commentId: '',
        pullup: true,
        noRefresh: true,
        pullText: '下拉刷新',
        status: 1,
        pageIndex: 1,
        hasMore: true,
        isLoad: false,
        stop: '',
        isvip: ''
      }
    },
    created () {
      this.getpush()
    },
    mounted () {
      this._getFriendslist()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      _getFriendslist () {
        if (localStorage.hasOwnProperty('userInfo')) {
          this.stop = JSON.parse(localStorage.getItem('userInfo')).circle_stop
          getFriendslist(this.pagesize, this.friends, this.news, this.pageIndex).then((res) => {
            console.log(res)
            if (res.data.status === ERR_OK) {
              if (!res.data.info.length) {
                this.status = 0
              } else {
                this.noRefresh = false
                setTimeout(() => {
                  this.noRefresh = true
                  this.pullText = '下拉刷新'
                }, 1500)
                this.friendList = this._changefriendsList(res.data.info)
                this.status = 1
              }
              this._checkMore(res.data)
            } else {
              this.status = 0
            }
          })
          this.getpush()
        } else {
          this.$router.replace({
            path: `/login`
          })
        }
      },
      getpush () {
        if (this.$route.path === '/friends') {
          this.isvip = Number(JSON.parse(localStorage.getItem('userInfo')).isVip)
          let schoolname = JSON.parse(localStorage.getItem('userInfo')).shop_name
          let truename = JSON.parse(localStorage.getItem('userInfo')).truename
          let nickname = JSON.parse(localStorage.getItem('userInfo')).nick_name
          if (schoolname === '' || truename === '' || nickname === '') {
            this.maskText = '请完善自己的个人信息'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          }
        }
      },
      tip () {
        this.pullText = '正在刷新'
        this.noRefresh = true
      },
      pullRefresh () {
        this.hasMore = true
        this.pageIndex = 1
        this._getFriendslist()
      },
      moreFriendList () {
        if (!this.hasMore) {
          return
        }
        this.isLoad = true
        this.pageIndex++
        getFriendslist(this.pagesize, this.friends, this.news, this.pageIndex).then((res) => {
          if (res.data.status === ERR_OK) {
            this.friendList = this.friendList.concat(this._changefriendsList(res.data.info))
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
      changeContent () {
        getFriendslist(this.pagesize, this.friends, this.news).then((res) => {
          if (res.data.status === ERR_OK) {
            if (!res.data.info) {
              this.friendList = []
            } else {
              this.friendList = this._changefriendsList(res.data.info)
            }
          }
        })
      },
      _changeTimeType (param) {
        let time = param.substring(0, 19).replace('T', ' ')
        time = dateStr(time)
        return time
      },
      toggleTitle (str, e) {
        this.friends = str
        this._getFriendslist()
      },
      toggleTab (str, e) {
        this.news = str
        this._getFriendslist()
      },
      comment (id) {
        console.log(this.$refs.commentSub)
        this.$refs.commentSub.show()
        this.commentId = id.toString()
      },
      release () {
        if (this.stop === 1) {
          this.maskText = '已禁言'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
        } else {
          console.log(this.$refs.release)
          this.$refs.release.show()
        }
//      else if (this.isvip !== 1) {
//          this.maskText = '您不是VIP，无法发布消息'
//          this.$refs.dialogMask.show()
//          setTimeout(() => {
//            this.$refs.dialogMask.hide()
//          }, 2000)
//        }
      },
      previewImage (allpath, nowpath) {
        console.log(allpath, nowpath)
        scan().then((res) => {
          console.log(res)
          if (res.data.status === ERR_OK) {
            let data = res.data.info[0]
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: 'wx546e93e8f5190cba', // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.noncestr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名，见附录1
              jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            let arr = []
            allpath.forEach((item) => {
              arr.push('http://mytsg.wydztech.com' + item.original_path)
            })
            wx.ready(() => {
              wx.previewImage({
                current: 'http://mytsg.wydztech.com' + nowpath, // 当前显示图片的http链接
                urls: arr // 需要预览的图片http链接列表
              })
            })
          }
        }).catch(() => {
        })
      },
      _changefriendsList (list) {
        let ret = []
        list.forEach((content) => {
          if (content.id) {
            let item = new ContentClass({
              id: content.id,
              avatar: content.avatar,
              nickName: content.nick_name,
              createtime: content.createtime,
              remarks: content.remarks,
              isUpvote: content.is_upvote,
              upvoteNum: content.upvote_num,
              circleDetail: content.circle_detail,
              imgFile: content.albums
            })
            ret.push(item)
          }
        })
        return ret
      },
      _support (id, isSupport, e) {
        if (e.target.parentNode.className !== 'support') {
          support(id, 1).then((res) => {
            if (res.data.status === ERR_OK) {
              e.target.parentNode.className = e.target.parentNode.className + 'support'
              e.target.parentNode.querySelectorAll('span')[0].innerText = parseInt(e.target.parentNode.querySelectorAll('span')[0].innerText) + 1
            } else {
              this.maskText = '网络错误'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            }
          }).catch(() => {
            this.maskText = '网络错误'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          })
        } else {
          support(id, 0).then((res) => {
            if (res.data.status === ERR_OK) {
              e.target.parentNode.className = e.target.parentNode.className.replace('support', '')
              e.target.parentNode.querySelectorAll('span')[0].innerText = parseInt(e.target.parentNode.querySelectorAll('span')[0].innerText) - 1
            } else {
              this.maskText = '网络错误'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 2000)
            }
          }).catch(() => {
            this.maskText = '网络错误'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          })
        }
      },
      govip () {
        this.$router.push({
          path: `/mine/vip`
        })
      }
    },
    activated () {
      if (!this.userInfo) {
        this.$router.replace({
          path: `/login`
        })
      }
    },
    watch: {
      '$route': 'getpush'
    },
    components: {
      Scroll,
      Loading,
      CommentSub,
      Release,
      DialogMask,
      NoResult
    }
  }
</script>

<style scoped>

  @import '../../../common/css/iconfont.css';

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .friends {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .friends > .title {
    width: 100%;
    text-align: center;
    line-height: 42px;
    height: 42px;
    font-size: 18px;
    font-weight: 600;
    background: #00a9e4;
    color: #ffffff;
    position: relative;
    z-index: 51;
  }

  .friends > .title > .title-tab > .text {
    display: inline-block;
    line-height: 42px;
    height: 42px;
    padding: 0 5px 3px 5px;
    color: #a2d2e8;
    text-align: center;
    box-sizing: border-box;
  }

  .friends > .title > .title-tab > .active {
    color: #ffffff;
    text-align: center;
  }

  .friends > .title > .icon {
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 42px;
    font-size: 14px;
  }

  .friends > .title > .icon > .iconfont {
    font-size: 22px;
  }

  .friends > .tab {
    position: fixed;
    top: 42px;
    width: 100%;
    padding: 12px 0;
    font-size: 14px;
    display: flex;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    background: #ffffff;
    z-index: 51;
  }

  .friends > .tab > .tab-item {
    flex: 1;
    text-align: center;
    border-right: 1px solid rgba(1, 17, 27, 0.1);
  }

  .friends > .tab > .tab-item:last-child {
    border-right: 0;
  }

  .friends > .tab > .active {
    color: #00a9e4;
  }

  .friends > .tip {
    position: fixed;
    top: 81px;
    width: 100%;
    text-align: center;
  }

  .friends > .tip > .text {
    font-size: 12px;
    color: #fff;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    background: #00a9e4;
  }

  .friends > .content-wrapper {
    position: fixed;
    top: 35px;
    bottom: 50px;
    width: 100%;
  }

  .friends > .content-wrapper > .content-list {
    width: 100%;
    height: 100%;
  }
  .friends > .content-wrapper > .content-list > ul{
    min-height: 110%;
  }

  .friends > .content-wrapper > .content-list > .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  .friends > .content-wrapper > .content-list > ul > .item {
    display: flex;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    padding: 15px 0;
  }

  .friends > .content-wrapper > .content-list > ul > .item:last-child {
    border-bottom: 0;
    padding: 15px 0 40px 0;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-l {
    flex: 0 0 17%;
    box-sizing: border-box;
    text-align: center;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-l > img {
    width: 70%;
    max-height: 50px;
    border-radius: 50%;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r {
    flex: 1;
    padding: 0 12px 0 2px;
    box-sizing: border-box;
    width: 80%;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .name-time {
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: relative;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .name-time > .name {
    font-size: 16px;
    color: #00a9e4;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .name-time > .time {
    position: absolute;
    right: 0;
    font-size: 12px;
    color: #666;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .words {
    padding-bottom: 10px;
    line-height: 1.5;
    font-size: 14px;
    color: #333;
    word-wrap: break-word;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .pic > ul > li {
    position: relative;
    display: block;
    float: left;
    width: 30%;
    padding: 2px;
    box-sizing: border-box;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .pic > ul > li > .img {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    background-size: cover;
    background-position: center center;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .buttons {
    padding: 10px 5px 10px 0;
    display: flex;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .buttons > span {
    display: inline-block;
    flex: 1;
    color: #666;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .buttons > .support {
    color: red;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .buttons > span > .iconfont {
    font-size: 16px;
    padding: 5px;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .buttons > .comment {
    text-align: center;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .buttons > .share {
    text-align: right;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .comment-content > ul {
    padding: 5px;
    background: #f4f4f4;
    position: relative;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .comment-content > ul:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 48%;
    display: inline-block;
    border-bottom: 6px solid #f4f4f4;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .comment-content > ul > .comment-content-item {
    padding: 3px 0;
    font-size: 12px;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .comment-content > ul > .comment-content-item > span > .name {
    color: #1c739c;
  }

  .friends > .content-wrapper > .content-list > ul > .item > .item-r > .comment-content > ul > .comment-content-item > span {
    word-wrap: break-word;
  }

  .friends > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 40%;
    transform: translateY(-40%);
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
