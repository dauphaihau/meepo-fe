import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: function (to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // if (savedPosition) {
    //   return savedPosition;
    // }
    // if (to.hash) {
    //   return { el: to.hash, behavior: 'smooth' };
    // } else {
    //   setTimeout(() => {
    //     window.scrollTo(0, 0);
    //   }, 500);
    // }
  },
});

export default router
