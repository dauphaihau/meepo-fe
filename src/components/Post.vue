<template>
  <div>
    <div class="flex flex-col gap-4 relative">
      <!--      <div class="relative block p-6 bg-white border border-gray-200 rounded-lg shadow flex flex-col gap-4">-->

      <div
          @click="handleClickDetailPost('post')"
          class="block px-4 py-3 bg-white border-b flex flex-col cursor-pointer hover:bg-zinc-100"
      >

        <!--         Pin Post-->
        <div
            v-if="currentRouteName === 'profile' && dataPost.pin_status === PIN_STATUS.PIN"
            class="flex gap-3 items-center  text-gray-500 mb-1 ml-[30px]"
        >
          <StarIcon class="h-4 w-4"/>
          <p class="font-semibold text-[13px]">Pinned Post</p>
        </div>

        <div class="flex flex-row">
          <!--          Avatar-->
          <div class="mr-4 basis-11">
            <img
                alt="avatar"
                v-if="dataPost.author_avatar"
                v-bind:src="dataPost.author_avatar"
                @click="handleClickDetailPost('user')"
                class="rounded-full h-10 w-10 bg-black"
            />
            <!--          <div v-else @click="handleClickDetailPost('user')" class="rounded-full h-10 w-10 bg-black col-span-1"/>-->
            <div v-else @click="handleClickDetailPost('user')" class="rounded-full h-10 w-10 bg-black"/>
          </div>

          <div class="w-full">
            <div class="flex justify-between">
              <!--              info author-->
              <div @click="handleClickDetailPost('user')" class="flex gap-2 text-[15px]">
                <div class="font-bold text-black hover:underline hover:underline-offset-2">{{
                    dataPost.author_name
                  }}
                </div>
                <div class="text-zinc-500">@{{ dataPost.author_username }} · {{ dataPost.time }}</div>
              </div>

            </div>


            <!--         Content post   -->
            <p class="font-normal text-gray-700 dark:text-gray-400 text-[15px] whitespace-pre-line mt-1.5">
              {{ dataPost.content }}
            </p>

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
                <div class='cursor-pointer flex items-center gap-1' @click="handleClickDetailPost('likePost')">

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
          class="absolute top-3.5 right-5 h-5"
          :class="openMenu ? 'z-20' : 'z-10' "
          @click="openMenu = true"
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
  </div>

</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import { ChatBubbleOvalLeftEllipsisIcon, ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/vue/24/outline"
import { HeartIcon as HeartIconSolid, StarIcon } from "@heroicons/vue/24/solid"
import { apiHelper } from "@/lib/axios";
import OptionsPost from "@/components/OptionsPost.vue";
import { mapGetters } from '@/lib/map-state';
import { IPost, PIN_STATUS } from "@/types/post";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { logger } from "@/core/helper";

// Unresolved function or method updateLocale()
// @ts-ignore
dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: '1s',
    m: "1m",
    mm: "%dm",
    h: "h",
    hh: "%dh",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})

interface Props {
  dataPost: IPost & {time: string},
}

let { dataPost } = defineProps<Props>()

const route = useRoute()
const router = useRouter()
const store = useStore()

const guid = ref('')
const isLike = ref(false)
const animationLikes = ref('initial')
const animationComments = ref('initial')
const keyOptionsPost = ref(0)
const currentRouteName = route.params.name
const redirecting = ref('')
const openMenu = ref(false)

const { isLoggedIn, getUser } = mapGetters()
const emit = defineEmits(['onDeletePost', 'onPinPost'])

onBeforeMount(() => {
  if (isLoggedIn.value) {
    isLike.value = dataPost.likes_count && dataPost.is_current_user_like
  } else {
    isLike.value = !!dataPost.likes_count
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

const onDeletePostChildComp = (value) => {
  emit('onDeletePost', value)
}

const onPinPost = (value) => {
  emit('onPinPost', value)
}

const likePost = async () => {

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  const { data } = await apiHelper.post('/posts/likes', {
    user_id: getUser.value.id,
    post_id: dataPost.id,
  })

  console.log('dauphaihau debug: res-data', data)
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

const handleClickDetailPost = (type = '') => {

  switch (type) {
    case 'options':
      redirecting.value = type
      break
    case 'user':
      redirecting.value = type
      router.push('/user/' + dataPost.author_username)
      break
    case 'likePost':
      redirecting.value = type
      likePost()
      break
  }

  // console.log('dauphaihau debug: redirecting-value', redirecting.value)
  if (!redirecting.value && type === 'post') {
    router.push('/posts/' + dataPost.id)
  }
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
