<!--
  User: fanqingyu
  Date: 2017/6/28 11:18
  功能：
-->
<template>
  <transition name="move">
    <div class="login">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">登录</span>
      </div>
      <div class="content-wrapper">
        <div class="logo">
          <img src="./moyue_logo.png" alt="">
        </div>
        <div class="content-text">
          <span class="phoneId">
            <img src="./phone.png"/>
            <input type="text" class="input" v-model="mobile" placeholder="请输入手机号" @keyup.enter="submit()">
          </span>
          <span class="pwdId">
            <img src="./pwd.png" alt="">
            <input type="password" class="input" v-model="pwd" placeholder="请输入密码" @keyup.enter="submit()">
          </span>
          <div type="submit" class="btn" @click="submit()">登录</div>
          <div class="sign-content">
            <span class="signUp" @click="sign()">注册账号</span>
            <span class="getback" @click="findPwd">找回密码?</span>
          </div>
        </div>
      </div>
      <dialog-prompt ref="dialogPrompt" v-show="showAnimate"></dialog-prompt>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { login } from 'api/user'
  import { mapMutations } from 'vuex'
  import DialogPrompt from 'base/dialog-prompt/dialog-prompt'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import FindPwdFirst from 'components/login/findPwdFirst'
  export default {
    data () {
      return {
        mobile: '',
        pwd: '',
        showAnimate: false,
        maskText: ''
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      findPwd () {
        this.$router.push({
          path: `/login/findPwd`
        })
      },
      sign () {
        this.$router.push({
          path: `/login/sign`
        })
      },
//      focus () {
//        console.log('获得焦点')
//        this.$refs.foot.style.position = 'static'
//        this.$refs.img.style.position = 'static'
//        console.log(this.$refs.foot.style.position)
//      },
//      blur () {
//        console.log('失去焦点')
//        this.$refs.foot.style.position = 'absolute'
//        this.$refs.img.style.position = 'absolute'
//      },
      submit () {
        this.showAnimate = true
        login(this.mobile, this.pwd).then((res) => {
          if (res.data.status === ERR_OK) {
            localStorage.removeItem('userInfo')
            localStorage.setItem('userInfo', JSON.stringify(res.data.info[0]))
            this.setUserInfo(res.data.info[0])
            this.showAnimate = false
            this.maskText = '登录成功，正在跳转...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
              this.$router.replace('/home')
            }, 1000)
          } else {
            this.showAnimate = false
            this.maskText = '登录失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 2000)
          }
        }).catch(() => {
          this.showAnimate = false
          this.maskText = '登录失败，请重试~'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 2000)
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    },
    components: {
      DialogPrompt,
      DialogMask,
      FindPwdFirst
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

  .login {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0
  }

  .login > .title {
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

  .login > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .login > .content-wrapper > .logo {
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .login > .content-wrapper > .logo img {
    width: 80px;
    height: 80px;
    vertical-align: middle;
  }

  .login > .content-wrapper > .content-text {
    padding: 0 28px;
  }

  .login > .content-wrapper > .content-text > span {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #cccccc;
  }

  .login > .content-wrapper > .content-text > span img {
    display: inline-block;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    margin-right: 8px;
  }

  .login > .content-wrapper > .content-text > span input {
    display: inline-block;
    flex: 1;
    border: 0;
    resize: none;
    border-radius: 5px;
    background: #f4f4f4;
  }

  .login > .content-wrapper > .content-text > span input:focus {
    outline-color: #f4f4f4;
    border-radius: 5px;
  }

  .login > .content-wrapper > .content-text > .btn {
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: #00a9e4;
    color: #ffffff;
    border-radius: 20px;
    margin: 18px 0;
  }

  .login > .foot {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    border-bottom: 0;
  }

  .login > .foot > img {
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .login > .content-wrapper > .content-text > .sign-content {
    width: 100%;
    font-size: 12px;
    color: #666666;
    position: relative;
  }

  .login > .content-wrapper > .content-text > .sign-content > .getback {
    position: absolute;
    right: 0;
  }
</style>
