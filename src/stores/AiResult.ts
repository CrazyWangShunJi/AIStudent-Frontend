import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const AiResult = defineStore('aiResult', () => {
  const AiParseResult = ref<any>(null);

  return {
    AiParseResult,
  }
})