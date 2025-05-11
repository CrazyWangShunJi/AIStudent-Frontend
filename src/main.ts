import './assets/main.css'
import 'katex/dist/katex.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { i18n, setupElementPlus} from  './plugins/i18n';

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.use(i18n);


setupElementPlus(app);

app.mount('#app');
