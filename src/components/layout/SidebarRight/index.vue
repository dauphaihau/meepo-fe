<template>

  <div
      class="pb-14 z-[4] w-sidebar"
      ref="sidebar"
  >
    <div class="fixed top-0 z-[3] w-sidebar">
      <div class="h-2 bg-white"/>
      <SearchBar
          v-if="showSearchBar"
          class="bg-white"
          :query="query"
          @changeRoute="changeRoute"
          :key="keySearchAllComp"
      />
      <div class="h-5 bg-gradient-to-b from-white"/>
    </div>

    <div :class="!showSearchBar ? 'pb-8' : 'pb-[4.5rem]'"/>

    <div
        class="flex flex-col gap-5 pb-40 w-sidebar"
        ref="content"
    >
      <Auth :class="isLoggedIn ? 'absolute z-[-1] invisible' : ''"/>
      <PhotosProfile v-if="showPhotoComp"/>
      <UsersSuggest/>
      <Trends v-if="route.name !== 'explore'"/>
      <div class="flex-center gap-2 text-zinc-500 -mt-2">
        <About/>
        ·
        <div class="text-zinc-500 text-sm">
          © 2023 Hau Tran
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import About from "@components/About.vue";
import PhotosProfile from "@components/layout/SidebarRight/PhotosProfile.vue";
import UsersSuggest from "@components/layout/SidebarRight/UsersSuggest.vue";
import Trends from "@components/layout/SidebarRight/Trends.vue";
import SearchBar from "@components/layout/SearchBar.vue";
import Auth from "@components/layout/SidebarRight/Auth.vue";
import { mapGetters } from "@/lib/map-state";

const router = useRouter()
const route = useRoute()
const { isLoggedIn, getUser } = mapGetters()

const currentRouteName = route.name;

const routerIsReady = ref(false)
const showPhotoComp = ref(false)
const showSearchBar = ref(false)
const keySearchAllComp = ref(0)
const query = ref('')
let sidebar = ref<HTMLDivElement | null>(null)
let content = ref<HTMLDivElement | null>(null)

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

onMounted(async () => {
  window.addEventListener("scroll", onScroll)
  await router.isReady();
  routerIsReady.value = true
})

const onScroll = (e) => {
  let scrollTop = window.scrollY; // current scroll position
  let viewportHeight = window.innerHeight; // viewport height
  let sidebarTop = sidebar.value?.getBoundingClientRect()?.top + window.pageYOffset; // current content height
  let contentHeight = content.value?.getBoundingClientRect().height; // distance from top to sidebar
  // console.log('dauphaihau debug: -scroll-top-viewport-height-sidebar-top-content-height-', [scrollTop, viewportHeight, sidebarTop, contentHeight])

  if (scrollTop >= contentHeight - viewportHeight + sidebarTop) {
    content.value.style.transform = `translateY(-${(contentHeight - viewportHeight + sidebarTop)}px)`;
    content.value.style.position = "fixed";
  } else {
    content.value.style.transform = "";
    content.value.style.position = "";
  }
}

watch(router.currentRoute, (value) => {
  showSearchBar.value = value.name !== 'search' && value.name !== 'explore'
  showPhotoComp.value = value.name === 'profile'
  if (route.query?.q) {
    query.value = route.query.q as string
    keySearchAllComp.value++
  } else {
    query.value = ''
  }
})

const changeRoute = () => {
  keySearchAllComp.value++
}

</script>

<style scoped>

.w-sidebar {
  @apply w-[350px] max-w-[350px]
}
</style>
