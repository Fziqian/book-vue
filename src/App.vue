<template>
  <div>
    <footer-tab></footer-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  /* eslint-disable no-trailing-spaces */
  import FooterTab from 'base/footer-tab/footer-tab.vue'
  export default {
    components: {
      FooterTab
    }
  }
</script>

<style>

</style>
