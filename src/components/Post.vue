<template>
  <div>
    <div
        class="flex flex-col relative"
        @mouseover="isHover = true"
        @mouseleave="isHover = false"
        :class="{'z-[3]': isHover}"
    >
      <div
          class="px-4 bg-white flex flex-col animate hover:bg-zinc-100"
          :class="{'cursor-pointer': !isOpenPopover, }"
          @click="!isOpenPopover && clickDetailPost('post')"
      >

        <!--         Pin Post-->
        <div
            v-if="currentRouteName === 'profile' && dataPost.pin_status_int === PIN_STATUS.PIN"
            class="flex gap-3 items-center text-gray-500 ml-[30px] mb-[-10px] mt-2"
        >
          <!--            class="flex gap-3 items-center text-gray-500 ml-[30px] "-->
          <StarIcon class="h-4 w-4"/>
          <p class="font-semibold text-[13px]">Pinned Post</p>
        </div>

        <div class="flex flex-row">

          <!--          Avatar-->
          <div
              class="mr-3 basis-11 relative flex flex-col"
              :class="!isSubPost && 'pt-3'"
          >
            <!--            <div v-if="isSubPost" class="border-r-2 h-2 w-5 absolute top-[-12px] "></div>-->

            <div
                v-if="isSubPost && currentRouteName !== 'search'"
                class="items-stretch flex-shrink-0 border basis-auto min-h-0 min-w-0 h-2 mx-auto w-[2px] mb-0.5"
            />
            <UserPopper :user="dataPost" prefixAuthor @onOpenPopover="onOpenPopover">
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
                v-if="dataPost.sub_posts_count > 0 && !isSubPost && currentRouteName !== 'search'"
                class="items-stretch flex-shrink-0 border basis-auto min-h-0 min-w-0 flex-grow mx-auto w-[2px]"
            />
          </div>

          <div class="w-full py-3">
            <div class="flex justify-between">
              <!--              info author-->
              <div class="flex gap-2 text-[15px]">
                <UserPopper :user="dataPost" prefixAuthor @onOpenPopover="onOpenPopover">
                  <div
                      @click="redirectProfile"
                      class="font-bold text-black hover:underline hover:underline-offset-2 before:absolute"
                  >
                    {{ dataPost.author_name }}
                  </div>
                </UserPopper>
                <div class="text-zinc-500 inline-flex gap-1">
                  <UserPopper :user="dataPost" prefixAuthor @onOpenPopover="onOpenPopover">
                    <div @click="redirectProfile" class="before:absolute">@{{ dataPost.author_username }}</div>
                  </UserPopper>
                  · {{ dataPost.time }}
                </div>
              </div>
            </div>

            <!--         Content post   -->
            <!--            <p class="font-normal text-gray-700 dark:text-gray-400 text-[15px] whitespace-pre-line mt-1.5 mb-12">-->
            <!--              {{ dataPost.content }}-->
            <!--            </p>-->
            <p
                class="font-normal text-gray-700 dark:text-gray-400 text-[15px] whitespace-pre-line mt-1.5"
                v-html="formatTextWithHashTags(dataPost.content)"
            />

            <img
                v-if="dataPost.image_url"
                v-bind:src="dataPost.image_url"
                alt=""
                class="rounded-xl my-4 w-full h-auto"
            >

            <!--              Statistic post ( likes, comment, .. ) -->
            <div class="flex gap-8 -ml-[9px]">

              <!--              Comments-->
              <div class="flex items-center gap-1 group">
                <div class="p-2 group-hover:bg-zinc-200 animate rounded-full">
                  <ChatBubbleOvalLeftEllipsisIcon
                      v-if="dataPost.sub_posts_count > 0"
                      @click="router.push('/posts/' + dataPost.id)"
                      class="text-gray-500 h-5 w-5 cursor-pointer"
                  />
                  <ChatBubbleOvalLeftIcon
                      v-else
                      @click="router.push('/posts/' + dataPost.id)"
                      class="text-gray-500 h-5 w-5 cursor-pointer"
                  />

                </div>
                <span :class="animationComments">{{ dataPost.sub_posts_count ?? 0 }}</span>
              </div>

              <!--              Likes -->
              <div class="flex items-center gap-2 group">
                <div class='cursor-pointer flex items-center gap-1' @click="clickDetailPost('likePost')">

                  <div v-if="isLike" class="p-2 group-hover:bg-zinc-200 animate rounded-full">
                    <HeartIconSolid class="text-gray-500 h-5 w-5 cursor-pointer"/>
                  </div>
                  <div v-else class="p-2 group-hover:bg-zinc-200 animate rounded-full">
                    <HeartIcon class="text-gray-500 h-5 w-5 cursor-pointer"/>
                  </div>

                  <span :class="animationLikes">{{ dataPost.likes_count ?? 0 }}</span>
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
            v-if="getUser.id === dataPost.user_id"
            @onDeletePostChildComp="onDeletePostChildComp"
            @onPinPost="onPinPost"
            @onCloseMenu="onCloseMenu"
            :key="keyOptionsPost"
            :dataPost="dataPost"
        />
      </div>
    </div>

    <!--    <div v-if="dataPost.sub_post" class="relative z-20">-->
    <div v-if="dataPost.sub_post">
      <Post isSubPost :dataPost="dataPost.sub_post"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { cn } from '@/core/helper.js'
import { ChatBubbleOvalLeftEllipsisIcon, ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/vue/24/outline"
import { HeartIcon as HeartIconSolid, StarIcon } from "@heroicons/vue/24/solid"
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
}

let { dataPost, isSubPost } = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const store = useStore()

const { isLoggedIn, getUser } = mapGetters()

const emit = defineEmits<{
  (e: 'onDeletePost'): void,
  (e: 'onPinPost'): void
}>()

const guid = ref('')
const isLike = ref(false)
const isHover = ref(false)
const isLoading = ref(false)
const isOpenPopover = ref(false)
const animationLikes = ref('initial')
const animationComments = ref('initial')
const keyOptionsPost = ref(0)
const redirecting = ref('')
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
    // isLike.value = !!dataPost.likes_count
  }
})

// const ws = new WebSocket(process.env.BASE_URL_WEBSOCKET);
//
// ws.onopen = () => {
//   logger.info('Connected to websocket server', 'src/components/Post.vue')
//   guid.value = Math.random().toString(36).substring(2, 15)
//
//   ws.send(
//       JSON.stringify({
//         command: "subscribe",
//         identifier: JSON.stringify({
//           id: guid,
//           channel: "PostsChannel",
//         }),
//       })
//   );
// };
//
// ws.onmessage = (e) => {
//   const data = JSON.parse(e.data);
//   if (data.type === "ping") return;
//   if (data.type === "welcome") return;
//   if (data.type === "confirm_subscription") return;
//
//   logger.debug('ws.onmessage response data message', data.message, 'src/components/Post.vue')
//
//   if (!data.message) {
//     return;
//   }
//
//   if (dataPost.id === data.message.post.id) {
//
//     if (data.message?.post.likes_count !== dataPost.likes_count) {
//       handleAnimationCount('likes_count')
//     }
//
//     if (data.message.post.sub_posts_count !== dataPost.sub_posts_count) {
//       handleAnimationCount('sub_posts_count')
//     }
//   }
//
//   function handleAnimationCount(key) {
//     const isUp = data.message.post[key] > dataPost[key]
//     let animation = key === 'likes_count' ? animationLikes : animationComments
//     // 1. Old number goes up
//     setTimeout(() => animation.value = isUp ? 'goUp' : 'goDown', 0);
//
//     // 2. Incrementing the counter
//     setTimeout(() => dataPost[key] = data.message.post[key], 100);
//
//     // 3. New number waits down
//     setTimeout(() => animation.value = isUp ? 'waitUp' : 'waitDown', 0);
//
//     // 4. New number stays in the middle
//     setTimeout(() => animation.value = 'initial', 200);
//   }
//
// };

const onDeletePostChildComp = () => {
  emit('onDeletePost')
}

const onPinPost = () => {
  emit('onPinPost')
}

const likePost = async () => {

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  const { data } = await postAPI.like(dataPost.id)

  if (data) {
    const isUp = data.likes_count > dataPost.likes_count
    isLike.value = isUp
    // 1. Old number goes up
    setTimeout(() => animationLikes.value = isUp ? 'goUp' : 'goDown', 0);

    // 2. Incrementing the counter
    setTimeout(() => dataPost.likes_count = data.likes_count, 100);

    // 3. New number waits down
    setTimeout(() => animationLikes.value = isUp ? 'waitUp' : 'waitDown', 0);

    // 4. New number stays in the middle
    setTimeout(() => animationLikes.value = 'initial', 200);

    redirecting.value = ''
  }

}

const clickDetailPost = (type = '') => {

  switch (type) {
    case 'options':
      redirecting.value = type
      break
    case 'likePost':
      redirecting.value = type
      likePost()
      break
  }

  if (!redirecting.value && type === 'post') {
    router.push('/posts/' + dataPost.id)
  }
}

const redirectProfile = () => {
  router.push('/user/' + dataPost.author_username)
}

const onCloseMenu = () => {
  openMenu.value = false
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
</style>
