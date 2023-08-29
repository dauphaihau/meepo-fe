<template>
  <div
      class="flex justify-end gap-2 h-[180vh] pt-8 pb-20 max-w-[350px] relative"
      ref="refSb"
  >

    <div
        class="flex flex-col gap-5 min-h-0 w-[350px]"
    >
      <!--              :class="scrollHeight > 900 ?-->
      <!--               currentRouteName === 'profile' ?-->
      <!--               'fixed bottom-20 right-[17px]' : 'fixed bottom-20 right-[17px]': 'sticky top-70'"-->

      <PhotosProfile v-if="showPhotoComp"/>
      <UsersSuggest/>
      <Trends v-if="route.name !== 'explore'"/>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PhotosProfile from "@/components/PhotosProfile.vue";
import UsersSuggest from "@components/UsersSuggest.vue";
import Trends from "@components/Trends.vue";

const router = useRouter()
const route = useRoute()

const showPhotoComp = ref(false)
const scrollHeight = ref(0)
const refSb = ref(0)

let currentRouteName

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

onMounted(async () => {
  window.addEventListener("scroll", onScroll)

  await router.isReady();
  showPhotoComp.value = currentRouteName === 'profile'
})

const onScroll = (e) => {
  scrollHeight.value = e.target.documentElement.scrollTop;
}

watch(router.currentRoute, (value) => {
  showPhotoComp.value = value.name === 'profile'
})

</script>

<style scoped>

</style>
