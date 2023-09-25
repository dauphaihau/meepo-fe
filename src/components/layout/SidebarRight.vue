<template>

  <div class="pb-14 z-[2]">

    <!--    <div class="fixed top-3 lg:top-2 h-[85%] w-[90px] xl:w-[259px] lg:pl-[23px] xl:pl-0">-->
    <div class="fixed top-0 z-[3] w-[350px] max-w-[350px]">
      <div class="h-2 bg-white"/>
      <SearchBar
          v-if="showSearchBar"
          class="bg-white"
          :query="query"
          @changeRoute="changeRoute"
          :key="keySearchAllComp"
      />
      <div class="h-10 bg-gradient-to-b from-white"/>
    </div>

    <div :class="!showSearchBar ? 'pb-8' : 'pb-[4.5rem]'"/>

    <Auth class="mb-5" v-if="!isLoggedIn"/>

    <div
        class="flex justify-end gap-2 max-w-[350px] relative mb-4"
        ref="refSb"
    >
      <div
          class="flex flex-col gap-5 min-h-0 w-[350px] "
      >
<!--                        :class="(scrollHeight > (is2XlScreen ? 330 : 870) ) ?-->
<!--                                     currentRouteName === 'profile' ?-->
<!--                                     'fixed bottom-20 right-[17px]' : 'fixed bottom-20 pl-[22rem] z-[2]': ''"-->

<!--                                     'fixed bottom-20 right-[17px]' : 'fixed bottom-20 pl-[22rem] z-[2]': ''"-->
        <!--                             'fixed bottom-20 right-[17px]' : 'fixed bottom-20 pl-[22rem] z-[2]': 'sticky top-70 z-[2]'"-->



        <PhotosProfile v-if="showPhotoComp"/>
        <UsersSuggest/>
        <Trends v-if="route.name !== 'explore'"/>

        <div class="flex justify-center items-center gap-2 text-zinc-500 w-[348px]">
          <About/>
          ·
          <div class="text-zinc-500 text-sm">
            © 2023 Hau Tran
          </div>
        </div>

      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import About from "@components/About.vue";
import PhotosProfile from "@/components/PhotosProfile.vue";
import UsersSuggest from "@components/UsersSuggest.vue";
import Trends from "@components/Trends.vue";
import SearchBar from "@components/layout/SearchBar.vue";
import Auth from "@components/layout/Auth.vue";
import { mapGetters } from "@/lib/map-state";
// import { useMediaQuery } from "@vueuse/core";

const router = useRouter()
const route = useRoute()
const { isLoggedIn, getUser } = mapGetters()

const currentRouteName = route.name;

// const is2XlScreen = useMediaQuery('(min-width: 1536px)')

const routerIsReady = ref(false)
const showPhotoComp = ref(false)
const showSearchBar = ref(false)
const scrollHeight = ref(0)
const refSb = ref(null)
const keySearchAllComp = ref(0)
const query = ref('')

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

onMounted(async () => {
  window.addEventListener("scroll", onScroll)
  await router.isReady();
  routerIsReady.value = true
})

const onScroll = (e) => {
  scrollHeight.value = e.target.documentElement.scrollTop;
  // console.log('dauphaihau debug: document scroll height', document.body.scrollHeight)
  // console.log('dauphaihau debug: window-inner-height', window.innerHeight)
  // console.log('dauphaihau debug: scroll top', e.target.documentElement.scrollTop)

  // console.log('dauphaihau debug: ref-sb', refSb.value)
  // console.log('dauphaihau debug: ref-sb offsetHeight', refSb.value.offsetHeight)
  // console.log('dauphaihau debug: ref-sb offsetTop', refSb.value.offsetTop)
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
</style>
