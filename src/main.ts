import './assets/main.css'
import 'katex/dist/katex.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { i18n, setupElementPlus} from  './plugins/i18n';
import { useAuthStore } from '@/stores/auth';

const app = createApp(App);

// 初始化Pinia
app.use(createPinia());

// 初始化认证状态
const authStore = useAuthStore();
authStore.init();

app.use(ElementPlus);
app.use(router);
app.use(i18n);

setupElementPlus(app);

app.mount('#app');
