<template>
  <div class="image-previewer-overlay" @click.self="close">
    <div class="image-previewer-toolbar">
      <button class="nav-btn" @click="prevImage" :disabled="currentIndex === 0">‹</button>
      <button class="nav-btn" @click="nextImage" :disabled="currentIndex === images.length - 1">›</button>
      <span class="index-info">{{ currentIndex + 1 }} / {{ images.length }}</span>
      <button class="zoom-btn" @click="zoomIn">+</button>
      <button class="zoom-btn" @click="zoomOut">-</button>
      <button class="zoom-btn" @click="resetZoom">⟳</button>
      <button class="close-btn" @click="close">×</button>
    </div>
    <div class="image-previewer-content">
      <img :src="images[currentIndex]" :style="imgStyle" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
const props = defineProps<{ images: string[], startIndex?: number }>();
const emit = defineEmits(['close']);
const currentIndex = ref(props.startIndex || 0);
const scale = ref(1);
const offset = ref({ x: 0, y: 0 });
const dragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const imgStart = ref({ x: 0, y: 0 });
const imgStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${offset.value.x}px, ${offset.value.y}px)`
}));
function close() { emit('close'); }
function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    resetZoom();
  }
}
function nextImage() {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
    resetZoom();
  }
}
function zoomIn() { scale.value = Math.min(scale.value + 0.2, 5); }
function zoomOut() { scale.value = Math.max(scale.value - 0.2, 0.2); }
function resetZoom() { scale.value = 1; offset.value = { x: 0, y: 0 }; }
function startDrag(e: MouseEvent) {
  dragging.value = true;
  dragStart.value = { x: e.clientX, y: e.clientY };
  imgStart.value = { ...offset.value };
}
function onDrag(e: MouseEvent) {
  if (!dragging.value) return;
  offset.value = {
    x: imgStart.value.x + (e.clientX - dragStart.value.x),
    y: imgStart.value.y + (e.clientY - dragStart.value.y)
  };
}
function endDrag() { dragging.value = false; }
watch(() => props.startIndex, (val) => { if (typeof val === 'number') currentIndex.value = val; });
</script>
<style scoped>
.image-previewer-overlay {
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.image-previewer-toolbar {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  align-items: center;
  z-index: 2;
}
.close-btn, .nav-btn, .zoom-btn {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  font-size: 32px;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover, .nav-btn:hover, .zoom-btn:hover {
  background: rgba(255,255,255,0.35);
}
.close-btn {
  font-size: 32px;
  font-weight: bold;
  margin-left: 16px;
}
.index-info {
  color: #fff;
  font-size: 18px;
  margin: 0 10px;
}
.image-previewer-content {
  width: 90vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.image-previewer-content img {
  max-width: 100%;
  max-height: 100%;
  user-select: none;
  cursor: grab;
  transition: transform 0.2s;
}
</style> 