<template>
  <div class="flex flex-col">

    <CreatePostForm
        v-if="isLoggedIn && !hideInput && !disabledComment"
        @onCreatePost="onGetPosts"
    />

    <div v-if="disabledComment" class="flex gap-4 m-5 px-3 py-3 bg-zinc-100 rounded-lg">
      <UserGroupIcon class="h-9 w-9 rounded-full bg-zinc-200 p-2 text-black"/>
      <div>
        <div class="font-bold">
          Who can comment?
        </div>
        <div class="text-sm font-normal">
          People @{{ author?.username }} follows can comments
        </div>
      </div>

    </div>

    <!-- Posts -->
    <div
        :key="keyPosts"
        class="flex flex-col relative z-10"
        :class="{
          'border-t' : !isFocus && currentRouteName === 'post',
        }"
    >
      <!--          'mt-[52px]' : isFocus-->

      <div v-for="post in posts" :key="post.id">
        <Post
            @onPinPost="onGetPosts('pin')"
            @onDeletePost="onGetPosts"
            :dataPost="post"
            :pinStatus="post.pin_status"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router";
import { UserGroupIcon } from "@heroicons/vue/20/solid"
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { postAPI } from '@/apis/post'
import Post from "@/components/Post.vue";
import { mapGetters } from "@/lib/map-state";
import { FILTER_POST_BY } from "@/config/const";
import { IPost, PIN_STATUS } from "@/types/post";
import CreatePostForm from "@/components/CreatePostForm.vue";
import { useStore } from "@/store";
import { IUser } from "@/types/user";

dayjs.extend(utc)
dayjs.extend(isToday)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

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

const store = useStore()

interface IProps {
  hideInput?: boolean,
  disabledComment?: boolean,
  by?: number
  author?: Pick<IUser, 'username' | 'id'>
}

const { hideInput, disabledComment, by, author } = defineProps<IProps>()

const posts = ref([])
const content = ref('')
const isFocus = ref(false)
const loading = ref(false)
const reachEndPage = ref(false)
const page_count = ref(1)
const disableInfinityScroll = ref(false)
const keyPosts = ref(0)
const perPage = 10

const route = useRoute()
const currentRouteName = route.name
const username = route.params.username

const { isLoggedIn, getUser, getKeyMutatePosts } = mapGetters()

onMounted(() => {
  getPosts()
  getNextPosts()
})

function getNextPosts() {
  window.onscroll = () => {
    const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (bottomOfWindow && !reachEndPage.value) {
      page_count.value++
      getPosts()
    }
  }
}

type Params = {
  by?: number
  page: number
} & Partial<Pick<IPost, 'parent_id' | 'pin_status' | 'user_id'>>

const getPosts = async () => {
  loading.value = true

  const payload: Params = {
    page: page_count.value,
  }

  if (FILTER_POST_BY[by]) {
    payload.by = by
  }

  if ([FILTER_POST_BY.LIKES, FILTER_POST_BY.REPLIES, FILTER_POST_BY.MEDIA].includes(by)) {
    payload.user_id = author?.id
  }

  if (currentRouteName !== 'home' && by === FILTER_POST_BY.DEFAULT) {
    payload.user_id = author?.id
  }

  if (currentRouteName === 'post') {
    if (!route.params.id) {
      return
    }
    payload.parent_id = Number(route.params.id)
  }

  if (currentRouteName === 'profile') {
    payload.pin_status = PIN_STATUS.PIN
  }

  let { data } = await postAPI.list(payload, 'src/components/Posts.vue')

  if (data.posts) {

    if (data.posts.length < perPage) {
      reachEndPage.value = true
    }

    data.posts = data.posts.map((p) => {
      if (dayjs(p.created_at).isToday()) {
        return { ...p, time: dayjs(p.created_at).fromNow() }
      } else {
        return { ...p, time: dayjs(p.created_at).format('MMM D') }
      }
    })

    if (disableInfinityScroll.value) {
      posts.value = data.posts
      return
    }

    posts.value = [...posts.value, ...data.posts]
  }
  loading.value = false
  disableInfinityScroll.value = false
}

const onGetPosts = (type?: string) => {
  disableInfinityScroll.value = true
  page_count.value = 1
  if (!type) {
    window.scrollTo(0, 0);
  }
  getPosts()
}

watch(getKeyMutatePosts, () => {
  onGetPosts()
})

</script>

<style scoped>
.textarea-input {
  @apply resize-none block flex-1  bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-500
  focus:ring-0 focus:outline-none sm:text-sm lg:text-xl sm:leading-6;
  max-height: 100%;
  /*height: 52px;*/
}


.icon-btn {
  @apply flex items-center justify-center hover:bg-zinc-100 p-2 rounded-full mx-auto h-9 w-9 text-gray-500 cursor-pointer
}

/*text-gray-500 h-5 w-5 cursor-pointer*/
</style>
