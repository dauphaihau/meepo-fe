<script setup lang="ts">
import { ref } from 'vue';

import Input from '@/core/components/forms/Input.vue';
import Button from '@/core/components/Button.vue';
import { authService } from '@services/auth.ts';

const emit = defineEmits<{
  (e: 'changeStep')
}>();

const isLoading = ref(false);
const refInput = ref(null);
const query = ref('');
const errorQuery = ref('');

const onSubmit = async () => {
  isLoading.value = true;
  const { status } = await authService.forgetPassword(query.value);
  isLoading.value = false;

  if (status === 404) {
    errorQuery.value = 'Sorry, we could not find your account.';
  }
  if (status === 200) {
    emit('changeStep');
  }
};

</script>

<template>
  <div>
    <div class="mb-4">
      <h1 class="text-2xl text-black font-bold mb-2">
        Find your Meepo account
      </h1>
      <h2 class="text-sm md:text-base text-zinc-600 leading-6">
        Enter the email or username associated with your account to change
        your password.
      </h2>
    </div>

    <form @submit.prevent="onSubmit">
      <Input
        ref="refInput"
        v-model="query"
        :disabled="isLoading"
        class-wrapper="mb-4"
        size="md"
        label="Email, username"
        :helper-text="errorQuery"
      />
      <Button
        :disabled-click="!query"
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
