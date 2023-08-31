<script setup>
import { onMounted, watch, ref } from "vue";
import { Toaster } from 'vue-sonner'
import { useRoute, useRouter } from "vue-router";

import Header from "@/components/layout/Header.vue";
import SidebarLeft from "@/components/layout/SidebarLeft.vue";
import SidebarRight from "@/components/layout/SidebarRight.vue";
import { mapGetters } from "@/lib/map-state";
import Help from "@components/Help.vue";

const route = useRoute()
const router = useRouter()
const keyApp = ref(0)

const { isLoggedIn } = mapGetters()

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

    <div :key="keyApp" class="max-w-7xl xl:max-w-[76rem] mx-auto pt-12 flex">
      <SidebarLeft/>
      <div class="flex gap-6">
        <div class="flex flex-col border-l border-r min-w-[600px] max-w-[600px]">
          <router-view :key="route.path"/>
        </div>
        <SidebarRight/>
      </div>
    </div>
    <Help/>

  </div>
</template>

