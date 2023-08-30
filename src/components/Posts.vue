<template>
  <div class="flex flex-col">

    <CreatePostForm
        v-if="isLoggedIn && !hideInput && !disabledComment"
        @onCreatePost="onGetPosts('create')"
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

    <div v-if="isLoading && page_count === 1" class="flex-center min-h-[35vh]">
      <Loading/>
    </div>

    <!-- Posts -->
<!--        class="flex flex-col relative z-10"-->
    <div
        :key="keyPosts"
        class="flex flex-col relative z-[1]"
        :class="{
          'border-t': currentRouteName === 'post',
        }"
    >

      <div v-for="post in posts" :key="post.id">
        <Post
            class="border-b"
            @onPinPost="onGetPosts('pin')"
            @onDeletePost="onGetPosts"
            :dataPost="post"
            :by="by"
            :pinStatus="post.pin_status"
        />
      </div>
    </div>

    <div v-if="isLoading && page_count > 1 && !reachEndPage" class="flex-center min-h-[35vh]">
      <Loading/>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router";
import { UserGroupIcon } from "@heroicons/vue/20/solid"

import Loading from "@/core/components/Loading.vue";
import { postAPI } from '@/apis/post'
import Post from "@/components/Post.vue";
import { mapGetters } from "@/lib/map-state";
import { FILTER_POST_BY } from "@/config/const";
import { IPost, PIN_STATUS } from "@/types/post";
import CreatePostForm from "@/components/CreatePostForm.vue";
import { useStore } from "@/store";
import { IUser } from "@/types/user";
import { parseTimePosts } from "@/lib/dayjs-parse";

const store = useStore()

interface IProps {
  hideInput?: boolean,
  disabledComment?: boolean,
  by?: number
  author?: Pick<IUser, 'username' | 'id'>
}

const { hideInput, disabledComment, by, author } = defineProps<IProps>()

const route = useRoute()
const { isLoggedIn, getUser, getKeyMutatePosts } = mapGetters()

const posts = ref([])
const content = ref('')
const isFocus = ref(false)
const isLoading = ref(false)
const reachEndPage = ref(false)
const page_count = ref(1)
const disableInfinityScroll = ref(false)
const keyPosts = ref(0)
const perPage = 10

const currentRouteName = route.name
const username = route.params.username

onMounted(() => {
  getPosts()
  window.addEventListener("scroll", onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

function onScroll() {
  if (
      window.scrollY + window.innerHeight >= (document.body.scrollHeight * 90 / 100) &&
      !isLoading.value &&
      !reachEndPage.value
  ) {
    page_count.value++
    getPosts()
  }
}

type Params = {
  by?: number
  page: number
} & Partial<Pick<IPost, 'parent_id' | 'pin_status' | 'user_id'>>

const getPosts = async () => {
  isLoading.value = true

  const payload: Params = {
    page: page_count.value,
  }

  if (FILTER_POST_BY[by]) {
    payload.by = by
  }

  if ([FILTER_POST_BY.LIKES, FILTER_POST_BY.COMMENTS, FILTER_POST_BY.MEDIA].includes(by)) {
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
  isLoading.value = false

  if (data.posts) {
    if (data.posts.length < perPage) {
      reachEndPage.value = true
    }

    data.posts = parseTimePosts(data.posts)

    if (disableInfinityScroll.value) {
      posts.value = data.posts
      return
    }

    posts.value = [...posts.value, ...data.posts]
  }
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
