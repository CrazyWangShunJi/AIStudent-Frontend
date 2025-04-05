<template>
  <header>
    <div class="main-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/" @click.native="handleHomeClick" class="header-link">
            <img src="@/assets/logo.jpg" class="home-link" />
            <span class="title-text">QuickCheck</span>
          </router-link>
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
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserFilled } from '@element-plus/icons-vue'
import { ElHeader, ElSelect, ElOption, ElAvatar } from 'element-plus'

const { locale } = useI18n()
const langConfig = {
  'zh-CN': '中文',
  en: 'english',
}
const languages = ref([
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: 'English' },
])
const currentLanguage = ref(langConfig[locale.value])

const handleLanguageChange = (val) => {
  locale.value = val;

}

const handleHomeClick = () => {}
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
        font-family: 'Dancing Script', sans-serif;
        font-size: 30px;
        font-weight: 600;
        color: #22405c;
      }
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
