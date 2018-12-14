<!--
  User: fanqingyu
  Date: 2017/8/8 0008 17:56
  功能：
-->
<template>
  <div class="homeType" v-show="bookType.length">
    <ul class="clear">
      <li class="type-item" v-for="(item, index) in bookType" v-if="index < 7" @click="clickBookType(index, item)">
        <span :class="{'active': selectIndex === index}">{{item.title}}</span>
      </li>
      <li class="type-item" @click="moreBookType"><span>更多<i
        class="iconfont icon-zuoyoujiantouicon10024"></i></span></li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getHomeType } from 'api/home'
  import { ERR_OK } from 'api/config'

  const READ = 1
  const LISTEN = 2
  export default {
    data () {
      return {
        bookType: [],
        selectIndex: 0,
        bookTypeIndex: false
      }
    },
    created () {
      this._getTypeList(READ)
    },
    methods: {
      _getTypeList (typeId) {
        getHomeType(typeId).then((res) => {
          if (res.data.status === ERR_OK) {
            this.readTypeId = res.data.info[0].id
            this.bookType = res.data.info
            if (typeId === READ) {
              this.$emit('readTypeId', this.readTypeId)
            } else if (typeId === LISTEN) {
              this.$emit('listenTypeId', this.readTypeId)
            }
          }
        })
      },
      clickBookType (index, item) {
        this.selectIndex = index
        this.readTypeId = item.id
        this.$emit('clickBookType', item)
      },
      changeIndex (index) {
        this.selectIndex = index
      },
      moreBookType () {
        this.$emit('moreBookType', this.bookType)
      }
    }
  }
</script>

<style scoped>

  .homeType > ul > .type-item {
    padding: 12px 6px 0 6px;
    float: left;
    width: 25%;
    text-align: center;
    box-sizing: border-box;
    font-size: 12px;
  }

  .homeType > ul > .type-item > span {
    display: inline-block;
    padding: 10px;
    width: 100%;
    border: 1px solid #00a9e4;
    border-radius: 3px;
    color: #00a9e4;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .homeType > ul > .type-item:last-child > span {
    display: inline-block;
    padding: 10px;
    width: 100%;
    border: 1px solid #cccccc;
    border-radius: 3px;
    background: #ffffff;
    color: #000000;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .homeType > ul > .type-item > .active {
    background: #00a9e4;
    color: #ffffff;
  }

  .homeType > ul > .type-item > span > .iconfont {
    font-size: 12px;
    position: relative;
    top: 1px;
  }
</style>
