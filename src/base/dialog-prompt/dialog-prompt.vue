<!--
  User: fanqingyu
  Date: 2017/7/24 13:52
  功能：
-->

<template>
  <div class="dialog-prompt">
    <loading :title="title"></loading>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  export default {
    props: {
      title: {
        type: String,
        default: '登录中...'
      }
    },
    components: {
      Loading
    }
  }
</script>

<style>
  .dialog-prompt {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
  .dialog-prompt > .loading {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
