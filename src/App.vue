<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Header from "@/components/layout/Header.vue";
import SidebarLeft from "@/components/layout/SidebarLeft.vue";
import SidebarRight from "@/components/layout/SidebarRight.vue";

</script>

<template>
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
         }}"
  />
  <Header/>

  <div class="max-w-7xl mx-auto pt-16 flex">
    <SidebarLeft class="col-span-1"/>
    <div class="flex gap-10">
      <div class="flex flex-col border-l border-r border-l-zinc-100 border-r-zinc-100 min-w-[600px] max-w-[600px]">
        <router-view/>
      </div>
      <SidebarRight/>
    </div>
  </div>

</template>

<style scoped>
</style>
