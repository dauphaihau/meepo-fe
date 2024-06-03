<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { StarIcon } from '@heroicons/vue/24/solid';
import { POST_FILTER_BY } from '@/config/const';
import OptionsPost from '@components/common/post/PostOptions.vue';
import { mapGetters } from '@/lib/map-state';
import { IPostTemp } from '@/types/post';
import InfoAuthorPost from '@components/common/post/InfoAuthorPost.vue';
import ContentPost from '@components/common/post/ContentPost.vue';
import PostActions from '@components/common/post/PostActions.vue';
import AvatarAuthorPost from '@components/common/post/AvatarAuthorPost.vue';
import { POST_PIN_STATUS } from '@config/post.ts';

interface Props {
  dataPost: IPostTemp & { time?: string, sub_post?: IPostTemp },
  isSubPost?: boolean
  by?: POST_FILTER_BY
}

let {
  dataPost, by,
} = defineProps<Props>();

const router = useRouter();

const { getUser } = mapGetters();

const isHover = ref(false);
const isHoverAction = ref(false);
const isOpenPopover = ref(false);

const onOpenPopover = (val: boolean) => {
  isOpenPopover.value = val;
};

const onHoverAction = (val: boolean) => {
  isHoverAction.value = val;
};

const redirectDetailPost = () => {
  router.push('/posts/' + dataPost.id);
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
        :class="{'cursor-pointer': !isOpenPopover, }"
        @click="!isOpenPopover && !isHoverAction && redirectDetailPost()"
      >
        <!--         Pin Post-->
        <div
          v-if="dataPost.pin_status_int === POST_PIN_STATUS.PIN"
          class="flex gap-3 items-center text-zinc-500 ml-[30px] mb-[-10px] mt-2"
        >
          <StarIcon class="h-4 w-4" />
          <p class="font-semibold text-[13px]">
            Pinned Post
          </p>
        </div>

        <div class="flex flex-row">
          <AvatarAuthorPost
            :show-line-connect-sub-post="by === POST_FILTER_BY.COMMENTS && !isSubPost"
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
              :data-post="dataPost"
              @on-hover-action="onHoverAction"
            />
          </div>
        </div>
      </div>

      <div
        v-if="getUser.id === dataPost.user_id"
        class="absolute right-5 h-5"
        :class="dataPost.pin_status_int === POST_PIN_STATUS.PIN ? 'top-8' : 'top-3.5'"
      >
        <OptionsPost
          :data-post="dataPost"
        />
      </div>
    </div>

    <div
      v-if="by === POST_FILTER_BY.COMMENTS &&
        dataPost.sub_post &&
        getUser.username === dataPost?.sub_post?.author_username"
    >
      <ProfilePost
        is-sub-post
        :by="by"
        :data-post="dataPost.sub_post"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
