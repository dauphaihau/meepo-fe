<script setup lang="ts">
import { ref } from 'vue';

import { IResponseGetPost } from '@/types/post';
import AvatarAuthorPost from '@components/common/post/AvatarAuthorPost.vue';
import InfoAuthorPost from '@components/common/post/InfoAuthorPost.vue';
import ContentPost from '@components/common/post/ContentPost.vue';
import PostActions from '@components/common/post/PostActions.vue';

interface IProps {
  dataPost: IResponseGetPost
}

const {
  dataPost,
} = defineProps<IProps>();

const isHover = ref(false);
const isOpenPopover = ref(false);

const onOpenPopover = (val: boolean) => {
  isOpenPopover.value = val;
};

</script>

<template>
  <div>
    <div
      class="flex flex-col relative mx-[0.3px]"
      :class="{'z-[1]': isHover}"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <div
        class="px-4 bg-white flex flex-col animate hover:bg-zinc-100"
        :class="{'cursor-pointer': !isOpenPopover }"
      >
        <div class="flex flex-row">
          <AvatarAuthorPost
            :data-post="dataPost"
            @on-open-popover="onOpenPopover"
          />

          <div class="w-full max-w-[83%] md:max-w-[90%] py-3">
            <InfoAuthorPost
              :data-post="dataPost"
              @on-open-popover="onOpenPopover"
            />
            <ContentPost :data-post="dataPost" />

            <PostActions
              :disabled-actions="['repost', 'like', 'reply']"
              :data-post="dataPost"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
