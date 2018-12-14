<!--
  User: fanqingyu
  Date: 2017/6/7 11:08
  功能：
-->

<template>
  <transition name="move">
    <div class="more-bookType" v-show="showFlag">
      <div class="title">
        <span @click="back()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">更多</span>
      </div>
      <scroll class="content-wrapper" ref="contentWrapper">
        <ul>
          <li class="content-item" v-for="(item, index) in nativeType">
            <span class="text">{{index + 1}}. {{item.title}}</span>
            <span class="icon" v-if="index > 0" @click="gotop(index, item)">置顶</span>
          </li>
        </ul>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  export default {
    props: {
      nativeType: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        showFlag: false,
        pullup: true
      }
    },
    created () {
    },
    methods: {
      show () {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.contentWrapper.refresh()
        })
      },
      back () {
        this.showFlag = false
        this.$emit('changeBookType', this.nativeType)
      },
      gotop (index, item) {
        this.nativeType.splice(index, 1)
        this.nativeType.unshift(item)
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

  .more-bookType {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0;
  }

  .more-bookType > .title {
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

  .more-bookType > .title > .back {
    position: absolute;
    top: 0;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .more-bookType > .content-wrapper {
    position: fixed;
    top: 42px;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
  }

  .more-bookType > .content-wrapper > ul {
    padding: 0 12px;
  }

  .more-bookType > .content-wrapper > ul > li {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    position: relative;
  }

  .more-bookType > .content-wrapper > ul > li > .text {
    font-size: 14px;
    color: #333333;
  }

  .more-bookType > .content-wrapper > ul > li > .icon {
    position: absolute;
    right: 0;
    font-size: 14px;
    color: #00a9e4;
  }
</style>
