<!--
  User: fanqingyu
  Date: 2017/8/9 0009 15:14
  功能：
-->
<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">请输入修改的文字</p>
          <input type="text" maxlength="10" v-model="text">
          <div class="operate">
            <div @click="cancel" class="operate-btn left">取消</div>
            <div class="operate-btn" @click="sure">确认</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        showFlag: false,
        text: ''
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      cancel () {
        this.showFlag = false
      },
      sure () {
        this.showFlag = false
        this.$emit('sure', this.text)
      },
      setText () {
        this.text = ''
      }
    }
  }
</script>

<style scoped>
  .confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: rgba(0, 0, 0, 0.6)
  }

  .confirm-fade-enter-active {
    animation: confirm-fadein 0.3s
  }

  .confirm .confirm-content {
    animation: confirm-zoom 0.3s
  }

  .confirm .confirm-wrapper {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }

  .confirm .confirm-wrapper .confirm-content {
    width: 250px;
    border-radius: 13px;
    background: #888;
    text-align: center;
  }

  .confirm .confirm-wrapper .confirm-content input {
    margin-bottom: 10px;
    width: 90%;
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    border-radius: 5px;
    outline-style: none;
  }

  .confirm .confirm-wrapper .confirm-content .text {
    padding: 10px 15px;
    line-height: 22px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .confirm .confirm-wrapper .confirm-content .operate {
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 14px;
  }

  .confirm .confirm-wrapper .confirm-content .operate .operate-btn {
    flex: 1;
    line-height: 22px;
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.3);
  }

  .confirm .confirm-wrapper .confirm-content .operate .left {
    border-right: 1px solid rgba(0, 0, 0, 0.3);
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0)
    }
    50% {
      transform: scale(1.1)
    }
    100% {
      transform: scale(1)
    }
  }

</style>
