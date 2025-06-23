<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import PublicHeader from './components/PublicHeader.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <PublicHeader/>
  <div class="main-container">
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
  <Footer/>
</template>

<style lang="less">
html, body {
  height: 100%;
  overflow-x: hidden; /* 防止水平滚动 */
}

html {
  /* 确保可以垂直滚动 */
  overflow-y: auto;
}

body {
	overscroll-behavior: none;
	background: #f7f7fb !important;
	/* 移除最小宽度限制，支持移动端 */
	/* min-width: 1280px; */
}

html,
body,
ul,
li,
p,
a,
h1,
h2,
h3,
h4,
h5,
h6 {
	margin: 0;
	padding: 0;
	list-style: none;
	text-decoration: none;
	font-size: 14px;
}

b {
	font-weight: inherit !important;
}

a:hover {
	text-decoration: none;
}
.router-link-active {
	text-decoration: none !important;
}
.float-right {
	float: right;
}
.el-upload__input {
	display: none !important;
}

#app {
	font-family: 'PingFang SC', 'Microsoft YaHei', Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #3a415c;
	min-height: 100vh; /* 确保至少占满视口高度 */
	width: 100%;
	min-width: 320px; /* 设置最小宽度为常见手机宽度 */
}

.main-container {
  margin-top: 64px; /* 调整为头部实际高度 */
  min-height: calc(100vh - 64px - 60px); /* 减去头部和底部的高度 */
  background: #f9fafc;    
  /* 让内容自然流动，不限制高度 */
}

.main-container::-webkit-scrollbar {
  width: 6px;
}
.main-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.main-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

/* 移动端全局样式优化 */
@media (max-width: 768px) {
  html, body {
    font-size: 16px; /* 移动端基础字体稍大 */
  }
  
  #app {
    min-width: 320px; /* 保持最小宽度 */
  }
  
  .main-container {
    margin-top: 64px;
    min-height: calc(100vh - 64px - 60px);
    /* 移动端隐藏滚动条宽度适配 */
    padding-left: 0;
  }
  
  /* 移动端滚动条样式 */
  body::-webkit-scrollbar {
    width: 3px; /* 更窄的滚动条 */
  }
}

@media (max-width: 480px) {
  body::-webkit-scrollbar {
    width: 2px; /* 最窄的滚动条 */
  }
}
</style>
