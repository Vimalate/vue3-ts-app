import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import type { StateAll } from '@/store'
import _ from 'lodash'

declare module 'vue-router' {
  interface RouteMeta {
    menu?: boolean
    title?: string
    icon?: string
    auth?: boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    redirect: '/sign',
    meta: {
      menu: true,
      title: '考勤管理',
      icon: 'document-copy',
      auth: true,
    },
    children: [
      {
        path: 'sign',
        name: 'sign',
        component: () => import('@/views/sign/index.vue'),
        meta: {
          menu: true,
          title: '在线打卡签到',
          icon: 'calendar',
          auth: true,
        },
      },
      {
        path: 'exception',
        name: 'exception',
        component: () => import('@/views/exception/index.vue'),
        meta: {
          menu: true,
          title: '异常考勤查询',
          icon: 'warning',
          auth: true,
        },
      },
      {
        path: 'apply',
        name: 'apply',
        component: () => import('@/views/apply/index.vue'),
        meta: {
          menu: true,
          title: '添加考勤审批',
          icon: 'document-add',
          auth: true,
        },
      },
      {
        path: 'check',
        name: 'check',
        component: () => import('@/views/check/index.vue'),
        meta: {
          menu: true,
          title: '我的考勤审批',
          icon: 'finished',
          auth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = (store.state as StateAll).users.token
  const infos = (store.state as StateAll).users.infos
  if (to.meta.auth && _.isEmpty(infos)) {
    if (token) {
      store.dispatch('users/infos').then((res) => {
        if (res.data.errcode === 0) {
          store.commit('users/updateInfos', res.data.infos)
          next()
        }
      })
    } else {
      next('/login')
    }
  } else {
    if (token && to.path === '/login') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
