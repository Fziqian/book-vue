<template>
  <transition name="move">
    <div ref="myInfo" class="myInfo">
      <div class="title">
        <span class="back" @click="myInfoBack"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">个人信息</span>
      </div>
      <scroll class="myInfoScroll" ref="scroll":pullup="pullup">
        <div>
        <div class="avatar">
        <div class="circle-1">
          <div class="circle-2">
            <input type="file" ref="imgUpload" accept='image/*' @change="preview()">
            <img :src="myInfo.avatar" alt="" width="100%" height="100%" style="border-radius: 50%" ref="avatar">
          </div>
        </div>
      </div>
        <div class="avatar_1">
          <ul class="details">
            <li class="item" @click="selectInput($event.currentTarget, 'nick_name')">
              <span class="item-left">昵称</span>
              <span class="item-right">{{myInfo.nick_name}}</span>
            </li>
            <li @click="selectInput($event.currentTarget, 'truename')">
              <span class="item-left">姓名</span>
              <span class="item-right">{{myInfo.truename}}</span>
            </li>
            <li @click="selectSex($event.currentTarget)">
              <span class="item-left">性别</span>
              <span class="item-right" v-html="sex(myInfo.sex)"></span>
            </li>
            <li @click="address($event.currentTarget)">
              <span class="item-left">地址</span>
              <span class="item-right">{{myInfo.fxz_address}}</span>
            </li>
            <li @click="selectShop($event.currentTarget, myInfo.fxz_area)">
              <span class="item-left">幼儿园</span>
              <span class="item-right">{{myInfo.shop_name}}</span>
            </li>
          </ul>
          <split></split>
          <ul class="details d2">
            <li class="item" @click="showTwocode">
              <span class="item-left">借阅卡二维码</span>
              <span class="item-right"><i class="iconfont icon-zuoyoujiantouicon10024"></i></span>
            </li>
            <li class="item" @click="updataPwd">
              <span class="item-left">修改密码</span>
              <span class="item-right"><i class="iconfont icon-zuoyoujiantouicon10024"></i></span>
            </li>
          </ul>
          <updataPwd ref="updataPwd"></updataPwd>
          <div class="login-out" @click="loginOut">退出登录</div>
          <input-box ref="inputBox" @sure="sure"></input-box>
          <twoCode ref="twoCode" :url="myInfo.jsk.extStr" v-if="myInfo.jsk"></twoCode>
        </div>
        </div>
      </scroll>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import Scroll from 'base/scroll/scroll'
  import Split from 'base/split/split'
  import { getUserInfo, getProvince, getCity, getArea, getShop, saveUserinfo, upAvatar } from 'api/user'
  import { ERR_OK } from 'api/config'
  import { mapMutations } from 'vuex'
  import Picker from 'better-picker'
  import InputBox from 'base/input-box/input-box'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  import UpdataPwd from 'components/my/myInfo/updataPwd'
  import TwoCode from 'components/my/twoCode/twoCode'
  export default {
    data () {
      return {
        showFlag: false,
        myInfo: {},
        domArr: [],
        pullup: true,
        param: '',
        maskText: '',
        imgs: [],
        imgFile: []
      }
    },
    created () {
      this._getUserInfo()
    },
    computed: {},
    methods: {
      showTwocode () {
        if (this.myInfo.jsk) {
          this.$refs.twoCode.show()
        } else {
          this.maskText = '未绑定借阅卡...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
        }
      },
      updataPwd () {
        this.$refs.updataPwd.show()
      },
      sex (str) {
        return str === '0' ? '保密' : str === '1' ? '男' : '女'
      },
      myInfoBack () {
        this.$router.back()
      },
      _getUserInfo () {
        getUserInfo().then((res) => {
          if (res.data.status === ERR_OK) {
            this.myInfo = res.data.info[0]
          }
        })
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
        upAvatar(this.imgFile).then((res) => {
          if (res.data.status === ERR_OK) {
            this.imgFile = []
            this.setAvatar(res.data.headimg)
            this.$refs.avatar.src = res.data.headimg
            this.maskText = '头像修改成功...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          } else {
            this.maskText = '头像修改失败，请重试...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          }
        }).catch(() => {
          this.maskText = '头像修改失败，请重试...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
        })
      },
      selectInput (e, param) {
        this.$refs.inputBox.show()
        this.domArr = e
        this.param = param
      },
      sure (text) {
        if (!text) {
          this.maskText = '修改为空，无法修改...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
          return false
        }
        saveUserinfo(this.param, text).then((res) => {
          if (res.data.status === ERR_OK) {
            this.domArr.children[1].innerText = text
            this.$refs.inputBox.setText()
            if (this.param === 'truename') {
              this.setName(text)
            }
            this.maskText = '修改成功...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          } else {
            this.maskText = '修改失败，请重试...'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$refs.dialogMask.hide()
            }, 1500)
          }
        }).catch(() => {
          this.maskText = '修改失败，请重试...'
          this.$refs.dialogMask.show()
          setTimeout(() => {
            this.$refs.dialogMask.hide()
          }, 1500)
        })
      },
      address (e) {
        let that = this
        getProvince().then((res) => {
          if (res.data.status === ERR_OK) {
            let arr = res.data.info
            let pro = []
            let city = []
            let area = []
            arr.forEach((item) => {
              let obj = {}
              obj['text'] = item.name
              obj['value'] = item.id
              pro.push(obj)
            })
            // 默认请求一次省份获取市区
            let proid = pro[0].value
            console.log(pro)
            getCity(proid).then((res) => {
              if (res.data.status === ERR_OK) {
                city = []
                let arr = res.data.info
                arr.forEach((item) => {
                  let obj = {}
                  obj['text'] = item.name
                  obj['value'] = item.id
                  city.push(obj)
                })
                // 第一次获取区域
                let areaid = city[0].value
                getArea(areaid).then((res) => {
                  if (res.data.status === ERR_OK) {
                    area = []
                    let arr = res.data.info
                    arr.forEach((item) => {
                      let obj = {}
                      obj['text'] = item.name
                      obj['value'] = item.id
                      area.push(obj)
                    })
                    let picker = new Picker({
                      data: [pro, city, area],
                      selectedIndex: [0, 0, 0],
                      title: '地址选择'
                    })
                    // 滚动停止派发事件
                    picker.on('picker.change', function (index, selectedIndex) {
                      if (index === 0) {
                        let id = pro[selectedIndex].value
                        getCity(id).then((res) => {
                          if (res.data.status === ERR_OK) {
                            city = []
                            let arr = res.data.info
                            arr.forEach((item) => {
                              let obj = {}
                              obj['text'] = item.name
                              obj['value'] = item.id
                              city.push(obj)
                            })
                            picker.refillColumn(1, city)
                          }
                        })
                      } else if (index === 1) {
                        let id = city[selectedIndex].value
                        getArea(id).then((res) => {
                          if (res.data.status === ERR_OK) {
                            area = []
                            let arr = res.data.info
                            arr.forEach((item) => {
                              let obj = {}
                              obj['text'] = item.name
                              obj['value'] = item.id
                              area.push(obj)
                            })
                            picker.refillColumn(2, area)
                          }
                        })
                      }
                    })
                    picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
                      let par = ['fxz_province', 'fxz_city', 'fxz_area']
                      saveUserinfo(par.toString(), selectedVal.toString()).then((res) => {
                        console.log(res)
                        if (res.data.status === ERR_OK) {
                          console.log(11)
                          e.children[1].innerText = pro[selectedIndex[0]].text + ' ' + city[selectedIndex[1]].text + ' ' + area[selectedIndex[2]].text
                          this._getUserInfo()
                          that.maskText = '修改成功...'
                          that.$refs.dialogMask.show()
                          setTimeout(() => {
                            that.$refs.dialogMask.hide()
                          }, 1500)
                        } else {
                          console.log(22)
                          that.maskText = '修改失败，请重试...'
                          that.$refs.dialogMask.show()
                          setTimeout(() => {
                            that.$refs.dialogMask.hide()
                          }, 1500)
                        }
                      }).catch(() => {
                        that.maskText = '修改成功...'
                        that.$refs.dialogMask.show()
                        setTimeout(() => {
                          that.$refs.dialogMask.hide()
                        }, 1500)
                      })
                    })
//                    // 点击确定插入地址
//                    picker.on('picker.select', function (selectedVal, selectedIndex) {
//                      e.target.children[1].innerText = pro[selectedIndex[0]].text + ' ' + city[selectedIndex[1]].text + ' ' + area[selectedIndex[2]].text
//                    })
                    picker.show()
                  }
                })
              }
            })
          }
        })
      },
      selectShop (e, area) {
        let that = this
        if (area) {
          getShop().then((res) => {
            if (res.data.status === ERR_OK) {
              let arr = res.data.info
              let shop = []
              arr.forEach((item) => {
                let obj = {}
                obj['text'] = item.shop_name
                obj['value'] = item.id
                shop.push(obj)
              })
              console.log(shop)
              var picker = new Picker({
                data: [shop],
                selectedIndex: [0],
                title: '幼儿园选择'
              })

              picker.on('picker.select', function (selectedVal, selectedIndex) {
                let par = 'shopid'
                saveUserinfo(par, selectedVal.toString()).then((res) => {
                  if (res.data.status === ERR_OK) {
                    e.children[1].innerText = shop[selectedIndex[0]].text
                    that.maskText = '修改成功...'
                    that.$refs.dialogMask.show()
                    setTimeout(() => {
                      that.$refs.dialogMask.hide()
                    }, 1500)
                  } else {
                    that.maskText = '修改失败，请重试...'
                    that.$refs.dialogMask.show()
                    setTimeout(() => {
                      that.$refs.dialogMask.hide()
                    }, 1500)
                  }
                })
              })
              picker.show()
            } else {
              that.maskText = '此地区没有相关幼儿园...'
              that.$refs.dialogMask.show()
              setTimeout(() => {
                that.$refs.dialogMask.hide()
              }, 1500)
            }
          })
        } else {
          that.maskText = '您未选择地址，请先选择地址...'
          that.$refs.dialogMask.show()
          setTimeout(() => {
            that.$refs.dialogMask.hide()
          }, 1500)
        }
      },
      selectSex (e) {
        let that = this
        var sexArr = [
          {
            text: '保密',
            value: '0'
          }, {
            text: '男',
            value: '1'
          },
          {
            text: '女',
            value: '2'
          }
        ]

        var picker = new Picker({
          data: [sexArr],
          selectedIndex: [0],
          title: '性别选择'
        })
        console.log(picker.select)
        picker.on('picker.select', function (selectedVal, selectedIndex) {
          console.log(selectedVal)
          console.log(selectedIndex)
          let par = 'sex'
          saveUserinfo(par, selectedVal.toString()).then((res) => {
            console.log(res)
            if (res.data.status === ERR_OK) {
              console.log('res', res.data.status)
              e.children[1].innerText = sexArr[selectedIndex[0]].text
              that.maskText = '修改成功...'
              that.$refs.dialogMask.show()
              setTimeout(() => {
                that.$refs.dialogMask.hide()
              }, 1500)
            } else {
              that.maskText = '修改失败，请重试...'
              that.$refs.dialogMask.show()
              setTimeout(() => {
                that.$refs.dialogMask.hide()
              }, 1500)
            }
          })
        })
        picker.show()
//
//        picker.on('picker.change', function (index, selectedIndex) {
//        })
//
//        picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
//        })
      },
      loginOut () {
        localStorage.removeItem('userInfo')
        this.setUserInfo({})
        this.$router.replace({
          path: `/mine`
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO',
        setAvatar: 'SET_NATIVE_AVATAR',
        setName: 'SET_NATIVE_NAME'
      })
    },
    components: {
      Split,
      InputBox,
      DialogMask,
      UpdataPwd,
      TwoCode,
      Scroll
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

  .myInfoScroll {
    position: fixed;
    top: 0;
    bottom: 50px;
    padding-bottom: 70px;
    width: 100%;
    left: 0;
  }

  .mineScroll > div {
    min-height: 110%;
  }

  .myInfoScroll .avatar_1 {
    padding-top: 40px;
    padding-bottom: 20px;
  }

  .myInfo {
    background: #fff;
    width: 100%;
    height: 120%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .myInfo > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    position: fixed;
    z-index: 60;
  }

  .myInfo > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .myInfo .avatar {
    padding: 17px;
    text-align: center;
    background-image: -webkit-linear-gradient(to top, #a2d2e8, #00a9e4);
    background-image: linear-gradient(to top, #a2d2e8, #00a9e4);
    position: relative;
    top: 43px;
    z-index: 60;
  }

  .myInfo .circle-1 {
    height: 86px;
    width: 86px;
    padding: 6px;
    box-sizing: border-box;
    background: #a2d2e8;
    border-radius: 50%;
    margin: auto;
  }

  .myInfo .circle-2 {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    margin: auto;
    position: relative;
  }

  .myInfo .circle-2 > input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .myInfo ul.details {
    padding: 0 12px;
    font-size: 14px;
  }

  .myInfo ul.d2 {
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .myInfo .details li {
    position: relative;
    padding: 12px 0;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    color: #333333;
  }

  .myInfo .details li:last-child {
    border-bottom: 0;
  }

  .myInfo .details li .item-left {
    display: inline-block;
  }

  .myInfo .details li .item-right {
    display: inline-block;
    position: absolute;
    right: 0;
  }

  .myInfo .login-out {
    width: 80%;
    height: 42px;
    line-height: 42px;
    margin: auto;
    font-size: 16px;
    text-align: center;
    border-radius: 10px;
    background: #00a9e4;
    color: #ffffff;
    margin-top: 10px;
  }

  .picker .picker-panel .picker-choose .confirm {
    right: 0;
    color: #00a9e4;
  }
</style>

