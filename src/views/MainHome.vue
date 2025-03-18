<template>
  <el-row class="main-container" :gutter="20">
    <!-- 左侧预览区域 -->
    <el-col :span="6">
      <MainConfig />
    </el-col>

    <!-- 中间解析结果 -->
    <el-col :span="12">
      <el-card style="height: 100%;">
        <h2 class="title">识别结果</h2>
        <div class="content-section">
          <el-text class="content-title">作者姓名</el-text>
          <el-text class="content-value">大师作声说视频</el-text>

          <el-text class="content-title">学号</el-text>
          <el-text class="content-value">您的学号</el-text>

          <el-text class="content-title">专业</el-text>
          <el-text class="content-value">您的专业</el-text>

          <el-divider />

          <el-text class="section-title">摘要</el-text>
          <el-text class="content-text">
            这一部分为摘要，使用摘要相关的样式。标题使用摘要标题样式...
          </el-text>

          <el-text class="section-title">关键字</el-text>
          <el-text class="content-text">毕业论文，模板</el-text>
        </div>
      </el-card>
    </el-col>

    <!-- 右侧结果面板 -->
    <el-col :span="6">
      <el-tabs type="border-card" style="height: 89%;">
        <el-tab-pane label="试卷结果">
          <pre class="code-block">{{ sampleJSON }}</pre>
        </el-tab-pane>
        <el-tab-pane label="AI解析">
          <div class="reference-sample">
            <!-- 标准样例内容 -->
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-card class="mt-3">
        <el-input
          placeholder="输入在线文件URL，回车/Enter发起调用"
          @keyup.enter="handleUrlSubmit"
        />
        <el-text class="tip">支持的文件格式：png, .jpg, jpg, doc, docx 等</el-text>

        <div class="action-buttons mt-4">
          <el-button type="primary">复制结果</el-button>
          <el-button>问题反馈</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import MainConfig from '@/components/MainConfig/index.vue'

const sampleJSON = `{
  "author": "大师作声说视频",
  "student_id": "您的学号",
  "major": "您的专业"
}`

const handleUrlSubmit = () => {
  // 处理URL提交逻辑
}
</script>

<style lang="less" scoped>
.main-container {
  position: relative;
  top: 62px;
  height: 73vh;
  padding: 20px;
  width: 100%;
  background-color: #f5f7fa;

}

.preview-card {
  height: calc(100vh - 40px);
}

.content-section {
  line-height: 2em;
}

.content-title {
  display: block;
  color: #909399;
  font-size: 0.9em;
}

.content-value {
  display: block;
  margin-bottom: 1em;
  font-size: 1.1em;
}

.section-title {
  display: block;
  font-weight: bold;
  margin: 1em 0;
}

.code-block {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
}

.tip {
  color: #999;
  font-size: 0.8em;
  display: block;
  margin-top: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>