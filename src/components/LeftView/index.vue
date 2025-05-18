<template>
  <aside class="left-sidebar">
    <h3 class="title">{{ $t("configMenu")}}</h3>

    <el-divider style="margin: 0px 0px 10px 0px"/>

    <el-upload
     class="upload-demo"
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleUpload"
    >
      <el-button>
        {{ $t("uploadFile") }}
      </el-button>
    </el-upload>

    <div ref="affixButton">
      <el-affix :offset="affixOffset">
        <el-button type="primary">{{ $t("uploadCountLimit") }}</el-button>
      </el-affix>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia'
import { useCanvasImg } from '@/stores/canvasImg.ts';
import { useI18n } from 'vue-i18n';
import * as pdfjsLib from 'pdfjs-dist';

// 配置PDF.js Worker（必须）
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';

const { t } = useI18n()

interface UploadFile {
  name: string
  size: number
  type: string
  raw: File
}

const affixOffset = ref(0)
const affixButton = ref<HTMLElement>() // 获取按钮元素的引用

const store = useCanvasImg()
const { canvasFile, imgSrc } = storeToRefs(store)

const maxFileSize = 5 // MB
const errMsgSize = t('uploadMaxLimit', {maxFileSize: maxFileSize});

// 计算偏移量
const calculateOffset = () => {
  nextTick(() => { // 确保 DOM 更新完成
    if (affixButton.value) {
      // 使用 getBoundingClientRect 获取精确高度
      const buttonHeight = affixButton.value.getBoundingClientRect().height
      affixOffset.value = window.innerHeight - buttonHeight - 20
    }
  })
}
// 文件验证
const validateFile = (file: any) => {
  const maxSize = maxFileSize * 1024 * 1024
  const isValidType = [
    'image/jpeg', 
    'image/png', 
    'image/jpg',
    'application/pdf'  // 添加PDF类型支持
  ].includes(file.raw.type)

  if (file.size > maxSize) {
    ElMessage.error(errMsgSize)
    return false
  }
  if (!isValidType) {
    ElMessage.error(t('uploadFileTypeLimit'))
    return false
  }

  canvasFile.value = file;
  return true;
}

// 加载图片
const loadImage = async (file: File) => {
  console.log('file.', file)
  if (file.type === 'application/pdf') {
    try {
      // 步骤1: 读取PDF文件
      const arrayBuffer = await file.arrayBuffer()
      
      // 步骤2: 解析PDF文档
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      // 步骤3: 获取第一页
      const page = await pdf.getPage(1)
      
      // 步骤4: 准备Canvas渲染
      const viewport = page.getViewport({ scale: 2 }) // 缩放比例建议2倍清晰度
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      canvas.width = viewport.width
      canvas.height = viewport.height

      // 步骤5: 渲染到Canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      // 步骤6: 转换为JPEG格式的Base64
      const base64 = canvas.toDataURL('image/jpeg', 0.85)
      console.log('pdf', imgSrc.value)
      imgSrc.value = base64
    } catch (error) {
      ElMessage.error(t('pdfConvertError'))
      console.error('PDF转换失败:', error)
    }
  } else{
    const reader = new FileReader()
    reader.onload = (e) => {
      imgSrc.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 处理文件上传
const handleUpload = async (file: UploadFile) => {
  if (!validateFile(file)) return
  await loadImage(file.raw) // 等待转换完成
}
// 生命周期钩子
onMounted(() => {
  // 添加延迟确保元素渲染完成
  calculateOffset()
  window.addEventListener('resize', calculateOffset)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateOffset)
})
</script>

<style lang="less" scoped>
.left-sidebar {
  width: 200px;

  .title {
    margin: -20px -20px 0px -20px;
    padding: 10px 0px 10px 0px;
  }
}
</style>