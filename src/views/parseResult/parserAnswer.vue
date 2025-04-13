<template>
  <div class="result-container">
    <!-- 头部信息 -->
    <div class="header-box" v-if="resultData.header">
      <div class="title">考试结果概览</div>
      <div class="content" v-html="formatContent(resultData.header)"></div>
    </div>

    <!-- 题目解析 -->
    <div 
      v-for="q in resultData.questions" 
      :key="q.number"
      class="question-box"
    >
      <div class="question-header">
        第 {{ q.number }} 题 
        <span class="correct-answer">正确答案：{{ q.answer }}</span>
      </div>
      <div 
        class="parse-content" 
        v-html="formatContent(q.parse)"
      ></div>
    </div>

    <!-- 底部建议 -->
    <div class="footer-box" v-if="resultData.footer">
      <div class="title">总体学习建议</div>
      <div class="content" v-html="formatContent(resultData.footer)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Str } from '../../../mock/001.ts'; // 假设这是你的 XML 字符串
import { ref, onMounted } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.css';

// 类型定义
interface QuestionItem {
  number: string;
  answer: string;
  parse: string;
}

interface ResultData {
  header?: string;
  questions: QuestionItem[];
  footer?: string;
}

// 类型定义保持不变
interface QuestionItem {/* 同上 */}
interface ResultData {/* 同上 */}

// 响应式数据
const resultData = ref<ResultData>({
  header: '',
  questions: [],
  footer: ''
});

// 新版解析函数
const parseResultXML = (xmlString: string) => {
  const result: ResultData = {
    header: '',
    questions: [],
    footer: ''
  };

  try {
    // 解析 header
    const headerMatch = xmlString.match(/<header>([\s\S]*?)<\/header>/i);
    result.header = headerMatch?.[1]?.trim() || '';

    // 解析 questions
    const questionRegex = /<question>([\s\S]*?)<\/question>/gi;
    let questionMatch;
    
    while ((questionMatch = questionRegex.exec(xmlString)) !== null) {
      const questionContent = questionMatch[1];
      
      // 提取子元素
      const numberMatch = questionContent.match(/<number>([\s\S]*?)<\/number>/i);
      const answerMatch = questionContent.match(/<answer>([\s\S]*?)<\/answer>/i);
      const parseMatch = questionContent.match(/<parse>([\s\S]*?)<\/parse>/i);

      result.questions.push({
        number: numberMatch?.[1]?.trim() || '',
        answer: answerMatch?.[1]?.trim() || '',
        parse: parseMatch?.[1]?.trim() || ''
      });
    }

    // 解析 footer
    const footerMatch = xmlString.match(/<footer>([\s\S]*?)<\/footer>/i);
    result.footer = footerMatch?.[1]?.trim() || '';

  } catch (e) {
    console.error('解析错误:', e);
  }

  return result;
};

// 修改后的 formatContent 函数
const formatContent = (content: string) => {
  // 第一步：处理 HTML 实体和换行
  let formatted = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // 第二步：精确处理 LaTeX 公式的双重转义
  formatted = formatted.replace(
    /\\\(\s*(.*?)\s*\\\)/g,  // 匹配 \\(...\\)
    (_, mathContent) => {
      try {
        // 关键处理：将双重转义反斜杠转换为单反斜杠
        const cleanedMath = mathContent
          .replace(/\\\\/g, '\\')  // 把 \\ 转换为 \
          .replace(/\s+/g, ' ')    // 合并多余空格
          .trim();

        return katex.renderToString(cleanedMath, {
          throwOnError: false,
          displayMode: false,
          strict: false
        });
      } catch (e) {
        console.warn('KaTeX 渲染错误:', e);
        return `<span class="katex-error">${mathContent}</span>`;
      }
    }
  );

  // 第三步：处理换行符
  return formatted.replace(/\n/g, '<br>');
};

onMounted(() => {
  resultData.value = parseResultXML(Str);
});
</script>

<style scoped>
/* 确保公式正确显示 */
:deep(.katex) {
  font-size: 1.1em !important;
  line-height: 1.2;
}

/* 处理行内公式对齐 */
:deep(.katex-display) {
  margin: 0.5em 0;
  overflow: auto hidden;
}
.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.header-box, .footer-box {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title {
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.question-box {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
}

.question-header {
  font-size: 1.1em;
  font-weight: 500;
  margin-bottom: 15px;
}

.correct-answer {
  color: #42b983;
  margin-left: 15px;
}

.parse-content {
  line-height: 1.6;
  color: #34495e;
}

/* 处理数学公式样式（需要配合数学公式库使用） */
:deep(.math-formula) {
  font-family: "KaTeX", sans-serif;
  font-size: 1.1em;
}
</style>