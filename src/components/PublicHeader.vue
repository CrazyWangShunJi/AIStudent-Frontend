<template>
  <header>
    <div class="main-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/" @click.native="handleHomeClick" class="header-link">
            <img src="@/assets/logo.jpg" class="home-link" />
            <span class="title-text" v-if="currentLanguage === 'en'">QuickCheck</span>
            <span class="title-text" v-else>知卷AI</span>
          </router-link>
        </div>
        <div class="header-middle" v-if="showButton">
          <el-button
            size="default"
            class="ask-button long-ask-button"
            @click="modalVisible = true"
          >
            <span>{{ currentLanguage === 'zh-CN' ? '你还有什么问题？' : "What's your next question?" }}</span>
          </el-button>
        </div>
        <div class="header-right">
          <el-select
            v-model="currentLanguage"
            @change="handleLanguageChange"
            class="language-select"
            size="small"
          >
            <el-option
              v-for="lang in languages"
              :key="lang.value"
              :label="lang.label"
              :value="lang.value"
            />
          </el-select>

          <el-avatar :icon="UserFilled" class="user-avatar" :size="50"/>
        </div>
      </div>
    </div>

    <el-dialog v-model="modalVisible" width="75vw" height="75vh" :close-on-click-modal="true" :show-close="true" center custom-class="next-question-dialog">
      <div style="padding: 32px 32px 24px 32px; text-align: center; min-height: 60vh; min-width: 60vw;">
        <h2 style="font-size: 28px; font-weight: bold; color: #22405c; margin-bottom: 18px;">知卷AI - 快速检查作业答案与解析</h2>
        <div style="margin-bottom: 28px; color: #666; font-size: 18px;">上传您的试卷图片或PDF，快速获取准确答案和详细解题过程。</div>
        <div class="upload-container-wrapper" style="max-width: 900px; margin: 0 auto;">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :accept="'.png, .jpg, .jpeg, .pdf'"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(uploadFile, uploadFiles) => {}"
          >
            <div class="upload-container">
              <img src="@/assets/icon-upload.webp" width="180" height="78" style="margin-top: 20px">
              <div class="upload-text" style="font-size: 20px; font-weight: 700; margin-top: 20px; color: #000;">
                上传 <span style="color: #5db1ff; font-weight: 800;">图片或PDF</span> 来检查答案
              </div>
              <div class="drag-text" style="margin-top: 18px; color: #6e6e86; font-size: 16px;">
                拖拽文件到此处或 <span style="color: #5db1ff;">点击上传</span>
              </div>
            </div>
          </el-upload>
        </div>
      </div>
    </el-dialog>
  </header>
</template>

<script setup>
import { ref, computed  } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserFilled } from '@element-plus/icons-vue'
import { ElHeader, ElSelect, ElOption, ElAvatar, ElButton } from 'element-plus';
import { useRoute } from 'vue-router';
import card from '@/components/MainHome/card.vue';

const route = useRoute();
const showButton = computed(() => route.path !== '/');
const { locale } = useI18n();
const langConfig = {
  'zh-CN': '中文',
  en: 'English',
}
const languages = ref([
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: 'English' },
])
const currentLanguage = ref(locale.value)

const handleLanguageChange = (val) => {
  locale.value = val;
}

const handleHomeClick = () => {};

const modalVisible = ref(false)
</script>

<style lang="less" scoped>
.main-header {
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 64px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 新增外层容器样式 */
.header-content {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 15px 0 15px;
  margin: 0 auto;
  position: relative;

  .header-left {
    display: flex;
    align-items: center;
    .header-link {
      display: flex;
      align-items: center;
      .home-link {
        height: 44px;
        width: auto;
        margin-right: 20px;
        color: #334488;
      }

      .title-text {
        font-family: 'Roboto', 'SF Pro Display', 'PingFang SC', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: #22405c;
        letter-spacing: 0.5px;
      }
    }
  }

  .header-middle {
    .ask-button {
      background-color: #f8f5ff ;
      border: 0px;
      color: #8d37ff;
    }
  }

  .header-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    /deep/ .el-select--small .el-select__wrapper {
      width: 60px;
    }
    .user-avatar {
      width: 50px !important;
      height: 50px !important;
      flex-shrink: 0; /* 防止被 flex 布局压缩 */
    }
  }
}

.long-ask-button {
  min-width: 320px;
  height: 48px;
  font-size: 20px;
  border-radius: 8px;
  background: #f8f5ff;
  color: #8d37ff;
  font-weight: 700;
  letter-spacing: 1px;
  transition: background 0.2s, color 0.2s;
  margin: 0 24px;
  box-shadow: 0 2px 8px rgba(141,55,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.long-ask-button:hover {
  background: #e6e0ff;
  color: #5d2fff;
}
.long-ask-button:active {
  background: #d1c4e9;
  color: #4a148c;
}

.upload-container-wrapper {
  width: 100%;
  margin-bottom: 40px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
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
</style>
