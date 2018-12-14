/**
 * Created by sjs-fqy on 2017/6/14.
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由懒加载
// 首页路由
const Home = (resolve) => {
  import('components/home/index/home').then((module) => {
    resolve(module)
  })
}

// 轨迹
const Line = (resolve) => {
  import('components/home/line/line').then((module) => {
    resolve(module)
  })
}

// 首页搜索
const HomeSearch = (resolve) => {
  import('components/home/homeSearch/homeSearch').then((module) => {
    resolve(module)
  })
}

// 绘本详情
const ReadDetail = (resolve) => {
  import('components/home/readDetail/readDetail').then((module) => {
    resolve(module)
  })
}

// 听书详情
const ListenDetail = (resolve) => {
  import('components/home/player/player').then((module) => {
    resolve(module)
  })
}

// 同学圈
const friends = (resolve) => {
  import('components/friends/friends/friends.vue').then((module) => {
    resolve(module)
  })
}

// 选书
const ChooseBooks = (resolve) => {
  import('components/chooseBooks/index/chooseBooks.vue').then((module) => {
    resolve(module)
  })
}

// 选书搜索
const BookSearch = (resolve) => {
  import('components/chooseBooks/bookSearch/bookSearch').then((module) => {
    resolve(module)
  })
}

// 书本其他系列
const SeriesBook = (resolve) => {
  import('components/chooseBooks/seriesBook/seriesBook').then((module) => {
    resolve(module)
  })
}

// 书本详情
const BookDetail = (resolve) => {
  import('components/chooseBooks/bookDetail/bookDetail').then((module) => {
    resolve(module)
  })
}

// 借书架
const BorrowStand = (resolve) => {
  import('components/chooseBooks/borrowStand/borrowStand').then((module) => {
    resolve(module)
  })
}

// 订单提交成功
const OrderSuccess = (resolve) => {
  import('components/chooseBooks/orderSuccess/orderSuccess').then((module) => {
    resolve(module)
  })
}

// 我的
const Mine = (resolve) => {
  import('components/my/mine/mine.vue').then((module) => {
    resolve(module)
  })
}

// 我的详细资料
const MyInfo = (resolve) => {
  import('components/my/myInfo/myInfo').then((module) => {
    resolve(module)
  })
}

// 我的收藏
const MyCollection = (resolve) => {
  import('components/my/collection/collection').then((module) => {
    resolve(module)
  })
}

// 书本其他系列
const MineSeriesBook = (resolve) => {
  import('components/my/seriesBook/seriesBook').then((module) => {
    resolve(module)
  })
}

// 书本详情
const MineBookDetail = (resolve) => {
  import('components/my/bookDetail/bookDetail').then((module) => {
    resolve(module)
  })
}

// vip卡
const Vip = (resolve) => {
  import('components/my/vip/vip').then((module) => {
    resolve(module)
  })
}

// 关于我们
const AboutUs = (resolve) => {
  import('components/my/about-us/aboutAs').then((module) => {
    resolve(module)
  })
}

// 反馈
const Feedback = (resolve) => {
  import('components/my/feedback/feedback').then((module) => {
    resolve(module)
  })
}

// 问题
const Problem = (resolve) => {
  import('components/my/problem/problem').then((module) => {
    resolve(module)
  })
}

// 图书管理
const BooksManage = (resolve) => {
  import('components/my/books-manage/books-manage').then((module) => {
    resolve(module)
  })
}

// 人员管理
const PeopleMg = (resolve) => {
  import('components/my/peopleMg/peopleMg').then((module) => {
    resolve(module)
  })
}

// 人员搜索
const PeopleSearch = (resolve) => {
  import('components/my/peopleSearch/peopleSearch').then((module) => {
    resolve(module)
  })
}

// 业务管理
const Service = (resolve) => {
  import('components/my/service/service').then((module) => {
    resolve(module)
  })
}

// 订单管理
const Order = (resolve) => {
  import('components/my/order/order').then((module) => {
    resolve(module)
  })
}

// 登录
const Login = (resolve) => {
  import('components/login/login').then((module) => {
    resolve(module)
  })
}

// 找回密码
const FindPwd = (resolve) => {
  import('components/login/findPwdFirst').then((module) => {
    resolve(module)
  })
}

// 注册
const Sign = (resolve) => {
  import('components/sign/sign').then((module) => {
    resolve(module)
  })
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/chooseBooks'
    }, {
      path: '/login',
      component: Login,
      children: [
        {
          path: 'sign',
          component: Sign
        },
        {
          path: 'findPwd',
          component: FindPwd
        }
      ]
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {
          name: 'line',
          path: 'line',
          component: Line
        },
        {
          name: 'readDetail',
          path: 'readDetail/:readId',
          component: ReadDetail
        },
        {
          name: 'listenDetail',
          path: 'listenDetail/:listenId',
          component: ListenDetail
        },
        {
          name: 'homeSearch',
          path: 'homeSearch',
          component: HomeSearch
        }
      ]
    }, {
      path: '/friends',
      component: friends
    }, {
      path: '/chooseBooks',
      component: ChooseBooks,
      children: [
        {
          path: 'bookSearch',
          component: BookSearch,
          children: [
            {
              path: 'bookDetail=:id',
              component: BookDetail
            }
          ]
        },
        {
          path: 'bookDetail=:id',
          component: BookDetail
        },
        {
          path: 'borrowStand',
          component: BorrowStand,
          children: [
            {
              path: 'orderSuccess',
              component: OrderSuccess
            }
          ]
        },
        {
          path: 'seriesBook=:id',
          component: SeriesBook
        }
      ]
    }, {
      path: '/mine',
      component: Mine,
      children: [
        {
          path: 'myInfo',
          component: MyInfo
        },
        {
          path: 'myCollection',
          component: MyCollection
        },
        {
          path: 'bookDetail=:id',
          component: MineBookDetail
        },
        {
          path: 'seriesBook=:id',
          component: MineSeriesBook
        },
        {
          path: 'borrowStand',
          component: BorrowStand,
          children: [
            {
              path: 'orderSuccess',
              component: OrderSuccess
            }
          ]
        },
        {
          path: 'booksMg',
          component: BooksManage
        },
        {
          path: 'peopleMg',
          component: PeopleMg,
          children: [
            {
              path: 'peopleSearch',
              component: PeopleSearch
            }
          ]
        },
        {
          path: 'order',
          component: Order
        },
        {
          path: 'vip',
          component: Vip
        },
        {
          path: 'service',
          component: Service
        },
        {
          path: 'feedback',
          component: Feedback
        },
        {
          path: 'problem',
          component: Problem
        },
        {
          path: 'about',
          component: AboutUs
        }
      ]
    }],
  linkActiveClass: 'active'
})
