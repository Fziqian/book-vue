<!--
  User: fanqingyu
  Date: 2017/6/23 16:10
  功能：
-->

<template>
  <div class="footer-tab">
    <router-link tag="div" to="/home" class="tab-item">
      <span class="iconfont hl icon-icon_index" style="font-size: 18px"></span>
      <span class="text">首页</span>
    </router-link>
    <router-link tag="div" to="/friends" class="tab-item">
      <span class="iconfont hl icon-icon_friend" style="font-size: 18px"></span>
      <span class="text">同学圈</span>
    </router-link>
    <div class="tab-item" @click="runCamera">
      <div class="circle">
        <div class="circle-1">
          <div class="circle-2">
            <i class="iconfont icon-ccgl-yundansaomiao-5" style="font-size: 26px"></i>
          </div>
        </div>
      </div>
    </div>
    <router-link tag="div" to="/chooseBooks" class="tab-item">
      <span class="iconfont hl icon-icon_select" style="font-size: 18px"></span>
      <span class="text">选书</span>
    </router-link>
    <router-link tag="div" to="/mine" class="tab-item">
      <span class="iconfont hl icon-icon_mine" style="font-size: 18px"></span>
      <span class="text">我的</span>
    </router-link>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import { scan, scanISBN } from 'api/scan'
  import { ERR_OK } from 'api/config'
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        selectedBook: {}
      }
    },
    methods: {
      runCamera () {
        if (Number(JSON.parse(localStorage.getItem('userInfo')).isVip) !== 1) {
          return
        }
        scan().then((res) => {
          if (res.data.status === ERR_OK) {
            let data = res.data.info[0]
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: 'wx546e93e8f5190cba', // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.noncestr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名，见附录1
              jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            let that = this
            wx.ready(() => {
              wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  let strISBN = res.resultStr.split(',')[1]
                  scanISBN(strISBN).then((item) => {
                    if (item.data.status === ERR_OK) {
                      that.selectedBook = item.data.info[0]
                      that.toPath(that.selectedBook)
                    }
                  })
                }
              })
            })
          } else {
            console.log('启动失败~')
          }
        }).catch(() => {
          console.log('网络错误，启动失败~')
        })
      },
      toPath (item) {
        this.setBookDetail(item)
        this.$router.push({
          path: '/chooseBooks/bookDetail=' + item.id
        })
      },
      ...mapMutations({
        setBookDetail: 'SET_BOOKDETAIL'
      })
    }
  }
</script>

<style>
  @import '../../common/css/iconfont.css';

  .footer-tab {
    position: fixed;
    display: flex;
    height: 50px;
    line-height: 50px;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #ffffff;
    background: #00a9e4;
    z-index: 51;
  }

  .footer-tab > .tab-item {
    flex: 1;
    text-align: center;
    font-size: 12px;
    padding-top: 8px;

  }

  .active {
    color: #000000;
  }

  .hl {
    display: block;
    font-size: 18px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 3px;
    font-weight: 400;
  }

  .icon-ccgl-yundansaomiao-5 {
    line-height: 48px;
    color: #00a9e4;
    font-size: 26px;
    font-weight: 500;
    margin-left: 1px;
  }

  .footer-tab .scan {
    position: relative;
  }

  .footer-tab .circle {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #00a9e4;
    top: -20px;
    margin: auto;
    padding: 6px;
    box-sizing: border-box;
  }

  .footer-tab .circle-1 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #a2d2e8;
    padding: 4px;
    box-sizing: border-box;
  }

  .footer-tab .circle-2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #ffffff;
    box-sizing: border-box;
  }

  .footer-tab .tab-item .text {
    display: block;
    font-size: 10px;
    height: 14px;
    line-height: 14px;

  }

</style>
