<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, watch
} from 'vue';

import Loading from '@/core/components/Loading.vue';
import { useGetPosts } from '@/services/post';
import { POST_FILTER_BY } from '@/config/const';
import { IParamsGetPosts } from '@/types/post';
import { IUser } from '@/types/user';
import { parseCreatedAts } from '@/lib/dayjs-parse';
import ProfilePost from '@components/pages/profile/ProfilePost.vue';
import { POST_PIN_STATUS } from '@config/post.ts';

interface IProps {
  by: POST_FILTER_BY
  author: Pick<IUser, 'username' | 'id'>
}

const {
  by, author,
} = withDefaults(defineProps<IProps>(), {
  by: POST_FILTER_BY.DEFAULT,
});

const posts = ref([]);
const isLoading = ref(false);
const reachEndPage = ref(false);
const keyPosts = ref(0);

const limit = 10;

const params = computed(() => {
  const base: IParamsGetPosts = {
    page: 1,
    by,
    limit,
    user_id: author.id,
    pin_status: POST_PIN_STATUS.PIN,
  };

  if (POST_FILTER_BY[by]) {
    base.by = by;
  }

  return base;
});

const {
  data,
  isFetching,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGetPosts(params.value);

watch([data, isFetchingNextPage], () => {
  if (data.value?.pages) {
    let mergerPosts = [];
    data.value.pages.forEach((page) => {
      mergerPosts = [...mergerPosts, ...page.posts];
    });
    posts.value = parseCreatedAts(mergerPosts);
    keyPosts.value++;
  }
}, { immediate: true });

onMounted(() => {
  window.scrollTo(0, 0);
  window.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

function onScroll() {
  if (
    window.scrollY + window.innerHeight >= (document.body.scrollHeight * 85 / 100) &&
      !isLoading.value &&
      !reachEndPage.value &&
      !isFetchingNextPage.value &&
      hasNextPage.value
  ) {
    fetchNextPage();
  }
}

</script>

<template>
  <div class="flex flex-col">

    <!-- Posts -->
    <div
      v-if="posts && posts.length > 0"
      :key="keyPosts"
      class="flex flex-col relative z-[1]"
    >
      <div
        v-for="post in posts"
        :key="post.id"
      >
        <ProfilePost
          class="border-b"
          :data-post="post"
          :by="by"
        />
      </div>
    </div>

    <div
      v-if="isFetching || isFetchingNextPage"
      class="flex-center min-h-[35vh]"
    >
      <Loading
        variant="secondary"
        classes="h-7 w-7"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
