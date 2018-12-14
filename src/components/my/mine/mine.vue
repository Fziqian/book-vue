<template>

  <div class="mine">
    <div class="title">我的</div>
    <scroll class="mineScroll"
            ref="scroll"
            :pullup="pullup"
            @scrollToTop="pullRefresh"
            @scrollToRefresh="tip"
    >
      <div>
        <li v-show="flagPull">
          <div class="refresh-container">
            <loading :title="pullText"></loading>
          </div>
        </li>
        <div class="desc" @click="myInfo()">
          <div class="avatar">
            <img v-if="!nativeUserInfo.id" src="./logoDefault.png" width="100%" height="100%" alt="">
            <img v-if="nativeUserInfo.id" :src="nativeUserInfo.avatar" width="100%" height="100%" alt="">
          </div>
          <div class="content">
            <div class="name">
              <span class="text" v-html="nativeUserInfo.id ? nativeUserInfo.truename : name"></span>
              <span class="lable" v-if="nativeUserInfo.id">{{nativeUserInfo.group_name}}</span>
            </div>
            <div class="card">
              <span class="text" v-html="nativeUserInfo.jsk ? ('实体卡ID：' + nativeUserInfo.jsk.cardno) : poster"></span>
            </div>
          </div>
          <div class="arrow">
            <i class="iconfont icon-zuoyoujiantouicon10024"></i>
          </div>
        </div>
        <div class="desc-mid">
          <!--<div class="item">-->
          <!--<span :class="money > 0 ? 'num': 'defnum'">{{money}}</span>-->
          <!--<span class="text">钱包</span>-->
          <!--</div>-->
          <div class="item" @click="goCollection">
            <!--<span :class="collection > 0 ? 'num': 'defnum'" v-text="_nativeUser().collection_num ? _nativeUser().collection_num : 0"></span>-->
            <span class="text">收藏</span>
          </div>
          <div class="item" @click="goBorrowStand">
            <!--<span :class="borrow > 0 ? 'num': 'defnum'" v-text="_nativeUser().cart_num ? _nativeUser().cart_num : 0"></span>-->
            <span class="text">借书架</span>
          </div>
        </div>
        <split></split>
        <div class="list">
          <ul>
            <li class="item" @click="booksMg()">
            <span class="icon">
              <img src="./icon_bookAdmin.png" alt="">
            </span>
              <span class="text">图书管理</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
            <li class="item" @click="peopleMg()" v-if="nativeUserInfo.id && nativeUserInfo.userType != '1'">
              <span class="icon">
                <img src="./peopleMg.png" alt="">
              </span>
                <span class="text">人员管理</span>
                <span class="arrow">
                <i class="iconfont icon-zuoyoujiantouicon10024"></i>
              </span>
            </li>
            <li class="item" @click="order()">
            <span class="icon">
              <img src="./icon_myOrder.png" alt="">
            </span>
              <span class="text">我的订单</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
            <li class="item" @click="vip()">
            <span class="icon">
              <img src="./icon_card.png" alt="">
            </span>
              <span class="text">VIP借阅卡</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
            <li class="item" @click="service()" v-if="nativeUserInfo.id && nativeUserInfo.userType != '1'">
            <span class="icon">
              <img src="./service.png" alt="">
            </span>
              <span class="text">业务管理</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
          </ul>
          <split></split>
          <ul>
            <li class="item" @click="feedback()">
            <span class="icon">
              <img src="./icon_feedback.png" alt="">
            </span>
              <span class="text">意见反馈</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
            <li class="item" @click="problem()">
            <span class="icon">
              <img src="./icon_question.png" alt="">
            </span>
              <span class="text">常见问题</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
            <li class="item" @click="about()">
            <span class="icon">
              <img src="./icon_us.png" alt="">
            </span>
              <span class="text">关于我们</span>
              <span class="arrow">
              <i class="iconfont icon-zuoyoujiantouicon10024"></i>
            </span>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import Split from 'base/split/split'
  import Scroll from 'base/scroll/scroll'
  import { mapMutations, mapGetters } from 'vuex'
  import { getUserInfo } from 'api/user'
  import { ERR_OK } from 'api/config'
  import Loading from 'base/loading/loading'
  export default {
    props: {},
    data () {
      return {
        name: '登录 / 注册',
        poster: '你的学习从这里开始',
        money: 0,
        collection: 0,
        borrow: 0,
        pullup: true,
        pullText: '下拉刷新',
        flagPull: true,
        nativeUserInfo: {}
      }
    },
    created () {
      this.$nextTick(() => {
        this._nativeUser()
        this.$refs.scroll.refresh()
      })
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'nativeAvatar',
        'nativeName'
      ])
    },
    methods: {
      tip () {
        this.pullText = '正在刷新'
      },
      pullRefresh () {
        if (localStorage.hasOwnProperty('userInfo')) {
          getUserInfo().then((res) => {
            if (res.data.status === ERR_OK) {
              this.pullText = '下拉刷新'
              localStorage.removeItem('userInfo')
              localStorage.setItem('userInfo', JSON.stringify(res.data.info[0]))
              this.setUser(res.data.info[0])
              this.nativeUserInfo = JSON.parse(localStorage.getItem('userInfo'))
            }
          })
        }
      },
      _nativeUser () {
        if (localStorage.hasOwnProperty('userInfo')) {
          this.nativeUserInfo = JSON.parse(localStorage.getItem('userInfo'))
          if (this.nativeUserInfo.userType === '2') {
            this.setPeopleMg('学生')
          } else if (this.nativeUserInfo.userType === '3') {
            this.setPeopleMg('老师')
          } else if (this.nativeUserInfo.userType === '4') {
            this.setPeopleMg('园长')
          }
        } else {
          this.nativeUserInfo = {}
        }
      },
      myInfo () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/myInfo`
          })
        }
      },
      goCollection () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/myCollection`
          })
        }
      },
      goBorrowStand () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/borrowStand`
          })
        }
      },
      booksMg () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/booksMg`
          })
        }
      },
      peopleMg () {
        this.$router.push({
          path: `/mine/peopleMg`
        })
      },
      order () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/order`
          })
        }
      },
      vip () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/vip`
          })
        }
      },
      service () {
        this.$router.push({
          path: `/mine/service`
        })
      },
      feedback () {
        if (!this.nativeUserInfo.id) {
          this._Login()
        } else {
          this.$router.push({
            path: `/mine/feedback`
          })
        }
      },
      problem () {
        this.$router.push({
          path: `/mine/problem`
        })
      },
      about () {
        this.$router.push({
          path: `/mine/about`
        })
      },
      _Login () {
        this.$router.push({
          path: `/login`
        })
      },
      ...mapMutations({
        setUser: 'SET_USER_INFO',
        setPeopleMg: 'SET_PEOPLE_MG'
      })
    },
    activated () {
      this._nativeUser()
      this.$refs.scroll.refresh()
    },
    watch: {
      nativeAvatar: {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            let userinfo = JSON.parse(localStorage.getItem('userInfo'))
            userinfo.avatar = this.nativeAvatar
            localStorage.removeItem('userInfo')
            localStorage.setItem('userInfo', JSON.stringify(userinfo))
          }
        },
        deep: true
      },
      nativeName: {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            let userinfo = JSON.parse(localStorage.getItem('userInfo'))
            userinfo.truename = this.nativeName
            localStorage.removeItem('userInfo')
            localStorage.setItem('userInfo', JSON.stringify(userinfo))
          }
        },
        deep: true
      },
      userInfo: {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            this._nativeUser()
          }
        },
        deep: true
      }
    },
    components: {
      Split,
      Scroll,
      Loading
    }
  }
</script>

<style scoped>
  @import '../../../common/css/iconfont.css';

  .mineScroll {
    position: fixed;
    top: -3px;
    bottom: 50px;
    width: 100%;
  }

  .mineScroll > div {
    min-height: 110%;
  }

  .mine {
    top: 0;
    left: 0;
    bottom: 50px;
    width: 100%;
    background: #fff;
  }

  .mine > .title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    z-index: 50;
  }

  .mine .desc {
    position: relative;
    padding: 12px;
    font-size: 0;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .mine .desc > .avatar {
    position: relative;
    width: 64px;
    height: 64px;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    padding: 3px;
    background: #a2d2e8;
    box-sizing: border-box;
  }

  .mine .desc > .avatar img {
    border-radius: 50%;
  }

  .mine .desc > .content {
    display: inline-block;
    margin-left: 8px;
  }

  .mine .desc > .content > .name {
    margin: 12px 0 10px 0;
    font-size: 0;
  }

  .mine .desc > .content > .name .text {
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
  }

  .mine .desc > .content > .name .lable {
    display: inline-block;
    font-size: 12px;
    padding: 2px;
    background: #00a9e4;
    color: #ffffff;
    vertical-align: top;
  }

  .mine .desc > .content > .card {
    font-size: 0;
  }

  .mine .desc > .content > .card .text {
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
    color: #888888;
  }

  .mine .desc > .arrow {
    display: inline-block;
    position: absolute;
    right: 12px;
    padding: 26px 0;
  }

  .mine .desc > .arrow .iconfont {
    font-size: 12px;
  }

  .mine .desc-mid {
    display: flex;
    width: 100%;
    padding: 10px 0;
  }

  .mine .desc-mid > .item {
    flex: 1;
    margin: 10px 0;
    border-right: 1px solid rgba(1, 17, 27, 0.1);
    text-align: center;
  }

  .mine .desc-mid > .item:last-child {
    border-right: 0;
  }

  .mine .desc-mid > .item span {
    display: block;
  }

  .mine .desc-mid > .item .defnum {
    color: #888888;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .mine .desc-mid > .item .num {
    color: #00a9e4;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .mine .desc-mid > .item .text {
    color: #888888;
    font-size: 14px;
  }

  .mine .list > ul {
    padding: 0 12px 12px;
  }

  .mine .list > ul li {
    position: relative;
    font-size: 0;
    padding: 10px 0;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .mine .list > ul:first-child > li:last-child {
    border-bottom: 0;
  }

  .mine .list > ul li .icon, .mine > .scroll > .list > ul li .text, .mine > .list > ul li .arrow {
    display: inline-block;
  }

  .mine .list > ul li img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .mine .list > ul li .text {
    line-height: 20px;
    vertical-align: top;
    font-size: 14px;
    color: #333333;
  }

  .mine .list > ul li .arrow {
    display: inline-block;
    position: absolute;
    right: 0px;
    padding: 4px 0;
  }

  .mine .list > ul li .arrow .iconfont {
    font-size: 12px;
  }

</style>
