<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core';
import { useScrollDirection } from '@/core/hooks/useScrollDirection';
import Button from '@core/components/Button.vue';
import { DialogTypes, useDialogStore } from '@stores/dialog.ts';

const direction = useScrollDirection();
const dialogStore = useDialogStore();
const minLargeScreen = useMediaQuery('(min-width: 1024px)');

const showDialog = (type: DialogTypes) => {
  dialogStore.showDialog = type;
};

</script>

<template>
  <div
    :class="{'opacity-50': direction === 'down'}"
    class="
        lg:hidden fixed bottom-0 md:bottom-0 left-0 z-[2]
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
      v-if="!minLargeScreen"
      class="flex gap-2 grow max-w-[50%] md:max-w-[200px]"
    >
      <Button
        variant="outline"
        @click="showDialog('login')"
      >
        Log In
      </Button>
      <Button
        variant="outline"
        @click="showDialog('register')"
      >
        Register
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
