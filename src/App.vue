<script setup>
import { onMounted, watch, ref } from "vue";
import { Toaster } from 'vue-sonner'
import { useRoute, useRouter } from "vue-router";

import SidebarLeft from "@/components/layout/SidebarLeft.vue";
import SidebarRight from "@/components/layout/SidebarRight.vue";
import ChatBox from "@/components/layout/Chatbox.vue";
import { mapGetters } from "@/lib/map-state";
import AuthBar from "@components/pages/AuthBar.vue";

const route = useRoute()
const router = useRouter()
const keyApp = ref(0)

const { isLoggedIn, getUser, getShowChatbox } = mapGetters()

onMounted(async () => {
  await router.isReady()
})


watch(isLoggedIn, () => {
  keyApp.value++
})

</script>

<template>
  <div id="app" class="w-full">
    <Toaster position="bottom-center" offset="20px" class="flex justify-center"/>
    <AuthBar v-if="!isLoggedIn" class="lg:hidden"/>
    <div class="max-w-4xl xl:max-w-[76rem] mx-auto flex" :key="keyApp">
      <SidebarLeft class="ml-8 lg:ml-0"/>
      <main class="flex gap-6 min-h-[200vh]">
        <div class="pt-12 flex flex-col w-full border-l border-r min-w-[600px] max-w-[600px] min-h-screen">
          <router-view :key="route.path"/>
        </div>
        <SidebarRight class="hidden lg:block"/>
      </main>
    </div>
    <ChatBox v-if="isLoggedIn && ( getUser.rooms_private_count > 0 || getShowChatbox)"/>
  </div>
</template>

