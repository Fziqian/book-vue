<!--
  User: fanqingyu
  Date: 2017/7/13 15:23
  功能：
-->

<template>
  <transition name="move">
    <div class="comment-sub" v-show="showFlag">
      <div class="title">
        <span @click="back()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">评论</span>
        <span class="sub-btn" @click="goComment">提交</span>
      </div>
      <div class="content-wrapper" @click="getFocus()">
        <texta :title="title" @contentText="onContentChange" ref="texta"></texta>
      </div>
      <dialog-prompt ref="dialogPrompt" v-show="showAnimate" title="请求中..."></dialog-prompt>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script>
  import Texta from 'base/textarea/textarea'
  import { comment } from 'api/friends'
  import { ERR_OK } from 'api/config'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import DialogPrompt from 'base/dialog-prompt/dialog-prompt'
  import { trim } from 'common/js/trim'

  export default {
    props: {
      commentId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showFlag: false,
        title: '请输入评论内容',
        contentText: '',
        maskText: '',
        zhi: '',
        showAnimate: false
      }
    },
    created () {
      console.log(222222222)
    },
    methods: {
      getFocus () {
        this.$refs.texta.onFocus()
      },
      show () {
        this.showFlag = true
      },
      back () {
        this.showFlag = false
      },
      onContentChange (text) {
        this.contentText = text
      },
      goComment () {
        if (trim(this.contentText)) {
          this.showAnimate = true
          comment(this.commentId, this.contentText).then((res) => {
            if (res.data.status === ERR_OK) {
              this.showAnimate = false
              this.$emit('changeContent')
              this.showFlag = false
              this.contentText = ''
              this.$refs.texta.contentText = ''
            } else {
              this.showAnimate = false
              this.maskText = '评论失败，请重试~'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1500)
            }
          }).catch(() => {
            this.showAnimate = false
            this.maskText = '评论失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          })
        } else {
          this.maskText = '输入不能为空，请重新输入'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
        }
      }
    },
    components: {
      Texta,
      DialogMask,
      DialogPrompt
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

  .comment-sub {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0
  }

  .comment-sub > .title {
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

  .comment-sub > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .comment-sub > .title > .sub-btn {
    position: absolute;
    right: 15px;
    top: 0;
    display: block;
    font-size: 14px;
    line-height: 42px;
    height: 42px;
    color: #ffffff
  }

  .comment-sub > .content-wrapper {
    position: fixed;
    top: 42px;
    bottom: 50px;
    padding: 0 10px;
    width: 100%;
    box-sizing: border-box;
  }
</style>
