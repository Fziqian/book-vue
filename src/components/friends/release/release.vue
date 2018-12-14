<!--
  User: fanqingyu
  Date: 2017/6/7 10:55
  功能：
-->

<template>
  <transition name="move">
    <div class="release" v-show="showFlag">
      <div class="title">
        <span @click="back()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">发布</span>
        <span class="sub-btn" @click="goRelease">发表</span>
      </div>
      <div class="content-wrapper" @click="getFocus()">
        <texta :title="title" @contentText="onContentChange" ref="texta"></texta>
      </div>
      <div class="pic">
        <ul class="clear" id="clear">
          <li class="pic-item imgItem" v-for="item in imgs" v-show="imgs">
            <div class="img" :style="{backgroundImage: 'url(' + item + ')'}">
            </div>
            <img src="./del.png" alt="" style="width:20px;height:20px;" @click="delImg(item, $event.currentTarget)">
          </li>
          <li class="pic-item add-li">
            <input type="file" multiple ref="imgUpload" accept='image/*' @change="preview()">
            <div class="addimg">
            </div>
          </li>
          <!--<li class="pic-item del-li" @click="delimg">-->
          <!--<div class="delimg">-->
          <!--</div>-->
          <!--</li>-->
        </ul>
      </div>
      <dialog-prompt ref="dialogPrompt" v-show="showAnimate" title="请求中..."></dialog-prompt>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script>
  import Texta from 'base/textarea/textarea'
  import { release } from 'api/friends'
  import { ERR_OK } from 'api/config'
  import DialogPrompt from 'base/dialog-prompt/dialog-prompt'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import { trim } from 'common/js/trim'
  export default {
    data () {
      return {
        showFlag: false,
        title: '请输入发布内容',
        delFlag: false,
        contentText: '',
        maskText: '',
        imgs: [],
        imgFile: [],
        showAnimate: false
      }
    },
    created () {
      console.log(111111111)
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
      preview () {
        let files = this.$refs.imgUpload.files
        this.imgFile = files
        let leng = files.length
        let vm = this
        for (let i = 0; i < leng; i++) {
          let reader = new FileReader()
          reader.readAsDataURL(files[i])
          reader.onload = function (ee) {
            vm.imgs.push(ee.target.result)
          }
        }
      },
      delImg (item, e) {
        this.imgs.splice(this.imgs.indexOf(item), 1)
        e.parentNode.parentNode.removeChild(e.parentNode)
      },
      onContentChange (text) {
        this.contentText = text
      },
      goRelease () {
        if (trim(this.contentText) || this.imgs.length) {
          this.showAnimate = true
          release(this.contentText, this.imgFile).then((res) => {
            if (res.data.status === ERR_OK) {
              this.showAnimate = false
              this.imgs = []
              this.$emit('changeContent')
              this.contentText = ''
              this.showFlag = false
            } else {
              this.maskText = '发表失败，请重试~'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1500)
            }
          }).catch(() => {
            this.maskText = '发表失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          })
        } else {
          this.maskText = '发表文字或图片不能为空~'
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

  .release {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0
  }

  .release > .title {
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

  .release > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .release > .title > .sub-btn {
    position: absolute;
    right: 15px;
    top: 0;
    display: block;
    font-size: 14px;
    line-height: 42px;
    height: 42px;
    color: #ffffff
  }

  .release > .content-wrapper {
    position: fixed;
    top: 42px;
    height: 200px;
    padding: 0 10px;
    width: 100%;
    box-sizing: border-box;
  }

  .release > .pic {
    position: fixed;
    top: 242px;
    padding: 0 10px;
    width: 100%;
    box-sizing: border-box;
  }

  .release > .pic > ul > li {
    position: relative;
    display: block;
    float: left;
    width: 25%;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 15px;
  }

  .release > .pic > ul > li > img {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
  }

  .release > .pic > ul > .add-li {
    position: relative;
    display: block;
    width: 15%;
    margin: 10px;
    box-sizing: border-box;
    padding: 0;
    clear: both;
  }

  .release > .pic > ul > .del-li {
    position: relative;
    display: block;
    width: 15%;
    margin: 10px;
    box-sizing: border-box;
    padding: 0;
  }

  .release > .pic > ul > li > .img {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 5px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .release > .pic > ul > li > input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .release > .pic > ul > li > .addimg {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 5px;
    background-size: cover;
    background-position: center center;
    background-image: url("add.png");
    background-repeat: no-repeat;
  }

  .release > .pic > ul > li > .delimg {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 5px;
    background-size: cover;
    background-position: center center;
    background-image: url("icon-del.png");
    background-repeat: no-repeat;
  }

  .release > .pic > ul > li > .icon-del {
    position: absolute;
    left: 50%;
    width: 20px;
    bottom: -7px;
    transform: translateX(-50%);
    padding: 5px;
  }
</style>
