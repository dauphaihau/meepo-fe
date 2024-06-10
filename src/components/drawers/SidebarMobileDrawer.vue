<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { UserIcon } from '@heroicons/vue/20/solid';
import {
  UserIcon as UserIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  BellIcon as BellIconOutline,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@stores/auth.ts';
import Drawer from '@core/components/Drawer.vue';
import { useDrawerStore } from '@stores/drawer.ts';
import { PAGE_PATHS } from '@config/const.ts';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const drawerStore = useDrawerStore();

const { isLoggedIn, user } = storeToRefs(authStore);

const logout = () => {
  authStore.logout();
  router.push({ name: 'explore' });
  drawerStore.close();
};

function redirectFollowPage(path: PAGE_PATHS.FOLLOWING | PAGE_PATHS.FOLLOWERS) {
  router.push(`${PAGE_PATHS.USER}/${user.value.username}${path}`);
  drawerStore.close();
}

</script>

<template>
  <Drawer
    :show="drawerStore.showDrawer === 'sidebar-mobile'"
    :close="drawerStore.close"
  >
    <template #panel>
      <router-link
        class="px-3 block w-fit"
        :to="`${PAGE_PATHS.USER}/${user.username}`"
      >
        <img
          v-if="user.avatar_url"
          alt="avatar"
          :src="user.avatar_url"
          class="h-10 w-10 lg:h-10 lg:w-10 rounded-full "
        >
        <img
          v-else
          alt="avatar"
          src="@/assets/default-avatar.png"
          class="h-10 w-10 lg:h-10 lg:w-10 rounded-full "
        >
      </router-link>

      <div class="mt-2 space-y-2 px-3">
        <div>
          <h3 class="text-[15px] font-bold  text-zinc-900">
            {{ user?.name }}
          </h3>
          <p class="max-w-2xl text-sm text-zinc-500">
            @{{ user?.username }}
          </p>
        </div>
        <div class="flex gap-4 ">
          <div
            class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
            @click="redirectFollowPage(PAGE_PATHS.FOLLOWERS)"
          >
            <span class="font-bold text-[14px]">{{ user?.followers_count ?? 0 }}</span>
            <span class="text-zinc-500 text-[14px]">Follower</span>
          </div>

          <div
            class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
            @click="redirectFollowPage(PAGE_PATHS.FOLLOWING)"
          >
            <span class="font-bold text-[14px]">{{ user?.followed_count ?? 0 }}</span>
            <span class="text-zinc-500 text-[14px]">Following</span>
          </div>
        </div>
      </div>

      <div class="mt-3">
        <router-link
          v-if="isLoggedIn"
          class="link"
          :to="`${PAGE_PATHS.USER}/${user.username}`"
          active-class="active"
          @click="drawerStore.close"
        >
          <UserIcon v-if="route.name === 'profile'" />
          <UserIconOutline v-else />
          <p>Profile</p>
        </router-link>
        <div
          v-if="isLoggedIn"
          class="link opacity-50"
        >
          <BellIconOutline />
          <p>Notifications</p>
        </div>
        <div
          v-if="isLoggedIn"
          class="link opacity-50"
        >
          <BookmarkIconOutline />
          <p>Bookmarks</p>
        </div>
        <div
          v-if="isLoggedIn"
          class="link"
          @click="logout"
        >
          <ArrowLeftOnRectangleIcon />
          <p>Log out</p>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>

.base {
  @apply flex items-center gap-4 hover:bg-zinc-100/80 animate text-black cursor-pointer px-3
}

.link {
  @apply base text-2xl py-3
}

.link svg {
  @apply h-6 w-6 stroke-[2]
}

.link p {
  @apply tracking-wide font-semibold text-[20px]
}

</style>
