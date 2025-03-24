<template>
  <div class="right-sidebar">
    <div class="tabs-header">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ 'active': activeTab === tab.id }"
        @click="activeTab = tab.id"
        role="button"
        @keydown.enter="activeTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'ocr'">
        <OcrResult />
      </div>
      <div v-else-if="activeTab === 'ai'">
        <AIResult />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AIResult from '@/views/parseResult/AIResult.vue';
import OcrResult from '@/views/parseResult/OcrResult.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const tabs = computed(() => {
  return [
    { id: 'ocr', label: t('OcrTitle') },
    { id: 'ai', label: t('AITitle') }
  ];
})

const activeTab = ref('ocr');
</script>

<style lang="less" scoped>
.right-sidebar {
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .tabs-header {
    display: flex;
    position: relative;
    border-bottom: 1px solid #eee;

    .tab-item {
      flex: 1;
      padding: 16px 0;
      text-align: center;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        color: #333;
        background: #f8f9fa;
      }

      &.active {
        color: #1890ff;
        font-weight: 500;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background: #1890ff;
          border-radius: 1px;
          animation: underline 0.3s ease;
        }
      }
    }
  }

  .tab-content {
    padding: 20px;
    min-height: 200px;
  }
}

@keyframes underline {
  from {
    width: 0;
  }
  to {
    width: 40px;
  }
}
</style>