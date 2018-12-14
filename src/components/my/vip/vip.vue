<template>
  <transition name="move">
    <div class="vip-card">
      <div class="title">
        <span class="back" @click="vipBack"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span>VIP借阅卡</span>
      </div>
      <div class="card-img" ref="cardImg">
        <img src="./vip-pic.png" style="border-radius: 10px;" width="100%" alt="">
      </div>
      <div class="content-wrapper" ref="contentWrapper">
        <scroll ref="scroll">
          <div>
            <div class="desc">
              <p>详细说明：</p>
              <p>
                1.本卡的有效期是一年，相当于一天一元。有效开始日期是购买并成功支付。
              </p>
              <p>
                2.购买本卡后方能在商城借阅馆里面借书，而且可以观看风信子图书馆APP内所有的视频。未购用户只能观看30%的视频。
              </p>
            </div>
            <div class="line"></div>
            <div v-if="isCard || statusNum !== cardStatus.OK_BIND" class="content">
              <div class="input">
                <input class="num" placeholder="请输入实体卡号" v-model="codeNum">
              </div>
              <div class="bind" @click="_bind">
                <p class="btn">立即绑定</p>
              </div>
            </div>
            <div v-if="!isCard && statusNum === cardStatus.OK_BIND" class="content">
              <div style="font-size: 12px;color: #00a9e4;">NO：{{cardno}}</div>
              <span>借阅卡有效期剩余 </span>
              <div class="day">
                <i>{{day1}}</i><i>{{day2}}</i><i>{{day3}}</i><span>天</span>
              </div>
              <span>有效期至{{time}}</span>
            </div>
          </div>
        </scroll>
      </div>
      <dialog-prompt ref="dialogPrompt" v-show="showAnimate" title="请求中..."></dialog-prompt>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>

</template>
<script>
  import { ERR_OK } from 'api/config'
  import { bindCode, getallBindCard } from 'api/user'
  import Scroll from 'base/scroll/scroll'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import DialogPrompt from 'base/dialog-prompt/dialog-prompt'

  export default {
    props: {
      cardStatus: {
        type: Object,
        default () {
          return {
            OK_BIND: '2'
          }
        }
      }
    },
    data () {
      return {
        isCard: true,
        statusNum: '',
        day1: '',
        day2: '',
        day3: '',
        time: '',
        codeNum: '',
        maskText: '',
        cardno: '',
        showAnimate: false
      }
    },
    created () {
      this._getBindCard()
    },
    mounted () {
      this.changeTop()
    },
    methods: {
      changeTop () {
        setTimeout(() => {
          let imgHeight = this.$refs.cardImg.getBoundingClientRect().height
          this.$refs.contentWrapper.style.top = imgHeight + 42 + 'px'
        }, 100)
      },
      _getBindCard () {
        let id = JSON.parse(localStorage.getItem('userInfo')).id
        getallBindCard(id).then((res) => {
          console.log(res)
          if (res.data.status === ERR_OK) {
            if (res.data.info.length === 0) {
              return
            }
            this.statusNum = res.data.info[0].status
            this.cardno = res.data.info[0].cardno
            this.isCard = false
            // 获取借书卡有效期时间，将其转换成单个数字后期方便使用
            this.time = res.data.info[0].enddate.substring(0, 10).toString()
            let strs = this.getDay(this.time).toString().split('')
            console.log(this.time)
            console.log(strs)
            this.day1 = strs[0]
            this.day2 = strs[1]
            this.day3 = strs[2]
          }
        })
      },
      getDay (time) {
        let date1 = new Date(time).getTime()
        let date2 = new Date().getTime()
        let total = (date1 - date2) / 1000
        this.day = parseInt(total / (24 * 60 * 60)) + 1 // 计算整数天数
        return this.day
      },
      vipBack () {
        this.$router.back()
      },
      _bind () {
        if (localStorage.hasOwnProperty('userInfo')) {
          let id = JSON.parse(localStorage.getItem('userInfo')).id
          this.showAnimate = true
          bindCode(id, this.codeNum).then((res) => {
            console.log(res)
            if (res.data.status === ERR_OK) {
              this.showAnimate = false
              this.maskText = '绑定成功...'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
                this.$router.replace('/mine')
              }, 1500)
            } else {
              this.showAnimate = false
              this.maskText = '绑定失败，请重试...'
              this.$refs.dialogMask.show()
              setTimeout(() => {
                this.$refs.dialogMask.hide()
              }, 1500)
            }
          }).catch(() => {
            this.maskText = '绑定失败，请重试...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          })
        }
      }
    },
    components: {
      Scroll,
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

  .vip-card {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .vip-card > .title {
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

  .vip-card > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .vip-card > .card-img {
    padding: 12px;
  }

  .vip-card > .content-wrapper {
    background: #ffffff;
    position: fixed;
    top: 254px;
    bottom: 50px;
  }
  .vip-card > .content-wrapper > div {
    height:100%;
    overflow: hidden;
  }
  .vip-card > .content-wrapper > div > div{
    padding: 24px;
  }

  .vip-card > .content-wrapper .desc > p {
    font-size: 12px;
    color: #666666;
    line-height: 24px;
  }

  .vip-card > .content-wrapper .desc > p:first-child {
    font-size: 12px;
    color: #333333;
    line-height: 24px;
  }

  .vip-card > .content-wrapper .line {
    margin: 12px 0;
    border-bottom: 1px dashed rgba(1, 17, 27, 0.1);
  }

  .vip-card > .content-wrapper .content {
    text-align: center;
  }

  .vip-card > .content-wrapper .content > .day > i {
    display: inline-block;
    width: 24px;
    height: 37px;
    line-height: 37px;
    margin: 12px 2px;
    font-size: 36px;
    background: #00a9e4;
    color: #ffffff;
  }

  .vip-card > .content-wrapper .content > .day > span {
    display: inline-block;
    margin-left: 5px;
    font-size: 14px;
    color: #666666;
    position: relative;
    top: -8px;
  }

  .vip-card > .content-wrapper .content > span {
    font-size: 12px;
    color: #666666;
  }

  .vip-card > .content-wrapper .content > .input > .num {
    width: 100%;
    height: 42px;
    line-height: 42px;
    border-radius: 21px;
    font-size: 16px;
    text-align: center;
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    margin-bottom: 15px;
    padding: 10px 10px;
    box-sizing: border-box;
  }

  .vip-card > .content-wrapper .content > .input > .num:focus {
    outline-style: none;
  }

  .vip-card > .content-wrapper .content > .bind {
    height: 42px;
    line-height: 42px;
    border-radius: 21px;
    font-size: 16px;
    text-align: center;
    background-color: #00a9e4;
    margin-bottom: 15px;
    color: #ffffff;
  }

  .vip-card > .content-wrapper .content > .bind:last-child {
    margin-bottom: 10px;
  }
</style>
