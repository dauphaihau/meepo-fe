<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Header from "@/components/layout/Header.vue";

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

  <router-view/>
</template>

<style scoped>
</style>
