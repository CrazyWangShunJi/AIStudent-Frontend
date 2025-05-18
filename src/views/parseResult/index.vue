<template>
  <div class="result-page-wrapper">
    <!-- 问题展示区 (Thumbnail) -->
    <div class="question-section section-card">
      <h2 class="section-title">{{ $t('resultPage.questionTitle') }}</h2>
      <div class="file-preview-container">
        <!-- Display image thumbnail -->
        <img 
           v-if="fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg'" 
           :src="imgSrc || defaultImage" 
           alt="Uploaded Image Thumbnail" 
           class="image-thumbnail" 
           @error="onImageError"
           @click="showImagePreview = true"
        />
        <!-- Placeholder for PDF -->
        <div v-else-if="fileType === 'application/pdf'" class="pdf-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>{{ $t('resultPage.pdfPreviewPlaceholder', { name: canvasFile?.name || 'PDF' }) }}</span>
           <!-- Add horizontal scroll for future multi-page thumbnails here if needed -->
        </div>
         <div v-else class="no-preview">{{ $t('resultPage.noPreview') }}</div>
      </div>
      <!-- 图片大图预览弹窗 -->
      <ImagePreviewer v-if="showImagePreview" :images="[imgSrc]" :start-index="0" @close="showImagePreview = false" />
    </div>

    <!-- 结果分析区 -->
    <div class="result-section section-card">
      <h2 class="section-title">{{ $t('resultPage.resultTitle') }}</h2>
      <div v-if="!parsedResult || (!parsedResult.header && parsedResult.questions.length === 0)" class="no-result">
        {{ $t('resultPage.parsingError') }}
      </div>
      <el-collapse v-else v-model="activeCollapseNames" class="result-collapse">
        <!-- 答案概览 -->
        <el-collapse-item v-if="parsedResult.header?.answer_summary" name="overview" class="overview-item">
          <template #title>
            <span class="collapse-title overview-title">{{ $t('resultPage.overview') }}</span>
          </template>
          <div class="overview-content">
            <!-- Display formatted answer summary -->
            <div class="overview-detail answer-summary">
               <!-- Removed the label -->
               <p class="answer-summary-text">{{ formatAnswerSummary(parsedResult.header.answer_summary) }}</p>
            </div>
            <!-- Optional suggestions and error analysis -->
            <div v-if="parsedResult.header.suggestions" class="overview-detail">
              <strong>{{ $t('resultPage.suggestions') }}:</strong>
              <p v-html="sanitizeHtml(parsedResult.header.suggestions)"></p>
            </div>
             <!-- Removed error_analysis display -->
          </div>
        </el-collapse-item>

        <!-- 分题解析 -->
        <el-collapse-item 
          v-for="(item, index) in parsedResult.questions"
          :key="item.number || index" 
          :name="`question-${item.number || index}`"
          class="question-item"
        >
          <template #title>
             <div class="collapse-title question-title">
                <!-- Title only shows question number now -->
                <span>{{ $t('resultPage.questionLabel', { num: item.number }) }}</span>
             </div>
          </template>
          <div class="question-details">
            <!-- Use MarkdownRenderer for the parse content -->
            <MarkdownRenderer :markdown="item.parse || ''" />
            <!-- Final answer display below markdown -->
             <div class="detail-item final-answer-display" v-if="item.answer">
                <strong>{{ $t('resultPage.correctAnswerLabel') }}:</strong> 
                <span>{{ item.answer }}</span>
             </div>
          </div>
        </el-collapse-item>
        
        <!-- Footer Removed -->
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasImg } from '@/stores/canvasImg.ts';
import { AiResult } from '@/stores/AiResult';
import { ElCollapse, ElCollapseItem } from 'element-plus';
import DOMPurify from 'dompurify';
import { useI18n } from 'vue-i18n';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'; // Import the new component
import ImagePreviewer from '@/components/ImagePreviewer.vue';

const { t } = useI18n();

// Stores
const canvasStore = useCanvasImg();
// Added canvasFile to display PDF name
const { imgSrc, fileType, canvasFile } = storeToRefs(canvasStore); 
const aiResultStore = AiResult();
const { AiParseResult } = storeToRefs(aiResultStore);

// State
const defaultImage = ref('@/assets/placeholder.png'); 
const parsedResult = ref<ParsedAnalysis | null>(null);
const activeCollapseNames = ref<string[]>([]);
const showImagePreview = ref(false);

// Types (Removed error_analysis)
interface ParsedHeader {
  answer_summary?: string;
  suggestions?: string;
}

interface ParsedQuestion {
  number?: string;
  answer?: string;
  parse?: string;
}

interface ParsedAnalysis {
  header?: ParsedHeader;
  questions: ParsedQuestion[];
}

// Parsing Logic (Removed error_analysis)
const parseXmlResult = (xmlString: string): ParsedAnalysis | null => {
  if (!xmlString || typeof xmlString !== 'string') {
    console.error('Invalid XML string for parsing:', xmlString);
    return null;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<root>${xmlString.trim()}</root>`, "application/xml");

    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('XML Parsing Error:', parserError.textContent);
      return null; 
    }

    const analysisNode = doc.querySelector('analysis');
    if (!analysisNode) {
       console.warn('No <analysis> tag found in the response.');
       return null;
    }

    const result: ParsedAnalysis = { questions: [] };

    // Parse Header
    const headerNode = analysisNode.querySelector('header');
    if (headerNode) {
      result.header = {
        answer_summary: headerNode.querySelector('answer_summary')?.textContent?.trim() || undefined,
        suggestions: headerNode.querySelector('suggestions')?.textContent?.trim() || undefined,
      };
    }

    // Parse Questions
    const questionNodes = analysisNode.querySelectorAll('question');
    questionNodes.forEach(qNode => {
      result.questions.push({
        number: qNode.querySelector('number')?.textContent?.trim() || undefined,
        answer: qNode.querySelector('answer')?.textContent?.trim() || undefined,
        parse: qNode.querySelector('parse')?.textContent?.trim() || undefined,
      });
    });

    if (!result.header && result.questions.length === 0) {
        console.warn('Parsing resulted in empty data.');
        return null;
    }

    return result;
  } catch (error) {
    console.error('Error parsing XML result:', error);
    return null;
  }
};

// Sanitize HTML (Only for suggestions now)
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html || '', { USE_PROFILES: { html: true } });
};

// Format Answer Summary for better readability
const formatAnswerSummary = (summary: string | undefined): string => {
  if (!summary) return '-';
  // Replace commas with line breaks for display
  return summary.replace(/,\s*/g, '\n'); 
};

// Lifecycle and Watchers
const processResult = () => {
  parsedResult.value = parseXmlResult(AiParseResult.value);
  activeCollapseNames.value = []; // Keep collapsed
};

onMounted(() => {
  processResult();
});

watch(AiParseResult, (newValue) => {
  processResult();
});

// Image Error Handling
const onImageError = () => {
  console.error('Failed to load image preview.');
}

</script>

<style lang="less" scoped>
.result-page-wrapper {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  text-align: left;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #22405c;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

// Question Section (Thumbnail focus)
.question-section {
  padding-bottom: 15px;
  .file-preview-container {
    width: 100%;
    display: flex;
    align-items: flex-start; 
    min-height: 80px;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: auto;

    .image-thumbnail {
      max-width: 100%;
      height: 100px;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid #eee;
    }
    
    .pdf-placeholder {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #555;
      font-size: 14px;
      padding: 15px 0; 
      svg {
        stroke: #888;
        flex-shrink: 0;
      }
      span {
        word-break: break-all; // Allow long PDF names to wrap
      }
    }
    .no-preview {
       color: #888;
       font-size: 14px;
       padding: 15px 0;
    }
  }
}

// Result Section (Dominant Area)
.result-section {
  flex-grow: 1;
  
  .no-result {
    color: #888;
    text-align: left;
    padding: 20px 0;
    font-size: 15px;
  }

  .result-collapse {
    border: none;
    background-color: transparent;
    text-align: left;

    .overview-item, .question-item {
       margin-bottom: 12px;
       background-color: #ffffff;
       border-radius: 8px;
       border: 1px solid #e8ecf1;
       overflow: hidden;

      /deep/ .el-collapse-item__header {
         background-color: #f8f9fa;
         border-radius: 0;
         border-bottom: 1px solid #e8ecf1; 
         padding: 0 15px;
         height: auto;
         min-height: 45px;
         line-height: normal;
         transition: background-color 0.3s;
         text-align: left;
         display: flex; // Use flex for title alignment
         align-items: center; // Vertically center title content
         
         &:hover {
           background-color: #f0f2f5;
         }
         &.is-active {
           border-bottom-color: transparent; 
         }
         // Remove arrow default right placement
         .el-collapse-item__arrow {
           margin: 0 0 0 8px; 
         }
      }
      
       /deep/ .el-collapse-item__wrap {
         background-color: #ffffff;
         border: none;
         border-top: 1px solid #e8ecf1;
         border-radius: 0;
         
         .el-collapse-item__content {
           padding: 0; // Remove default padding, handled by MarkdownRenderer/detail-item
           line-height: 1.7;
           text-align: left;
         }
       }
    }
    
    .overview-item {
       /deep/ .el-collapse-item__header {
          background-color: #eef2f8; 
          &:hover {
             background-color: #e6ebf2;
          }
       }
    }
    
    .collapse-title {
      font-size: 15px;
      font-weight: 600;
      color: #334;
      padding: 8px 0;
      text-align: left;
      flex-grow: 1; // Allow title to take available space
    }
    
    .overview-title {
       color: #22405c;
    }

    .question-title {
       // No answer preview needed here anymore
       justify-content: flex-start; // Just display the title left-aligned
    }
    
    .overview-content {
        padding: 15px; // Add padding back here
        text-align: left;
        .overview-detail {
          margin-bottom: 12px;
          strong {
            display: block;
            margin-bottom: 5px;
            color: #333;
          }
          p {
            margin: 0;
            color: #555;
            word-wrap: break-word;
          }
          &.answer-summary .answer-summary-text {
            // Renamed class for clarity
            white-space: pre-wrap; 
            background-color: #f0f2f5; 
            padding: 10px 15px;
            border-radius: 6px;
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; // Monospace font
            line-height: 1.6;
            display: inline-block; // Fit content width
            min-width: 200px; // Ensure minimum width
          }
        }
    }
    
    .question-details {
      padding: 15px; // Add padding here for the details section
      text-align: left;
       // The MarkdownRenderer component will handle the content display
      .detail-item {
         margin-bottom: 12px;
         strong {
            display: block;
            margin-bottom: 5px;
            color: #333;
         }
         span {
           color: #555;
         }
         &.final-answer-display {
            margin: 0 15px 15px 15px; // Apply margin only here
            padding-top: 15px;
            border-top: 1px solid #eee;
            strong {
              font-size: 14px;
              color: #67c23a;
            }
            span {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-left: 8px;
            }
         }
      }
    }
  }
}
</style>