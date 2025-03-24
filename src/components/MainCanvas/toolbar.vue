<template>
  <div class="toolbar">
    <div class="title">{{ canvasFile?.name }}</div>
    <el-button-group class="btn-group">
      <el-button @click="emit('zoom', 0.2)" :icon="ZoomIn" title="放大"/>
      <el-button @click="emit('zoom', -0.2)":icon="ZoomOut" title="缩小"/>
      <el-button @click="emit('reset')" :icon="Refresh" title="重置"/>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCanvasImg } from '@/stores/canvasImg.ts';
import { ZoomIn, ZoomOut, Refresh } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'zoom', value: number): void
  (e: 'reset'): void
}>()

const store = useCanvasImg();
const { canvasFile } = storeToRefs(store);
</script>

<style lang="less" scoped>
.toolbar {
  position: relative;
  top: 0px;
  left: 0px;
  z-index: 10;
  background: #f8f9fa;
  border-radius: 0px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
    margin-left: 10px;
    color: #797a85;
  }

  .btn-group {
    margin-right: 0px;
  }
}
</style>