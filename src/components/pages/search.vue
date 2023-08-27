<template>
  <div>

    <!--    Header-->
    <HeaderMini title="Search">
      <template v-slot:tabs>
        <div class="grid grid-cols-4 bg-white z-10">
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
    <div class="h-[121px] "></div>

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
    <div v-if="users.length > 0 && (currentTab === 2 || currentTab === 0)" :class="currentTab !== 2 && 'border-b'">
      <h3 class="text-[20px] font-bold leading-6 px-6 pt-6 pb-3">People</h3>
      <div v-for="(user ) of users">
        <div class="relative">
          <router-link
              class="block px-6 py-3 bg-white flex flex-col cursor-pointer hover:bg-zinc-100 animate "
              :to="'/user/' + user.username"
          >
            <div class="grid grid-cols-11">
              <img
                  alt="avatar"
                  v-if="user.avatar_url"
                  v-bind:src="user.avatar_url"
                  class="rounded-full h-10 w-10 bg-black col-span-1"
              />

              <div v-else class="rounded-full h-10 w-10 bg-black col-span-1"/>

              <div class="col-span-10">
                <div class=" text-[15px]">

                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-bold text-black hover:underline hover:underline-offset-2 animate">{{ user.name }}
                      </div>
                      <div class="text-zinc-500">@{{ user.username }}</div>
                    </div>
                  </div>

                  <p v-if="user.bio" class="font-normal text-gray-700 dark:text-gray-400 text-[15px]">{{ user.bio }}</p>
                </div>
              </div>
            </div>
          </router-link>

          <div class="absolute top-4 right-5" v-if="getUser.id !== user.id">
            <ToggleFollowBtn
                :show="isLoggedIn"
                :isFollowing="user.is_current_user_following"
                @click="unOrFollow(user)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Posts -->
    <div v-if="currentTab !== 2 && !isLoading && posts.length > 0">
      <!--      <h3 class="text-[20px] font-bold leading-6 px-6 pt-6 pb-3">Posts</h3>-->
      <!--        :key="keyPosts"-->
      <div class="flex flex-col relative z-10">
        <!--        :class="{-->
        <!--          'border-t' : !isFocus && currentRouteName === 'post',-->
        <!--        }"-->

        <div v-for="post in posts" :key="post.id">
          <Post
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
import { onBeforeMount, onMounted, ref, watch } from "vue";

import Post from "@/components/Post.vue";
import { userAPI } from "@/apis/user";
import { useRoute, useRouter } from "vue-router";
import { mapGetters } from "@/lib/map-state";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import { useStore } from "@/store";
import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";
import HeaderMini from "@components/HeaderMini.vue";
import Loading from "@/core/components/Loading.vue";
import { commonAPI } from "@/apis/common";
import { FILTER_SEARCH } from "@/config/const";
import { mapKeyEnum, toUpperCaseFirstL } from "@/core/helper";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

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
    h: "1h",
    hh: "%dh",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})

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
  getSearch()
})

const getUsers = async () => {
  const { data } =
      currentRouteName === 'following' ?
          await userAPI.followingByUser('dauphaihan')
          : await userAPI.followersByUser('dauphaihan');

  users.value = data.users
  // user.value = data.by_user
  // store.commit(MutationEnums.SET_STATE_ROUTER, data.by_user)

  isLoading.value = false
}

async function getSearch() {
  if (!route.query?.f) {
    route.query.f = 'top'
  }
  const { data } = await commonAPI.searchAll(route.query)

  isNotFound.value = Object.values(data).every(d => d.length === 0)

  if (data.posts && data.posts.length > 0) {
    posts.value = data.posts.map((p) => {
      if (dayjs(p.created_at).isToday()) {
        return { ...p, time: dayjs(p.created_at).fromNow() }
      } else {
        return { ...p, time: dayjs(p.created_at).format('MMM D') }
      }
    })

  }
  users.value = data.users
  isLoading.value = false
}

function validateLogin() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
}

const onUpdateProfile = (values) => {
  values.created_at = dayjs(values.created_at).format('MMMM YYYY')
  values.dob = dayjs(values.dob).format('DD MMMM YYYY')
  values.hostWebsite = values.website && values.website.includes('http') ? new URL(values.website).host : values.website
  user.value = { ...user.value, ...values }
  keyPostsComp.value++
}

async function changeTab(tab, index) {
  if (index === currentTab.value) return
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
