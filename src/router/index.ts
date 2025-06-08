import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/MainHome.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/parseResult',
    name: 'parseResult',
    component: () => import('@/views/parseResult/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [...routes],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 初始化认证状态（仅在应用启动时）
  if (!authStore.token && !authStore.user) {
    await authStore.init()
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // 已登录但访问登录页，跳转到首页
    next('/')
  } else {
    // 正常访问
    next()
  }
})

export default router
