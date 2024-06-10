<script setup lang="ts">
import { IResponseGetPost } from '@/types/post.ts';
import { formatTextWithHashTags } from '@core/helpers/common.ts';

interface IProps {
  dataPost: IResponseGetPost
}

const { dataPost } = defineProps<IProps>();

</script>

<template>
  <p
    class="content-post"
    v-html="formatTextWithHashTags(dataPost.content)"
  />
  <img
    v-if="dataPost.image_url"
    :src="dataPost.image_url"
    alt=""
    class="rounded-xl my-4 w-full h-auto"
  >
</template>

<style scoped>

.content-post {
  @apply font-normal text-zinc-700 dark:text-zinc-400 text-[15px]
  whitespace-pre-line mt-1.5 break-words;
}

</style>
