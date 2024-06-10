<script setup lang="ts">
import { useRouter } from 'vue-router';

import UserPopper from '@components/UserPopper.vue';
import { IResponseGetPost } from '@/types/post.ts';
import { PAGE_PATHS } from '@config/const.ts';

interface IProps {
  dataPost: IResponseGetPost
  showLineConnectSubPost?: boolean
}

const { dataPost, showLineConnectSubPost } = defineProps<IProps>();

const emit = defineEmits<{ (e: 'onOpenPopover', value: boolean): void }>();

const router = useRouter();

const onOpenPopover = (val: boolean) => {
  emit('onOpenPopover', val);
};

const redirectProfile = () => {
  if (dataPost?.author?.username) {
    router.push(`${PAGE_PATHS.USER}/${dataPost.author.username}`);
  }
};

</script>

<template>
  <!--          Avatar-->
  <div class="mr-3 basis-11 relative flex flex-col min-w-[40px] max-w-[40px] pt-3">
    <UserPopper
      :username="dataPost?.author_username"
      class="w-fit"
      @on-open-popover="onOpenPopover"
    >
      <div class="before:absolute">
        <img
          v-if="dataPost.author_avatar_url"
          :src="dataPost.author_avatar_url"
          alt="avatar"
          class="rounded-full h-10 w-10 bg-black "
          @click="redirectProfile"
        >
        <img
          v-else
          src="@assets/default-avatar.png"
          alt="avatar"
          class="rounded-full h-10 w-10 bg-black "
          @click="redirectProfile"
        >
      </div>
    </UserPopper>

    <!-- line connect avatar parent and child post &&-->
    <div
      v-if="dataPost.sub_posts_count > 0 && showLineConnectSubPost"
      class="items-stretch flex-shrink-0 border basis-auto min-h-0 min-w-0 flex-grow mx-auto mt-1 md:mt-0"
    />
  </div>
</template>

<style scoped>

</style>
