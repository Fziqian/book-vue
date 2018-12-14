<!--

  User: fanqingyu

  Date: 2017/6/5 9:54

  功能：

-->
<template>
  <div class="home">
    <div class="title">
      <span class="linedetail" @click="line"><i class="iconfont icon-zuixin"></i></span>
      <span class="title-tab">
        <span class="tab-item" @click="toggle(1, $event)" :class="{'active': selectTab === 1}">看绘本</span>
        <span class="tab-item" @click="toggle(2, $event)" :class="{'active': selectTab === 2}">听绘本</span>
        <!--<span class="tab-item" @click="toggle(3, $event)" :class="{'active': selectTab === 3}">绘本课</span>-->
      </span>
      <span class="search-div" @click="homeSearch"><i class="iconfont icon-sousou"></i></span>
    </div>
    <transition name="fade">
      <div class="tip" v-show="!noRefresh">
        <div class="text">
          数据更新成功
        </div>
      </div>
    </transition>
    <div class="content-wrapper">
      <div class="bookType" v-show="selectTab !== 3">
        <homeType ref="homeType" @clickBookType="clickBookType" @moreBookType="moreBookType"
                  @readTypeId="changeReadTypeId" @listenTypeId="changeListenTypeId"></homeType>
      </div>
      <div class="read-content" v-show="selectTab === 1" ref="readContent">
        <homelist ref="homelist" @readSelectItem="readSelectItem" @readsuccessRefresh="successRefresh" :pullup="true"
                  :flagPull="true"></homelist>
      </div>
      <div class="listen-content" v-show="selectTab === 2" ref="listenContent">
        <listenList ref="listenList" @player="player" @listensuccessRefresh="successRefresh" :pullup="true"
                    :flagPull="true"></listenList>
      </div>
      <!--<div class="book-content" v-show="selectTab === 3">-->
        <!--<booklist ref="booklist" @readSelectItem="readSelectItem" @readsuccessRefresh="successRefresh" :pullup="true"-->
                  <!--:flagPull="true"></booklist>-->
      <!--</div>-->
    </div>
    <more ref="more" @changeBookType="changeBookType" :nativeType="nativeType"></more>
    <div class="download-content-wrapper"></div>
    <router-view :key="$route.path"></router-view>
  </div>
</template>


<script>
  /* eslint-disable no-unused-vars */

  import Scroll from 'base/scroll/scroll'
  import More from 'components/home/more/more'
  import { getHomeType, getHomeList, addPlayNum, saveTypeList } from 'api/home'
  import { ERR_OK } from 'api/config'
  import AudioClass from 'common/js/audioClass'
  import { mapGetters } from 'vuex'
  import NoResult from 'base/no-result/no-result'
  import Booklist from 'components/home/bookList/booklist'
  import ListenList from 'components/home/listenList/listenList'
  import Homelist from 'components/home/homelist/homelist'
  import HomeType from 'components/home/homeType/homeType'

  const READ = 1
  const LISTEN = 2
  const Book = 3
  export default {
    props: {},
    data () {
      return {
        selectTab: 1,
        nativeType: [],
        noRefresh: true
      }
    },
    created () {
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      changeReadTypeId (id) {
        this.$refs.homelist.setType(this.selectTab, id)
        this.$refs.homelist._getHomelist(this.selectTab, id)
      },
      changeListenTypeId (id) {
        this.$refs.listenList.setType(this.selectTab, id)
        this.$refs.listenList._getListenList(this.selectTab, id)
      },
      homeSearch () {
        this.$router.push({
          name: 'homeSearch'
        })
      },
      player (item) {
        addPlayNum(item.id).then((res) => {
        })
        this.$router.push({
          name: 'listenDetail',
          params: {listenId: item.id}
        })
      },
      // tab切换，改变selectTab的值来动态切换
      toggle (type, event) {
        console.log(type)
        this.selectTab = type
        if (type === READ) {
          this.$refs.homeType._getTypeList(1)
          this.$refs.homeType.changeIndex(0)
        }
        if (type === LISTEN) {
          this.$refs.homeType._getTypeList(2)
          this.$refs.homeType.changeIndex(0)
        }
        if (type === Book) {
          this.$refs.booklist.setType(this.selectTab, 22)
          this.$refs.booklist._getHomelist(this.selectTab, 22)
        }
      },
      line () {
        this.$router.push({name: 'line'})
      },
      moreBookType (types) {
        this.nativeType = types
        this.$refs.more.show()
      },
      clickBookType (item) {
        if (this.selectTab === READ) {
          this.$refs.homelist.setType(this.selectTab, item.id)
          this.$refs.homelist._getHomelist(this.selectTab, item.id)
        } else if (this.selectTab === LISTEN) {
          this.$refs.listenList.setType(this.selectTab, item.id)
          this.$refs.listenList._getListenList(this.selectTab, item.id)
        }
      },
      changeBookType (item) {
        let arr = []
        item.forEach((type) => {
          arr.push(type.id)
        })
        saveTypeList(arr.toString(), this.selectTab).then((res) => {
          console.log(res)
          if (res.data.status === ERR_OK) {
            this.$refs.homeType._getTypeList(this.selectTab)
            this.$refs.homeType.changeIndex(0)
            if (this.selectTab === READ) {
              this.$refs.homelist._getHomelist(this.selectTab, arr[0])
            } else if (this.selectTab === LISTEN) {
              this.$refs.listenList._getListenList(this.selectTab, arr[0])
            }
          }
        })
      },
      successRefresh () {
        this.noRefresh = false
        setTimeout(() => {
          this.noRefresh = true
        }, 1500)
      },
      readSelectItem (item) {
        addPlayNum(item.id).then((res) => {
        })
        this.$router.push({
          name: 'readDetail',
          params: {readId: item.id}
        })
      }
    },
    activated () {
      this.$watch('userInfo', () => {
        this.$refs.homeType._getTypeList(1)
      })
    },
    components: {
      Scroll,
      More,
      NoResult,
      Booklist,
      ListenList,
      Homelist,
      HomeType
    }
  }
</script>


<style>
  @import '../../../common/css/iconfont.css';

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .home {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .home > .title {
    display: flex;
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 0;
    color: #ffffff;
    position: relative;
    z-index: 60;
  }

  .home > .title > .linedetail {
    display: inline-block;
    line-height: 42px;
    height: 42px;
    color: #ffffff;
    flex: 0 0 50px;
  }

  .home > .title > .linedetail > .iconfont {
    font-size: 20px;
  }

  .home > .title > .title-tab {
    display: inline-block;
    font-size: 14px;
    line-height: 42px;
    height: 42px;
    color: #ffffff;
    flex: 1;
  }

  .home > .title > .title-tab > .tab-item {
    display: inline-block;
    font-size: 14px;
    padding: 0 10px 3px 10px;
    line-height: 42px;
    height: 42px;
    color: #a2d2e8;
    flex: 1;
    box-sizing: border-box;
  }

  .home > .title > .title-tab > .active {
    color: #ffffff;
    border-bottom: 3px solid #ffffff;
  }

  .home > .title > .search-div {
    display: inline-block;
    font-size: 14px;
    line-height: 42px;
    height: 42px;
    color: #ffffff;
    flex: 0 0 50px;
  }

  .home > .title > .search-div > .iconfont {
    font-size: 20px;
  }

  .home > .tip {
    position: fixed;
    width: 100%;
    text-align: center;
    z-index: 51;
  }

  .home > .tip > .text {
    font-size: 12px;
    color: #fff;
    display: inline-block;
    padding: 10px 10px 5px;
    border-radius: 10px;
    background: #00a9e4;
  }

  .home > .content-wrapper {
    position: fixed;
    top: 42px;
    height: 100%;
    width: 100%;
  }

  .home > .content-wrapper > .bookType {
    padding: 0 5px 10px 5px;
    background: #f4f4f4;
    position: fixed;
    z-index: 60;
    width: 100%;
    box-sizing: border-box;
  }

  .home > .content-wrapper > .read-content {
    position: fixed;
    top: 100px;
    bottom: 50px;
    width: 100%;
  }

  .home > .content-wrapper > .listen-content {
    position: fixed;
    top: 88px;
    bottom: 50px;
    width: 100%;
  }

  .home > .content-wrapper > .book-content {
    position: fixed;
    top: 0px;
    bottom: 50px;
    width: 100%;
  }

  .home > .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 30%;
    transform: translateY(-20%);
  }
</style>
