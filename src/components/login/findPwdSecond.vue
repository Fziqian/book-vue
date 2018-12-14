<!--
  User: fanqingyu
  Date: 2017/8/11 0011 11:49
  功能：
-->
<template>
  <transition name="move">
    <div class="findPwdSecond" v-show="showFlag">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">找回密码</span>
      </div>
      <div class="newPwd-Content">
        <span class="newPwd">
          <img src="./pwd.png"/>
          <input type="password" class="input" v-model="newPwd" placeholder="请输入新密码">
        </span>
        <span class="newPwd">
          <img src="./pwd.png"/>
          <input type="password" class="input" v-model="againNewPwd" placeholder="请再次输入新密码">
        </span>
      </div>
      <div class="next" @click="next">完成</div>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ERR_OK } from 'api/config'
  import { newPwd } from 'api/user'
  import DialogMask from 'base/dialog-mask/dialog-mask'

  export default {
    data () {
      return {
        newPwd: '',
        againNewPwd: '',
        maskText: '',
        showFlag: false,
        mobile: ''
      }
    },
    methods: {
      show (mobile) {
        this.mobile = mobile
        this.showFlag = true
      },
      hide () {
        this.showFlag = false
      },
      goBack () {
        this.showFlag = false
      },
      next () {
        if (this.newPwd !== this.againNewPwd) {
          this.maskText = '两次输入的密码不一样...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
          return
        }
        var reg = /\s/
        if (reg.test(this.newPwd)) {
          this.maskText = '输入的密码中不能包含空格...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1000)
          return
        }
        newPwd(this.mobile, this.newPwd).then((res) => {
          if (res.data.status === ERR_OK) {
            this.maskText = '修改成功...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
              this.$router.replace({
                path: `/login`
              })
            }, 1000)
          } else {
            this.maskText = res.data.msg
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1000)
          }
        }).catch(() => {
          this.maskText = '修改失败请重试...'
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

  .findPwdSecond {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .findPwdSecond > .title {
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

  .findPwdSecond > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .findPwdSecond > .newPwd-Content {
    padding: 20px 28px;
  }

  .findPwdSecond > .newPwd-Content > span {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #cccccc;
  }

  .findPwdSecond > .newPwd-Content > span img {
    display: inline-block;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    margin-right: 8px;
  }

  .findPwdSecond > .newPwd-Content > span input {
    display: inline-block;
    flex: 1;
    border: 0;
    resize: none;
    border-radius: 5px;
    background: #f4f4f4;
    width: 150px;
  }

  .findPwdSecond > .newPwd-Content > span input:focus {
    outline-color: #f4f4f4;
    border-radius: 5px;
  }

  .findPwdSecond .next {
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
