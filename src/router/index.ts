import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '@pages/home.vue';
import Post from '@pages/post.vue';
import History from '@pages/history-edited-posts.vue';
import Profile from '@pages/profile.vue';
import Follow from '@pages/follow.vue';
import Search from '@pages/search.vue';
import Explore from '@pages/explore.vue';
import Room from '@pages/room.vue';
import Messages from '@pages/messages.vue';
import NotFound from '@pages/not-found.vue';
import { mapGetters } from '@/lib/map-state';
import { ActionEnums } from '@/types/store/root';
import { store } from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: Post,
  },
  {
    path: '/posts/:id/history',
    name: 'history',
    component: History,
  },
  {
    path: '/user/:username',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/user/:username/following',
    name: 'following',
    component: Follow,
    props: true,
  },
  {
    path: '/user/:username/followers',
    name: 'followers',
    component: Follow,
    props: true,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    props: true,
  },
  {
    path: '/explore',
    name: 'explore',
    component: Explore,
  },
  {
    path: '/messages',
    name: 'messages',
    component: Messages,
  },
  {
    path: '/room',
    name: 'room',
    component: Room,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: function (to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    else {
      return { top: 0 };
    }
  },
});

router.beforeResolve(async (to, from, next) => {
  const { isLoggedIn } = mapGetters();

  if (!isLoggedIn.value) {
    const localAuthToken = localStorage.auth_token;
    const tokenExists = localAuthToken !== 'undefined' && localAuthToken !== null;
    if (tokenExists) {
      const auth_token = localStorage.getItem('auth_token');
      const authTokenExists = auth_token !== 'undefined' && auth_token !== null;
      if (authTokenExists) {
        await store.dispatch(ActionEnums.LOGIN_WITH_TOKEN);
      }
    }
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return next('/explore');
  }

  if (to.path === '/') {
    if (isLoggedIn.value) {
      return next('/home');
    }
    else {
      return next('/explore');
    }
  }

  next();
});

export default router;
