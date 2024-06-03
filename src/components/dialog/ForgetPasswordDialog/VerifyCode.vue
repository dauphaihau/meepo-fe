<script setup lang="ts">
import { ref } from 'vue';

import Input from '@core/components/forms/Input.vue';
import Button from '@core/components/Button.vue';
import { authService } from '@/services/auth.ts';

const emit = defineEmits<{
  (e: 'changeStep', value: string)
}>();

const token = ref('');
const errorToken = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  const { status } = await authService.verifyCodeFromEmail(token.value);
  isLoading.value = false;

  if (status === 401) {
    errorToken.value = 'Invalid or expired code';
  }
  if (status === 200) {
    emit('changeStep', token.value);
  }
};

</script>

<template>
  <div class="mb-4">
    <div class="mb-4">
      <h1 class="text-2xl text-black font-bold mb-2">
        We send you a code
      </h1>
      <h2 class="text-base text-zinc-500 leading-6">
        Check your email to get your confirmation code. If you need
        to request a new code, go back and reselect a confirmation.
      </h2>
    </div>
    <form @submit.prevent="onSubmit">
      <Input
        v-model="token"
        :disabled="isLoading"
        class-wrapper="mb-4"
        size="md"
        label="Code"
        :helper-text="errorToken"
      />
      <Button
        :disabled-click="!token"
        :is-loading="isLoading"
        radius="lg"
        class="w-full"
        size="md"
        @submit.prevent="onSubmit"
      >
        Next
      </Button>
    </form>
  </div>
</template>
