import service from "./index";
import { i18n } from '@/plugins/i18n'; // Import i18n instance

export const getAiService = (data: string) => {
  const currentLocale = i18n.global.locale.value; // Get current language
  console.log('Sending request to AI service with locale:', currentLocale);
  // Send data and language in the POST body
  return service.post('/api/ai/imageParse', { 
    fileData: data, // Changed key 
    language: currentLocale 
  });
};