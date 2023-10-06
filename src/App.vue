<script setup>
import { onMounted } from "vue";
import { Toaster } from 'vue-sonner'
import { useRoute, useRouter } from "vue-router";
import { useMediaQuery } from "@vueuse/core";

import SidebarLeft from "@components/layout/SidebarLeft/index.vue";
import SidebarRight from "@components/layout/SidebarRight/index.vue";
import ChatBox from "@/components/layout/Chatbox.vue";
import { mapGetters } from "@/lib/map-state";
import AuthBar from "@components/AuthBar.vue";

const isTabletScreen = useMediaQuery('(min-width: 768px)')
const route = useRoute()
const router = useRouter()

const { isLoggedIn, getUser, getShowChatbox, getLoadingAuth } = mapGetters()

onMounted(async () => {
  await router.isReady()
})

</script>

<template>
  <div id="app" class="w-full">
    <div v-if="getLoadingAuth" class="fixed bg-white inset-0 z-[10] flex justify-center items-center">
      <p class="font-black text-black font-[Alphabets4] py-2 px-3 lg:px-4 text-7xl">m</p>
    </div>

    <div v-else>
      <Toaster position="bottom-center" offset="20px" class="flex justify-center"/>
      <AuthBar v-if="!isLoggedIn" class="lg:hidden"/>
      <div class="flex mx-auto max-w-[100vw] lg:max-w-4xl xl:max-w-[76rem]">
        <SidebarLeft
            v-if="isTabletScreen || (!isTabletScreen && isLoggedIn)"
            class="w-0 md:w-auto md:ml-8 lg:ml-0"
        />
        <main class="flex gap-6 w-full min-h-[130vh] md:min-h-[200vh]">
          <div
              class="flex flex-col w-full border-l border-r md:min-w-[598px] md:max-w-[598px] min-h-screen"
              :class="{'pt-12': !['messages', 'room'].includes(route.name)}"
          >
            <router-view :key="route.path"/>
          </div>
          <SidebarRight class="hidden lg:block"/>
        </main>
      </div>
      <ChatBox v-if="isLoggedIn && ( getUser.rooms_private_count > 0 || getShowChatbox)"/>
    </div>
  </div>
</template>

