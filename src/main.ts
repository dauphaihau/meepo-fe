import { createApp } from 'vue'
import { useStore, store as VuexStore } from '@/store'
import axios from 'axios';
import FloatingVue from 'floating-vue'

import App from './App.vue'
import router from './router'

import '@/assets/main.css'
import '@/assets/tooltip.css'

import { ActionEnums } from "@/types/store/root";

const store = useStore()

let localAuthToken = localStorage.auth_token;
let tokenExists = localAuthToken !== "undefined" && localAuthToken !== null;
if (tokenExists) {
  const auth_token = localStorage.getItem("auth_token");
  const authTokenExists = auth_token !== "undefined";
  if (authTokenExists) {
    store.dispatch(ActionEnums.LOGIN_WITH_TOKEN);
  }
}

const app = createApp(App)
app.use(FloatingVue)
app.use(VuexStore)
// @ts-ignore: error TS2345: Argument of type 'AxiosStatic' is not assignable to parameter of type '[]'
app.use(router, axios)

app.mount('#app')
