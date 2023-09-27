<template>

  <!--  Header-->
  <HeaderMainContent title="Post"/>
  <div class="h-4"></div>

  <div v-if="isLoading" class="flex-center min-h-[35vh]">
    <Loading variant="secondary" classes="h-7 w-7"/>
  </div>

  <div v-else>

    <!--    Response error 404 -->
    <div v-if="isPostNotExist" class="max-w-[20rem] mx-auto mt-20">
      <div class="space-y-2">
        <div class="text-3xl font-bold">This post doesn’t exist</div>
        <div class="text-zinc-500 font-semibold">Try searching for another.</div>
        <Button @click="router.push({name: 'explore'})">Search</Button>
      </div>
    </div>

    <!--    Parent post-->
    <Post v-if="parentPost" :dataPost="parentPost" class="mb-2"/>

    <!-- Detail Post-->
    <div class="px-4" v-if="!isPostNotExist">
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
                class="whitespace-pre-line break-words"
                v-html="formatTextWithHashTags(post.content)"
            ></p>
            <img
                v-if="post.image_url"
                v-bind:src="post.image_url"
                alt=""
                class="rounded-xl mt-4 w-full h-auto"
            >

            <div
                v-if="post.edited_posts_count > 0"
                class="text-zinc-500 font-normal text-sm mt-4 flex items-center"
                :class="{'hover:underline hover:underline-offset-2 cursor-pointer': post.edited_posts_count > 0}"
                @click="redirectHistory"
            >
              <PencilIcon v-if="post.edited_posts_count > 0" class="h-4 w-4 inline mr-1.5"/>
              Last edited {{ post.time }} · {{ post.date }}
            </div>

            <div
                v-else
                class="text-zinc-500 font-normal text-sm mt-4 flex items-center"
            >{{ post.time }} · {{ post.date }}
            </div>

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

              <div class='icon-btn' @click="toggleLikePost" v-tooltip="'Like'">
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
        v-if="!isPostNotExist"
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

import { HeartIcon, PencilIcon } from "@heroicons/vue/24/outline"
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
import HeaderMainContent from "@components/layout/HeaderMainContent.vue";
import { formatTextWithHashTags, logger, parseJSON } from "@/core/helper";
import { parseCreatedAt } from "@/lib/dayjs-parse";
import UserPopper from "@components/UserPopper.vue";
import Button from "@/core/components/Button.vue";
import { useWebSocket } from "@vueuse/core";
import { IMessage } from "@/types/message";

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
const isPostNotExist = ref(false)
const guid = ref('')

const postId = route.params.id
const paramsPostId = route.params.id

const { isLoggedIn, getUser, getKeyMutatePosts } = mapGetters()

const { data, send } = useWebSocket(process.env.BASE_URL_WEBSOCKET, {
  autoReconnect: true,
  onConnected: () => {
    logger.info('Connected to websocket server - PostsChannel', 'src/components/pages/post.vue')
    guid.value = Math.random().toString(36).substring(2, 15)

    send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: guid,
            channel: "PostsChannel",
          }),
        })
    );
  },
  onError: (e) => {
    logger.error('Something error with websocket server - PostsChannel', 'src/components/pages/post.vue')
  },
  onMessage: () => {
    const parsed = parseJSON<{type: string, message: any}>(data.value)
    if (!parsed) {
      logger.error('parse data is null', 'src/components/pages/post.vue')
      return
    }
    if (parsed.type === "ping") return;
    if (parsed.type === "welcome") return;
    if (parsed.type === "confirm_subscription") return;
    const message = parsed.message
    logger.debug('Websocket server response message - PostsChannel', message, 'src/components/pages/post.vue')

    if (!message) {
      return;
    }

    if (post.value.id === message.post.id) {

      if (message?.post.likes_count !== post.value.likes_count) {
        handleAnimationCount('likes_count')
      }

      if (message.post.sub_posts_count !== post.value.sub_posts_count) {
        handleAnimationCount('sub_posts_count')
      }

    }

    function handleAnimationCount(key) {
      const isUp = message.post[key] > post.value[key]
      // if (key === 'likes_count') {
      //   isLike.value = isUp
      // }
      let animation = key === 'likes_count' ? animationLikes : animationComments
      // 1. Old number goes up
      setTimeout(() => animation.value = isUp ? 'goUp' : 'goDown', 0);

      // 2. Incrementing the counter
      setTimeout(() => post.value[key] = message.post[key], 100);

      // 3. New number waits down
      setTimeout(() => animation.value = isUp ? 'waitUp' : 'waitDown', 0);

      // 4. New number stays in the middle
      setTimeout(() => animation.value = 'initial', 200);
    }
  }
})

onBeforeMount(() => {
  getDetailPost()
})

async function getDetailPost(post_id = null) {
  isLoading.value = true
  const { data, status } = await postAPI.detail(post_id ?? postId)
  isLoading.value = false

  if (status === 404) {
    isPostNotExist.value = true
    return
  }

  if (data) {
    post.value = data.post
    isLike.value = data.post.is_current_user_like
    post.value.isExpiresEdit = dayjs().isBefore(dayjs(post.value.created_at).add(1, 'h'))
    post.value.time = dayjs(post.value.created_at).format('h:mm A  ')
    post.value.date = dayjs(post.value.created_at).format('MMM D, YYYY')
    author.value = data.post.author

    if (data.post?.parent_post) {
      parentPost.value = parseCreatedAt<IPost>(data.post.parent_post)
    }
  }
}

async function toggleLikePost() {

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  const { status } = await postAPI.like(postId)
  isLike.value = !isLike.value
  if (status !== 200) {
    isLike.value = !isLike.value
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

const redirectHistory = () => {
  if (post.value.edited_posts_count > 0) {
    router.push({ name: 'history' })
  }
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
