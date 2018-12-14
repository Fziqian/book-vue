<!--
  User: fanqingyu
  Date: 2017/7/5 14:13
  功能：
-->

<template>
  <div class="left-delete">
    <div class="move"
         @touchstart="_touchStart"
         @touchmove="_touchMove"
         @touchend="_touchEnd"
         :style="txtStyle">
      <slot></slot>
    </div>
    <div class="deleteIcon" :style="zIndex" @click.prevent="deleteItem(index)">删除</div>
  </div>
</template>

<script>
  export default {
    props: {
      index: {
        type: String,
        default: 0
      },
      isSlider: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        startX: 0,       // 触摸位置
        moveX: 0,       // 滑动时的位置
        disX: 0,       // 移动距离
        txtStyle: '',
        delWidth: 70, // 删除按钮宽度
        top: '',
        zIndex: 'z-index:-1',
        isLeft: false
      }
    },
    methods: {
      _touchStart: function (ev) {
        ev = ev || event
        if (ev.touches.length === 1) {
          // 手指按下的时候记录按下的位置
          this.startX = ev.touches[0].clientX
        }
      },
      _touchMove: function (ev) {
        ev = ev || event
        if (ev.touches.length === 1) {
          // 滑动过程中的实时位置
          this.moveX = ev.touches[0].clientX
          // 滑动过程中实时计算滑动距离
          this.disX = this.startX - this.moveX
          // 如果是向右滑动或者只是点击，不改变滑动位置
          if (this.disX > 0 && this.disX < 100 && this.isSlider === true) {
            // 如果是向左滑动，则实时给这个根元素一个向左的偏移-left，当偏移量到达固定值delWidth时，固定元素的偏移量为 delWidth
            this.txtStyle = 'transform: translateX(-' + this.disX + 'px);transition: all 0.5s'
          }
          if (this.disX < 0 && this.isLeft === true) {
            this.txtStyle = 'transform: translateX(-' + this.disX + 'px);transition: all 0.5s'
          }
        }
      },
      _touchEnd: function (ev) {
        if (this.disX > 0 && this.disX < this.delWidth && this.isSlider === true) {
          // 如果是向左滑动，则实时给这个根元素一个向左的偏移-left，当偏移量到达固定值delWidth时，固定元素的偏移量为 delWidth
          this.txtStyle = 'transform: translateX(0);transition: all 0.5s'
        } else if (this.disX >= this.delWidth && this.isSlider === true) {
          this.txtStyle = 'transform: translateX(-' + this.delWidth + 'px);transition: all 0.5s'
          this.isLeft = true
        }
        if (this.disX < 0 && this.isLeft === true) {
          this.txtStyle = 'transform: translateX(0);transition: all 0.5s'
          this.isLeft = false
        }
      },
      deleteItem: function (index) {
        this.$emit('deleteItem', index)
      }
    }
  }
</script>

<style>
  .left-delete {
    width: 100%;
    height: 71px;
    position: relative;
    z-index: 2;
    border-bottom: 1px solid rgba(1, 17, 27, 0.1);
  }

  .left-delete > .move {
    position: relative;
    background: #ffffff;
  }

  .left-delete > .deleteIcon {
    width: 70px;
    height: 71px;
    line-height: 71px;
    position: absolute;
    text-align: center;
    right: 0;
    top: 0;
    font-size: 16px;
    background: red;
    color: #ffffff;
  }
</style>
