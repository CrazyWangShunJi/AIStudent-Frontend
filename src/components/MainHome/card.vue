<template>
  <div class="main">
    <el-card shadow="always" class="card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <img src="@/assets/ask.svg">
            <span class="header-text">Ask Your Homework Question Here!</span>
          </div>
        </div>
      </template>
      <div class="content">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleUpload"
        >
          <div class="upload-container">
            <img src="@/assets/icon-upload.webp" width="180" height="78" style="margin-top: 15px">
            <div class="upload-text">
              Upload <span class="specials-text">Image</span> to solve questions in it
            </div>
            <div class="drag-text">
              Drap file here or <span class="drag-special-text">click to upload</span>
            </div>
          </div>
        </el-upload>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCanvasImg } from '@/stores/canvasImg.ts';
import { ElMessage } from 'element-plus';

interface UploadFile {
  name: string
  size: number
  type: string
  raw: File
}

const store = useCanvasImg();
const { canvasFile, imgSrc } = storeToRefs(store);

const maxFileSize = 5 // MB

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
    // 获取图片的base64形式
    imgSrc.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}


const handleUpload = (file: UploadFile) => {
  if (!validateFile(file)) return
  loadImage(file.raw)
}
</script>

<style lang="less" scoped>
/deep/ .el-card__header {
  border-bottom: 0px
}
/deep/.el-upload-dragger {
  background-color: #f9fafc;
  height: 380px;
  margin: 0px 10px 0px 10px;
}
.main {
  width: 100%;
  height:100%;
  .card{
    border-radius: 20px;
    width: 100%;
    height:100%;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center; // 垂直居中
      
      .header-left {
        display: flex;
        align-items: center; // 图片和文字垂直居中
        gap: 8px; // 图片和文字间距
        font-size: 18px;
        font-weight: 700; // 确保父容器加粗
        color: #000000;
        
        .header-text {
          line-height: 10px;
          font-weight: 800;
        }
      }
    }

    .content {
      height: 380px;

      .upload-container {
        width: 100%;
        height: 100%;

        .upload-text {
          font-size: 18px;
          font-weight: 700;
          margin-top:30px;
          color:#000000;
          .specials-text {
            color: #8d37ff;
            font-weight: 800;
          }
        }

        .drag-text {
          margin-top: 35px;
          color:#6e6e86;

          .drag-special-text {
            color:#409eff;
          }
        }
      }
    }
  }
}
</style>