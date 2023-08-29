<template>
  <div>
    <!--    Header-->
    <HeaderMini title="Search">
      <template v-slot:tabs>
        <div class="grid grid-cols-4">
          <div v-for="(tab, index) of tabs">
            <div @click="changeTab(tab, index)" class="flex-center py-4 hover:bg-[#e7e7e8] relative cursor-pointer">
              <div
                  class="font-semibold"
                  :class="index === currentTab ? 'text-black' : 'text-gray-500' "
              >{{ tab.name }}
              </div>
              <div v-if="index === currentTab" class="bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full"/>
            </div>
          </div>
        </div>
      </template>
    </HeaderMini>
    <div class="h-[126px] "></div>

    <!--    Response error 404 -->
    <div v-if="!isLoading && isNotFound" class="max-w-[20rem] mx-auto mt-20">
      <div class="space-y-2">
        <p class="text-3xl font-bold break-words">No results for "{{ route.query.q }}"</p>
        <!--        <div class="text-3xl font-bold flex">No results for "{{ route.query.q }}"</div>-->
        <div class="text-gray-500 font-normal">Try searching for something else</div>
      </div>
    </div>

    <!--    Loading-->
    <div v-if="isLoading" class="flex-center min-h-[35vh]">
      <Loading/>
    </div>

    <!--  Users-->
    <div
        v-if="users.length > 0 && (currentTab === 2 || currentTab === 0)"
        :class="currentTab !== 2 && 'border-b'"
    >
      <h3 class="text-[20px] font-bold leading-6 px-4 pt-6 pb-3">People</h3>
      <div v-for="(user) of users">
        <User
            :user="user"
            :class="currentTab === 2 && 'border-b'"
        />
      </div>
    </div>

    <!-- Posts -->
    <div v-if="currentTab !== 2 && !isLoading && posts.length > 0">
      <!--      <h3 class="text-[20px] font-bold leading-6 px-4 pt-6 pb-3">Posts</h3>-->
      <!--      <div class="flex flex-col relative z-10">-->
      <div class="flex flex-col">
        <div v-for="post in posts" :key="post.id">
          <Post
              class="border-b"
              :dataPost="post"
              :pinStatus="post.pin_status"
          />
          <!--            @onPinPost="onGetPosts('pin')"-->
          <!--            @onDeletePost="onGetPosts"-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import Post from "@/components/Post.vue";
import { userAPI } from "@/apis/user";
import { useRoute, useRouter } from "vue-router";
import { mapGetters } from "@/lib/map-state";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import { useStore } from "@/store";
import HeaderMini from "@components/HeaderMini.vue";
import Loading from "@/core/components/Loading.vue";
import { commonAPI } from "@/apis/common";
import { FILTER_SEARCH } from "@/config/const";
import { mapKeyEnum, toUpperCaseFirstL } from "@/core/helper";
import User from "@components/User.vue";

import { parseTimePosts } from "@/lib/dayjs-parse";

const route = useRoute()
const router = useRouter()
const store = useStore()

const users = ref<IUser[] | []>([])

const { getUser, isLoggedIn } = mapGetters()

const currentRouteName = route.name
const isLoading = ref(true)
const isUserNotExist = ref(false)
const isFollowing = ref(false)
const isNotFound = ref(false)
const keyPostsComp = ref(0)

const tabs = mapKeyEnum(FILTER_SEARCH).map((name) => ({ name: toUpperCaseFirstL(name) }))

const currentTab = ref(0)

const user = ref<IUser & {hostWebsite?: string}>()
const host = ref('')
const posts = ref([])

const currentRouteUsername = route.params.username

onMounted(async () => {
  await router.isReady()
  if (!route.query?.f) {
    route.query.f = 'top'
    await router.push({
      path: 'search',
      query: {
        q: route.query.q,
        f: 'top'
      }
    }).catch(failure => false)
  }
  currentTab.value = tabs.findIndex((tab) => tab.name.toLowerCase() === route.query.f)
  await getSearch()
})

watch(router.currentRoute, () => {
  if (route.query?.f) {
    currentTab.value = tabs.findIndex((tab) => tab.name.toLowerCase() === route.query.f)
  }
  getSearch()
})

async function getSearch() {
  if (!route.query?.f) {
    route.query.f = 'top'
  }

  users.value = []
  posts.value = []
  const { data } = await commonAPI.searchAll(route.query)

  isNotFound.value = Object.values(data).every(d => d.length === 0)

  if (data.posts && data.posts.length > 0) {
    posts.value = parseTimePosts(data.posts)

  }
  users.value = data.users
  isLoading.value = false
}

async function changeTab(tab, index) {
  if (index === currentTab.value) return
  users.value = []
  posts.value = []
  keyPostsComp.value += 1
  currentTab.value = index
  await router.push({ path: 'search', query: { q: route.query.q, f: tab.name.toLowerCase() } })
  await getSearch()
}

function redirect(name) {
  localStorage.setItem('state', JSON.stringify(this.user))
  router.push({
    name,
    params: { username: currentRouteUsername, },
  });
}

const unOrFollow = async (user: IUser) => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  const { status } = user.is_current_user_following ? await userAPI.unfollow(user.id) : await userAPI.follow(user.id)

  if (status === 200) {
    user.is_current_user_following = !user.is_current_user_following
  }
}

</script>


<style scoped>

.tabs {
  @apply grid grid-cols-2 w-[599px] z-10;
}

.tab {
  @apply flex-center py-4 hover:bg-[#e7e7e8] animate relative cursor-pointer;
}

.tab .active-underline {
  @apply bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full;
}

</style>
