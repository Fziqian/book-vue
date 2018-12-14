<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" style="padding: 0 100px">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style>

  .loading {
    width: 100%;
    text-align: center;
  }
  .loading > .desc{
    line-height: 20px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
  }

</style>
