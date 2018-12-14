<!--
  User: fanqingyu
  Date: 2017/6/28 11:18
  功能：
-->
<template>
  <transition name="move">
    <div class="sign">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">注册账号</span>
      </div>
      <div class="content-wrapper">
        <div class="logo">
          <img src="./moyue_logo.png" alt="">
        </div>
        <div class="content-text">
          <span class="phoneId">
            <img src="./phone.png"/>
            <input type="text" class="input" v-model="mobile" placeholder="请输入手机号">
          </span>
          <span class="pwdId">
            <img src="./pwd.png" alt="">
            <input type="password" class="input" v-model="pwd" placeholder="请输入密码">
          </span>
          <span class="pwdId">
            <img src="./pwd.png" alt="">
            <input type="password" class="input" v-model="twopwd" @blur="getblur()" placeholder="请再次输入密码">
          </span>
          <span class="code">
            <img src="./code.png" alt="">
            <input type="text" class="input" placeholder="请输入验证码" v-model="code">
            <button :disabled="disabled || time > 0" @click="run()" :class="disabled || time > 0 ? 'disGet' : 'get'">
              {{ text }}
            </button>
          </span>
          <div class="btn" @click="sub()">注册</div>
        </div>
      </div>
      <dialog-prompt ref="dialogPrompt" v-show="showAnimate" title="注册中..."></dialog-prompt>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { sign, getCode } from 'api/user'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import DialogPrompt from 'base/dialog-prompt/dialog-prompt'
  export default {
    props: {
      second: {
        type: Number,
        default: 60
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        time: 0,
        mobile: '',
        pwd: '',
        twopwd: '',
        code: '',
        maskText: '',
        showAnimate: false,
        lineCode: ''
      }
    },
    computed: {
      text () {
        return this.time > 0 ? this.time + 's 后获取' : '获取验证码'
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      run () {
        console.log(1111111)
//        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})) +\d{8})$/
//        var myreg = !((/^1[3|4|5|8][0-9]\d{4,8}$/)
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test(this.mobile)) {
          this.maskText = '请输入正确手机号...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
        } else {
          getCode(this.mobile).then((res) => {
            if (res.data.status === ERR_OK) {
              this.maskText = '验证码已发送...'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1000)
              this.lineCode = res.data.code
              this.time = this.second
              this.timer()
            } else {
              this.maskText = '手机号已注册'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1000)
            }
          })
        }
      },
      timer () {
        if (this.time > 0) {
          this.time--
          setTimeout(this.timer, 1000)
        }
      },
      focus () {
        this.$refs.foot.style.position = 'static'
        this.$refs.img.style.position = 'static'
      },
      blur () {
        this.$refs.foot.style.position = 'absolute'
        this.$refs.img.style.position = 'absolute'
      },
      getblur () {
        if (this.pwd !== this.twopwd) {
          this.maskText = '两次输入的密码不一致'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
        }
      },
      sub () {
        if (this.pwd !== this.twopwd) {
          this.maskText = '两次输入的密码不一致'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
          return false
        }
        if (this.code !== this.lineCode) {
          this.maskText = '验证码错误，请输入正确验证码~'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
          return false
        }
        this.showAnimate = true
        sign(this.mobile, this.pwd).then((res) => {
          if (res.data.status === ERR_OK) {
            this.showAnimate = false
            this.maskText = '注册成功~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
              this.$router.replace({
                path: `/login`
              })
            }, 500)
          } else {
            this.showAnimate = false
            this.maskText = '注册失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          }
        })
      }
    },
    components: {
      DialogMask,
      DialogPrompt
    }
  }
</script>

<style>
  @import '../../common/css/iconfont.css';

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .sign {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0
  }

  .sign > .title {
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

  .sign > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .sign > .content-wrapper > .logo {
    width: 100%;
    height: 112px;
    line-height: 112px;
    text-align: center;
  }

  .sign > .content-wrapper > .logo img {
    width: 80px;
    height: 80px;
    vertical-align: middle;
  }

  .sign > .content-wrapper > .content-text {
    padding: 0 28px;
  }

  .sign > .content-wrapper > .content-text > span {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #cccccc;
  }

  .sign > .content-wrapper > .content-text > span img {
    display: inline-block;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    margin-right: 8px;
  }

  .sign > .content-wrapper > .content-text > span input {
    display: inline-block;
    flex: 1;
    border: 0;
    resize: none;
    border-radius: 5px;
    background: #f4f4f4;
    width: 150px;
  }

  .sign > .content-wrapper > .content-text > span .get {
    display: inline-block;
    flex: 0 0 75px;
    height: 19px;
    line-height: 19px;
    border-radius: 5px;
    font-size: 10px;
    text-align: center;
    background: #00a9e4;
    color: #ffffff;
    border: 0;
    resize: none;
  }

  .sign > .content-wrapper > .content-text > span .disGet {
    display: inline-block;
    flex: 0 0 75px;
    height: 19px;
    line-height: 19px;
    border-radius: 5px;
    font-size: 10px;
    text-align: center;
    background: #cccccc;
    color: #ffffff;
    border: 0;
    resize: none;
  }

  .sign > .content-wrapper > .content-text > span input:focus {
    outline-color: #f4f4f4;
    border-radius: 5px;
  }

  .sign > .content-wrapper > .content-text > .btn {
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: #00a9e4;
    color: #ffffff;
    border-radius: 20px;
    margin: 18px 0;
  }

  .sign > .foot {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    border-bottom: 0;
  }

  .sign > .foot > img {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
</style>
