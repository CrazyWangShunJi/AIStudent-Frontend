<template>
  <div class="demo-progress" v-if="AiProgress !== 0 && ProgressStatus !== 'success'">
    <el-progress
      :percentage="AiProgress" 
      :stroke-width="4"
      :show-text="false"
      :status="ProgressStatus"
      :color="customProgressColor"
    />
  </div>
  <div class="wrapper">
    <div class="content-container">
      <div class="section">
        <card />
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import card from '@/components/MainHome/card.vue';
import eventBus from '@/utils/eventBus';

const AiProgress = ref(0);
const ProgressStatus = ref('active');

let progressTimer: any = null

// 自定义进度条颜色（根据进度变化）
const customProgressColor = computed(() => {
  if (ProgressStatus.value === 'success') return '#67C23A';
  return `hsl(${Math.floor(AiProgress.value * 1.2)}, 80%, 50%)`; // 颜色渐变
});

// 分阶段速度控制
const getIncrement = () => {
  const progress = AiProgress.value;
  if (progress < 50) {
    return 5 + Math.random() * 5; // 快速阶段：5~13
  } else if (progress < 80) {
    return 2 + Math.random() * 2; // 中速阶段：2~5
  } else {
    return 0.5 + Math.random();  // 慢速阶段：0.5~1.5
  }
};

const startProgress = () => {

  
  AiProgress.value = 0;
  ProgressStatus.value = 'active'

  progressTimer = setInterval(() => {
    const increment = getIncrement();
    AiProgress.value = Math.min(AiProgress.value + increment, 99);
  }, 200)
}

const endProgess = () => {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progressTimer = null;
  AiProgress.value = 100;
  ProgressStatus.value = 'success';
}

onMounted(() => {
  eventBus.on('startProgress', startProgress);
  eventBus.on('endProgess', endProgess);
})

onBeforeUnmount(() => {
  eventBus.off('startProgress', startProgress);
  eventBus.off('endProgess', endProgess);
  if (progressTimer) clearInterval(progressTimer);
});
</script>
<style scoped lang="less">
.demo-progress {

}
.wrapper {
  background-color: #ffffff;
  min-height: 100vh; // 使用最小视口高度确保撑满
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0;

  .content-container {
    padding: 0;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    
    .section {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>