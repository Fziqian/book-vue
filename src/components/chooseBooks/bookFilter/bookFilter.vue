<!--
  User: fanqingyu
  Date: 2017/8/5 14:05
  功能：
-->

<template>
  <transition name="move">
    <div class="bookFilter" v-show="showFilter" ref="bookFilter">
      <div class="title">
        <span class="back" @click="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span class="text">筛选详情</span>
      </div>
      <div class="detailList">
        <booklist ref="booklist" @select="selectBook" :flagPull="true" :pullup="true"></booklist>
      </div>
    </div>
  </transition>
</template>
<script>
  import Booklist from 'components/chooseBooks/booklist/booklist'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        showFilter: false
      }
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'type1',
        'type2',
        'type3'
      ])
    },
    methods: {
      show () {
        this.showFilter = true
        this.$refs.booklist._getBooklist(this.type1, this.type2, this.type3)
      },
      back () {
        this.showFilter = false
      },
      selectBook (item) {
        this.$router.push({
          path: '/chooseBooks/bookDetail=' + item.id
        })
      }
    },
    components: {
      Booklist
    }
  }
</script>

<style scoped>
  @import '../../../common/css/iconfont.css';

  .bookFilter {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 50;
  }

  .bookFilter > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    position: relative;
    z-index: 50;
  }

  .bookFilter > .title > .back {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
    width: 50px;
  }
  .bookFilter > .detailList {
    position: fixed;
    left: 0;
    top: -2px;
    bottom: 50px;
    width: 100%;
  }

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
</style>
