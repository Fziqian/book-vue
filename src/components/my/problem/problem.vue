<template>
  <transition name="move">
    <div class="problem">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">常见问题</span>
      </div>
      <split></split>
      <scroll class="content-wrapper">
        <div class="problem-list bt">
          <div class="title">
            <span class="icon"></span>
            <span class="text">问题列表</span>
          </div>
          <ul>
            <li class="list-item" v-for="(item, index) in list" @click="showProblemDetail(index)">{{item}}</li>
          </ul>
        </div>
      </scroll>
      <problemDetail ref="problemDetail" :listIndex="listIndex"></problemDetail>
    </div>
  </transition>
</template>
<script>
  import Split from 'base/split/split'
  import ProblemDetail from 'components/my/problemDetail/problemDetail'
  import Scroll from 'base/scroll/scroll'

  export default {
    data () {
      return {
        list: [
          '1.什么时候才能收到退还的押金？押金退到哪？',
          '2.借书有时间限定吗？',
          '3.购买了VIP读书卡还需要押金吗？',
          '4.如何观看所有视频？',
          '5.如何购书？',
          '6.幼儿园可以借书吗？',
          '7.还书流程是怎样的？',
          '8.借阅卡遗失怎么办？',
          '9.如何补办借阅卡？',
          '10.幼儿离校需办理退证手续吗？',
          '11.幼儿单次借书本数？借期时长？',
          '12.图书超期为什么要视为遗失进行赔偿？',
          '13.图书损坏，丢失怎么处理？'
        ],
        listIndex: 0
      }
    },
    methods: {
      showProblemDetail (index) {
        this.listIndex = index
        this.$refs.problemDetail.show()
      },
      goBack () {
        this.$router.back()
      }
    },
    components: {
      Split,
      ProblemDetail,
      Scroll
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

  .problem {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .problem > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: fixed;
    top: 0;
    z-index: 50;
  }

  .problem > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    color: #ffffff;
    width: 50px;
  }

  .problem > .split {
    position: fixed;
    top: 42px;
    z-index: 50;
  }

  .problem > .content-wrapper {
    position: fixed;
    top: 56px;
    bottom: 50px;
    width: 100%;
  }

  .problem > .content-wrapper > .problem-list {
    padding: 16px 12px;
    background: #ffffff;
  }

  .problem > .content-wrapper > .problem-list .title {
    font-size: 0;
    margin-bottom: 16px;
  }

  .problem > .content-wrapper > .problem-list .title .icon {
    display: inline-block;
    background: url("question.png");
    background-size: 14px 14px;
    background-repeat: no-repeat;
    margin-right: 8px;
    width: 14px;
    height: 14px;
    line-height: 14px;
  }

  .problem > .content-wrapper > .problem-list .title .text {
    display: inline-block;
    line-height: 14px;
    vertical-align: top;
    font-size: 14px;
    color: #333333;
  }

  .problem > .content-wrapper > .problem-list .list-item {
    font-size: 14px;
    color: #666666;
    padding: 10px 0;
  }

  .problem > .content-wrapper > .problem-list .list-item:last-child {
    margin-bottom: 0;
  }

  .problem > .content-wrapper > .bt {
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }
</style>
