import { createApp } from 'vue';
import { store as VuexStore } from '@/store';
import FloatingVue from 'floating-vue';

import App from './App.vue';
import router from './router';

import '@/assets/main.css';
import '@/assets/tooltip.css';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(VuexStore);
app.use(FloatingVue);
app.use(VueQueryPlugin);

app.use(router);
app.mount('#app');
