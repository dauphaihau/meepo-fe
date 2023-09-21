import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from "@/components/pages/home.vue";
import Post from "@/components/pages/post.vue";
import History from "@components/pages/history-edited-posts.vue";
import Profile from "@/components/pages/profile.vue";
import Follow from "@/components/pages/follow.vue";
import Search from "@/components/pages/search.vue";
import Explore from "@/components/pages/explore.vue";
import Test from "@/components/pages/test.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: Post
  },
  {
    path: '/posts/:id/history',
    name: 'history',
    component: History
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
  {
    path: '/user/:username/following',
    name: 'following',
    component: Follow,
    props: true
  },
  {
    path: '/user/:username/followers',
    name: 'followers',
    component: Follow,
    props: true
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    props: true
  },
  {
    path: '/explore',
    name: 'explore',
    component: Explore,
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
