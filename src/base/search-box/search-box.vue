<!--
  User: fanqingyu
  Date: 2017/7/5 16:39
  功能：
-->

<template>
  <div class="search">
    <span @click="goBack" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
    <span class="s-input">
      <i class="iconfont icon-sousou"></i>
      <input type="text" class="input" v-model="query" placeholder="请输入关键字">
    </span>
    <span class="s-btn" @click="search" @keyup.enter="search">搜索</span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        query: ''
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      search () {
        this.$emit('search')
      },
      setQuery (query) {
        this.query = query
      }
    },
    created () {
      this.$watch('query', (newQuery) => {
        this.$emit('query', newQuery)
      })
    }
  }
</script>

<style>
  @import '../../common/css/iconfont.css';

  .search {
    display: flex;
    height: 28px;
    line-height: 28px;
    padding: 10px 0;
    font-size: 0;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
    background: #fff;
    z-index: 51;
  }

  .search > span {
    display: inline-block;
  }

  .search > .back {
    width: 40px;
    font-size: 16px;
    text-align: center;
    flex: 0 0 40px;
    color: #00a9e4;
  }

  .search > .s-input {
    position: relative;
    flex: 1;
    height: 28px;
    line-height: 28px;
  }

  .search > .s-input > input {
    width: 100%;
    height: 28px;
    line-height: 28px;
    background: #e8e8e8;
    border-radius: 5px;
    color: #000000;
    font-size: 14px;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .search > .s-btn {
    width: 50px;
    font-size: 15px;
    text-align: center;
    flex: 0 0 50px;
    color: #333;
  }

  .search > .s-input > .icon-sousou {
    position: absolute;
    flex: 1;
    font-size: 12px;
    left: 5px;
  }
</style>
