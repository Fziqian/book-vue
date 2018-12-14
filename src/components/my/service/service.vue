<!--
  User: fanqingyu
  Date: 2017/7/6 10:23
  功能：
-->

<template>
  <transition name="move">
    <div class="service">
      <div class="title">
        <span class="back" @click="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">业务管理</span>
      </div>
      <div class="desc">
        <div class="item">
          <span class="text">下属{{statePeopleMg}}</span>
          <span :class="childCount.childcount > 0 ? 'num': 'defnum'">{{childCount.childcount}}</span>
        </div>
        <div class="item">
          <span class="text">办卡总量</span>
          <span :class="childCount.vipcount > 0 ? 'num': 'defnum'">{{childCount.vipcount}}</span>
        </div>
      </div>
      <split></split>
      <div ref="scroll" class="scroll">
        <div class="kinderList">
          <ul>
            <li class="item" v-for="item in peoples">
              <div class="avatar">
                <img :src="item.avatar" width="100%" height="100%" alt="">
              </div>
              <div class="text">
                <span class="nametext">{{item.truename}}</span>
                <span class="mobiletext">{{item.mobile}}</span>
                <span class="numtext">{{item.shop_name}}</span>
              </div>
              <div class="singleNum">{{item.vipcount}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Split from 'base/split/split'
  import BScroll from 'better-scroll'
  import { ERR_OK } from 'api/config'
  import { getPeopleMg, getChildCount } from 'api/user'
  import { mapGetters } from 'vuex'

  const PAGESIZE = 1000
  export default {
    props: {},
    data () {
      return {
        peoples: [],
        childCount: []
      }
    },
    created () {
      this._getChildCount()
      this._getPeopleList()
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {click: true})
      })
    },
    computed: {
      ...mapGetters([
        'statePeopleMg'
      ])
    },
    methods: {
      back () {
        this.$router.back()
      },
      _getPeopleList () {
        getPeopleMg(PAGESIZE).then((res) => {
          if (res.data.status === ERR_OK) {
            this.peoples = res.data.info
          }
        })
      },
      _getChildCount () {
        getChildCount().then((res) => {
          if (res.data.status === ERR_OK) {
            this.childCount = res.data.info[0]
          }
        })
      }
    },
    components: {
      Split
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

  .service {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
  }

  .service > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
  }

  .service > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .service > .scroll {
    width: 100%;
    position: absolute;
    top: 148px;
    bottom: 50px;
    overflow: hidden;
  }

  .service > .desc {
    display: flex;
    width: 100%;
  }

  .service > .desc > .item {
    flex: 1;
    margin: 20px 0;
    border-right: 1px solid rgba(1, 17, 27, 0.1);
    text-align: center;
  }

  .service > .desc > .item:last-child {
    border-right: 0;
  }

  .service > .desc > .item span {
    display: block;
  }

  .service > .desc > .item .defnum {
    color: #888888;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .service > .desc > .item .num {
    color: #00a9e4;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .service > .desc > .item .text {
    color: #888888;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .service > .scroll > .kinderList {
    padding: 0 12px;
  }

  .service > .scroll > .kinderList > ul li {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .service > .scroll > .kinderList > ul li > .avatar {
    width: 55px;
    height: 55px;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    background: #a2d2e8;
  }

  .service > .scroll > .kinderList > ul li > .avatar img {
    border-radius: 50%;
  }

  .service > .scroll > .kinderList > ul li > .text {
    flex: 1;
    margin-left: 10px;
  }

  /*.service > .scroll > .kinderList > ul li > .text span {*/
    /*display: block;*/
  /*}*/

  .service > .scroll > .kinderList > ul li > .text .nametext {
    font-size: 16px;
    margin-bottom: 10px;
    margin-top: 10px;
    color: #333333;
    display: inline-block;
  }

  .service > .scroll > .kinderList > ul li > .text .mobiletext {
    font-size: 16px;
    margin-bottom: 10px;
    margin-top: 10px;
    color: #333333;
    display: inline-block;
  }

  .service > .scroll > .kinderList > ul li > .text .numtext {
    font-size: 12px;
    color: #b4b4b4;
    display: block;
  }

  .service > .scroll > .kinderList > ul li > .singleNum {
    flex: 0 0 50px;
    font-size: 36px;
    color: #00a9e4;
    text-align: center;
    height: 55px;
    line-height: 55px;
  }


</style>

