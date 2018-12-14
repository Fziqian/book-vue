<!--
  User: fanqingyu
  Date: 2017/7/24 13:52
  功能：
-->

<template>
  <transition name="maskMove">
    <div class="dialog-mask" v-show="showFlag">
      <div class="text">{{maskText}}</div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      maskText: {
        type: String,
        default: '请输入提示文字'
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

<style>
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .maskMove-enter-active, .maskMove-leave-active {
    transition: all .5s ease;
    transform: translate3d(0, 0, 0);
  }
  .maskMove-enter, .maskMove-leave-active
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(0, -50px, 0);
  }

  .dialog-mask {
    position: fixed;
    width: 100%;
    height: 50px;
    top: 0;
    z-index: 60;
  }

  .dialog-mask > .text {
    padding: 15px 10px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
  }
</style>
