<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import HeaderMainContent from '@components/layout/HeaderMainContent.vue';
import { FILTER_SEARCH_ALL } from '@config/const.ts';
import { toUpperCaseFirstL } from '@core/helpers/common.ts';
import TabsMainContent from '@components/layout/TabsMainContent.vue';
import UserPostList from '@components/pages/search/UserPostList.vue';

const route = useRoute();
const router = useRouter();

const keyPostUserComp = ref(0);

const tabs = Object.values(FILTER_SEARCH_ALL).map((name) => ({
  id: name,
  name: toUpperCaseFirstL(name),
}));

const currentFilter = ref(computed(() => route.query.f || FILTER_SEARCH_ALL.TOP));

const onChangeTab = async (value: FILTER_SEARCH_ALL) => {
  await router.push({
    name: 'search',
    query: {
      q: route.query.q,
      f: value,
    },
  });
  keyPostUserComp.value++;
};

</script>

<template>
  <div>
    <HeaderMainContent title="Search">
      <template #tabs>
        <TabsMainContent
          :tabs="tabs"
          class="grid-cols-4"
          :default-tab="currentFilter.toString()"
          @on-change-tab="onChangeTab"
        />
      </template>
    </HeaderMainContent>
    <div class="h-[56px]" />

    <UserPostList
      :key="keyPostUserComp"
    />
  </div>
</template>

<style scoped>
</style>
