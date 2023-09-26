<template>
  <div
      class="wrapper"
      :class="slots.tabs ?'border-b' : scrollHeight > 0 ? 'border-b':'border-b-white'"
  >
    <p
        v-if="currentRouteName === 'home'"
        class="capitalize text-[18px] font-bold leading-6 ml-4 mt-4 lg:my-4"
    >{{ currentRouteName }}</p>
    <div v-if="title || subTitle" class="flex gap-4 items-center h-14 px-4">
      <ArrowLeftIcon
          class="h-9 w-9 cursor-pointer hover:bg-zinc-300 animate rounded-full p-2"
          aria-hidden="true"
          @click="backTo ? router.push(backTo) : router.back()"
      />
      <div :class="title && subTitle && 'mt-1.5'">
        <div v-if="!showSearchBar">
          <h3 class="text-[20px] font-bold leading-6">{{ title }}</h3>
          <p v-if="subTitle" class="text-zinc-500 text-sm">{{ subTitle }}</p>
        </div>

        <SearchBar
            class="w-[490px] max-w-[490px]"
            v-if="showSearchBar && routerIsReady"
            :query="query"
            @changeRoute="changeRoute"
            :key="keySearchAllComp"
        />

      </div>
    </div>
    <slot name="tabs" class="relative z-[-2]"/>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'

import SearchBar from "@components/layout/SearchBar.vue";

interface Props {
  title?: string
  subTitle?: string
  backTo?: string
}

let { title, subTitle, backTo } = defineProps<Props>()

const router = useRouter()
const route = useRoute()
const slots = useSlots()

const scrollHeight = ref(0)
const routerIsReady = ref(false)
const keySearchAllComp = ref(0)
const query = ref('')

const currentRouteName = route.name
const showSearchBar = currentRouteName === 'search' || currentRouteName === 'explore'

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

onMounted(async () => {
  await router.isReady();
  routerIsReady.value = true

  if (route.query?.q) {
    query.value = route.query.q as string
    keySearchAllComp.value++
  }

  window.addEventListener("scroll", onScroll)
})

const onScroll = (e) => {
  scrollHeight.value = e.target.documentElement.scrollTop;
}

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
  @apply fixed top-0  w-full max-w-2xl w-[600px] max-w-[600px] border z-[4] backdrop-blur-xl bg-white/70;
  margin-left: -1px;
}

</style>
