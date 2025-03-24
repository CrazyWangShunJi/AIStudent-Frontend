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
    console.log('affixButton.value', affixButton.value)
    if (affixButton.value) {
      // 使用 getBoundingClientRect 获取精确高度
      console.log('affixButton.value', affixButton.value)
      const buttonHeight = affixButton.value.getBoundingClientRect().height
      affixOffset.value = window.innerHeight - buttonHeight - 20
    }
  })
}
// 文件验证
const validateFile = (file: any) => {
  const maxSize = maxFileSize * 1024 * 1024
  const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.raw.type)

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
const loadImage = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imgSrc.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 处理文件上传
const handleUpload = (file: UploadFile) => {
  if (!validateFile(file)) return
  loadImage(file.raw)
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