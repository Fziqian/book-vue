<template>
  <transition name="move">
    <div class="peopleDetail" v-if="showFlag">
      <div class="title">
        <span class="back" @click="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">详细信息</span>
      </div>
      <div class="content-wrapper">
        <div class="desc">
          <div class="avatar">
            <img :src="userInfo.avatar" width="100%" height="100%" alt="">
          </div>
          <div class="content">
            <div class="name">
              <span class="text">{{userInfo.truename}}</span>
            </div>
            <div class="phone">
              <span class="text">{{userInfo.mobile}}</span>
            </div>
          </div>
        </div>
        <div class="address" v-show="_trim(userInfo.fxz_address)">
          <span class="icon"><i class="iconfont icon-dizhi"></i></span>
          <span class="text">{{userInfo.fxz_address}}</span>
        </div>
        <div class="kinderAddress" v-show="userInfo.shop_name">
          <span class="icon"><i class="iconfont icon-jianzhu"></i></span>
          <span class="text">{{userInfo.shop_name}}</span>
        </div>
        <div class="sureAdd" @click="_sureAdd" v-if="isAdd">
          确认添加
        </div>
      </div>
      <dialog-mask :maskText="maskText" ref="dialogMask"></dialog-mask>
    </div>
  </transition>
</template>
<script>

  import { mapGetters } from 'vuex'
  import { ERR_OK } from 'api/config'
  import { addPeople } from 'api/user'
  import DialogMask from 'base/dialog-mask/dialog-mask'
  export default {
    props: {
      isAdd: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showFlag: false,
        maskText: ''
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      _trim (str) {
        if (str) {
          return str.replace(/(^\s*)|(\s*$)/g, '')
        }
      },
      back () {
        this.showFlag = false
      },
      show () {
        this.showFlag = true
      },
      _sureAdd () {
        addPeople(this.userInfo.id, 1).then((res) => {
          if (res.data.status === ERR_OK) {
            this.maskText = '添加成功~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$router.replace('/mine')
              this.$refs.dialogMask.hide()
            }, 1000)
          } else {
            this.maskText = '添加失败，请重试~'
            this.$refs.dialogMask.show()
            setTimeout(() => {
              this.$router.replace('/mine')
              this.$refs.dialogMask.hide()
            }, 1000)
          }
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

  .peopleDetail {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .peopleDetail > .title {
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

  .peopleDetail > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .peopleDetail > .content-wrapper {
    padding: 0 12px;
  }

  .peopleDetail > .content-wrapper > .desc {
    position: relative;
    padding: 12px;
    font-size: 0;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .peopleDetail > .content-wrapper > .desc > .avatar {
    width: 64px;
    height: 64px;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    padding: 6px;
    background: #a2d2e8;
    box-sizing: border-box;
  }

  .peopleDetail > .content-wrapper > .desc > .avatar img {
    border-radius: 50%;
  }

  .peopleDetail > .content-wrapper > .desc > .content {
    display: inline-block;
    margin-left: 8px;
  }

  .peopleDetail > .content-wrapper > .desc > .content > .name {
    margin: 12px 0 10px 0;
    font-size: 0;
  }

  .peopleDetail > .content-wrapper > .desc > .content > .name .text {
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
  }

  .peopleDetail > .content-wrapper > .desc > .content > .phone {
    font-size: 0;
  }

  .peopleDetail > .content-wrapper > .desc > .content > .phone .text {
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    color: #999999;
  }

  .peopleDetail > .content-wrapper > .address, .peopleDetail > .content-wrapper > .kinderAddress {
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    font-size: 0;
  }
  .peopleDetail > .content-wrapper > .address > .icon > .iconfont,.peopleDetail > .content-wrapper > .kinderAddress > .icon > .iconfont {
    margin-right: 4px;
    color: #00a9e4;
    font-size: 14px;
  }
  .peopleDetail > .content-wrapper > .address > .text,.peopleDetail > .content-wrapper > .kinderAddress > .text {
    font-size: 14px;
  }

  .peopleDetail > .content-wrapper > .sureAdd {
    width: 200px;
    height: 42px;
    line-height: 42px;
    background: #00a9e4;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    margin: auto;
    margin-top: 36px;
    border-radius: 21px;
  }

</style>
