import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/MainHome.vue')
  },
  {
    path: '/parseResult',
    name: 'parseResult',
    component: () => import('@/views/parseResult/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [...routes],
})

// 移除路由守卫，所有页面无需登录即可访问

export default router
