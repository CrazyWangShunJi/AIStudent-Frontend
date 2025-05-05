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
            class="ask-button"
            @click="modalVisible = true"
          >
            <span>What's your next question?</span>
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

    <el-dialog v-model="modalVisible">
      <card />
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

</style>
