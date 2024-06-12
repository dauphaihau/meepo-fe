<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { StatusCodes } from 'http-status-codes';
import { useMutationState, useQueryClient } from '@tanstack/vue-query';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import {
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  PencilIcon,
  ArrowPathRoundedSquareIcon,
  ShareIcon
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';

import OptionsPost from '@components/common/post/PostOptions.vue';

import { IPost, IResponseGetDetailPost } from '@/types/post.ts';
import {
  formatTextWithHashTags, truncateText
} from '@core/helpers/common.ts';
import UserPopper from '@components/UserPopper.vue';
import { useGetDetailPost, useLikePost } from '@services/post.ts';
import useRealtimePost from '@composables/useRealtimePost.ts';
import { PAGE_PATHS } from '@config/const.ts';
import { useDialogStore } from '@stores/dialog.ts';
import { useAuthStore } from '@stores/auth.ts';

const router = useRouter();
const route = useRoute();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const isTabletScreen = useMediaQuery('(min-width: 768px)');
const queryClient = useQueryClient();

const postId = route.params.id;

onMounted(async () => {
  await router.isReady();
});

const {
  data: dataPost,
} = useGetDetailPost(Number(postId));

const {
  mutateAsync: likePost,
} = useLikePost(Number(postId));

const post = ref<IResponseGetDetailPost['post']>({ ...dataPost.value?.post });

const postLastEdited = computed(() => {
  return {
    time: dayjs(post.value.updated_at).format('h:mm A  '),
    date: dayjs(post.value.updated_at).format('MMM D, YYYY'),
  };
});

const { animationLikes, animationComments } = useRealtimePost(post);

const dataUpdatedPost = useMutationState({
  filters: {
    mutationKey: ['update-post'],
  },
  select: (mutation) => {
    return (mutation.state.data as AxiosResponse<{ post: IPost }>)?.data?.post;
  },
});

watch(dataUpdatedPost, () => {
  const lastPostUpdate = dataUpdatedPost.value[dataUpdatedPost.value.length - 1];
  if (lastPostUpdate) {
    post.value = { ...post.value, ...lastPostUpdate };
  }
});

async function toggleLikePost() {
  if (!authStore.isLoggedIn) {
    dialogStore.showDialog = 'login';
    return;
  }
  const { status } = await likePost();
  post.value.is_current_user_like = !post.value.is_current_user_like;
  if (status !== StatusCodes.OK) {
    post.value.is_current_user_like = !post.value.is_current_user_like;
    return;
  }
  queryClient.removeQueries({
    queryKey: ['get-posts'],
  });
  queryClient.removeQueries({
    queryKey: ['detail-post'],
  });
}

const redirectProfile = () => {
  router.push(`${PAGE_PATHS.USER}/${post.value.author.username}`);
};

const redirectHistory = () => {
  if (post.value.edited_posts_count > 0) {
    router.push({ name: 'history' });
  }
};

const replyPost = () => {
  if (!post.value.is_current_user_can_comment) {
    return;
  }
  dialogStore.showDialog = 'reply-post';
  dialogStore.data = post.value;
};

</script>

<template>
  <div
    v-if="post"
    class="px-4"
  >
    <div class=" flex justify-between items-center">
      <div class="w-full">
        <!--       Post's Author   -->
        <div class="flex justify-between">
          <div
            class="flex gap-2.5 mb-4"
          >
            <UserPopper :username="post.author?.username">
              <img
                v-if="post.author?.avatar_url"
                alt="avatar"
                :src="post.author?.avatar_url"
                class="rounded-full h-10 w-10 bg-black cursor-pointer"
                @click="redirectProfile"
              >
              <img
                v-else
                alt="avatar"
                src="@assets/default-avatar.png"
                class="rounded-full h-10 w-10 bg-black cursor-pointer"
                @click="redirectProfile"
              >
            </UserPopper>
            <div>
              <UserPopper
                :username="post.author?.username"
                class="max-h-[18px] mb-1.5 md:mb-0 "
              >
                <h3
                  class="text-base font-semibold  text-zinc-900
                       hover:underline hover:underline-offset-2 cursor-pointer"
                  @click="redirectProfile"
                >
                  {{ truncateText(post.author?.name, isTabletScreen ? 20 : 10, '...') }}
                </h3>
              </UserPopper>
              <UserPopper :username="post.author?.username">
                <p
                  class="max-w-2xl text-sm leading-3 text-zinc-500 cursor-pointer"
                  @click="redirectProfile"
                >
                  @{{ truncateText(post.author?.username, isTabletScreen ? 20 : 10, '...') }}
                </p>
              </UserPopper>
            </div>
          </div>

          <OptionsPost
            v-if="authStore.user?.id === post?.user_id"
            class-dot-icon="h-7 w-7"
            :data-post="post"
          />
        </div>

        <!-- Content post-->
        <div class="mb-4">
          <!--            <div class="whitespace-pre-line">{{ post.content }}</div>-->
          <p
            class="whitespace-pre-line break-words"
            v-html="formatTextWithHashTags(post?.content)"
          />
          <img
            v-if="post?.image_url"
            :src="post?.image_url"
            alt=""
            class="rounded-xl mt-4 w-full h-auto"
          >

          <div
            v-if="post?.edited_posts_count > 0"
            class="text-zinc-500 font-normal text-sm mt-4 flex items-center"
            :class="{'hover:underline hover:underline-offset-2 cursor-pointer': post?.edited_posts_count > 0}"
            @click="redirectHistory"
          >
            <PencilIcon
              v-if="post?.edited_posts_count > 0"
              class="h-4 w-4 inline mr-1.5"
            />
            Last edited {{ postLastEdited?.time }} · {{ postLastEdited?.date }}
          </div>

          <div
            v-else
            class="text-zinc-500 font-normal text-sm mt-4 flex items-center"
          >
            {{ postLastEdited?.time }} · {{ postLastEdited?.date }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex py-4 md:py-2 border-t">
          <div class="item-action">
            <div class="flex items-center gap-1 md:gap-0">
              <div
                v-tooltip="'Reply'"
                class="icon-btn relative"
                :class="{'opacity-40': !post.is_current_user_can_comment}"
                @click="replyPost"
              >
                <ChatBubbleOvalLeftEllipsisIcon v-if="post.sub_posts_count > 0" />
                <ChatBubbleOvalLeftIcon v-else />
              </div>
              <div
                v-if="post.sub_posts_count > 0"
                :class="['icon-text', animationComments]"
              >
                {{ post.sub_posts_count }}
              </div>
            </div>
          </div>

          <div class="item-action">
            <ArrowPathRoundedSquareIcon
              v-tooltip="'Not available'"
              class="icon-btn opacity-40"
            />
          </div>

          <div class="item-action">
            <div class="flex items-center gap-1 md:gap-0">
              <div
                class="icon-btn"
                @click="toggleLikePost"
              >
                <!--                  v-if="isLikePost"-->
                <HeartIconSolid
                  v-if="post.is_current_user_like"
                  v-tooltip="'Like'"
                />
                <HeartIcon
                  v-else
                  v-tooltip="'Unlike'"
                />
              </div>

              <div
                v-if="post.likes_count > 0"
                :class="['icon-text', animationLikes]"
              >
                {{ post.likes_count }}
              </div>
            </div>
          </div>

          <div class="item-action">
            <BookmarkIcon
              v-tooltip="'Not available'"
              class="icon-btn opacity-40"
              :class="'text-zinc-500'"
            />
          </div>

          <div>
            <div
              v-tooltip="'Not available'"
              class="icon-btn opacity-40"
            >
              <ShareIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="border-b w-full md:hidden" />
</template>

<style scoped>

.item-action {
  @apply flex flex-1 items-stretch justify-start;
}

.icon-btn {
  @apply text-zinc-500 hover:bg-zinc-100
  h-6 w-6 md:h-10 md:w-10
  md:p-2 rounded-full
  cursor-pointer
  transition transform duration-200 ease-in-out;
}

.icon-text {
  @apply text-zinc-500 text-sm md:text-base
}

</style>
