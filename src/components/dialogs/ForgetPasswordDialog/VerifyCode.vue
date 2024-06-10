<script setup lang="ts">
import Input from '@core/components/forms/Input.vue';
import Button from '@core/components/Button.vue';
import { authService } from '@services/auth.ts';
import FormGroup from '@core/components/forms/FormGroup.vue';
import { StatusCodes } from 'http-status-codes';

const emit = defineEmits<{
  (e: 'changeStep', value: string)
}>();

const token = ref('');
const errorTokenMsg = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  const { status } = await authService.verifyCodeFromEmail(token.value);
  isLoading.value = false;

  if (status === StatusCodes.UNAUTHORIZED) {
    errorTokenMsg.value = 'Invalid or expired code';
  }
  if (status === StatusCodes.OK) {
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
      <FormGroup
        class="mb-4"
        label="Code"
        :error="errorTokenMsg"
        size="md"
      >
        <Input
          v-model="token"
          :disabled="isLoading"
          size="md"
        />
      </FormGroup>
      <Button
        :disabled="!token"
        :loading="isLoading"
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
