import { createI18n } from 'vue-i18n';
import zh from '../locales/zh';
import eng from '../locales/en';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/zh-cn';

const messages: Record<string, any> = {
  'zh-CN': {
    ...zh,
    el: zhCn.el
  },
  'en': {
    ...eng,
    el: en.el
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