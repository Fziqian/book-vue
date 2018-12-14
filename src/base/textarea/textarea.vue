<!--
  User: fanqingyu
  Date: 2017/7/14 15:42
  功能：
-->

<template>
  <div class="textarea-wrapper">
    <textarea ref="text" class="text" maxlength="200" :placeholder="title" v-model="contentText" autofocus></textarea>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '请输入内容'
      }
    },
    data () {
      return {
        contentText: ''
      }
    },
    methods: {
      setText () {
        this.contentText = ''
      },
      onFocus () {
        this.$refs.text.focus()
      }
    },
    created () {
      this.$watch('contentText', (newQuery) => {
        this.$emit('contentText', newQuery)
      })
    }
  }
</script>

<style>
  .textarea-wrapper {
    margin-top: 16px;
    width: 100%;
    height: 90%;
  }
  .textarea-wrapper > .text {
    width: 100%;
    height: 100%;
    border: 0;
    resize: none;
    overflow: auto;
    word-break: break-all;
    font-size: 14px;
  }
  .textarea-wrapper > .text:focus {
    border: 0;
    outline-color: #ffffff;
  }
</style>
