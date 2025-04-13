<template>
  <div class="result-container">
    <!-- Header 折叠面板 -->
    <el-collapse v-model="activeHeaders" v-if="resultData.header">
      <el-collapse-item 
        name="header" 
        class="collapse-card-header"
        :class="{ 'expanded': activeHeaders.includes('header') }"
      >
        <template #title>
          <span class="collapse-title">概览</span>
        </template>
        <div class="content left-align" v-html="formatContent(resultData.header)"></div>
      </el-collapse-item>
    </el-collapse>

    <!-- 每个题目独立折叠面板 -->
    <div v-for="(q, index) in resultData.questions" :key="q.number">
      <el-collapse v-model="activeQuestions">
        <el-collapse-item 
          :name="'question-' + index"
          class="collapse-card-question"
        >
          <template #title>
            <div class="question-header">
              <span>第 {{ q.number ?  q.number : (index + 1)}} 题</span>
            </div>
          </template>
          <div class="correct-answer" v-if="q.answer">
            <div class="answer-title">答案: </div>
            <div class="answer-content">
              {{ q.answer }}
            </div>
          </div>
          <br></br>
          <div class="correct-parse" v-if="q.parse">
            <div class="parse-title">解析: </div>
            <div class="parse-content left-align" v-html="formatContent(q.parse)"></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Footer 折叠面板 -->
    <el-collapse v-model="activeFooters" v-if="resultData.footer">
      <el-collapse-item 
        name="footer" 
        class="collapse-card-footer"
      >
        <template #title>
          <span class="collapse-title">总体学习建议</span>
        </template>
        <div class="content left-align" v-html="formatContent(resultData.footer)"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { Str } from '../../../mock/001.ts'; // 假设这是你的 XML 字符串
import { ref, onMounted, watch } from 'vue';
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

// 控制展开状态
const activeHeaders = ref(['header'])
const activeQuestions = ref<string[]>(resultData.value.questions.map((_, index) => `question-${index}`))
const activeFooters = ref(['footer'])

onMounted(() => {
  resultData.value = parseResultXML(Str);
});

// 动态更新问题展开状态
watch(() => resultData.value.questions, (newVal) => {
  activeQuestions.value = newVal.map((_, index) => `question-${index}`)
}, { deep: true })
</script>

<style lang="less" scoped>
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

/* 处理数学公式样式（需要配合数学公式库使用） */
:deep(.math-formula) {
  font-family: "KaTeX", sans-serif;
  font-size: 1.1em;
}
.result-container {
  // 通用折叠面板样式
  .el-collapse {
    border: none;
    margin-bottom: 20px;

    // 深度选择器覆盖element样式
    &:deep(.el-collapse-item) {
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      margin-bottom: 16px;
      transition: all 0.3s;

      &:last-child {
        margin-bottom: 0;
      }
    }

    // 标题区域样式
    &:deep(.el-collapse-item__header) {
      background-color: #f9fafb;
      padding: 16px 20px;
      border-bottom: none;
      font-weight: 600; // 加粗标题
      color: #2d333a;

      .collapse-title {
        letter-spacing: 0.5px;
        font-size: 16px;
        font-weight: 700;
      }
    }

    // 内容区域样式
    &:deep(.el-collapse-item__content) {
      padding: 20px;
      background: white;
      text-align: left; // 强制左对齐

      .left-align {
        text-align: left;
        > * {
          text-align: left !important; // 强制继承左对齐
        }
      }
    }
  }

  // 题目特殊样式
  .collapse-card-question {
    &:deep(.el-collapse-item__header) {
      background-color: #f3f8ff;
    }

    .question-header {
      display: flex;
      align-items: center;
      gap: 15px;
      font-size: 16px;
      font-weight: 700;
    }

    .correct-answer {
      .answer-title {
        font-size: 14px;
        font-weight: 600;
      }

      .answer-content {
        margin-left: 10px;
      }
    }

    .correct-parse {
      .parse-title {
        font-size: 14px;
        font-weight: 600;
      }

      .parse-content {
        margin-left: 10px;
      }
    }
  }

  // 底部特殊样式
  .collapse-card-footer {
    &:deep(.el-collapse-item__header) {
      background-color: #fff7f0;
    }
  }

  // 数学公式样式保持
  &:deep(.katex) {
    font-size: 1.1em !important;
    line-height: 1.2;
  }
}
</style>