<template>
  <toolbar @zoom="zoom" @reset="reset"/>
  <div class="image-canvas">

    <div
      class="canvas-container"
      ref="container"
      @wheel.prevent="handleWheel"
    >
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUnmount, watch, type PropType } from 'vue'
import { ZoomIn, ZoomOut, Refresh } from '@element-plus/icons-vue'
import { useCanvasImg } from '@/stores/canvasImg.ts';
import toolbar from './toolbar.vue';

const store = useCanvasImg();
const { canvasFile, imgSrc } = storeToRefs(store)
interface Position {
  x: number
  y: number
}

const props = defineProps({
  imageSrc: {
    type: String as PropType<string>,
    default: '',
  },
  maxScale: {
    type: Number,
    default: 5
  },
  minScale: {
    type: Number,
    default: 0.1
  }
})

const emit = defineEmits(['scale-change'])

// Canvas相关引用
const canvas = ref<HTMLCanvasElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const image = ref<HTMLImageElement | null>(null)

// 状态管理
const scale = ref(1)
const position = ref<Position>({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref<Position>({ x: 0, y: 0 })

// 初始化画布
onMounted(() => {
  initCanvas()
  window.addEventListener('resize', updateCanvasSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasSize)
})

// 初始化画布上下文
const initCanvas = () => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    loadImage()
  }
}

// 加载图片
const loadImage = () => {
  image.value = new Image()
  image.value.src = imgSrc.value;
  image.value.onload = () => {
    updateCanvasSize()
    reset()
  }
}

// 更新画布尺寸
const updateCanvasSize = () => {
  if (container.value && canvas.value) {
    canvas.value.width = container.value.clientWidth
    canvas.value.height = container.value.clientHeight
    drawImage()
  }
}

// 绘制图片
const drawImage = () => {
  if (!ctx.value || !image.value || !canvas.value) return

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  const dx = position.value.x
  const dy = position.value.y
  const dWidth = image.value.width * scale.value
  const dHeight = image.value.height * scale.value

  ctx.value.drawImage(
    image.value,
    dx, dy,
    canvas.value.width / scale.value,
    canvas.value.height / scale.value,
    0, 0,
    canvas.value.width,
    canvas.value.height
  )
}

// 缩放控制
const zoom = (delta: number) => {
  const newScale = Math.min(Math.max(props.minScale, scale.value + delta), props.maxScale)
  scale.value = newScale
  emit('scale-change', newScale)
  drawImage()
}

const handleWheel = (e: WheelEvent) => {
  const deltaY = e.deltaY * 0.5
  const deltaX = e.deltaX * 0.5

  // 更新位置（确保不超过图片边界）
  position.value = {
    x: Math.max(0, Math.min(
      position.value.x + deltaX,
      image.value!.width - canvas.value!.width / scale.value
    )),
    y: Math.max(0, Math.min(
      position.value.y + deltaY,
      image.value!.height - canvas.value!.height / scale.value
    ))
  }

  drawImage()
}

// 重置状态
const reset = () => {
  if (!canvas.value || !image.value) return

  const canvasWidth = canvas.value.width;
  const imgWidth = image.value.width;
  scale.value = canvasWidth / imgWidth

  position.value = { x: 0, y: 0 }
  drawImage()
}


// 监听图片源变化
watch(() => imgSrc, () => {
  loadImage()
}, {
  deep: true
})
</script>

<style lang="less" scoped>
.image-canvas {
  padding: 10px 10px 0px 10px;
  height: 100%;
  position: relative;
  background-color: white;

  .canvas-container {
    height: 100%;
    overflow: auto;
    cursor: pointer;

    &:active {
      cursor: grabbing;
    }

    canvas {
      display: block;
    }
  }
}
</style>