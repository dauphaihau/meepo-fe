<script setup>
import { onMounted } from "vue";
import { Toaster } from 'vue-sonner'
import { useRoute, useRouter } from "vue-router";

import Header from "@/components/layout/Header.vue";
import SidebarLeft from "@/components/layout/SidebarLeft.vue";
import SidebarRight from "@/components/layout/SidebarRight.vue";

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  await router.isReady()
  if (route.path === '/') {
    router.push('/home')
  }
})

</script>

<template>
  <div id="app" class="w-full">
    <Toaster
        position="bottom-center" offset="20px"
        :toastOptions="{
            style: {
              background: 'black',
              color: 'white',
              border: 'black',
              padding: '10px 20px',
              width: 'fit-content',
              marginLeft: '100px'
         },
  }"

    />
    <Header/>

    <div class="max-w-7xl xl:max-w-[76rem] mx-auto pt-12 flex">
      <SidebarLeft/>
      <div class="flex gap-6">
        <div class="flex flex-col border-l border-r min-w-[600px] max-w-[600px]">
          <router-view :key="route.path"/>
        </div>
        <SidebarRight/>
      </div>
    </div>

  </div>
</template>

