<template>
  <div class="container">

    <el-card class="card-question">
      <template #header>
        <div class="card-header-custom">
          <div class="header-left">
            <span class="header-text">Question</span>
          </div>
        </div>
      </template>

      <div class="image-canvas">
        <img :src="imgSrc" class="image-content">
      </div>
    </el-card>

    <el-card class="card-answer">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-text">Ai Parse Result</span>
          </div>
        </div>
      </template>
      <div class="markdown-container">
        <parserAnswer></parserAnswer>
      </div>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useCanvasImg } from '@/stores/canvasImg.ts';
import { AiResult } from '@/stores/AiResult';
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css';
import parserAnswer from './parserAnswer.vue';

const store = useCanvasImg();
const AiStore = AiResult();

const { imgSrc } = storeToRefs(store);
const { AiParseResult } = storeToRefs(AiStore);
</script>

<style scoped lang="less">
/deep/ .el-card__header {
  border-bottom: 0px
}

/deep/ .el-card__footer {
  border: 0px;
}

.container {
  background-color: #ffffff;
  height: 100%; // 使用视口高度确保撑满
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;
  gap: 50px;
  overflow-y: auto;

  .card-question {
    width: 100%;
    height: 200px;
    min-height: 200px;
    max-width: 1378px;
    border-radius: 20px;

    .card-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center; // 垂直居中
      margin-bottom: 0px;

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

    .image-canvas {
      height: 150px;
      background: rgba(241, 245, 249, 0.5);
      border-radius: 8px;
      margin-top: -27px;
      .image-content {
        height: 150px;
        object-fit: contain;
      }
    }
  }

  .card-answer {
    border-radius: 20px;
    width: 100%;
    max-width: 1378px;
    flex: 1;
    overflow: visible;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center; // 垂直居中

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 700;
        color: #000000;

        .header-text {
          line-height: 10px;
          font-weight: 800;
        }
      }
    }

    .markdown-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      overflow-y: auto;
      /* 自定义 markdown 样式 */
      .markdown-body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;

        /* 标题样式 */
        h1,
        h2,
        h3 {
          border-bottom: 1px solid #eaecef;
          padding-bottom: 0.3em;
        }

        /* 代码块 */
        pre.hljs {
          border-radius: 6px;
          padding: 1.2em;
          position: relative;
          margin: 1rem 0;
          background: #f6f8fa;

          &:hover::after {
            content: "点击代码复制";
            position: absolute;
            right: 10px;
            top: 5px;
            font-size: 0.8em;
            color: #666;
            cursor: pointer;
          }
        }

        /* 表格样式 */
        table {
          border-collapse: collapse;
          margin: 1em 0;

          th,
          td {
            border: 1px solid #dfe2e5;
            padding: 0.6em 1em;
          }

          th {
            background: #f6f8fa;
          }
        }

        /* 列表样式 */
        ul,
        ol {
          padding-left: 2em;

          li {
            margin: 0.5em 0;
          }
        }
      }
    }
  }
}
</style>