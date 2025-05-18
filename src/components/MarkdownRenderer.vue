<template>
  <div ref="markdownContainer" class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
// ESM build of markdown-it-katex
import MarkdownItKatex from '@traptitech/markdown-it-katex';
import hljs from 'highlight.js';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css'; // Or your preferred highlight theme
import 'github-markdown-css/github-markdown.css'; // Basic GitHub styles

const props = defineProps<{ markdown: string }>();

const renderedHtml = ref('');
const markdownContainer = ref<HTMLDivElement | null>(null);

const md = new MarkdownIt({
  html: true, // Allow HTML tags
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    // Use external default escaping
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
}).use(MarkdownItKatex); // Use KaTeX plugin

const renderMarkdown = () => {
  renderedHtml.value = md.render(props.markdown || '');
  // Apply syntax highlighting after rendering and DOM update
  nextTick(() => {
     if (markdownContainer.value) {
        markdownContainer.value.querySelectorAll('pre code').forEach((block) => {
          // Re-highlight in case markdown-it didn't catch it
           // hljs.highlightElement(block as HTMLElement);
           // Note: markdown-it's highlight function should handle this, 
           // manual highlighting might cause double rendering issues.
        });
     }
  });
};

watch(() => props.markdown, () => {
  renderMarkdown();
}, { immediate: true });

onMounted(() => {
  renderMarkdown(); // Initial render
});

</script>

<style lang="less" scoped>
.markdown-body {
  // Basic text alignment and font settings
  text-align: left;
  font-size: 14px; 
  line-height: 1.7;
  color: #333;

  // Ensure block elements like paragraphs and lists have spacing
  /deep/ p, 
  /deep/ ul, 
  /deep/ ol, 
  /deep/ blockquote,
  /deep/ pre.hljs {
    margin-bottom: 1em; 
  }
  
  /deep/ h1, /deep/ h2, /deep/ h3, /deep/ h4, /deep/ h5, /deep/ h6 {
     margin-top: 1.5em;
     margin-bottom: 0.8em;
     font-weight: 600;
     line-height: 1.4;
  }
  
  // KaTeX specific overrides
  /deep/ .katex {
    font-size: 1.1em; // Make formulas slightly larger than text
    line-height: normal; // Prevent extra line height from interfering
  }

  /deep/ .katex-display {
    display: block;
    overflow-x: auto; // Allow horizontal scroll for very long equations
    overflow-y: hidden;
    padding: 0.75em 0; // Add vertical padding around block equations
    margin: 0.5em 0 1em 0; // Adjust margins
    text-align: center; // Center block equations
  }
  
  // Style inline math to align better with text
   /deep/ span.katex {
      display: inline-block; // Helps with vertical alignment
      vertical-align: middle; // Try to align with text middle
      padding: 0 0.1em; // Slight horizontal padding
   }

  /deep/ pre.hljs {
     position: relative; 
     padding: 1em;
     border-radius: 6px;
     background-color: #f6f8fa;
     overflow-x: auto;
     code {
        background-color: transparent; // Ensure code bg doesn't override pre bg
        padding: 0;
     }
  }
  
  ul, ol {
     padding-left: 2em;
  }
  li {
    margin-bottom: 0.5em;
  }
  
  // Ensure bold markdown translates well
  /deep/ strong {
     font-weight: 600;
  }
}
</style> 