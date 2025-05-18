import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import sitemap from 'vite-plugin-sitemap'
// import { routes } from './src/router/index'

// 直接用静态路由路径数组，避免import业务代码导致环境变量未定义
const paths = ['/', '/parseResult'];
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    sitemap({
      hostname: 'https://yourdomain.com',
      dynamicRoutes: paths
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'katex': fileURLToPath(new URL('node_modules/katex', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  },
})
