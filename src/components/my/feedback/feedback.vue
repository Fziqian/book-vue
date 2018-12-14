<template>
  <transition name="move">
    <div class="feedback">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">意见反馈</span>
        <span class="sub-btn" @click="_postFeed">提交</span>
      </div>
      <div class="content-wrapper">
        <div class="type">
          <span class="desc">问题主题</span>
          <input type="text" v-model="feedTheme">
          <!--<span class="select-type">功能优化<i class="iconfont icon-jiantouyou"></i></span>-->
        </div>
        <div class="content-text">
          <textarea class="text" maxlength="500" placeholder="请输入反馈内容" v-model="feedText"></textarea>
        </div>
      </div>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>
<script>
  import { postFeed } from 'api/user'
  import { ERR_OK } from 'api/config'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  export default {
    data () {
      return {
        feedTheme: '',
        feedText: '',
        maskText: ''
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      _postFeed () {
        if (!this.feedText) {
          this.maskText = '提交失败，未填写任何内容...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
          return
        }
        postFeed(this.feedTheme, this.feedText).then((res) => {
          if (res.data.status === ERR_OK) {
            this.maskText = '提交成功...'
            this.feedTheme = ''
            this.feedText = ''
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          } else {
            this.maskText = '提交失败，请重试...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          }
        }).catch(() => {
          this.maskText = '提交失败，请重试...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
        })
      }
    },
    components: {
      DialogMask
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
  .feedback{
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index:110;
    top: 0;
    left: 0
  }
  .feedback>.title{
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: relative;
  }

  .feedback>.title>.back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }
  .feedback>.title>.sub-btn {
    position: absolute;
    right: 15px;
    top: 0;
    display: block;
    font-size: 14px;
    line-height: 42px;
    height: 42px;
    color: #ffffff
  }
  .feedback>.content-wrapper {
    margin: 12px;
    padding: 12px;
    background: #ffffff;
    height: 85%;
    font-size: 14px;
  }
  .feedback>.content-wrapper>.type {
    margin-top: 4px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    position: relative;
    display: flex;
    height: 24px;
    line-height: 24px;
  }

  .feedback>.content-wrapper>.type > .desc{
    display: inline-block;
    flex: 0 0 70px;
  }

  .feedback>.content-wrapper>.type > input{
    border: 1px solid rgba(1, 17, 27, 0.1);
    flex: 1;
    outline: none;
  }

  .feedback>.content-wrapper>.type .select-type {
    position: absolute;
    right: 0;
  }
  .feedback>.content-wrapper>.type .select-type i{
    margin-left: 12px;
    font-size: 14px;
  }
  .feedback>.content-wrapper>.content-text {
    margin-top: 16px;
    width: 100%;
    height: 90%;
  }
  .feedback>.content-wrapper>.content-text .text {
    width: 100%;
    height: 90%;
    border: 0;
    resize: none;
    overflow:auto;
    word-break:break-all;
    font-size: 14px;
  }
  .feedback>.content-wrapper>.content-text .text:focus {
    border: 0;
    outline-color: #ffffff;
  }
</style>

