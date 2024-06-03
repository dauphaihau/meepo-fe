<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref
} from 'vue';

import Post from '@components/common/post/Post.vue';
import { useRoute, useRouter } from 'vue-router';
import Loading from '@core/components/Loading.vue';
import { useGetSearchAllTest } from '@services/common.ts';
import { FILTER_SEARCH_ALL } from '@config/const.ts';
import User from '@components/User.vue';

const route = useRoute();
const router = useRouter();

let limit = 20;

const currentFilter = route.query.f;

onMounted(async () => {
  window.addEventListener('scroll', onScroll);

  await router.isReady();

  // if (!route.query?.f) {
  //   route.query.f = FILTER_SEARCH_ALL.TOP;
  //
  //   await router.push({
  //     name: 'search',
  //     query: {
  //       q: route.query.q,
  //       f: FILTER_SEARCH_ALL.TOP,
  //     },
  //   });
  //   // }).catch(() => false);
  // }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

// watch(router.currentRoute, (value, oldValue) => {
//   if (value && oldValue.query.q !== value.query.q) {
//     resetState();
//     getSearch();
//   }
// });

const params = computed(() => {

  // console.log('route-query', route.query);
  // const queries: IParamsSearchAll = { ...route.query };
  // const queries: IParamsSearchAll = { ...queriesTemp.value, f: filter };
  // if (!queries?.f) {
  //   queries.f = FILTER_SEARCH_ALL.TOP;
  // }
  // if (queries?.f && queries.f !== FILTER_SEARCH_ALL.TOP) {
  //   queries.page = page_count.value.toString();
  //   if (queries.f === FILTER_SEARCH_ALL.PEOPLE) {
  //     perPage = 15;
  //   }
  //   queries.limit = perPage.toString();
  // }
  // return queries;
  return {
    ...route.query,
    limit,
  };
});

const {
  data,
  isPending: isPendingGetSearchAll,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGetSearchAllTest(params.value);

const maxPostsPage = ref(0);
const maxUsersPage = ref(0);

const users = computed(() => {
  if (data.value?.pages && data.value.pages.length > 0) {
    return data.value.pages.reduce((acc, next) => {
      maxUsersPage.value = Math.floor(next.total_users / limit);
      return [...acc, ...next.users];
    }, []);
  }
  return [];
});

const posts = computed(() => {
  if (data.value?.pages && data.value.pages.length > 0) {
    return data.value.pages.reduce((acc, next) => {
      maxPostsPage.value = Math.floor(next.total_posts / limit);
      return [...acc, ...next.posts];
    }, []);
  }
  return [];
});

function onScroll() {
  console.log('has-next-page-value', hasNextPage.value);
  if (
    window.scrollY + window.innerHeight >= (document.body.scrollHeight * 90 / 100) &&
    !isFetchingNextPage.value &&
      (
        (currentFilter === FILTER_SEARCH_ALL.PEOPLE && data.value.pageParams.length <= maxUsersPage.value) ||
          (currentFilter !== FILTER_SEARCH_ALL.PEOPLE && data.value.pageParams.length <= maxPostsPage.value)
      )
  ) {
    console.log('data-value-page-params', data.value.pageParams.length);
    console.log('max-users-page', maxUsersPage.value);
    fetchNextPage();
  }
}

</script>

<template>
  <div class="mt-1">
    <!--  Users-->
    <div
      v-if="users && users.length > 0
        && (currentFilter === FILTER_SEARCH_ALL.PEOPLE || currentFilter === FILTER_SEARCH_ALL.TOP)"
      class="bg-white"
      :class="currentFilter === FILTER_SEARCH_ALL.TOP && 'border-b'"
    >
      <h3 class="text-[20px] font-bold leading-6 px-4 pt-6 pb-3">
        People
      </h3>
      <div
        v-for="(user, idx) of users"
        :key="idx"
      >
        <User
          :user="user"
          :class="currentFilter === FILTER_SEARCH_ALL.PEOPLE && 'border-b'"
        />
      </div>
    </div>

    <!-- Posts -->
    <div v-if="currentFilter !== FILTER_SEARCH_ALL.PEOPLE && posts && posts.length > 0">
      <div class="flex flex-col">
        <div
          v-for="post in posts"
          :key="post.id"
        >
          <Post
            class="border-b"
            :data-post="post"
          />
        </div>
      </div>
    </div>
  </div>

  <!--    Response error 404 -->
  <div
    v-if="!isPendingGetSearchAll && users.length === 0 && posts.length === 0"
    class="max-w-[20rem] mx-auto mt-20"
  >
    <div class="space-y-2">
      <p class="text-3xl font-bold break-words">
        No results for "{{ route.query.q }}"
      </p>
      <div class="text-zinc-500 font-normal">
        Try searching for something else
      </div>
    </div>
  </div>

  <!--    Loading-->
  <div
    v-if="isPendingGetSearchAll"
    class="flex-center min-h-[35vh]"
  >
    <Loading
      variant="secondary"
      classes="h-7 w-7"
    />
  </div>
</template>

<style scoped>

</style>
