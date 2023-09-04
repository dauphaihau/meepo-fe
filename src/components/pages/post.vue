<template>

  <!--  Header-->
  <HeaderMini title="Post"/>
  <div class="h-20"></div>

  <div v-if="isLoading" class="flex-center min-h-[35vh]">
    <Loading/>
  </div>

  <div v-else>

    <!--    Parent post-->
    <Post v-if="parentPost" :dataPost="parentPost" class="mb-2"/>

    <!-- Detail Post-->
    <div class="px-4">
      <div class="flex justify-between items-center">

        <div class="w-full">

          <!--       Post's Author   -->
          <div class="flex justify-between">

            <div class="flex gap-2.5 mb-4">
              <UserPopper :username="author.username">
                <img
                    alt="avatar"
                    v-if="author.avatar_url"
                    @click="redirectProfile"
                    v-bind:src="author.avatar_url"
                    class="rounded-full h-10 w-10 bg-black cursor-pointer"
                />
                <img
                    v-else
                    alt="avatar"
                    @click="redirectProfile"
                    src="@/assets/default-avatar.png"
                    class="rounded-full h-10 w-10 bg-black cursor-pointer"
                />
              </UserPopper>
              <div>
                <UserPopper :username="author.username" class="max-h-[18px]">
                  <h3
                      @click="redirectProfile"
                      class="text-base font-semibold  text-zinc-900 hover:underline hover:underline-offset-2"
                  >
                    {{ author?.name }}</h3>
                </UserPopper>
                <UserPopper :username="author.username">
                  <p
                      @click="redirectProfile"
                      class="max-w-2xl text-sm leading-3 text-zinc-500"
                  >@{{ author?.username }}</p>
                </UserPopper>
              </div>
            </div>

            <OptionsPost
                classDotIcon="h-7 w-7"
                v-if="getUser.id === post.user_id"
                @onDeletePostChildComp="router.back()"
                :dataPost="post"
            />
          </div>

          <!--         Content post-->
          <div class="pb-4">
            <!--            <div class="whitespace-pre-line">{{ post.content }}</div>-->
            <p
                class="whitespace-pre-line"
                v-html="formatTextWithHashTags(post.content)"
            ></p>
            <img
                v-if="post.image_url"
                v-bind:src="post.image_url"
                alt=""
                class="rounded-xl mt-4 w-full h-auto"
            >

            <div class="text-zinc-500 font-normal text-sm mt-4">{{ post.time }} · {{ post.date }}</div>
          </div>

          <div v-if="post.sub_posts_count > 0 || post.likes_count > 0" class="border-b w-full"></div>

          <div>
            <!--      Statistics ..-->
            <div class="flex gap-8 py-4" v-if="post.sub_posts_count > 0 || post.likes_count > 0">
              <div class="flex items-center gap-1">
                <span :class="animationComments" class="text-[14px] font-bold">{{ post.sub_posts_count ?? 0 }}</span>
                <span class="text-[14px] text-zinc-500">Comments</span>
              </div>

              <div class="flex items-center gap-2">
                <div class='flex items-center gap-1'>
                  <span :class="animationLikes" class="text-[14px] font-bold">{{ post.likes_count ?? 0 }}</span>
                  <span class="text-[14px] text-zinc-500">Likes</span>
                </div>
              </div>
            </div>

            <!--            Icons Action -->
            <div class="grid grid-cols-5 py-1.5 border-t">
              <div
                  class="icon-btn"
                  v-tooltip="'Comment'"
                  :class="!post.is_current_user_can_comment ? 'text-zinc-400': 'text-zinc-500'"
              >
                <ChatBubbleOvalLeftEllipsisIcon
                    v-if="post.sub_posts_count > 0"
                    @click="router.push('/posts/' + post.id)"
                />
                <ChatBubbleOvalLeftIcon v-else @click="router.push('/posts/' + post.id)"/>
              </div>

              <!--              <ReceiptRefundIcon v-tooltip="'Repost'" class="icon-btn"/>-->
              <ReceiptRefundIcon
                  v-tooltip="'Not available'" class="icon-btn"
                  :class="'text-zinc-500'"
              />

              <div class='icon-btn' @click="dislikeOrLikePost" v-tooltip="'Like'">
                <HeartIconSolid v-if="isLike"/>
                <HeartIcon v-else/>
              </div>

              <BookmarkIcon
                  v-tooltip="'Not available'" class="icon-btn"
                  :class="'text-zinc-500'"
              />

              <!--              <div class="icon-btn" v-tooltip="'Share'">-->
              <div
                  class="icon-btn" v-tooltip="'Not available'"
                  :class="'text-zinc-500'"
              >
                <ShareIcon/>
              </div>
            </div>
          </div>

          <!--          <div class="border-b w-full"></div>-->
        </div>

      </div>
    </div>

    <!--  Sub Posts ( Comments )-->
        <Posts
            :key="keyPostsComp"
            :author="author"
            :disabledComment="!post?.is_current_user_can_comment"
        />
  </div>

</template>

<script setup lang="ts">

import { onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from 'dayjs';
import { HeartIcon } from "@heroicons/vue/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/24/solid"
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
  ReceiptRefundIcon,
  BookmarkIcon,
  ShareIcon
} from "@heroicons/vue/24/outline"
import OptionsPost from "@/components/OptionsPost.vue";

import { postAPI } from "@/apis/post";
import Posts from "@/components/Posts.vue";
import Post from "@/components/Post.vue";
import Loading from "@/core/components/Loading.vue";

import { mapGetters } from "@/lib/map-state";
import { IPost } from "@/types/post";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import HeaderMini from "@components/HeaderMini.vue";
import { formatTextWithHashTags, logger } from "@/core/helper";
import { parseCreatedAt } from "@/lib/dayjs-parse";
import UserPopper from "@components/UserPopper.vue";

const router = useRouter()
const route = useRoute()
const store = useStore()

type PostTypes = {time?: string, date?: string} & IPost

const animationLikes = ref('initial')
const animationComments = ref('initial')
const post = ref<PostTypes | null>(null)
const parentPost = ref<PostTypes | null>(null)
const author = ref<IUser | null>(null)
const keyPostsComp = ref(0)
const isLoading = ref(false)
const isLike = ref(false)
const guid = ref('')

const postId = route.params.id
const paramsPostId = route.params.id

const { isLoggedIn, getUser, getKeyMutatePosts } = mapGetters()

const ws = new WebSocket(process.env.BASE_URL_WEBSOCKET);

ws.onopen = () => {
  logger.info('Connected to websocket server', 'src/components/pages/post.vue')
  guid.value = Math.random().toString(36).substring(2, 15)

  ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "PostsChannel",
        }),
      })
  );
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === "ping") return;
  if (data.type === "welcome") return;
  if (data.type === "confirm_subscription") return;


  logger.debug('ws.onmessage response data message', data.message, 'src/components/pages/post.vue')

  if (!data.message) {
    return;
  }

  // const dataPost = post.value
  if (post.value.id === data.message.post.id) {

    if (data.message?.post.likes_count !== post.value.likes_count) {
      handleAnimationCount('likes_count')
    }

    if (data.message.post.sub_posts_count !== post.value.sub_posts_count) {
      handleAnimationCount('sub_posts_count')
    }

  }

  function handleAnimationCount(key) {
    const isUp = data.message.post[key] > post.value[key]
    // if (key === 'likes_count') {
    //   isLike.value = isUp
    // }
    let animation = key === 'likes_count' ? animationLikes : animationComments
    // 1. Old number goes up
    setTimeout(() => animation.value = isUp ? 'goUp' : 'goDown', 0);

    // 2. Incrementing the counter
    setTimeout(() => post.value[key] = data.message.post[key], 100);

    // 3. New number waits down
    setTimeout(() => animation.value = isUp ? 'waitUp' : 'waitDown', 0);

    // 4. New number stays in the middle
    setTimeout(() => animation.value = 'initial', 200);
  }
};

onBeforeMount(() => {
  getDetailPost()
})

async function getDetailPost(post_id = null) {
  isLoading.value = true
  const { data } = await postAPI.detail(post_id ?? postId)
  isLoading.value = false

  if (data) {
    post.value = data.post
    isLike.value = data.post.is_current_user_like
    post.value.time = dayjs(post.value.created_at).format('h:mm A  ')
    post.value.date = dayjs(post.value.created_at).format('MMM D, YYYY')
    author.value = data.post.author

    if (data.post?.parent_post) {
      parentPost.value = parseCreatedAt<IPost>(data.post.parent_post)
    }
  }
}

async function dislikeOrLikePost() {

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
  const { data, status } = await postAPI.like(postId)


  if (data) {
    const isUp = data.likes_count > post.value.likes_count
    isLike.value = isUp
  //   // 1. Old number goes up
  //   setTimeout(() => animationLikes.value = isUp ? 'goUp' : 'goDown', 0);
  //
  //   // 2. Incrementing the counter
  //   setTimeout(() => post.value.likes_count = data.likes_count, 100);
  //
  //   // 3. New number waits down
  //   setTimeout(() => animationLikes.value = isUp ? 'waitUp' : 'waitDown', 0);
  //
  //   // 4. New number stays in the middle
  //   setTimeout(() => animationLikes.value = 'initial', 200);
  }
}

watch(() => paramsPostId, (postId) => {
  getDetailPost(postId)
  keyPostsComp.value++
})

watch(getKeyMutatePosts, () => {
  getDetailPost()
})

const redirectProfile = () => {
  router.push('/user/' + author.value.username)
}

</script>


<style scoped>

.goUp {
  display: inline-flex;
  opacity: 0;
  transform: translate3d(0, -20px, 0);
  transition: 0.1s ease-in-out;
}

.waitup {
  display: inline-flex;
  opacity: 0;
  transform: translate3d(0, 20px, 0);
}

.initial {
  display: inline-flex;
  opacity: 1;
  transform: translate3d(0, 0px, 0);
  transition: 0.1s ease-in-out;
}


.godown {
  display: inline-flex;
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition: 0.1s ease-in-out;
}

.waitdown {
  display: inline-flex;
  opacity: 0;
  transform: translate3d(0, -20px, 0);
}

.initial {
  display: inline-flex;
  opacity: 1;
  transform: translate3d(0, 0px, 0);
  transition: 0.1s ease-in-out;
}

.icon-btn {
  @apply flex items-center justify-center hover:bg-zinc-100 p-2 rounded-full mx-auto h-10 w-10  cursor-pointer transition transform duration-200 ease-in-out;
}
</style>
