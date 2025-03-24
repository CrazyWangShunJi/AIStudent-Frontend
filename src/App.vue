<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import PublicHeader from './components/PublicHeader.vue'
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
</template>

<style lang="less">
html {
  overflow-y: hidden;
}
body {
	overscroll-behavior: none;
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
body {
	background: #f7f7fb !important;
	overflow-y: auto;
	min-width: 1280px;
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
	height: 100%;
	width: 100%;
}

.main-container {
  margin-top: 60px;
  height: calc(100vh - 60px);  /* 精确计算可视高度 */
  overflow-y: hidden;           /* 仅在此容器显示滚动条 */
  background: #f5f6f7;

  /* 防止内容抖动 */
  padding-left: calc(100vw - 100%);
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
</style>
