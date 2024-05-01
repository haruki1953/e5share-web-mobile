import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      // 设置页
      path: '/setting',
      component: () => import('@/views/setting/SettingPage.vue')
    },
    {
      // 用户主页
      path: '/user/:id',
      component: () => import('@/views/user/UserPage.vue')
    },
    {
      // 动态详情
      path: '/post-info',
      component: () => import('@/views/post/PostInfo.vue')
    },
    {
      // 布局架子
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          // 首页
          path: '/home',
          component: () => import('@/views/home/HomePage.vue')
        },
        {
          // 用户列表
          path: '/user-list',
          component: () => import('@/views/user/UserList.vue')
        },
        {
          // e5分享管理页
          path: '/share',
          component: () => import('@/views/share/ShareInfo.vue')
        },
        {
          // 通知页
          path: '/notif',
          component: () => import('@/views/notif/NotifPage.vue')
        },
        {
          // 动态页
          path: '/post',
          component: () => import('@/views/post/PostPage.vue')
        }
      ]
    }
  ]
})

export default router
