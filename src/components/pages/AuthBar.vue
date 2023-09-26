<template>
  <div class="fixed bottom-0 left-0 z-[2] bg-black w-full py-3 flex items-center justify-around">

    <div class="text-white">
      <p class="text-xl font-semibold">Don't miss what's happening</p>
      <p class="text-sm">People on Meepo are the first to know.</p>
    </div>

    <div
        v-if="!isLargeScreen"
        class="flex gap-2 grow max-w-[200px]"
    >
      <LoginDialog/>
      <RegisterDialog/>
      <ForgotPasswordDialog/>
    </div>
  </div>

</template>

<script lang="ts" setup>
import LoginDialog from "@/components/dialog/LoginDialog.vue";
import RegisterDialog from "@/components/dialog/RegisterDialog.vue";
import ForgotPasswordDialog from "@components/dialog/ForgetPasswordDialog/index.vue";
import { useMediaQuery } from "@vueuse/core";

const isLargeScreen = useMediaQuery('(min-width: 1024px)')

</script>

<style scoped>

</style>
