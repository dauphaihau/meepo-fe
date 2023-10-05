<template>
  <div>
    <!--    Header-->
    <HeaderMainContent title="Search">
      <template v-slot:tabs>
        <div class="grid grid-cols-4 relative z-[-1]">
          <div v-for="(tab, index) of tabs">
            <div @click="changeTab(tab, index)" class="flex-center py-3.5 hover:bg-[#e7e7e8] relative cursor-pointer">
              <div
                  class="font-semibold text-[15px]"
                  :class="index === currentTab ? 'text-black' : 'text-zinc-500' "
              >{{ tab.name }}
              </div>
              <div v-if="index === currentTab" class="bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full"/>
            </div>
          </div>
        </div>
      </template>
    </HeaderMainContent>
    <div class="h-[56px]"></div>

    <!--    Response error 404 -->
    <div v-if="!isLoading && isNotFound" class="max-w-[20rem] mx-auto mt-20">
      <div class="space-y-2">
        <p class="text-3xl font-bold break-words">No results for "{{ route.query.q }}"</p>
        <div class="text-zinc-500 font-normal">Try searching for something else</div>
      </div>
    </div>

    <!--    Loading-->
    <div v-if="isLoading && page_count === 1" class="flex-center min-h-[35vh]">
      <Loading variant="secondary" classes="h-7 w-7"/>
    </div>

    <!--  Users-->
    <div
        class="bg-white"
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
    <div v-if="currentTab !== 2 && posts.length > 0">
      <!--      <h3 class="text-[20px] font-bold leading-6 px-4 pt-6 pb-3">Posts</h3>-->
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

    <div v-if="isLoading && page_count > 1 && !reachEndPage" class="flex-center min-h-[35vh]">
      <Loading variant="secondary" classes="h-7 w-7"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import Post from "@/components/Post.vue";
import { useRoute, useRouter } from "vue-router";
import { mapGetters } from "@/lib/map-state";
import { IUser } from "@/types/user";
import { useStore } from "@/store";
import HeaderMainContent from "@components/layout/HeaderMainContent.vue";
import Loading from "@/core/components/Loading.vue";
import { commonAPI } from "@/apis/common";
import { FILTER_SEARCH } from "@/config/const";
import { mapKeyEnum, toUpperCaseFirstL } from "@/core/helper";
import User from "@components/User.vue";

import { parseCreatedAts } from "@/lib/dayjs-parse";

const route = useRoute()
const router = useRouter()
const store = useStore()

const { getUser, isLoggedIn } = mapGetters()

const isLoading = ref(false)
const isNotFound = ref(false)
const users = ref<IUser[] | []>([])
const posts = ref([])
let perPage = 10
const reachEndPage = ref(false)
const page_count = ref(1)

const tabs = mapKeyEnum(FILTER_SEARCH).map((name) => ({ name: toUpperCaseFirstL(name) }))
const currentTab = ref(0)

onMounted(async () => {
  window.addEventListener("scroll", onScroll)

  await router.isReady()
  if (!route.query?.f) {
    route.query.f = 'top'
    await router.push({
      name: 'search',
      query: {
        q: route.query.q,
        f: 'top'
      }
    }).catch(failure => false)
  }
  currentTab.value = tabs.findIndex((tab) => tab.name.toLowerCase() === route.query.f)

  await getSearch()
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
    getSearch()
  }
}

watch(router.currentRoute, (value, oldValue) => {
  if (route.query?.f) {
    currentTab.value = tabs.findIndex((tab) => tab.name.toLowerCase() === route.query.f)
  }

  if (value && oldValue.query.q !== value.query.q) {
    resetState()
    getSearch()
  }
})

async function getSearch() {
  if (!route.query?.f) {
    route.query.f = 'top'
  }
  if (route.query?.f && route.query.f !== 'top') {
    route.query.page = page_count.value.toString()
    if (route.query.f === 'people') {
      perPage = 15
    }
    route.query.limit = perPage.toString()
  }

  isLoading.value = true
  const { data } = await commonAPI.searchAll(route.query)
  isLoading.value = false
  isNotFound.value = Object.values(data).every(d => d.length === 0)

  if (data.posts && route.query.f !== 'people') {
    if (data.posts.length < perPage || route.query.f === 'top') {
      reachEndPage.value = true
    }
    posts.value = [...posts.value, ...parseCreatedAts(data.posts)]
  }

  if (data.users) {
    if (route.query.f === 'people' && data.users.length < perPage) {
      reachEndPage.value = true
    }
    users.value = [...users.value, ...data.users]
  }
}

async function changeTab(tab, index) {
  if (index === currentTab.value) return
  resetState()
  currentTab.value = index
  await router.push({ name: 'search', query: { q: route.query.q, f: tab.name.toLowerCase() } })
  await getSearch()
}

const resetState = () => {
  users.value = []
  posts.value = []
  page_count.value = 1
  reachEndPage.value = false
  isLoading.value = false
}

</script>

<style scoped>
</style>
