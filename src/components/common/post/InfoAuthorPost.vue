<script setup lang="ts">

import { truncateText } from '@core/helper.ts';
import { PencilIcon } from '@heroicons/vue/24/outline';
import UserPopper from '@components/UserPopper.vue';
import { IPostTemp } from '@/types/post.ts';
import { computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

interface IProps {
  dataPost: IPostTemp
}

const { dataPost } = defineProps<IProps>();

const emit = defineEmits<{ (e: 'onOpenPopover', value: boolean): void }>();

const router = useRouter();
const isTabletScreen = useMediaQuery('(min-width: 768px)');

const parseCreatedAt = computed(() => {
  if (dayjs(dataPost?.created_at).isValid()) {
    return dayjs(dataPost.created_at).fromNow();
  }
  return '';
});

const onOpenPopover = (val: boolean) => {
  emit('onOpenPopover', val);
};

const redirectProfile = () => {
  router.push('/user/' + dataPost.author_username);
};

</script>

<template>
  <div class="flex justify-between">
    <div class="flex gap-2 text-[15px] w-full max-w-[100vw]">
      <!--  Name -->
      <UserPopper
        :username="dataPost.author_username"
        @on-open-popover="onOpenPopover"
      >
        <div
          class="font-bold text-black hover:underline hover:underline-offset-2 before:absolute"
          @click="redirectProfile"
        >
          {{ truncateText(dataPost.author_name ?? dataPost.author.name, isTabletScreen ? 20 : 7, '...') }}
        </div>
      </UserPopper>

      <!--  username & createdAt post -->
      <div class="text-zinc-500 inline-flex gap-1">
        <UserPopper
          :username="dataPost.author_username"
          @on-open-popover="onOpenPopover"
        >
          <div
            class="before:absolute max-w-[7rem] md:max-w-[11rem] truncate"
            @click="redirectProfile"
          >
            @{{ truncateText(
              dataPost.author_username ?? dataPost.author.username,
              isTabletScreen ? 20 : (dataPost.edited_posts_count > 0 ? 4 : 8),
              '...')
            }}
          </div>
        </UserPopper>

        · {{ truncateText(parseCreatedAt, 8) }}
        <div
          v-if="dataPost.edited_posts_count > 0"
          class="flex gap-1"
        >
          ·
          <PencilIcon class="h-auto w-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
