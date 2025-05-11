import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/MainHome.vue'),
  },
  {
    path: '/parseResult',
    name: 'parseResult',
    component: () => import('@/views/parseResult/index.vue'),
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes],
})



export default router
