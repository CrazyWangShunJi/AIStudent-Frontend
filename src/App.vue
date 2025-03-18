<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import PublicHeader from './components/PublicHeader.vue'
</script>

<template>
  <PublicHeader/>
  <RouterView/>
</template>

<style lang="less">
html,
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
</style>
