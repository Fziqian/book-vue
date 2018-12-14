<!--
  User: fanqingyu
  Date: 2017/6/7 11:09
  功能：
-->

<template>
  <transition name="move">
    <div class="readDetail">
      <div class="title">
        <span @click="back()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">{{videoDetail.title}}</span>
        <!--<span class="share">分享</span>-->
      </div>
      <div class="video-wrapper" ref="videoWrapper" v-show="videoDetail">
        <video width="100%" controls="controls" preload="none" @timeupdate="updateTime" ref="video"
               v-for="item in videoDetail.attach" :poster="videoDetail.img_url">
          <source :src="'http://mytsg.wydztech.com' + item.file_path" type="video/mp4"></source>
        </video>
        <div v-if="Number(videoDetail.isVip) === 1 && isvip !== 1" class="zhezhao">
          <p>对不起，您没有VIP借阅卡，无法观看绘本</p>
          <p>点击此处<span @click="govip">绑定VIP借阅卡</span></p>
        </div>
      </div>
      <scroll class="detail" ref="detail">
        <div class="desc" ref="desc">
          <div class="title">内容简介</div>
          <div ref="about" :class="develop === false ? 'about' : 'develop'"
               v-html="videoDetail.content ? videoDetail.content : '暂无简介'">
          </div>
          <div class="changeDevelop" @click="changeDevelop" v-html="develop === false ? '【展开】' : '【收起】'"></div>
          <div class="other-book">
            <div class="title">其它绘本</div>
            <homelist ref="homelist" @readSelectItem="readSelectItem" @readsuccessRefresh="readsuccessRefresh"></homelist>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { getHomeDetail, addPlayLine, addPlayNum } from 'api/home'
  import { ERR_OK } from 'api/config'
  import Homelist from 'components/home/homelist/homelist'
  export default {
    data () {
      return {
        develop: false,
        scrollTop: 0,
        videoDetail: {},
        currentTime: 0,
        videoPath: '',
        isOk: false,
        isvip: ''
      }
    },
    created () {
      this._getDetail()
    },
    mounted () {
    },
    methods: {
      back () {
        this.$router.back()
      },
      _getDetail () {
        if (localStorage.hasOwnProperty('userInfo')) {
          this.isvip = Number(JSON.parse(localStorage.getItem('userInfo')).isVip)
          getHomeDetail(this.$route.params.readId).then((res) => {
            console.log(res)
            if (res.data.status === ERR_OK) {
              this.videoDetail = {}
              this.videoDetail = res.data.info
              this.$refs.homelist._getHomelist(this.videoDetail.type_id, this.videoDetail.category_id)
              setTimeout(() => {
                this.$refs.videoWrapper.children[0].currentTime = this.videoDetail.play_position
                let offsetHeight = window.innerWidth * 0.56 + 45
                this.$refs.videoWrapper.style.maxHeight = window.innerWidth * 0.56 + 'px'
                this.$refs.videoWrapper.children[0].style.minHeight = window.innerWidth * 0.56 + 'px'
                this.$refs.videoWrapper.children[0].style.maxHeight = window.innerWidth * 0.56 + 'px'
                this.$refs.detail.$el.style.top = `${offsetHeight}px`
                this.$refs.detail.refresh()
              }, 100)
            }
          })
        } else {
          this.$router.replace({
            path: `/login`
          })
        }
      },
      readsuccessRefresh () {
        this.isOk = !this.isOk
      },
      changeDevelop () {
        this.develop = !this.develop
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      readSelectItem (item) {
        addPlayNum(item.id).then((res) => {
        })
        this.$router.push({
          name: 'readDetail',
          params: {readId: item.id}
        })
      },
      govip () {
        this.$router.push({
          path: `/mine/vip`
        })
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
//      '$route': {
//        handler (newValue, oldValue) {
//          this._getDetail()
//        },
//        deep: true
//      }
    },
    components: {
      Scroll,
      Homelist
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

  .readDetail {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 60;
    top: 0;
    left: 0;
  }

  .readDetail > .title {
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

  .readDetail > .video-wrapper {
    width: 100%;
    position: fixed;
    background: #ffffff;
    top: 42px;
    z-index: 70;
    -webkit-box-shadow: 0px 3px 3px rgba(180, 180, 180, 0.5);
    box-shadow: 0px 3px 3px rgba(180, 180, 180, 0.5);
  }

  .readDetail > .video-wrapper > .zhezhao {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    z-index: 71;
    text-align: center;
    line-height: 50px;
    padding: 12px;
    box-sizing: border-box;
  }
  .readDetail > .video-wrapper > .zhezhao p{
    height: 50px;
  }
  .readDetail > .video-wrapper > .zhezhao span{
    color: #00a9e4;
  }

  .readDetail > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .readDetail > .title > .share {
    position: absolute;
    right: 15px;
    top: 0;
    display: block;
    height: 42px;
    line-height: 42px;
    color: #ffffff;
    font-size: 12px;
  }

  .readDetail > .detail {
    width: 100%;
    position: fixed;
    bottom: 50px;
  }

  .readDetail > .detail > .desc > .title {
    padding: 12px;
    background: #f4f4f4;
    color: #666666;
    font-size: 14px;
  }

  .readDetail > .detail > .desc > .about {
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

  .readDetail > .detail > .desc > .develop {
    padding: 0 16px;
    margin: 12px 0 5px 0;
    line-height: 2;
    text-indent: 20px;
    color: #333333;
  }

  .readDetail > .detail > .desc > .other-book > .title {
    padding: 12px;
    background: #f4f4f4;
    color: #666666;
    font-size: 14px;
  }

  .readDetail > .detail > .desc > .changeDevelop {
    margin-bottom: 12px;
    font-size: 12px;
    text-align: center;
    color: #00a9e4;
  }

  video {
    /*background: transparent url('http://mytsg.wydztech.com/upload/201708/02/thumb_201708021007432848.png') no-repeat 0 0;*/
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
</style>
