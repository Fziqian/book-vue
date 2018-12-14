<!--
  User: fanqingyu
  Date: 2017/8/11 0011 11:49
  功能：
-->
<template>
  <transition name="move">
    <div class="findPwdFirst">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">找回密码</span>
      </div>
      <div class="phone-Content">
        <span class="phoneId">
          <img src="./phone.png"/>
          <input type="text" class="input" v-model="mobile" placeholder="请输入手机号">
        </span>
        <span class="code">
          <img src="./code.png" alt="">
          <input type="text" class="input" placeholder="请输入验证码" v-model="code">
          <button :disabled="disabled || time > 0" @click="run()" :class="disabled || time > 0 ? 'disGet' : 'get'">
            {{ text }}
          </button>
        </span>
      </div>
      <div class="next" @click="next">下一步</div>
      <findPwdSecond ref="findPwdSecond"></findPwdSecond>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ERR_OK } from 'api/config'
  import { getfindPwdCode } from 'api/user'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import FindPwdSecond from 'components/login/findPwdSecond'

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
        code: '',
        maskText: '',
        lineCode: '',
        showFlag: false
      }
    },
    computed: {
      text () {
        return this.time > 0 ? this.time + 's 后获取' : '获取验证码'
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      hide () {
        this.showFlag = false
      },
      goBack () {
        this.$router.back()
      },
      timer () {
        if (this.time > 0) {
          this.time--
          setTimeout(this.timer, 1000)
        }
      },
      run () {
//        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test(this.mobile)) {
          this.maskText = '请输入正确手机号...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
        } else {
          getfindPwdCode(this.mobile).then((res) => {
            if (res.data.status === ERR_OK) {
              this.maskText = '验证码已发送...'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1500)
              this.lineCode = res.data.code
              this.time = this.second
              this.timer()
            } else {
              this.maskText = res.data.msg
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1500)
            }
          })
        }
      },
      next () {
        if (this.code !== this.lineCode) {
          this.maskText = '验证码错误，请输入正确验证码~'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
          return false
        }
        this.$refs.findPwdSecond.show(this.mobile)
      }
    },
    components: {
      DialogMask,
      FindPwdSecond
    }
  }
</script>

<style scoped>
  @import '../../common/css/iconfont.css';

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .findPwdFirst {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .findPwdFirst > .title {
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

  .findPwdFirst > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .findPwdFirst > .phone-Content {
    padding: 20px 28px;
  }

  .findPwdFirst > .phone-Content > span {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #cccccc;
  }

  .findPwdFirst > .phone-Content > span img {
    display: inline-block;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    margin-right: 8px;
  }

  .findPwdFirst > .phone-Content > span input {
    display: inline-block;
    flex: 1;
    border: 0;
    resize: none;
    border-radius: 5px;
    background: #f4f4f4;
    width: 150px;
  }

  .findPwdFirst > .phone-Content > span input:focus {
    outline-color: #f4f4f4;
    border-radius: 5px;
  }

  .findPwdFirst > .phone-Content > span .get {
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

  .findPwdFirst > .phone-Content > span .disGet {
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

  .findPwdFirst .next {
    width: 70%;
    height: 30px;
    line-height: 30px;
    border: 2px solid #00a9e4;
    text-align: center;
    margin: 0 auto;
    border-radius: 10px;
    color: #999;
  }

</style>
