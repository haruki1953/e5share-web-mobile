import { publicRoutes, webName } from '@/config'
import { useAuthStore } from '@/stores'
import { ref } from 'vue'
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

// 路由加载标识
export const isLoading = ref(false)

// 路由访问拦截
router.beforeEach((to) => {
  isLoading.value = true

  // 根据路由设置页面标题，对于移动好像不必要，偷懒了
  // document.title = to.meta.title || webName
  document.title = webName
  // 路由不存在，拦截到首页
  if (router.resolve(to.path).matched.length === 0) {
    return '/home'
  }
  // 如果没有token, 且访问的不是公开页面，拦截到登录，其他情况正常放行
  const authStore = useAuthStore()
  if (!authStore.token && !publicRoutes.includes(to.path)) return '/login'
})

router.afterEach(() => {
  isLoading.value = false
})
export default router
