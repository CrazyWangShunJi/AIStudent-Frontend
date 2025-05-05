<template>
  <div class="main">
    <div class="content-wrapper">
      <div class="product-description">
        <h1 class="description-title">{{ $t('home.title') }}</h1>
        <p class="description-text">{{ $t('home.subtitle') }}</p>
      </div>
      
      <!-- 上传组件 -->
      <div class="upload-container-wrapper">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :accept="'.png, .jpg, .jpeg, .pdf'" 
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleUpload"
        >
          <div class="upload-container">
            <img src="@/assets/icon-upload.webp" width="180" height="78" style="margin-top: 15px">
            <div class="upload-text">
              {{ $t('home.uploadText') }} <span class="specials-text">{{ $t('home.uploadType') }}</span> {{ $t('home.uploadAction') }}
            </div>
            <div class="drag-text">
              {{ $t('home.dragText') }} <span class="drag-special-text">{{ $t('home.clickUpload') }}</span>
            </div>
          </div>
        </el-upload>
      </div>
      
      <!-- 折叠式FAQ部分 -->
      <div class="faq-section">
        <h2 class="faq-title">{{ $t('home.faqTitle') }}</h2>
        
        <el-collapse class="custom-collapse" v-model="activeFaqNames">
          <el-collapse-item name="1">
            <template #title>
              <span class="faq-question-title">1. {{ $t('home.faq.q1') }}</span>
            </template>
            <div class="faq-answer">{{ $t('home.faq.a1') }}</div>
          </el-collapse-item>
          
          <el-collapse-item name="2">
            <template #title>
              <span class="faq-question-title">2. {{ $t('home.faq.q2') }}</span>
            </template>
            <div class="faq-answer">{{ $t('home.faq.a2') }}</div>
          </el-collapse-item>
          
          <el-collapse-item name="3">
            <template #title>
              <span class="faq-question-title">3. {{ $t('home.faq.q3') }}</span>
            </template>
            <div class="faq-answer">{{ $t('home.faq.a3') }}</div>
          </el-collapse-item>
          
          <el-collapse-item name="4">
            <template #title>
              <span class="faq-question-title">4. {{ $t('home.faq.q4') }}</span>
            </template>
            <div class="faq-answer">{{ $t('home.faq.a4') }}</div>
          </el-collapse-item>
          
          <el-collapse-item name="5">
            <template #title>
              <span class="faq-question-title">5. {{ $t('home.faq.q5') }}</span>
            </template>
            <div class="faq-answer">{{ $t('home.faq.a5') }}</div>
          </el-collapse-item>
          
           <el-collapse-item name="6">
             <template #title>
               <span class="faq-question-title">6. {{ $t('home.faq.q6') }}</span>
             </template>
             <div class="faq-answer">{{ $t('home.faq.a6') }}</div>
           </el-collapse-item>
        </el-collapse>
      </div>
      
      <!-- 产品特点部分 -->
      <div class="features-section">
        <h2 class="features-title">{{ $t('home.featuresTitle') }}</h2>
        
        <div class="features-container">
          <div class="feature-item">
            <div class="feature-icon">📄</div>
            <h3 class="feature-name">{{ $t('home.feature1.name') }}</h3>
            <p class="feature-desc">{{ $t('home.feature1.desc') }}</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">💡</div>
            <h3 class="feature-name">{{ $t('home.feature2.name') }}</h3>
            <p class="feature-desc">{{ $t('home.feature2.desc') }}</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">✅</div>
            <h3 class="feature-name">{{ $t('home.feature3.name') }}</h3>
            <p class="feature-desc">{{ $t('home.feature3.desc') }}</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">⏱️</div>
            <h3 class="feature-name">{{ $t('home.feature4.name') }}</h3>
            <p class="feature-desc">{{ $t('home.feature4.desc') }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载中弹窗 -->
    <el-dialog
      v-model="isLoading"
      width="300px"
      :close-on-click-modal="false"
      :show-close="false"
      center
      custom-class="loading-dialog"
    >
      <div class="loading-content">
        <!-- 简单SVG加载动画 -->
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        <p>{{ $t('home.loadingText') }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasImg } from '@/stores/canvasImg.ts';
import { AiResult } from '@/stores/AiResult';
import { ElMessage, ElDialog, ElCollapse, ElCollapseItem, ElUpload } from 'element-plus';
import { useRouter } from 'vue-router';
import { getAiService } from '@/server/utils';
import eventBus from '@/utils/eventBus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter()
const isLoading = ref(false);
const activeFaqNames = ref(['1']);

interface UploadFile {
  name: string
  size: number
  type: string
  raw: File
  url?: string
}

const store = useCanvasImg();
const { canvasFile, imgSrc, fileType } = storeToRefs(store);

const AiStore = AiResult();
const { AiParseResult } = storeToRefs(AiStore);

const maxFileSize = 10 // MB
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

// 文件验证
const validateFile = (file: UploadFile) => {
  const maxSize = maxFileSize * 1024 * 1024;
  const isValidType = allowedTypes.includes(file.raw.type);

  if (file.size > maxSize) {
    ElMessage.error(t('home.errorFileSize', { size: maxFileSize }));
    return false;
  }
  if (!isValidType) {
    ElMessage.error(t('home.errorFileType'));
    return false;
  }

  fileType.value = file.raw.type;
  
  imgSrc.value = '';

  canvasFile.value = file;
  return true;
};

const getAiResult = async (fileData: string | File) => {
  try {
    isLoading.value = true;
    let dataToSend: any;
    
    if (fileType.value === 'application/pdf') {
       dataToSend = imgSrc.value ? imgSrc.value : 'pdf_placeholder';
       console.warn("PDF handling needs backend support. Sending image preview or placeholder.");
    } else {
       dataToSend = fileData as string;
    }
    
    const response = await getAiService(dataToSend);
    console.log('response', response);
    AiParseResult.value = response.data.data; 
    router.push({
      path: '/parseResult',
    });
  } catch (error) {
    ElMessage.error(t('home.errorAnalysis'));
    console.error('AI Service Error:', error);
  } finally {
    isLoading.value = false;
    eventBus.emit('endProgess')
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const loadFile = async (file: File) => {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      imgSrc.value = e.target?.result as string;
      eventBus.emit('startProgress');
      getAiResult(imgSrc.value);
    };
    reader.readAsDataURL(file);
  } else if (file.type === 'application/pdf') {
    imgSrc.value = '';
    eventBus.emit('startProgress');
    getAiResult('pdf_placeholder');
  } else {
     console.error('Unsupported file type for loading preview:', file.type);
  }
};

const handleUpload = (uploadFile: UploadFile) => {
  if (!validateFile(uploadFile)) return;
  loadFile(uploadFile.raw);
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  min-height: 100vh;
  height: 1px;
  display: flex;
  justify-content: center;
  padding: 0;
  overflow-y: auto;
  background-color: #f9fafc;
}

.content-wrapper {
  width: 90%;
  max-width: 1200px;
  padding: 20px 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .product-description {
    width: 100%;
    text-align: center;
    margin: 20px 0 25px;
    
    .description-title {
      font-size: 32px;
      font-weight: 700;
      color: #22405c;
      margin-bottom: 12px;
    }
    
    .description-text {
      font-size: 16px;
      color: #666;
      line-height: 1.5;
    }
  }
  
  .upload-container-wrapper {
    width: 100%;
    margin-bottom: 40px;
    background-color: #f9fafc;
    border-radius: 10px;
    border: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 10px;
    
    /deep/ .el-upload {
      width: 100%;
    }
    
    /deep/ .el-upload-dragger {
      width: 100% !important;
      background-color: #f9fafc;
      height: 280px;
      transition: all 0.3s;
      border: 2px dashed #d9d9d9;
      
      &:hover {
        background-color: rgba(93, 177, 255, 0.1);
        border-color: #5db1ff;
      }
      
      &:active {
        background-color: rgba(93, 177, 255, 0.2);
        border-color: #4a90e2;
      }
    }
    
    .upload-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      img {
        margin-top: 0;
      }
      
      .upload-text {
        font-size: 18px;
        font-weight: 700;
        margin-top: 20px;
        color: #000000;
        .specials-text {
          color: #5db1ff;
          font-weight: 800;
        }
      }
      
      .drag-text {
        margin-top: 15px;
        color: #6e6e86;
        font-size: 14px;
        
        .drag-special-text {
          color: #5db1ff;
        }
      }
    }
  }
  
  .faq-section {
    width: 100%;
    margin-bottom: 40px;
    
    .faq-title {
      font-size: 24px;
      font-weight: 700;
      color: #22405c;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .custom-collapse {
      background-color: transparent;
      border: none;
      
      /deep/ .el-collapse-item {
        margin-bottom: 10px;
        
        .el-collapse-item__header {
          background-color: #ffffff;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 0 15px;
          font-weight: 600;
          color: #333;
          height: 50px;
          line-height: 50px;
          transition: background-color 0.3s;
          
          &:hover {
            background-color: rgba(93, 177, 255, 0.05);
          }
          
          &.is-active {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            background-color: #f5f7fa;
          }
        }
        
        .el-collapse-item__wrap {
          background-color: #ffffff;
          border: 1px solid #eee;
          border-top: none;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          
          .el-collapse-item__content {
            padding: 15px 20px;
          }
        }
      }
      
      .faq-question-title {
        font-size: 16px;
        font-weight: 600;
      }
      
      .faq-answer {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
    }
  }
  
  .features-section {
    width: 100%;
    margin-bottom: 30px;
    
    .features-title {
      font-size: 24px;
      font-weight: 700;
      color: #22405c;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .features-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      
      .feature-item {
        background-color: #ffffff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        
        .feature-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }
        
        .feature-name {
          font-size: 18px;
          font-weight: 600;
          color: #22405c;
          margin-bottom: 10px;
        }
        
        .feature-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
     .features-container {
        grid-template-columns: 1fr;
     }
  }
}

.loading-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 30px;
    text-align: center;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  
  p {
    font-size: 16px;
    color: #333;
  }
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 50px;
  height: 50px;
  
  .path {
    stroke: #5db1ff;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.custom-collapse /deep/ .el-collapse-item__header {
   user-select: text; 
}

</style>