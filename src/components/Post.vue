<template>
  <div>

    <ReplyPostDialog
        :key="keyReplyPostDialog"
        :showDialogFromProps="showReplyPostDialog"
        :hideTrigger="true"
        :postComment="dataPost"
        @onClose="() => action = ''"
    />

    <div
        class="flex flex-col relative"
        @mouseover="isHover = true"
        @mouseleave="isHover = false"
        :class="{'z-[1]': isHover}"
    >
      <div
          class="px-4 bg-white flex flex-col animate hover:bg-zinc-100"
          :class="{'cursor-pointer': !isOpenPopover, }"
          @click="!isOpenPopover && clickPost('post')"
      >
        <!--         Pin Post-->
        <div
            v-if="currentRouteName === 'profile' && dataPost.pin_status_int === PIN_STATUS.PIN"
            class="flex gap-3 items-center text-zinc-500 ml-[30px] mb-[-10px] mt-2"
        >
          <StarIcon class="h-4 w-4"/>
          <p class="font-semibold text-[13px]">Pinned Post</p>
        </div>

        <div class="flex flex-row">

          <!--          Avatar-->
          <div
              class="mr-3 basis-11 relative flex flex-col min-w-[40px]"
              :class="!isSubPost && 'pt-3'"
          >
            <div
                v-if="isSubPost && currentRouteName !== 'search'"
                class="items-stretch flex-shrink-0 border basis-auto min-h-0 min-w-0 h-2 mx-auto w-[2px] mb-0.5"
            />
            <UserPopper :username="dataPost.author_username" @onOpenPopover="onOpenPopover">
              <div class="before:absolute">
                <img
                    v-if="dataPost.author_avatar_url"
                    v-bind:src="dataPost.author_avatar_url"
                    alt="avatar"
                    @click="redirectProfile"
                    class="rounded-full h-10 w-10 bg-black "
                />
                <img
                    v-else
                    src="@/assets/default-avatar.png"
                    alt="avatar"
                    @click="redirectProfile"
                    class="rounded-full h-10 w-10 bg-black "
                />
              </div>
            </UserPopper>
            <div
                v-if="(dataPost.sub_posts_count > 0 && !isSubPost && currentRouteName === 'post') || by === FILTER_POST_BY.COMMENTS"
                class="items-stretch flex-shrink-0 border basis-auto min-h-0 min-w-0 flex-grow mx-auto w-[2px]"
            />
          </div>

          <!--          <div class="w-full md:max-w-[80%] py-3">-->
          <div class="w-full max-w-[83%] md:max-w-[90%] py-3">

            <div class="flex justify-between">
              <!--              info author-->
              <div class="flex gap-2 text-[15px]">
                <UserPopper :username="dataPost.author_username" @onOpenPopover="onOpenPopover">
                  <div
                      @click="redirectProfile"
                      class="font-bold text-black hover:underline hover:underline-offset-2 before:absolute max-w-[11rem] truncate"
                  >
                    {{ dataPost.author_name ?? dataPost.author.name }}
                  </div>
                </UserPopper>
                <div class="text-zinc-500 inline-flex gap-1">
                  <UserPopper :username="dataPost.author_username" @onOpenPopover="onOpenPopover">
                    <!--                    <div @click="redirectProfile" class="before:absolute">@{{ dataPost.author_username }}</div>-->
                    <div @click="redirectProfile" class="before:absolute max-w-[11rem] truncate">
                      @{{ dataPost.author_username ?? dataPost.author.username }}
                    </div>

                  </UserPopper>
                  · {{ dataPost.time }}
                  <div
                      v-if="dataPost.edited_posts_count > 0 && currentRouteName !== 'history'"
                      class="inline flex gap-1"
                  >
                    ·
                    <PencilIcon class="h-auto w-4"/>
                  </div>
                </div>
              </div>
            </div>

            <!--         Content post   -->
            <!--            <p class="font-normal text-zinc-700 dark:text-zinc-400 text-[15px] whitespace-pre-line mt-1.5 mb-12">-->
            <!--              {{ dataPost.content }}-->
            <!--            </p>-->

            <p
                class="font-normal text-zinc-700 dark:text-zinc-400 text-[15px] whitespace-pre-line  mt-1.5 break-words"
                v-html="formatTextWithHashTags(dataPost.content)"
            />

            <img
                v-if="dataPost.image_url"
                v-bind:src="dataPost.image_url"
                alt=""
                class="rounded-xl my-4 w-full h-auto"
            >

            <!--              Statistic post ( comment, likes, .. ) -->
            <div class="flex gap-8 -ml-[9px]">

              <!-- Reply -->
              <div class="flex items-center gap-1 group">
                <div
                    class="p-2 group-hover:bg-zinc-200 animate rounded-full"
                    @click="clickPost('commentPost')"
                >
                  <ChatBubbleOvalLeftEllipsisIcon
                      v-tooltip="'Reply'"
                      v-if="dataPost.sub_posts_count > 0"
                      class="icon-action"
                      :class="{'opacity-50': !dataPost.is_current_user_can_comment}"
                  />
                  <ChatBubbleOvalLeftIcon
                      v-tooltip="'Reply'"
                      v-else
                      :class="{'opacity-50': readonly || !dataPost.is_current_user_can_comment}"
                      class="icon-action"
                  />

                </div>
                <span v-if="!readonly" :class="animationComments">{{ dataPost.sub_posts_count ?? 0 }}</span>
              </div>

              <!-- Like -->
              <div class="flex items-center gap-2 group">
                <div class='cursor-pointer flex items-center gap-1' @click="clickPost('toggleLikePost')">

                  <div v-if="isLike" class="p-2 group-hover:bg-zinc-200 animate rounded-full">
                    <HeartIconSolid v-tooltip="'Like'" class="icon-action"/>
                  </div>
                  <div v-else class="p-2 group-hover:bg-zinc-200 animate rounded-full">
                    <HeartIcon
                        v-tooltip="'Like'"
                        class="icon-action"
                        :class="{'opacity-50': readonly}"
                    />
                  </div>
                  <span v-if="!readonly" :class="animationLikes">{{ dataPost.likes_count ?? 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
          class="absolute right-5 h-5"
          :class="currentRouteName === 'profile' && dataPost.pin_status_int === PIN_STATUS.PIN ? 'top-8' : 'top-3.5'"
      >
        <OptionsPost
            v-if="getUser.id === dataPost.user_id && !readonly"
            @onDeletePostChildComp="onDeletePostChildComp"
            @onPinPost="onPinPost"
            :key="keyOptionsPost"
            :dataPost="dataPost"
        />
      </div>
    </div>

    <div v-if="(currentRouteName === 'post' && dataPost.sub_post ) || by === FILTER_POST_BY.COMMENTS">
      <Post isSubPost :dataPost="dataPost.sub_post"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useWebSocket } from "@vueuse/core";
import ReplyPostDialog from "@/components/dialog/AddOrUpdatePost.vue";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  PencilIcon
} from "@heroicons/vue/24/outline"
import { HeartIcon as HeartIconSolid, StarIcon } from "@heroicons/vue/24/solid"

import { logger, parseJSON } from '@/core/helper.js'
import { FILTER_POST_BY } from "@/config/const";
import OptionsPost from "@/components/OptionsPost.vue";
import { mapGetters } from '@/lib/map-state';
import { IPost, PIN_STATUS } from "@/types/post";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { postAPI } from "@/apis/post";
import UserPopper from "@components/UserPopper.vue";
import { formatTextWithHashTags } from "@/core/helper";

interface Props {
  dataPost: IPost & {time?: string, sub_post?: IPost},
  isSubPost?: boolean
  readonly?: boolean
  by?: number
}

let { dataPost, isSubPost, by, readonly } = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const store = useStore()

const { isLoggedIn, getUser } = mapGetters()

const emit = defineEmits<{
  (e: 'onDeletePost'): void,
  (e: 'onPinPost'): void
}>()

const showReplyPostDialog = ref(false);
const keyReplyPostDialog = ref(0);
const guid = ref('')
const isLike = ref(false)
const isHover = ref(false)
const isLoading = ref(false)
const isOpenPopover = ref(false)
const animationLikes = ref('initial')
const animationComments = ref('initial')
const keyOptionsPost = ref(0)
const action = ref('')
const openMenu = ref(false)

const currentRouteName = route.name

const onOpenPopover = (val) => {
  isOpenPopover.value = val
}

onBeforeMount(() => {
  if (isLoggedIn.value) {
    isLike.value = dataPost.likes_count && dataPost.is_current_user_like
  } else {
    isLike.value = false
  }
})

const { data, send } = useWebSocket(process.env.BASE_URL_WEBSOCKET, {
  autoReconnect: true,
  onConnected: () => {
    logger.info('Connected to websocket server - PostsChannel', 'src/components/Post.vue')
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
  onMessage: () => {
    const parsed = parseJSON<{type: string, message: any}>(data.value)
    if (!parsed) {
      logger.error('parse data is null', 'src/components/Post.vue')
      return
    }
    if (parsed.type === "ping") return;
    if (parsed.type === "welcome") return;
    if (parsed.type === "confirm_subscription") return;
    const message = parsed.message

    logger.debug('Websocket server response message - PostsChannel', message, 'src/components/Post.vue')

    if (!message) {
      logger.error('message is null', 'src/components/Post.vue')
      return;
    }

    if (dataPost.id === message.post.id) {

      if (message?.post.likes_count !== dataPost.likes_count) {
        handleAnimationCount('likes_count')
      }

      if (message.post.sub_posts_count !== dataPost.sub_posts_count) {
        handleAnimationCount('sub_posts_count')
      }
    }

    function handleAnimationCount(key) {
      const isUp = message.post[key] > dataPost[key]
      // if (key === 'likes_count') {
      //   isLike.value = isUp
      // }
      let animation = key === 'likes_count' ? animationLikes : animationComments
      // 1. Old number goes up
      setTimeout(() => animation.value = isUp ? 'goUp' : 'goDown', 0);

      // 2. Incrementing the counter
      setTimeout(() => dataPost[key] = message.post[key], 100);

      // 3. New number waits down
      setTimeout(() => animation.value = isUp ? 'waitUp' : 'waitDown', 0);

      // 4. New number stays in the middle
      setTimeout(() => animation.value = 'initial', 200);
    }

  },
  onError: (e) => {
    logger.error('Something error with websocket server - PostsChannel', 'src/components/Post.vue')
  },
})

const onDeletePostChildComp = () => {
  emit('onDeletePost')
}

const onPinPost = () => {
  emit('onPinPost')
}

const toggleLikePost = async () => {

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  isLike.value = !isLike.value
  const { status } = await postAPI.like(dataPost.id)

  if (status === 200) {
    action.value = ''
  } else {
    isLike.value = !isLike.value
  }
}

const clickPost = (type = '') => {
  if (readonly) return

  switch (type) {
    case 'options':
      action.value = type
      break
    case 'commentPost':
      if (!dataPost.is_current_user_can_comment) {
        return;
      }
      action.value = type
      showReplyPostDialog.value = true;
      keyReplyPostDialog.value++
      break
    case 'toggleLikePost':
      action.value = type
      toggleLikePost()
      break
  }

  if (!action.value && type === 'post') {
    router.push('/posts/' + dataPost.id)
  }
}

const redirectProfile = () => {
  router.push('/user/' + dataPost.author_username)
}

</script>


<style scoped>

.goUp {
  display: inline-flex;
  opacity: 0;
  transform: translate3d(0, -20px, 0);
  transition: 0.1s ease-in-out;
}

.waitUp {
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


.goDown {
  display: inline-flex;
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition: 0.1s ease-in-out;
}

.waitDown {
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

.heart {
  cursor: pointer;
  height: 50px;
  width: 50px;
  background-image: url('https://abs.twimg.com/a/1446542199/img/t1/web_heart_animation.png');
  background-position: left;
  background-repeat: no-repeat;
  background-size: 2900%;
}

.heart:hover {
  background-position: right;
}

.is_animating {
  animation: heart-burst .8s steps(28) 1;
}

@keyframes heart-burst {
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
}

.icon-action {
  @apply text-zinc-500 h-5 w-5 cursor-pointer;
}


</style>
