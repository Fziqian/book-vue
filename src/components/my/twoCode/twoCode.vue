<!--
  User: fanqingyu
  Date: 2017/8/23 0023 10:35
  功能：
-->
<template>
  <transition name="move">
    <div class="twoCode" v-show="showFlag">
      <div class="title">
        <span class="back" @click="hide"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">读书卡二维码</span>
      </div>
      <div class="pic">
        <img :src="url" alt="" width="200px" height="200px">
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showFlag: false
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      hide () {
        this.showFlag = false
      }
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

  .twoCode {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 51;
    top: 0;
    left: 0;
    bottom: 0;
  }

  .twoCode > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: relative;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .twoCode > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .twoCode .pic {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -70%, 0);
  }
</style>
