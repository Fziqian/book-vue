<!--
  User: fanqingyu
  Date: 2017/7/3 14:58
  功能：
-->
<template>
  <transition name="move">
    <div class="problemDetail" v-if="showFlag">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">常见问题</span>
      </div>
      <split></split>
      <div class="content-wrapper">
        <div class="problem-list">
          <div class="title">
            <span class="icon">Q:</span>
            <span class="text" v-html="quenlist[listIndex]"></span>
          </div>
          <div class="content">
            <span class="icon">A:</span>
            <span class="text" v-html="detailList[listIndex]"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>
<script>
  import Split from 'base/split/split'

  export default {
    props: {
      listIndex: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        showFlag: false,
        quenlist: [
          '什么时候才能收到退还的押金？',
          '借书有时间限定吗？',
          '购买了VIP读书卡还需要押金吗？',
          '如何观看所有视频？',
          '如何购书？',
          '幼儿园可以借书吗？',
          '还书流程是怎样的？',
          '借阅卡遗失怎么办？',
          '如何补办借阅卡？',
          '幼儿离校需办理退证手续吗？',
          '幼儿单次借书本数？借期时长？',
          '图书超期为什么要视为遗失进行赔偿？',
          '图书损坏，丢失怎么处理？'
        ],
        detailList: [
          '年卡满一年退还其60元的押金',
          '借书为期一周，最多两周，两周不还视为遗失，按全价的8折赔偿，每人每次借阅2本。',
          '需要，押金在办卡期满，全部退还。',
          '办理会员即可观看所有绘本视频',
          '在选书功能里，直接点击购买。',
          '按幼儿园童书馆开放时间，进馆进行借阅',
          '将完整的书还给童书管理员即可。',
          '读者若遗失了借阅卡，请立即到童书馆办理挂失手续，以免被他人冒用。',
          '请到学校童书馆办理。',
          '需要，如幼儿转园，毕业，或者需要办理退证手续，都将按时间比例进行退款',
          '幼儿每次最多借阅2本，借期不超多2周，借书时必须将上次的书本还回才能继续借阅。',
          '是为了维护大多数读者的利益，保障图书的正常流通，图书超期遗失都将按图书全价的8折进行赔偿。',
          '按全款的8折进行赔偿'
        ]
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      goBack () {
        this.showFlag = false
      }
    },
    components: {
      Split
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

  .problemDetail {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0;
  }

  .problemDetail > .title {
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

  .problemDetail > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .problemDetail > .content-wrapper > .problem-list {
    padding: 16px 12px;
    background: #ffffff;
  }

  .problemDetail > .content-wrapper > .problem-list .title,.problemDetail > .content-wrapper > .problem-list .content {
    font-size: 0;
    margin-bottom: 12px;
  }

  .problemDetail > .content-wrapper > .problem-list .title .icon, .problemDetail > .content-wrapper > .problem-list .content .icon{
    background-size: 14px 14px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: #00a9e4;
  }

  .problemDetail > .content-wrapper > .problem-list .title .text,.problemDetail > .content-wrapper > .problem-list .content .text {
    line-height: 14px;
    vertical-align: top;
    font-size: 14px;
    color: #666666;
  }

</style>
