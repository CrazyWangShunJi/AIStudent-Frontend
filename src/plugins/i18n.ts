import { createI18n } from 'vue-i18n';
import zh from '../locales/zh';
import eng from '../locales/en';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

const messages: Record<string, any> = {
  'zh-CN': {
    ...zh,
    el: zhCn.el,
    home: {
      title: '知卷AI - 快速检查作业答案与解析',
      subtitle: '上传您的试卷图片或PDF，快速获取准确答案和详细解题过程。',
      uploadText: '上传',
      uploadType: '图片或PDF',
      uploadAction: '来检查答案',
      dragText: '拖拽文件到此处或',
      clickUpload: '点击上传',
      faqTitle: '关于知卷AI - 您可能想知道',
      featuresTitle: '为什么选择知卷AI？',
      loadingText: '正在分析您的文件，请稍候...',
      errorFileSize: '文件大小不能超过 {size}MB',
      errorFileType: '仅支持PNG, JPG, JPEG, PDF格式',
      errorAnalysis: 'AI分析失败，请稍后再试',
      faq: {
        q1: '知卷AI支持哪些文件类型？',
        a1: '我们支持常见的图片格式（PNG, JPG, JPEG）以及PDF文件。确保文件清晰以便AI准确识别。',
        q2: '知卷AI的主要功能是什么？',
        a2: '知卷AI旨在帮助学生快速核对试卷答案。您上传试卷后，AI会提供正确答案和详细的解题步骤，帮助您理解知识点。',
        q3: '分析结果包含哪些内容？',
        a3: '分析结果主要包括试卷中每道题目的正确答案和详细的解题过程解析，帮助您理解如何得出答案。',
        q4: '分析需要多长时间？',
        a4: '通常，分析过程需要几秒到半分钟不等，具体时间取决于您上传文件的页数和复杂度。',
        q5: '我可以用知卷AI来做什么？',
        a5: '您可以用它来快速检查作业或练习题的答案，或者在遇到难题时查看详细的解题步骤，加深对知识点的理解。',
        q6: '知卷AI支持手写文字识别吗？',
        a6: '对于清晰、规范的手写体，AI有一定的识别能力，但效果可能不如印刷体。为获得最佳效果，建议上传印刷体试卷。'
      },
      feature1: {
        name: '支持多种格式',
        desc: '轻松上传图片 (PNG, JPG) 或 PDF 格式的试卷文件。'
      },
      feature2: {
        name: '答案秒出',
        desc: '快速获取试卷题目的准确答案，节省核对时间。'
      },
      feature3: {
        name: '过程详解',
        desc: '不仅有答案，更有详细的解题步骤和思路解析。'
      },
      feature4: {
        name: '随时随地',
        desc: '网页版应用，无需安装，有网就能用，方便快捷。'
      }
    },
    resultPage: {
      questionTitle: '原始文件',
      resultTitle: '分析结果',
      parsingError: '结果解析失败，请检查AI返回内容或稍后再试。',
      overview: '答案概览',
      suggestions: '学习建议',
      answerSummary: '答案列表',
      questionLabel: '第 {num} 题',
      correct: '正确答案',
      notAvailable: '-',
      correctAnswerLabel: '正确答案',
      analysisLabel: '详细解析',
      solutionSteps: '解题思路',
      calculationProcess: '解题步骤',
      pdfPreviewPlaceholder: 'PDF 文件: {name} (暂不支持预览)',
      noPreview: '无法生成预览'
    }
  },
  'en': {
    ...eng,
    el: en.el,
    home: {
      title: 'QuickCheck - Fast Homework Answer Check & Analysis',
      subtitle: 'Upload your test paper image or PDF to quickly get accurate answers and detailed solution steps.',
      uploadText: 'Upload',
      uploadType: 'Image or PDF',
      uploadAction: 'to check answers',
      dragText: 'Drag file here or',
      clickUpload: 'click to upload',
      faqTitle: 'About QuickCheck - You Might Want to Know',
      featuresTitle: 'Why Choose QuickCheck?',
      loadingText: 'Analyzing your file, please wait...',
      errorFileSize: 'File size cannot exceed {size}MB',
      errorFileType: 'Only PNG, JPG, JPEG, PDF formats are supported',
      errorAnalysis: 'AI analysis failed, please try again later',
      faq: {
        q1: 'What file types does QuickCheck support?',
        a1: 'We support common image formats (PNG, JPG, JPEG) and PDF files. Ensure the file is clear for accurate AI recognition.',
        q2: 'What is the main function of QuickCheck?',
        a2: 'QuickCheck is designed to help students quickly verify their test paper answers. After uploading, the AI provides correct answers and detailed solution steps to help you understand the concepts.',
        q3: 'What does the analysis result include?',
        a3: 'The analysis primarily includes the correct answer for each question on the paper and a detailed explanation of the solution process, helping you understand how the answer is derived.',
        q4: 'How long does the analysis take?',
        a4: 'Typically, the analysis takes a few seconds to half a minute, depending on the number of pages and complexity of the uploaded file.',
        q5: 'What can I use QuickCheck for?',
        a5: 'You can use it to quickly check answers for homework or practice problems, or view detailed solution steps when you encounter difficulties, deepening your understanding of the topic.',
        q6: 'Does QuickCheck support handwriting recognition?',
        a6: 'The AI has some ability to recognize clear, standard handwriting, but results may not be as good as with printed text. For best results, uploading printed test papers is recommended.'
      },
      feature1: {
        name: 'Multiple Formats Supported',
        desc: 'Easily upload test paper files in image (PNG, JPG) or PDF format.'
      },
      feature2: {
        name: 'Instant Answers',
        desc: 'Quickly get accurate answers to test questions, saving checking time.'
      },
      feature3: {
        name: 'Detailed Process',
        desc: 'Not just answers, but also detailed solution steps and reasoning.'
      },
      feature4: {
        name: 'Anytime, Anywhere',
        desc: 'Web-based application, no installation required, accessible with internet.'
      }
    },
    resultPage: {
      questionTitle: 'Original File',
      resultTitle: 'Analysis Result',
      parsingError: 'Failed to parse the result. Please check the AI response or try again later.',
      overview: 'Answer Overview',
      suggestions: 'Learning Suggestions',
      answerSummary: 'Answer List',
      questionLabel: 'Question {num}',
      correct: 'Correct Answer',
      notAvailable: '-',
      correctAnswerLabel: 'Correct Answer',
      analysisLabel: 'Detailed Analysis',
      solutionSteps: 'Solution Approach',
      calculationProcess: 'Step-by-Step Process',
      pdfPreviewPlaceholder: 'PDF File: {name} (Preview not available)',
      noPreview: 'Preview cannot be generated'
    }
  }
};

// 从本地存储获取语言设置
const savedLang: string = localStorage.getItem('lang') || 'zh-CN';

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en',
  messages
})

// Element Plus 国际化配置
export const setupElementPlus = (app: any) => {
  app.use(ElementPlus, {
    locale: messages[savedLang].el
  })
}