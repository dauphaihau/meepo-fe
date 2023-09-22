<script setup>
import { onMounted, watch, ref } from "vue";
import { Toaster } from 'vue-sonner'
import { useRoute, useRouter } from "vue-router";

import About from "@components/About.vue";
import Header from "@/components/layout/Header.vue";
import SidebarLeft from "@/components/layout/SidebarLeft.vue";
import SidebarRight from "@/components/layout/SidebarRight.vue";
import ChatBox from "@/components/layout/Chatbox.vue";
import { mapGetters } from "@/lib/map-state";

const route = useRoute()
const router = useRouter()
const keyApp = ref(0)

const { isLoggedIn, getUser, getShowChatbox } = mapGetters()

onMounted(async () => {
  await router.isReady()
})

watch(router.currentRoute, (value) => {
  if (value.path === '/') {
    router.push('/home')
  }
})

watch(isLoggedIn, () => {
  keyApp.value++
})

</script>

<template>
  <div id="app" class="w-full">
    <Toaster position="bottom-center" offset="20px" class="flex justify-center"/>
    <Header/>
    <div class="max-w-7xl xl:max-w-[76rem] mx-auto pt-12 flex" :key="keyApp">
      <SidebarLeft/>

      <About class="grow flex flex-col justify-end ml-3"/>
      <div class="flex gap-6">
        <div class="flex flex-col border-l border-r min-w-[600px] max-w-[600px]">
          <router-view :key="route.path"/>
        </div>
        <SidebarRight/>
      </div>
    </div>
    <ChatBox v-if="isLoggedIn && ( getUser.rooms_private_count > 0 || getShowChatbox)"/>
  </div>
</template>

