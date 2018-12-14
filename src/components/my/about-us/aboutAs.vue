<template>
  <transition name="move">
    <div class="about">
      <div class="title">
        <span @click="goBack()" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">关于我们</span>
      </div>
      <div class="content">
        <img src="./td-logo.png" width="100%" alt="">
      </div>
      <ul class="contact">
        <!--<li class="contact-item">-->
          <!--<span class="icon web"></span>-->
          <!--<span class="text">官方网站：www.xxxxxxxx.com</span>-->
        <!--</li>-->
        <li class="contact-item">
          <span class="icon wechat"></span>
          <span class="text">官方微信：金百汇文化</span>
        </li>
        <li class="contact-item">
          <span class="icon qq"></span>
          <span class="text">商务Q Q：1439008076</span>
        </li>
        <li class="contact-item">
          <span class="icon coop"></span>
          <span class="text">商务合作：027-87870811</span>
        </li>
        <li class="contact-item">
          <span class="icon email"></span>
          <span class="text">客服邮箱：1439008076@qq.com</span>
        </li>
      </ul>
      <div class="org">Copyright &copy; 2017-2018 金百汇 版权所有
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    methods: {
      goBack () {
        this.$router.back()
      }
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

  .about {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 110;
    top: 0;
    left: 0
  }

  .about > .title {
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

  .about > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }

  .about .content {
    width: 30%;
    margin: 40px auto 56px auto;
  }
  .about .contact {
    width: 75%;
    margin: 0 auto;
  }
  .about .contact .contact-item {
    margin-bottom: 10px;
    font-size: 0;
  }
  .about .contact .contact-item .web{
    background-image: url("icon_web.png");
  }
  .about .contact .contact-item .wechat{
    background-image: url("icon_weixin.png");
  }
  .about .contact .contact-item .email{
    background-image: url("icon_email.png");
  }
  .about .contact .contact-item .coop{
     background-image: url("icon_coop.png");
   }
  .about .contact .contact-item .qq{
    background-image: url("icon_qq.png");
  }

  .about .contact .contact-item .icon{
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 18px 18px;
    background-repeat: no-repeat;
  }
  .about .contact .contact-item .text{
    display: inline-block;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
  }
  .about .org {
    width: 100%;
    position: absolute;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    color: #666666;
    bottom: 30px;

  }
</style>

