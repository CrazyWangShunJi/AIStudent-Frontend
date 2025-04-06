import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
interface fileType {
  name: string;
  percentage: number;
  size: number;
  status: string;
  uid: number;
  raw: any;
}

export const useCanvasImg = defineStore('canvasImg', () => {
  const canvasFile = ref<fileType | null>(null);
  const imgSrc = ref<string>('');

  return {
    canvasFile,
    imgSrc,
  }
})