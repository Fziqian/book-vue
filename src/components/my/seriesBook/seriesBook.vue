<!--

  User: fanqingyu

  Date: 2017/6/6 10:22

  功能：

-->

<template>
  <transition name="move">
    <div class="seriesBook">
      <div class="title">
        <span class="back" @click="back()"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">系列丛书</span>
      </div>
      <div class="list">
        <booklist @select="selectBook" ref="booklist">
        </booklist>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>


<script>
  import Booklist from 'components/chooseBooks/booklist/booklist'
  export default {
    mounted () {
      this.$refs.booklist._getBooklist(this.$route.params.id)
    },
    activated () {
      this.$refs.booklist._getBooklist(this.$route.params.id)
    },
    methods: {
      back () {
        this.$router.back()
      },
      selectBook (item) {
        this.$router.push({
          path: '/mine/bookDetail=' + item.id
        })
      }
    },
    components: {
      Booklist
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

  .seriesBook {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 110;
  }

  .seriesBook > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: relative;
    z-index: 51;
  }

  .seriesBook > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;

  }

  .seriesBook > .list {
    position: fixed;
    width: 100%;
    top: 2px;
    bottom: 50px;
    overflow: hidden;
  }

</style>
