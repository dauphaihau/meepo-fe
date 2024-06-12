<script setup lang="ts">
import { POST_FILTER_BY } from '@config/const';
import { useGetPosts } from '@services/post';
import { IParamsGetPosts } from '@/types/post.ts';

const router = useRouter();
const route = useRoute();
const username = route.params.username as string;

onMounted(async () => {
  await router.isReady();
});

const params = computed<IParamsGetPosts>(() => {
  return {
    by: POST_FILTER_BY.MEDIA,
    username,
    limit: 6,
    page: 1,
  };
});

const {
  data: dataGetPosts,
} = useGetPosts(params.value);

const posts = computed(() => {
  if (dataGetPosts.value?.pages && dataGetPosts.value.pages.length > 0) {
    return dataGetPosts.value.pages.reduce((acc, next) => {
      return [...acc, ...next.posts];
    }, []);
  }
  return [];
});

</script>

<template>
  <div v-if="posts && posts.length > 0">
    <div
      v-if="posts.length === 2"
      class="grid grid-cols-2 gap-[3px]"
    >
      <div
        v-for="(post, index) of posts"
        :key="index"
      >
        <img
          :src="post.image_url"
          alt="post"
          class="h-[195px] w-[195px] cursor-pointer"
          :class="{
            'rounded-tl-2xl rounded-bl-2xl': index === 0,
            'rounded-tr-2xl rounded-br-2xl': index === 1,
          }"
          @click="router.push('/posts/' + post.id)"
        >
      </div>
    </div>

    <div
      v-else-if="posts.length === 3"
      class="flex gap-[2px]"
    >
      <div class="flex flex-col flex-wrap max-h-[222px] gap-[2px]">
        <div
          v-for="(post, index) of posts"
          :key="index"
        >
          <img
            :src="post.image_url"
            alt="post"
            class=" cursor-pointer w-[170px]"
            :class="{
              'h-[222px]': index === 0,
              'h-[110px]': index >= 1,
              'rounded-tl-2xl rounded-bl-2xl': index === 0,
              'rounded-tr-2xl': index === 1,
              'rounded-br-2xl': index === 2,
            }"
            @click="router.push('/posts/' + post.id)"
          >
        </div>
      </div>
    </div>

    <div
      v-else-if="posts.length === 4"
      class="grid grid-cols-2 gap-[3px]"
    >
      <div
        v-for="(post, index) of posts"
        :key="index"
      >
        <img
          :src="post.image_url"
          alt="post"
          class="h-[110px] w-[173px] cursor-pointer"
          :class="{
            'rounded-tl-2xl': index === 0,
            'rounded-tr-2xl': index === 1,
            'rounded-bl-2xl': index === 2,
            'rounded-br-2xl': index === 3,
          }"
          @click="router.push('/posts/' + post.id)"
        >
      </div>
    </div>

    <div
      v-else-if="posts.length === 5"
      class="w-full"
    >
      <div class="flex flex-wrap gap-[3px]">
        <div
          v-for="(post, index) of posts"
          :key="index"
        >
          <img
            :src="post.image_url"
            alt="post"
            class="h-[110px]  cursor-pointer"
            :class="{
              'w-[113px]': index > 1,
              'w-[172px]': index < 2,
              'rounded-tl-2xl': index === 0,
              'rounded-tr-2xl': index === 1,
              'rounded-bl-2xl': index === 2,
              'rounded-br-2xl': index === 4,
            }"
            @click="router.push('/posts/' + post.id)"
          >
        </div>
      </div>
    </div>

    <div
      v-else-if="posts.length >= 6"
      class="grid grid-cols-3 gap-[3px]"
    >
      <div
        v-for="(post, index) of posts"
        :key="index"
      >
        <img
          :src="post.image_url"
          alt="post"
          class="h-[110px] w-[143px] cursor-pointer"
          :class="{
            'rounded-tl-2xl': index === 0,
            'rounded-tr-2xl': index === 2,
            'rounded-bl-2xl': index === 3,
            'rounded-br-2xl': index === 5,
          }"
          @click="router.push('/posts/' + post.id)"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
