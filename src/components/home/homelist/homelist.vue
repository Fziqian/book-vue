<!--
  User: fanqingyu
  Date: 2017/7/6 14:53
  功能：
-->

<template>
  <scroll class="homelist"
          :data="homelist"
          ref="scroll"
          :pullup="pullup"
          @scrollToTop="pullRefresh"
          @scrollToRefresh="tip"
          @scrollToEnd="moreList"
  >
    <ul class="clear" v-show="homelist.length">
      <li v-show="flagPull">
        <div class="refresh-container">
          <loading :title="pullText"></loading>
        </div>
      </li>
      <li class="content-item" @click="readSelectItem(item)" v-for="item in homelist">
        <img v-lazy="item.avatar" alt="" width="100%">
        <span class="click-num" v-show="item.playNum > 0">{{item.playNum}}次</span>
        <img src="../vip.png" v-if="Number(item.isvip) === 1" alt="" class="isvip">
        <span class="play-time">{{item.duration}}</span>
        <span class="icon"><i class="iconfont icon-bofang"></i></span>
        <div class="name">{{item.name || '暂无'}}</div>
      </li>
      <loading v-if="isLoad"></loading>
    </ul>
    <div class="loading-container" v-if="!homelist.length && status === 2">
      <loading></loading>
    </div>
    <div class="no-result-wrapper" v-if="status === 0">
      <no-result title="暂无其他看绘本"></no-result>
    </div>
  </scroll>
</template>

<script>
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
        homelist: [],
        pagesize: 20,
        minid: '',
        status: 2,
        pullText: '下拉刷新',
        newTypeId: '1',
        newCateId: '1',
        pageIndex: 1,
        hasMore: true,
        isLoad: false
      }
    },
    mounted () {
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
        this._getHomelist(this.newTypeId, this.newCateId)
      },
      moreList () {
        if (!this.hasMore) {
          return
        }
        this.isLoad = true
        this.pageIndex++
        getHomeList(this.pagesize, this.pageIndex, this.newTypeId, this.newCateId, this.query).then((res) => {
          if (res.data.status === ERR_OK) {
            this.homelist = this.homelist.concat(this._changAudioClass(res.data.info))
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
      _getHomelist (typeId, categoryId) {
        this.status = 1
        this.pageIndex = 1
        this.hasMore = true
        this.isLoad = false
        getHomeList(this.pagesize, this.pageIndex, typeId, categoryId, this.query).then((res) => {
          console.log(res)
          if (res.data.status === ERR_OK) {
            this.pullText = '下拉刷新'
            this.$emit('readsuccessRefresh')
            this.homelist = this._changAudioClass(res.data.info)
            this.status = 1
            this._checkMore(res.data)
          } else {
            this.homelist = []
            this.status = 0
            this.hasMore = false
            this.isLoad = false
          }
        }).catch(() => {
          this.homelist = []
          this.status = 1
        })
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
              playUrl: content.attach[0].file_path,
              playNum: content.click,
              isvip: content.isVip,
              duration: content.attach[0].duration,
              typeId: content.type_id
            })
            ret.push(item)
          }
        })
        return ret
      },
      readSelectItem (item) {
        this.$emit('readSelectItem', item)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style>
  .homelist {
    height: 100%;
    overflow: hidden;
    position: relative;
    min-height: 160px;
    padding-bottom: 50px;
    box-sizing: border-box;
  }
  .homelist > .loading-container {
    position: absolute;
    top: 50%;
  }
  .homelist > ul {
    min-height: 120%;
  }

  .homelist > ul > .content-item {
    position: relative;
    display: block;
    width: 50%;
    float: left;
    padding: 10px;
    box-sizing: border-box;
  }

  .homelist > ul > .content-item > span {
    display: block;
    position: absolute;
    font-size: 10px;
  }

  .homelist > ul > .content-item > .isvip {
    width: 34px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 8px;
  }
  .homelist > ul > .content-item > .click-num {
    top: 15px;
    left: 15px;
    border: 1px solid #ffffff;
    border-radius: 3px;
    padding: 3px;
    background: #ea6a76;
    color: #ffffff;
  }

  .homelist > ul > .content-item > .play-time {
    top: 11px;
    right: 9px;
    border-radius: 0 3px 0 3px;
    padding: 3px;
    background: rgba(255, 255, 255, 0.7);
    color: #000000;
  }

  .homelist > ul > .content-item > .icon {
    bottom: 40px;
    right: 20px;
    color: #ffffff;
    font-size: 16px;
  }

  .homelist > ul > .content-item > img {
    width: 100%;
    border-radius: 3px;
    border: 1px solid #ccc;
  }

  .homelist > ul > .content-item > .name {
    font-size: 14px;
    color: #333333;
    margin-top: 6px;
  }

  .clear:after {
    display: block;
    content: " ";
    height: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden;
  }

  .homelist > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 30%;
    transform: translateY(-20%);
  }
</style>
