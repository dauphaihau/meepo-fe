import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from "@/components/pages/home.vue";
import Post from "@/components/pages/post.vue";
import Profile from "@/components/pages/profile.vue";
import Test from "@/components/pages/test.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: Post
  },
  {
    path: '/user/:username',
    name: 'profile',
    component: Profile
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: function (to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }
    }
  },
});

export default router
