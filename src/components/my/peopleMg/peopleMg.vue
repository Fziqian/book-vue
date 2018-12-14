<!--
  User: fanqingyu
  Date: 2017/7/5 11:09
  功能：
-->

<template>
  <transition name="move">
    <div class="peopleMg">
      <div class="title">
        <span @click="goBack" class="back"><i class="iconfont icon-zuoyoujiantouicon100241"></i></span>
        <span>人员管理</span>
        <span class="addSearch" @click="addSearch">添加</span>
      </div>
      <div class="result" v-if="peoples">
        <!--<div class="total">共计<span>&nbsp;6&nbsp;</span>人，已办卡<span>&nbsp;2&nbsp;</span>人</div>-->
        <div class="content-wrapper" ref="contentWrapper">
          <peopleList @select="selectPeople" :isSlider="true" :peoples="peoples"></peopleList>
        </div>
      </div>
      <div class="no-result-wrapper" v-if="!peoples">
        <no-result title="暂无添加人员"></no-result>
      </div>
      <router-view></router-view>
      <peopleDetail ref="peopleDetail" :isAdd="false"></peopleDetail>
    </div>
  </transition>
</template>
<script>
  import { mapMutations, mapGetters } from 'vuex'
  import PeopleList from 'components/my/peopleList/peopleList'
  import PeopleDetail from 'components/my/peopleDetail/peopleDetail'
  import NoResult from 'base/no-result/no-result'
  import { ERR_OK } from 'api/config'
  import { getPeopleMg } from 'api/user'

  // eslint-disable-next-line no-unused-vars
  /* eslint-disable no-unused-vars */

  const PAGESIZE = 1000
  export default {
    data () {
      return {
        selectTab: 1,
        peoples: []
      }
    },
    created () {
      this._getPeopleList()
    },
    computed: {
      ...mapGetters([
        'statePeopleMg'
      ])
    },
    methods: {
      _getPeopleList () {
        getPeopleMg(PAGESIZE).then((res) => {
          if (res.data.status === ERR_OK) {
            this.peoples = res.data.info
          }
        })
      },
      goBack () {
        this.$router.back()
      },
      addSearch () {
        this.$router.push({
          path: 'peopleMg/peopleSearch'
        })
      },
      selectPeople (people) {
        this.setUser(people)
        this.$refs.peopleDetail.show()
      },
      ...mapMutations({
        setUser: 'SET_USER_INFO'
      })
    },
    components: {
      PeopleList,
      PeopleDetail,
      NoResult
    }
  }
</script>
<style>
  @import '../../../common/css/iconfont.css';

  .move-enter-active, .move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }

  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .peopleMg {
    background: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0
  }

  .peopleMg > .title {
    width: 100%;
    height: 42px;
    text-align: center;
    background: #00a9e4;
    line-height: 42px;
    font-size: 18px;
    color: #ffffff;
    position: relative;
  }

  .peopleMg > .title > .addSearch {
    position: absolute;
    right: 15px;
    top: 0;
    display: block;
    font-size: 14px;
    line-height: 42px;
    height: 42px;
    color: #ffffff
  }

  .peopleMg > .result> .content-wrapper {
    width: 100%;
    position: absolute;
    top: 46px;
    bottom: 50px;
    overflow: hidden;
  }

  .peopleMg > .result> .total {
    background: #f1f1f1;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    color: #666666;
  }

  .peopleMg > .content-wrapper > .content-wrapper-scroll > .total > span {
    color: #00a9e4;
  }

  .peopleMg > .title > .back {
    position: absolute;
    left: 15px;
    top: 0;
    border-radius: 50%;
    display: block;
    height: 42px;
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

</style>

