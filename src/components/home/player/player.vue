<template>
  <transition name="move">
    <div class="player">
      <transition name="normal">
        <div class="normal-player">
          <div class="background-w">
          </div>
          <div class="background">
            <img width="100%" height="100%" v-lazy="videoDetail.img_url">
          </div>
          <div class="top">
            <div class="back" @click="back">
              <i class="iconfont icon-zuoyoujiantouicon100241"></i>
            </div>
            <h1 class="title">{{videoDetail.title}}</h1>
            <!--<span class="share">分享</span>-->
          </div>
          <div class="middle">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" ref="cd">
                  <img class="image" v-lazy="videoDetail.img_url">
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                </div>
                <span class="time time-r">{{format(currentALLTime)}}</span>
              </div>
              <div class="operators">
                <!--<div class="icon i-left">-->
                <!--<i class="iconfont icon-shangyishou"></i>-->
                <!--</div>-->
                <div class="icon i-center">
                  <i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
                </div>
                <!--<div class="icon i-right">-->
                <!--<i class="iconfont icon-xiayishou"></i>-->
                <!--</div>-->
                <!--<div class="icon i-right">-->
                <!--<i class="icon icon-not-favorite">收藏</i>-->
                <!--</div>-->
              </div>
            </div>
          </div>
          <div v-if="Number(videoDetail.isVip) === 1 && isvip !== 1" class="zhezhao">
            <p>对不起，您没有VIP借阅卡，无法听绘本</p>
            <p>点击此处<span @click="govip">绑定VIP借阅卡</span></p>
          </div>
          <scroll class="detail" ref="detail">
            <div class="content-wrapper">
              <div class="title">内容简介</div>
              <div ref="about" :class="develop === false ? 'about' : 'develop'"
                   v-html="videoDetail.content ? videoDetail.content : '暂无简介'">
              </div>
              <div class="changeDevelop" @click="changeDevelop()"
                   v-html="develop === false ? '【展开】' : '【收起】'">
              </div>
              <div class="other-book">
                <div class="title">其它绘本</div>
                <listenList ref="listenList" @player="player" @listensuccessRefresh="listensuccessRefresh"></listenList>
              </div>
            </div>
          </scroll>
        </div>
      </transition>
      <transition name="mini" v-if="showFlag">
        <div class="mini-player" @click="open">
          <div class="icon">
            <img class="cdCls" width="40" height="40">
          </div>
          <div class="text">
            <h2 class="name">爱插嘴的小鸡</h2>
          </div>
          <div class="control">
            <progress-circle :radius="radius">
              <i class="icon-mini"></i>
            </progress-circle>
          </div>
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </transition>
      <audio ref="audio" preload="auto" @timeupdate="updateTime"
             @ended="end" :src="'http://mytsg.wydztech.com' + videoPath">
      </audio>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Scroll from 'base/scroll/scroll'
  import { getHomeDetail, addPlayNum, addPlayLine } from 'api/home'
  import { ERR_OK } from 'api/config'
  import ListenList from 'components/home/listenList/listenList'
  import DialogMask from 'base/dialog-mask/dialog-mask'

  export default {
    data () {
      return {
        songReady: false,
        currentTime: 0,
        currentALLTime: 0,
        radius: 32,
        currentLineNum: 0,
        currentShow: 'cd',
        showFlag: false,
        develop: false,
        videoDetail: {},
        playing: false,
        videoPath: '',
        isOk: false,
        maskText: '',
        isvip: ''
      }
    },
    created () {
      this._getListenDetail()
    },
    mounted () {
      this.reLoad()
    },
    computed: {
//      cdCls () {
//        return this.playing ? 'play' : 'play pause'
//      },
      playIcon () {
        return this.playing ? 'icon-zanting' : 'icon-bofang'
      },
      percent () {
        return this.currentTime / this.currentALLTime
      }
    },
    methods: {
      reLoad () {
        let audio = this.$refs.audio
        audio.load()
      },
      govip () {
        this.$router.push({
          path: `/mine/vip`
        })
      },
      togglePlaying () {
        this.playing = !this.playing
        let audio = this.$refs.audio
//        console.log('wangluo', audio.networkState)
//        console.log('buffered', audio.buffered)
//        console.log('readyState', audio.readyState)
//        console.log('seeking', audio.seeking)
//        audio.src = 'http://mytsg.wydztech.com' + this.videoPath
        if (audio.readyState === 4) {
          this.playing ? audio.play() : audio.pause()
        } else {
          this.maskText = '网路不佳，请稍等...'
          this.$refs.dialogMask.show()
          this.playing ? audio.play() : audio.pause()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
        }
      },
      _getListenDetail () {
        if (localStorage.hasOwnProperty('userInfo')) {
          this.isvip = Number(JSON.parse(localStorage.getItem('userInfo')).isVip)
          getHomeDetail(this.$route.params.listenId).then((res) => {
            if (res.data.status === ERR_OK) {
              this.videoDetail = {}
              this.videoDetail = res.data.info
              this.videoPath = this.videoDetail.attach[0].file_path
              let durations = this.videoDetail.attach[0].duration.split(':')
              let durationStr = parseInt(durations[0]) * 60 * 60 + parseInt(durations[1]) * 60 + parseInt(durations[2])
              this.currentALLTime = durationStr
              this.$refs.audio.currentTime = this.videoDetail.play_position
              this.$refs.listenList._getListenList(this.videoDetail.type_id, this.videoDetail.category_id)
              this.$nextTick(() => {
                this.$refs.detail.refresh()
              })
            }
          })
        } else {
          this.$router.replace({
            path: `/login`
          })
        }
      },
      listensuccessRefresh () {
        this.isOk = !this.isOk
      },
      player (item) {
        addPlayNum(item.id).then((res) => {
          if (res.data.status === ERR_OK) {
          }
        })
        this.$router.push({
          name: 'listenDetail',
          params: {listenId: item.id}
        })
      },
      changeDevelop () {
        this.develop = !this.develop
      },
      back () {
        this.$router.back()
      },
      end () {
        this.$refs.audio.play()
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      format (interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      onProgressBarChange (percent) {
        const currentTime = this.currentALLTime * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    destroyed () {
      if (Math.floor(this.currentTime) > 0) {
        addPlayLine(this.videoDetail.id, Math.floor(this.currentTime)).then((res) => {
          if (res.data.status === ERR_OK) {
          }
        })
      }
    },
    watch: {
      develop () {
        this.$nextTick(() => {
          this.$refs.detail.refresh()
        })
      },
      isOk () {
        this.$nextTick(() => {
          this.$refs.detail.refresh()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      ListenList,
      DialogMask
    }
  }
</script>

<style>
  @import '../../../common/css/iconfont.css';

  .player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #ffffff;
  }

  .player .normal-player > .background {
    position: absolute;
    left: 0;
    top: 42px;
    width: 100%;
    height: 210px;
    z-index: 52;
    opacity: 0.6;
    filter: blur(20px);
  }

  .player .normal-player > .background-w {
    position: absolute;
    left: 0;
    top: 42px;
    width: 100%;
    height: 210px;
    z-index: 51;
    background: #ffffff;
    box-shadow: 0px 2px 2px rgba(180, 180, 180, 0.5);
  }

  .player .normal-player > .top {
    position: relative;
    background: #00a9e4;
    z-index: 60;
  }

  .player .normal-player > .top > .back {
    position: absolute;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    color: #fff;
    z-index: 50;
    width: 50px;
    text-align: center;
  }

  .player .normal-player > .top > .title {
    width: 70%;
    margin: 0 auto;
    line-height: 42px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    color: #fff;
  }

  .player .normal-player > .top > .share {
    display: inline-block;
    position: absolute;
    height: 42px;
    line-height: 42px;
    right: 15px;
    font-size: 14px;
    color: #fff;
    z-index: 50;
    top: 0;
  }

  .player .normal-player > .middle {
    position: fixed;
    width: 100%;
    top: 42px;
    height: 210px;
    white-space: nowrap;
    font-size: 0;
    z-index: 60;
  }

  .player .normal-player > .zhezhao {
    width: 100%;
    height: 210px;
    background: rgba(0,0,0,0.3);
    position: absolute;
    top: 42px;
    left: 0;
    color: #fff;
    z-index: 71;
    text-align: center;
    line-height: 50px;
    padding: 12px;
    box-sizing: border-box;
  }
  .player .normal-player > .zhezhao > p{
    height: 50px;
  }
  .player .normal-player > .zhezhao span{
    color: #00a9e4;
  }

  .player .normal-player > .middle > .middle-l {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    margin-top: 10px;
    border: 5px solid #00a9e4;
    border-radius: 50%;
  }

  .player .normal-player > .middle > .middle-l > .cd-wrapper {
    width: 100%;
    height: 100%;
  }

  .play {
    animation: rotate 20s linear infinite;
  }

  .pause {
    animation-play-state: paused;
  }

  .player .normal-player > .middle > .middle-l > .cd-wrapper > .cd {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 50%;
  }

  /*.player .normal-player > .middle > .middle-l > .cd-wrapper > .play {*/
  /*animation: rotate 20s linear infinite;*/
  /*-webkit-animation: rotate 20s linear infinite;*/
  /*}*/

  /*.player .normal-player > .middle > .middle-l > .cd-wrapper > .pause {*/
  /*animation-play-state: paused;*/
  /*-webkit-animation-play-state: paused;*/
  /*}*/

  .player .normal-player > .middle > .middle-l > .cd-wrapper > .cd > .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .player .normal-player > .middle > .bottom {
  }

  .player .normal-player > .middle > .bottom > .dot-wrapper {
    text-align: center;
    font-size: 0;
  }

  .player .normal-player > .middle > .bottom > .dot-wrapper > .dot {
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }

  .player .normal-player > .middle > .bottom > .dot-wrapper > .active {
    width: 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
  }

  .player .normal-player > .middle > .bottom > .progress-wrapper {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0px auto;
    padding: 10px 0;
    padding-bottom: 0;
  }

  .player .normal-player > .middle > .bottom > .progress-wrapper > .time {
    color: #000000;
    font-size: 12px;
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
  }

  .player .normal-player > .middle > .bottom > .progress-wrapper > .time-l {
    text-align: left;
  }

  .player .normal-player > .middle > .bottom > .progress-wrapper > .time-r {
    text-align: right;
  }

  .player .normal-player > .middle > .bottom > .progress-wrapper > .progress-bar-wrapper {
    flex: 1
  }

  .player .normal-player > .middle > .bottom .operators {
    display: flex;
    align-items: center;
  }

  .player .normal-player > .middle > .bottom .operators > .icon {
    flex: 1;
    color: #00a9e4;
  }

  .player .normal-player > .middle > .bottom .operators > .disable {
    color: rgba(255, 205, 49, 0.5);
  }

  .player .normal-player > .middle > .bottom .operators > .icon > i {
    font-size: 20px;
  }

  .player .normal-player > .middle > .bottom .operators > .icon > .icon-bofang {
    font-size: 28px;
  }

  .player .normal-player > .middle > .bottom .operators > .icon > .icon-zanting {
    font-size: 28px;
  }

  .player .normal-player > .middle > .bottom .operators > .i-left {
    text-align: right;
  }

  .player .normal-player > .middle > .bottom .operators > .i-center {
    text-align: center;
  }

  .player .normal-player > .middle > .bottom .operators > .i-right {
    text-align: left;
  }

  .player .normal-player > .middle > .bottom .operators > .icon-favorite {
    color: #d93f30;
  }

  .normal-enter-active, .normal-leave-active {
    transition: all 0.4s
  }

  .normal-enter-active > .top, .normal-enter-active > .middle > .bottom, .normal-leave-active > .top, .normal-leave-active > .middle > .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  }

  .normal-enter, .normal-leave-to {
    opacity: 0
  }

  .normal-enter > .top, .normal-leave-to > .top {
    transform: translate3d(0, -100px, 0)
  }

  .normal-enter > .middle > .bottom, .normal-leave-to > .middle > .bottom {
    transform: translate3d(0, 100px, 0)
  }

  .player .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 50px;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
  }

  .mini-enter-active, .mini-leave-active {
    transition: all 0.4s
  }

  .mini-enter, .mini-leave-to {
    opacity: 0
  }

  .player .mini-player > .icon {
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
  }

  .player .mini-player > .icon > img {
    border-radius: 50%
  }

  .player .mini-player > .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }

  .player .mini-player > .text > .name {
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #fff;
  }

  .player .mini-player > .text > .desc {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
  }

  .player .mini-player > .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
  }

  .player .mini-player > .control > .icon-play-mini, .player > .mini-player > .control > .icon-pause-mini, .player > .mini-player > .control > .icon-playlist {
    font-size: 30px;
    color: rgba(255, 205, 49, 0.5);
  }

  .player .mini-player > .control > .icon-mini {
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .player .normal-player > .detail {
    position: fixed;
    bottom: 50px;
    top: 252px;
    width: 100%;
  }

  .player .normal-player > .detail > .content-wrapper > .title {
    padding: 12px;
    background: #f4f4f4;
    color: #666666;
    font-size: 14px;
  }

  .player .normal-player > .detail > .content-wrapper > .about {
    padding: 0 16px;
    margin: 12px 0 5px 0;
    line-height: 2;
    text-indent: 20px;
    color: #333333;
    overflow: hidden;
    height: 60px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .player .normal-player > .detail > .content-wrapper > .develop {
    padding: 0 16px;
    margin: 12px 0 5px 0;
    line-height: 2;
    text-indent: 20px;
    color: #333333;
  }

  .player .normal-player > .detail > .content-wrapper > .other-book > .title {
    padding: 12px;
    background: #f4f4f4;
    color: #666666;
    font-size: 14px;
  }

  .player .normal-player > .detail > .content-wrapper > .changeDevelop {
    margin-bottom: 12px;
    font-size: 12px;
    text-align: center;
    color: #00a9e4;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  @-webkit-keyframes rotate {
    from {
      -webkit-transform: rotate(0deg)
    }
    to {
      -webkit-transform: rotate(360deg)
    }
  }

</style>
