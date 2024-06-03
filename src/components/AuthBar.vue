<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core';

import LoginDialog from '@components/dialog/LoginDialog.vue';
import RegisterDialog from '@components/dialog/RegisterDialog.vue';
import ForgotPasswordDialog from '@components/dialog/ForgetPasswordDialog/index.vue';
import { useScrollDirection } from '@/core/hooks/useScrollDirection';

const direction = useScrollDirection();
const isLargeScreen = useMediaQuery('(min-width: 1024px)');

</script>

<template>
  <div
    :class="{'opacity-50': direction === 'down'}"
    class="
        fixed bottom-0 md:bottom-0 left-0 z-[2]
        bg-black w-full py-3 pl-4
        flex flex-col md:flex-row md:items-center md:justify-around
        transition-all duration-500
      "
  >
    <div class="text-white mb-3">
      <p class="text-xl font-semibold">
        Don't miss what's happening
      </p>
      <p class="text-sm">
        People on Meepo are the first to know.
      </p>
    </div>

    <div
      v-if="!isLargeScreen"
      class="flex gap-2 grow max-w-[50%] md:max-w-[200px]"
    >
      <LoginDialog />
      <RegisterDialog />
      <ForgotPasswordDialog />
    </div>
  </div>
</template>

<style scoped>

</style>
