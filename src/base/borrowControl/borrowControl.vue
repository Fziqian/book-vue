<!--
  User: fanqingyu
  Date: 2017/7/18 13:56
  功能：
-->

<template>
  <div class="borrowControl" @click="enterBorrow">
    <div class="content" :class="{'active' : num > 0}">
      <span class="num" v-show="num > 0">{{num}}</span>
      <span class="icon"><i class="iconfont icon-shujia"></i></span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        num: 0
      }
    },
    computed: {
      ...mapGetters([
        'books'
      ]),
      numTotal () {
        this.books.forEach((book) => {
          this.num++
        })
      }
    },
    mounted () {
      console.log(this.num)
    },
    methods: {
      enterBorrow () {
        this.$emit('enterBorrow')
      }
    },
    watch: {
      books: {
        handler (newValue, oldValue) {
          console.log(newValue, oldValue)
          if (newValue) {
            for (let i = 0; i < newValue.length; i++) {
              console.log(!oldValue || oldValue[i] !== newValue[i])
              if (!oldValue || oldValue[i] !== newValue[i]) {
                this.num++
                console.log('新', this.num)
              }
            }
          }
          if (oldValue) {
            for (let i = 0; i < oldValue.length; i++) {
              console.log(oldValue[i] !== newValue[i])
              if (oldValue[i] !== newValue[i]) {
                this.num--
                console.log('旧', this.num)
              }
            }
          }
//          for (let i = 0; i < newValue.length; i++) {
//            console.log(oldValue[i] !== newValue[i])
//            if (oldValue[i] === newValue[i]) {
//              this.num = newValue.length - oldValue.length
//              console.log('旧', this.num)
//            }
//          }
        },
        deep: true
      }
    }
  }
</script>



<style>
  @import '../../common/css/iconfont.css';

  .borrowControl {
    position: fixed;
    right: 5px;
    bottom: 70px;
    z-index: 111;
  }

  .borrowControl > .content {
    position: relative;
    width: 44px;
    height: 44px;
    line-height: 44px;
    border-radius: 50%;
    background: #cccccc;
    text-align: center;
    box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.2);
  }

  .borrowControl > .active {
    position: relative;
    width: 44px;
    height: 44px;
    line-height: 44px;
    border-radius: 50%;
    background: #00a9e4;
    text-align: center;
    box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.2);
  }

  .borrowControl > .content > .icon > .iconfont {
    font-size: 24px;
    color: #fff;
  }

  .borrowControl > .content > .num {
    position: absolute;
    top: -5px;
    left: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    background: #f01414;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  }
</style>
