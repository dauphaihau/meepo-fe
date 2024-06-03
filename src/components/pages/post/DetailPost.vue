<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

import { mapGetters } from '@/lib/map-state.ts';
import { IPostTemp } from '@/types/post.ts';
import { useStore } from '@/store';
import { MutationEnums } from '@/types/store/root.ts';
import { IUser } from '@/types/user.ts';
import {
  formatTextWithHashTags, truncateText
} from '@/core/helper.ts';
import { parseCreatedAt } from '@/lib/dayjs-parse.ts';
import UserPopper from '@components/UserPopper.vue';
import { useMediaQuery } from '@vueuse/core';
import { StatusCodes } from 'http-status-codes';
import ReplyPostDialog from '@components/dialog/AddOrUpdatePost.vue';
import { useGetDetailPost, useLikePost } from '@services/post.ts';
import useRealtimePost from '@/composables/useRealtimePost.ts';

const router = useRouter();
const route = useRoute();
const store = useStore();
const isTabletScreen = useMediaQuery('(min-width: 768px)');

type PostTypes = {time?: string, date?: string} & IPostTemp

const showReplyPostDialog = ref(false);
const keyReplyPostDialog = ref(0);
const post = ref<PostTypes | null>(null);
const parentPost = ref<PostTypes | null>(null);
const author = ref<IUser | null>(null);

const postId = route.params.id;

onMounted(async () => {
  await router.isReady();
});

const { isLoggedIn, getUser } = mapGetters();

const { animationLikes, animationComments } = useRealtimePost(post);

const {
  data: dataPost,
  isRefetching,
} = useGetDetailPost(Number(postId));

const {
  mutateAsync: likePost,
} = useLikePost(Number(postId));

watch([dataPost, isRefetching], () => {
  if (dataPost?.value?.post) {
    post.value = { ...dataPost.value.post };

    post.value.time = dayjs(post.value.created_at).format('h:mm A  ');
    post.value.date = dayjs(post.value.created_at).format('MMM D, YYYY');

    author.value = post.value.author;

    if (dataPost.value.post?.parent_post) {
      parentPost.value = parseCreatedAt<IPostTemp>(dataPost.value.post.parent_post);
    }
  }
}, { immediate: true });

async function toggleLikePost() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
    return;
  }
  const { status } = await likePost();
  post.value.is_current_user_like = !post.value.is_current_user_like;
  if (status !== StatusCodes.OK) {
    post.value.is_current_user_like = !post.value.is_current_user_like;
  }
}

const redirectProfile = () => {
  router.push('/user/' + author.value.username);
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
  showReplyPostDialog.value = true;
  keyReplyPostDialog.value++;
};

</script>

<template>
  <ReplyPostDialog
    :key="keyReplyPostDialog"
    :show-dialog-from-props="showReplyPostDialog"
    :hide-trigger="true"
    :data-post-reply="post"
  />

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
            <UserPopper :username="author?.username">
              <img
                v-if="author?.avatar_url"
                alt="avatar"
                :src="author?.avatar_url"
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
                :username="author?.username"
                class="max-h-[18px] mb-1.5 md:mb-0 "
              >
                <h3
                  class="text-base font-semibold  text-zinc-900
                       hover:underline hover:underline-offset-2 cursor-pointer"
                  @click="redirectProfile"
                >
                  {{ truncateText(author?.name, isTabletScreen ? 20 : 10, '...') }}
                </h3>
              </UserPopper>
              <UserPopper :username="author?.username">
                <p
                  class="max-w-2xl text-sm leading-3 text-zinc-500 cursor-pointer"
                  @click="redirectProfile"
                >
                  @{{ truncateText(author?.username, isTabletScreen ? 20 : 10, '...') }}
                </p>
              </UserPopper>
            </div>
          </div>

          <OptionsPost
            v-if="getUser.id === post?.user_id"
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
            Last edited {{ post?.time }} · {{ post?.date }}
          </div>

          <div
            v-else
            class="text-zinc-500 font-normal text-sm mt-4 flex items-center"
          >
            {{ post?.time }} · {{ post?.date }}
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
