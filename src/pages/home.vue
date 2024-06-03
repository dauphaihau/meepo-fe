<script setup lang="ts">
import { ref } from 'vue';

import { POST_FILTER_BY } from '@config/const.ts';
import { mapGetters } from '@lib/map-state.ts';
import HeaderMainContent from '@components/layout/HeaderMainContent.vue';
import TabsMainContent from '@components/layout/TabsMainContent.vue';
import HomePostList from '@components/pages/home/HomePostList.vue';
import HomeCreatePostForm from '@components/pages/home/HomeCreatePostForm.vue';

const { isLoggedIn } = mapGetters();

const tabs = [
  { id: POST_FILTER_BY.DEFAULT, name: 'For you' },
  { id: POST_FILTER_BY.FOLLOWING, name: 'Following' },
];

const currentTab = ref(0);
const keyPostsComp = ref(0);

const onChangeTab = (value: number) => {
  keyPostsComp.value++;
  currentTab.value = value;
};

</script>

<template>
  <div>
    <HeaderMainContent v-if="isLoggedIn">
      <template #tabs>
        <TabsMainContent
          :tabs="tabs"
          @on-change-tab="onChangeTab"
        />
      </template>
    </HeaderMainContent>

    <div :class="isLoggedIn ? 'pt-16 md:pt-1 lg:pt-2': 'pt-[15px]'">
      <HomeCreatePostForm />
      <HomePostList
        :key="keyPostsComp"
        :by="currentTab"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
