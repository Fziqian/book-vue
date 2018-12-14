<!--
  User: fanqingyu
  Date: 2017/6/6 16:15
  功能：确认支付页面
-->

<template>
  <transition name="move">
    <div class="orderSuccess">
      <div class="title">
        <span class="back" @click="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">提交成功</span>
      </div>
      <div class="content">
        <div class="bg-wrapper">
          <img class="bg" src="./order_ok_bg.png"></img>
          <img class="bg-icon" src="./order_ok.png" alt="">
          <div class="text">订单提交成功</div>
        </div>
        <div class="desc">
          <span>您好，订单已提交成功</span>
          <span>请于40分钟内去【幼儿园】图书馆领取</span>
          <span>请注意：当天【18：00】之后订单将重置</span>
        </div>
        <div class="showMyOrder" @click="showOrder">查看我的订单</div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    methods: {
      back () {
        this.$router.replace({
          path: '/chooseBooks'
        })
      },
      showOrder () {
        this.$router.push({
          path: `/mine/order`
        })
      }
    }
  }
</script>


<style>
  @import '../../../common/css/iconfont.css';

  .orderSuccess {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 100;
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .orderSuccess > .title {
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

  .orderSuccess > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .orderSuccess > .content > .bg-wrapper {
    width: 100%;
    text-align: center;
    position: relative;
  }

  .orderSuccess > .content > .bg-wrapper > .bg {
    width: 100%;
  }

  .orderSuccess > .content > .bg-wrapper > .bg-icon {
    width: 60px;
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
  }

  .orderSuccess > .content > .bg-wrapper > .text {
    position: absolute;
    top: 95px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 14px;
  }
  .orderSuccess > .content > .desc {
    padding: 26px 42px;
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
  }
  .orderSuccess > .content > .desc > span{
    display: inline-block;
    color: #333;
  }

  .orderSuccess > .content > .showMyOrder {
    margin: 0 auto;
    width: 200px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: #00a9e4;
    color: #fff;
    border-radius: 21px;
  }

</style>
