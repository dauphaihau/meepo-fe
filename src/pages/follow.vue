<script setup lang="ts">
import {
  onBeforeMount, onMounted, ref
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { userService } from '@services/user.ts';
import { mapGetters } from '@lib/map-state.ts';
import { useStore } from '@/store';
import { MutationEnums } from '@/types/store/root.ts';
import { IUser } from '@/types/user.ts';
import HeaderMainContent from '@components/layout/HeaderMainContent.vue';
import User from '@components/User.vue';
import Loading from '@core/components/Loading.vue';
import TabsMainContent from '@components/layout/TabsMainContent.vue';

const store = useStore();
const router = useRouter();
const route = useRoute();
const { getStateRouter } = mapGetters();

onMounted(async () => {
  await router.isReady();
});

const user = ref<IUser>(null);
const isLoading = ref(false);
const users = ref<IUser[] | []>([]);
const currentRouteUsername = route.params.username as string;
const currentRouteName = route.name as string;

const tabs = [
  { name: 'Followers', id: 'followers' },
  { name: 'Following', id: 'following' },
];

onMounted(() => {
  getUsers();
});

onBeforeMount(() => {
  if (getStateRouter.value && getStateRouter.value.username === currentRouteUsername) {
    user.value = getStateRouter.value;
  }
});

const getUsers = async () => {
  isLoading.value = true;
  const { data } =
      currentRouteName === 'following' ?
        await userService.followingByUser(currentRouteUsername) :
        await userService.followersByUser(currentRouteUsername);
  isLoading.value = false;
  users.value = data.users;
  user.value = data.by_user;
  store.commit(MutationEnums.SET_STATE_ROUTER, data.by_user);
};

const onChangeTab = (value: string) => {
  router.push({
    name: value,
    params: { username: currentRouteUsername },
  });
};

</script>

<template>
  <!--  Header with tabs-->
  <HeaderMainContent
    :title="user?.name"
    :sub-title="user?.username"
    :back-to="`/user/${currentRouteUsername}`"
  >
    <template #tabs>
      <TabsMainContent
        :tabs="tabs"
        :default-tab="currentRouteName"
        @on-change-tab="onChangeTab"
      />
    </template>
  </HeaderMainContent>

  <div class="h-[60px]" />

  <!--  Users-->
  <div>
    <div
      v-if="isLoading"
      class="flex-center min-h-[40vh]"
    >
      <Loading
        variant="secondary"
        classes="h-7 w-7"
      />
    </div>
    <div
      v-for="(userEle, idx) of users"
      :key="idx"
    >
      <User :user="userEle" />
    </div>
  </div>
</template>

<style scoped>

</style>
