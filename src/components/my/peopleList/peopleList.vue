<!--
  User: fanqingyu
  Date: 2017/7/5 18:25
  功能：
-->

<template>
  <scroll class="peopleList"
          ref="scroll"
          :data="peoples"
          :pullup="pullup"
          @scrollToTop="pullRefresh"
          @scrollToRefresh="tip"
          @scrollToEnd="moreList">
    <div>
      <div class="content-list" v-for="(item, index) in peoples" :data-index="item.id">
        <left-slider :index="item.id.toString()" :isSlider="isSlider" @deleteItem="deleteItem">
          <div class="content-item" @click="selectItem(item)">
            <div class="avatar">
              <img :src="item.avatar" width="100%" height="100%" alt="">
            </div>
            <div class="content">
              <div class="name">
                <span class="text">{{item.truename}}</span>
                <span class="text">{{item.mobile}}</span>
                <span class="vip" v-if="item.isVip > 0"><img src="./vip.png"></span>
              </div>
              <div class="address">
                <span class="text">{{item.fxz_address}}</span>
              </div>
            </div>
            <div class="total">{{item.vipcount}}</div>
          </div>
        </left-slider>
      </div>
      <loading v-if="isLoad"></loading>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </scroll>
</template>

<script>
  import LeftSlider from '../../../base/left-slide/leftslider.vue'
  import Scroll from 'base/scroll/scroll'
  import { ERR_OK } from 'api/config'
  import { addPeople } from 'api/user'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import Loading from 'base/loading/loading'
  export default {
    props: {
      peoples: {
        type: Array,
        default: []
      },
      isSlider: {
        type: Boolean,
        default: false
      },
      hasMore: {
        type: Boolean,
        default: false
      },
      isLoad: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        maskText: '',
        pullup: true,
        pullText: '下拉刷新'
      }
    },
    methods: {
      tip () {
        this.pullText = '正在刷新'
        this.noRefresh = true
      },
      pullRefresh () {
        this.pageIndex = 1
        this.hasMore = true
      },
      moreList () {
        if (!this.hasMore) {
          return
        }
        this.$emit('moreList')
      },
      selectItem (item) {
        this.$emit('select', item)
      },
      deleteItem (index) {
        addPeople(index, 2).then((res) => {
          if (res.data.status === ERR_OK) {
            for (let i = 0; i < this.peoples.length; i++) {
              if (this.peoples[i].id === index) {
                this.peoples.splice(i, 1)
              }
            }
            this.maskText = '删除成功~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          } else {
            this.maskText = '删除失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          }
        })
      }
    },
    components: {
      LeftSlider,
      Scroll,
      DialogMask,
      Loading
    }
  }
</script>

<style>

  .peopleList {
    height: 100%;
    overflow: hidden;
  }
  .peopleList > div {
    min-height: 110%;
  }
  .peopleList > div > .content-list .content-item {
    position: relative;
    padding: 8px 8px;
  }

  .peopleList > div > .content-list .content-item > .total {
    position: absolute;
    right: 10px;
    top: 16px;
    font-size: 36px;
    color: #00a9e4;
  }

  .peopleList > div > .content-list .content-item > .avatar {
    width: 55px;
    height: 55px;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    background: #a2d2e8;
  }

  .peopleList > div > .content-list .content-item > .avatar img {
    border-radius: 50%;
  }

  .peopleList > div > .content-list .content-item > .content {
    display: inline-block;
    margin-left: 8px;
  }

  .peopleList > div > .content-list .content-item > .content > .name {
    margin: 8px 0 8px 0;
    font-size: 0;
  }

  .peopleList > div > .content-list .content-item > .content > .name .text {
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
  }

  .peopleList > div > .content-list .content-item > .content > .name .vip img {
    width: 20px;
    height: 13px;
    vertical-align: top;
  }

  .peopleList > div > .content-list .content-item > .content > .address {
    font-size: 12px;
    color: #999999;
  }
</style>
