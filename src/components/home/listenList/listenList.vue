<!--
  User: fanqingyu
  Date: 2017/8/9 0009 2:04
  功能：
-->
<template>
  <scroll class="listenList"
          :data="listenList"
          ref="scroll"
          :pullup="pullup"
          @scrollToTop="pullRefresh"
          @scrollToRefresh="tip"
          @scrollToEnd="moreList"
  >
    <ul class="ul" v-show="listenList.length">
      <li v-show="flagPull">
        <div class="refresh-container">
          <loading :title="pullText"></loading>
        </div>
      </li>
      <li class="content-item" @click="player(item)" v-for="item in listenList">
        <div class="img">
          <img v-lazy="item.avatar" alt="" width="100%">
          <img src="../vip.png" v-if="Number(item.isvip) === 1" alt="" class="isvip">
        </div>
        <div class="desc">
          <div class="name">{{item.name}}</div>
          <span class="play-time">
                <i class="iconfont icon-zuixin"></i>{{item.duration}}
              </span>
          <span class="click-num">
                <i class="iconfont icon-bofang"></i>{{item.playNum}}次
              </span>
        </div>
      </li>
      <loading v-if="isLoad"></loading>
    </ul>
    <div class="loading-container" v-if="!listenList.length && status === 2">
      <loading></loading>
    </div>
    <div class="no-result-wrapper" v-if="status === 0">
      <no-result title="暂无其他听绘本"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { ERR_OK } from 'api/config'
  import NoResult from 'base/no-result/no-result'
  import { getHomeList } from 'api/home'
  import AudioClass from 'common/js/audioClass'
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      typeId: {
        type: Number,
        default: 1
      },
      categoryId: {
        type: Number,
        default: 1
      },
      pullup: {
        type: Boolean,
        default: false
      },
      flagPull: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        listenList: [],
        pagesize: 20,
        minid: '',
        status: 2,
        pullText: '下拉刷新',
        newTypeId: '',
        newCateId: '',
        pageIndex: 1,
        hasMore: true,
        isLoad: false
      }
    },
    methods: {
      tip () {
        this.pullText = '正在刷新'
        this.noRefresh = true
      },
      setType (typeId, categoryId) {
        this.newTypeId = typeId
        this.newCateId = categoryId
      },
      pullRefresh () {
        this.pageIndex = 1
        this.hasMore = true
        this._getListenList(this.newTypeId, this.newCateId)
      },
      moreList () {
        if (!this.hasMore) {
          return
        }
        this.isLoad = true
        this.pageIndex++
        getHomeList(this.pagesize, this.pageIndex, this.newTypeId, this.newCateId, this.query).then((res) => {
          if (res.data.status === ERR_OK) {
            this.listenList = this.listenList.concat(this._changAudioClass(res.data.info))
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
      _getListenList (typeId, categoryId) {
        this.pageIndex = 1
        this.hasMore = true
        this.isLoad = false
        if (categoryId) {
          getHomeList(this.pagesize, this.pageIndex, typeId, categoryId).then((res) => {
            if (res.data.status === ERR_OK) {
              this.pullText = '下拉刷新'
              this.$emit('listensuccessRefresh')
              this.listenList = this._changAudioClass(res.data.info)
              this.status = 1
              this._checkMore(res.data)
            } else {
              this.listenList = []
              this.status = 0
              this.hasMore = false
              this.isLoad = false
            }
          }).catch(() => {
            this.listenList = []
            this.status = 1
          })
        }
      },
      player (item) {
        this.$emit('player', item)
      },
      _changAudioClass (list) {
        let ret = []
        list.forEach((content) => {
          if (content.id) {
            let item = new AudioClass({
              id: content.id,
              avatar: content.img_url,
              name: content.title,
              desc: content.content,
              isvip: content.isVip,
              playUrl: content.attach[0].file_path,
              playNum: content.click,
              duration: content.attach[0].duration
            })
            ret.push(item)
          }
        })
        return ret
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped>
  .listenList {
    height: 100%;
    position: relative;
    overflow: hidden;
    position: relative;
    min-height: 160px;
  }

  .listenList > .loading-container {
    position: absolute;
    top: 50%
  }

  .listenList > ul {
    padding: 12px;
    min-height: 120%;
  }

  .listenList > ul > .content-item {
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .listenList > ul > .content-item:first-child {
    padding-top: 0;
  }

  .listenList > ul > .content-item > .img {
    width: 80px;
    height: 60px;
    flex: 0 0 88px;
    margin-right: 10px;
    position: relative;
  }

  .listenList > ul > .content-item > .img > .isvip {
    width: 24px;
    height: 15px;
    position: absolute;
    top: 0;
    right: 9px;
  }
  .listenList > ul > .content-item > .img > img {
    width: 80px;
    height: 60px;
    border-radius: 3px;
  }

  .listenList > ul > .content-item > .desc {
    flex: 1;
  }

  .listenList > ul > .content-item > .desc > .name {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .listenList > ul > .content-item > .desc > .play-time {
    font-size: 14px;
    color: #cccccc;
    margin-right: 20px;
  }

  .listenList > ul > .content-item > .desc > .play-time > .iconfont {
    margin-right: 4px;
    font-size: 14px;
  }

  .listenList > ul > .content-item > .desc > .click-num {
    font-size: 14px;
    color: #cccccc;
  }

  .listenList > ul > .content-item > .desc > .click-num > .iconfont {
    margin-right: 4px;
    font-size: 14px;
  }
  .listenList > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 30%;
    transform: translateY(-20%);
  }
</style>
