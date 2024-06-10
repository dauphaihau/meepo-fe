<script setup lang="ts">

import Button from '@core/components/Button.vue';

const emit = defineEmits<{
  (e: 'closeDialog')
}>();

</script>

<template>
  <div>
    <div class="mb-2">
      <h1 class="text-2xl text-black font-bold mb-2">
        You're all set
      </h1>
      <h2 class="text-[15px] text-zinc-600 leading-6 mb-3">
        You've successfully changed your password.
      </h2>
      <h2 class="text-[15px] text-zinc-600 leading-6">
        Add an extra layer of security to your account with
        <span class="text-zinc-600 hover:text-black underline underline-offset-2 cursor-pointer animate">
          two-factor authentication</span>. Enable it in your settings to help make sure that you, and
        only you, can access your account.
      </h2>

      <Button
        radius="lg"
        class="w-full mt-4"
        size="md"
        @click="() => emit('closeDialog')"
      >
        Continue to Meepo
      </Button>
    </div>
  </div>
</template>
