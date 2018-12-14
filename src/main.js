/* eslint-disable no-unused-vars,semi */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
// import vConsole from 'vconsole'

fastclick.attach(document.body)
/* eslint-disable no-new */
Vue.use(VueLazyLoad, {
  error: require('common/image/default.png'),
  loading: require('common/image/default.png'),
  filter: {
    progressive (listener, options) {
      const isCDN = /up/
      if (isCDN.test(listener.src)) {
        listener.loading = require('common/image/homeDefault.png')
        listener.error = require('common/image/homeDefault.png')
      }
    }
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})

