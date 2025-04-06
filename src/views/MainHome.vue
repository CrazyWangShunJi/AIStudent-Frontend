<template>
  <div class="wrapper">
    <div class="content-container">
      <div class="section">
        <card />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import card from '@/components/MainHome/card.vue'

</script>
<style scoped lang="less">
.wrapper {
  background-color: #ffffff;
  height: 100%; // 使用视口高度确保撑满
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .content-container {
    padding: 5rem 1.5rem 0;
    width: 100%;
    max-width: 1378px;
    margin: 0 auto;
    height: 100%;
    .section {
      width: 100%;
      height: 585px;      // 直接固定高度
    }
  }
}

</style>