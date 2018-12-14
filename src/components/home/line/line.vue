<!--
  User: fanqingyu
  Date: 2017/6/7 11:07
  功能：
-->

<template>
  <transition name="move">
    <div class="line">
      <div class="title">
        <span @click="back()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">轨迹</span>
      </div>
      <div class="content-wrapper" v-if="line.length">
        <scroll class="content">
          <ul>
            <li class="item" v-for="item in line" @click="selectItem(item)">
              <div class="item-left">{{item.uptime}}</div>
              <div class="item-right">
                <span class="circle">
                  <img src="./line.png" alt="">
                </span>
                <span class="img">
                  <img v-lazy="item.avatar" alt="">
                </span>
                <span class="desc">
                  <span class="name">{{item.name}}</span>
                  <span class="playtime" v-html="'播放至' + getPlayTime(item.duration) + '秒'"></span>
                </span>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-if="!line.length">
        <div class="no-result">
          <div class="no-result-icon"></div>
          <p class="no-result-text">您还没有观看任何视频 / 音频哦!</p>
          <span class="nowGo" @click="gohome">现在就去围观</span>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { getPlayLine, addPlayNum } from 'api/home'
  import { ERR_OK } from 'api/config'
  import LineClass from 'common/js/lineClass'

  const READ = 1
  const LISTEN = 2
  export default {
    data () {
      return {
        line: []
      }
    },
    created () {
      this._getPlayLine()
    },
    methods: {
      back () {
        this.$router.back()
      },
      selectItem (item) {
        addPlayNum(item.id).then((res) => {
        })
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
      },
      _getPlayLine () {
        getPlayLine(20).then((res) => {
          if (res.data.status === ERR_OK) {
            this.line = this._changelineList(res.data.info)
          }
        })
      },
      _changelineList (list) {
        let ret = []
        list.forEach((content) => {
          if (content.id) {
            let item = new LineClass({
              id: content.article_id,
              avatar: content.img_url,
              name: content.title,
              uptime: this._changeUptime(content.updatetime),
              duration: content.play_position,
              typeId: content.type_id
            })
            ret.push(item)
          }
        })
        return ret
      },
      _changeUptime (e) {
        let time = e.substring(0, 19).replace('T', ' ')
        return time
      },
      getPlayTime (time) {
        const min = time / 60 | 0
        const sec = this._pad(time % 60)
        return `${min}:${sec}`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      gohome () {
        this.$router.push({name: 'home'})
      }
    },
    components: {
      Scroll
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

  .line {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0;
  }

  .line > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: relative;
    z-index: 60;
  }

  .line > .title > .back {
    position: absolute;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .line > .content-wrapper {
    position: fixed;
    top: 42px;
    bottom: 50px;
    width: 100%;
  }

  .line > .content-wrapper > .content {
    height: 100%;
    width: 100%;
  }

  .line > .content-wrapper > .content > ul > li {
    display: flex;
  }

  .line > .content-wrapper > .content > ul > li > .item-left {
    flex: 0 0 100px;
    text-align: center;
    height: 80px;
    line-height: 1.5;
    color: #00a9e4;
    margin-top: 20px;
    font-size: 14px;
  }

  .line > .content-wrapper > .content > ul > li > .item-right {
    flex: 1;
    padding: 10px 20px;
    border-left: 1px solid #cccccc;
    position: relative;
    font-size: 0;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .circle {
    display: inline-block;
    width: 14px;
    height: 14px;
    position: absolute;
    left: -8px;
    top: 31px;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .circle > img {
    width: 100%;
    height: 100%;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .img {
    display: inline-block;
    width: 80px;
    height: 60px;
    margin-right: 10px;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .img > img {
    width: 100%;
    height: 100%;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .desc {
    display: inline-block;
    height: 55px;
    font-size: 16px;
    vertical-align: top;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .desc > span {
    display: block;
    margin-top: 10px;
    font-size: 14px;
  }

  .line > .content-wrapper > .content > ul > li > .item-right > .desc > .playtime {
    font-size: 12px;
    color: #999999;
  }

  .line > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 25%;
    transform: translateY(-25%);
  }

  .line > .no-result-wrapper > .no-result {
    text-align: center
  }

  .line > .no-result-wrapper > .no-result > .no-result-icon > img {
    width: 105px;
  }

  .line > .no-result-wrapper > .no-result > .no-result-text {
    margin-top: 14px;
    margin-bottom: 100px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
  }

  .line > .no-result-wrapper > .no-result > .nowGo {
    width: 200px;
    height: 42px;
    line-height: 42px;
    font-size: 16px;
    color: #ffffff;
    background: #00a9e4;
    display: block;
    margin: 0 auto;
    border-radius: 21px;
  }
</style>
