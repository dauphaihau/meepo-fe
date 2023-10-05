<template>
  <div>

    <div
        class="wrapper"
        :class="[
          (isMobileScreen && direction === 'down' ? '-top-28' : 'top-0'),
          (slots.tabs ? 'border-b' : scrollY > 0 ? 'border-b' : 'border-b-white')
     ]"
    >
      <p
          v-if="currentRouteName === 'home'"
          class="capitalize text-[18px] font-bold leading-6 ml-4 mt-4 lg:my-4 hidden md:block"
      >{{ currentRouteName }}</p>

      <!--      Header mobile ( logo + user ) -->
      <div
          v-if="currentRouteName === 'home'"
          class="md:hidden flex justify-between w-1/2 my-2 mx-4"
      >
        <div @click="showSidebarMobile = !showSidebarMobile" class="cursor-pointer">
          <img
              v-if="getUser.avatar_url"
              alt="avatar"
              :src="getUser.avatar_url"
              class="h-8 w-8 lg:h-8 lg:w-8 rounded-full "
          />
          <img
              v-else
              alt="avatar"
              src="@/assets/default-avatar.png"
              class="h-8 w-8 lg:h-8 lg:w-8 rounded-full "
          />
        </div>

        <router-link
            :to="isLoggedIn ? '/home' : '/explore' "
            class="font-black font-[Alphabets4] text-2xl"
        >m
        </router-link>
      </div>

      <!--      Search Bar, title , arrow back -->
      <div v-if="title || subTitle" class="flex gap-4 items-center h-[53px] pl-2 md:px-4">
        <ArrowLeftIcon
            class="h-9 w-9 cursor-pointer hover:bg-zinc-300 animate rounded-full p-2"
            aria-hidden="true"
            @click="backTo ? router.push(backTo) : router.back()"
        />
        <!--      <div :class="title && subTitle && 'mt-1.5'">-->
        <div :class="title && subTitle && ''">
          <div v-if="!showSearchBar">
            <h3 class="text-[17px] md:text-[20px] font-bold leading-6">{{ title }}</h3>
            <p v-if="subTitle" class="text-zinc-500 text-xs md:text-sm">{{ subTitle }}</p>
          </div>

          <SearchBar
              class="md:w-[450px] md:max-w-[450px]"
              v-if="showSearchBar && routerIsReady"
              :query="query"
              @changeRoute="changeRoute"
              :key="keySearchAllComp"
          />

        </div>
        <SettingIconOutline
            v-if="currentRouteName === 'explore'"
            v-tooltip="'Not available'"
            class="h-9 w-9 cursor-pointer hover:bg-zinc-300 animate rounded-full p-2 opacity-50"
        />
      </div>

      <slot name="tabs" class="relative max-w-[100vw] md:max-w-full"/>
    </div>

    <SidebarMobile
        @setShowSidebar="(val) => showSidebarMobile = val"
        :show="showSidebarMobile"
    />

  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, useSlots, watch } from "vue";
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import { useMediaQuery, useWindowScroll } from "@vueuse/core";
import {
  Cog8ToothIcon as SettingIconOutline,
} from "@heroicons/vue/24/outline"

import SearchBar from "@components/layout/SearchBar.vue";
import { mapGetters } from "@/lib/map-state";
import { useScrollDirection } from "@/core/hooks/useScrollDirection";
import SidebarMobile from "@components/layout/SidebarMobile.vue";

interface Props {
  title?: string
  subTitle?: string
  backTo?: string
}

let { title, subTitle, backTo } = defineProps<Props>()

const { getUser, isLoggedIn } = mapGetters()

const isMobileScreen = useMediaQuery('(max-width: 375px)')
const { y: scrollY } = useWindowScroll()
const direction = useScrollDirection()
const router = useRouter()
const route = useRoute()
const slots = useSlots()

const routerIsReady = ref(false)
const showSidebarMobile = ref(false)
const keySearchAllComp = ref(0)
const query = ref('')

const currentRouteName = route.name
const showSearchBar = currentRouteName === 'search' || currentRouteName === 'explore'

onMounted(async () => {
  await router.isReady();
  routerIsReady.value = true

  if (route.query?.q) {
    query.value = route.query.q as string
    keySearchAllComp.value++
  }
})

const changeRoute = () => {
  keySearchAllComp.value++
}

watch(router.currentRoute, () => {
  if (route.query?.q) {
    query.value = route.query.q as string
    keySearchAllComp.value++
  }
})

</script>

<style scoped>
.wrapper {
  @apply fixed z-[4]
  w-full max-w-2xl md:w-[596px] md:max-w-[596px]
  backdrop-blur-xl bg-white/70
  transition-all duration-500;
}
</style>
