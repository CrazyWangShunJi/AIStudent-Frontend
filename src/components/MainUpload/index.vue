<template>
  <div class="image-processor">
    <!-- 上传区域 -->
    <div v-if="!imgSrc" class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
      <el-upload
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleUpload"
      >
        <div class="upload-content">
          <el-icon :size="50"><UploadFilled /></el-icon>
          <p>{{ $t("clickUpload") }}</p>
          <p class="support-text">{{ $t("supportLimit")}}</p>
        </div>
      </el-upload>
    </div>

    <!-- 图片处理区域 -->
    <MainUpload
      v-else
      @scale-change="handleScaleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import MainUpload from '../MainCanvas/index.vue';
import { useCanvasImg } from '@/stores/canvasImg.ts';

const store = useCanvasImg()
const { canvasFile, imgSrc } = storeToRefs(store)

interface UploadFile {
  name: string
  size: number
  type: string
  raw: File
}

// 状态管理
// const imageSrc = ref<string | null>(null);
const maxFileSize = 5 // MB

// 处理文件上传
const handleUpload = (file: UploadFile) => {
  if (!validateFile(file)) return
  loadImage(file.raw)
}

// 拖拽上传处理
const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (validateFile(file)) {
      loadImage(file)
    }
  }
}

// 文件验证
const validateFile = (file: any) => {
  const maxSize = maxFileSize * 1024 * 1024
  const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.raw.type)

  if (file.size > maxSize) {
    ElMessage.error(`文件大小不能超过${maxFileSize}MB`)
    return false
  }
  if (!isValidType) {
    ElMessage.error('仅支持JPEG/PNG格式')
    return false
  }

  canvasFile.value = file;
  return true
}

// 加载图片
const loadImage = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imgSrc.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 处理缩放变化
const handleScaleChange = (scale: number) => {
}
</script>

<style lang="less" scoped>
.image-processor {
  height: 100%;
  position: relative;

  .upload-area {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ddd;
    border-radius: 8px;
    background: #f8f9fa;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }

    .upload-content {
      text-align: center;
      color: #666;
      padding: 40px;

      .support-text {
        font-size: 12px;
        color: #999;
        margin-top: 10px;
      }
    }
  }
}
</style>