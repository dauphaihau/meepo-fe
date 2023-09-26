import { createApp } from 'vue'
import { store as VuexStore } from '@/store'
import axios from 'axios';
import FloatingVue from 'floating-vue'

import App from './App.vue'
import router from './router'

import '@/assets/main.css'
import '@/assets/tooltip.css'

const app = createApp(App)
app.use(FloatingVue)
app.use(VuexStore)
// @ts-ignore: error TS2345: Argument of type 'AxiosStatic' is not assignable to parameter of type '[]'
app.use(router, axios)

app.mount('#app')
