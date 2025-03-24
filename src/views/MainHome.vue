<template>
  <div class="three-column-wrapper">
    <div class="content-container">
      <!-- 左侧边栏 -->
      <LeftView />

      <!-- 主内容区 -->
      <main class="main-content">
        <MainUpload />
      </main>

      <!-- 右侧边栏 -->
      <RightView />
    </div>
  </div>
</template>

<script setup lang="ts">
import MainUpload from '../components/MainUpload/index.vue';
import LeftView from '../components/LeftView/index.vue';
import RightView from '../components/RightView/index.vue';

</script>
<style scoped lang="less">
.three-column-wrapper {
  margin: 0 auto;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}

.content-container {
  width: 100%;
  height:100%;
  display: flex;
  gap: 20px;
  position: relative;

  // 公共侧边栏样式
  aside {
    flex-shrink: 0;  // 禁止侧边栏压缩
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .left-sidebar {
    width: 200px;
    ul {
      list-style: none;
      padding: 0;
      li {
        padding: 8px 0;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .main-content {
    flex-grow: 1;  // 主内容区自动填充剩余空间
    min-width: 0;  // 修复flex内容溢出问题
    background: #f2f4f7;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);

    article {
      margin-bottom: 20px;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
  }

  .right-sidebar {
    width: 400px;
    .widget {
      button {
        display: block;
        width: 100%;
        margin: 10px 0;
        padding: 8px;
      }
    }
  }
}

// 响应式处理
@media (max-width: 1200px) {
  .content-container {
    .right-sidebar {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;

    .left-sidebar {
      width: 100%;
      margin-bottom: 20px;
    }

    .main-content {
      order: 1; // 主内容下移
    }
  }
}
</style>