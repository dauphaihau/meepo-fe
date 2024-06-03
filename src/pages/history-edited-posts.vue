<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useGetDetailPost } from '@services/post.ts';
import Post from '@components/common/post/Post.vue';
import Loading from '@core/components/Loading.vue';
import HeaderContentMenu from '@components/layout/HeaderMainContent.vue';
import HistoryPostList from '@components/pages/history-edited-posts/HistoryPostList.vue';

const route = useRoute();

const postId = route.params.id;

const {
  data: dataPost,
  isPending: isPendingGetDetailPost,
} = useGetDetailPost(Number(postId));

const post = computed(() => {
  return {
    ...dataPost.value.post,
    author_username: dataPost.value.post.author.username,
    author_avatar_url: dataPost.value.post.author.avatar_url,
  };
});

</script>

<template>
  <HeaderContentMenu title="Edit History" />
  <div class="h-10" />

  <div
    v-if="isPendingGetDetailPost"
    class="flex-center min-h-[35vh]"
  >
    <Loading
      variant="secondary"
      classes="h-7 w-7"
    />
  </div>

  <div v-else-if="post">
    <div class="mb-4 relative z-[2]">
      <h1 class="text-xl font-bold ml-3 mb-2">
        Latest post
      </h1>
      <Post
        class="border-b"
        :data-post="post"
      />
    </div>
    <div>
      <h1 class="text-xl font-bold ml-3 mb-2">
        Version history
      </h1>
      <HistoryPostList />
    </div>
  </div>
</template>

<style scoped>

</style>
