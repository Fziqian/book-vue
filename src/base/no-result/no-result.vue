<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style>

  .no-result{
    text-align: center
  }
  .no-result > .no-result-icon {
    width: 86px;
    height: 90px;
    margin: 0 auto;
    background: url("logoDefault.png");
    background-size: 86px 90px;
  }
  .no-result > .no-result-text {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }

</style>
