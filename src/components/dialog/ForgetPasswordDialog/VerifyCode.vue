<script setup lang="ts">
import { ref } from 'vue'

import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import { useStore } from "@/store";
import { userAPI } from "@/apis/user";

const store = useStore()

const emit = defineEmits<{
  (e: 'changeStep', value: string)
}>()

const token = ref('');
const errorToken = ref('');
const isSubmitted = ref(false);
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true
  const { status } = await userAPI.verifyCodeFromEmail(token.value)
  isLoading.value = false

  if (status === 401) {
    errorToken.value = 'Invalid or expired code'
  }
  if (status === 200) {
    emit('changeStep', token.value)
  }
}

</script>


<template>
  <div class="mb-4">
    <div class="mb-4">
      <h1 class="text-2xl text-black font-bold mb-2">We send you a code</h1>
      <h2 class="text-base text-zinc-500 leading-6">Check your email to get your confirmation code. If you need
        to request a new code, go back and reselect a confirmation.</h2>
    </div>
    <form @submit.prevent="onSubmit">
      <Input
          :disabled="isLoading"
          classWrapper="mb-4"
          size="md"
          label="Code"
          v-model="token"
      />
      <Button
          :key="isLoading.toString()"
          :isLoading="isLoading"
          :disabled="!token"
          v-on:submit.prevent="onSubmit"
          radius="lg"
          class="w-full"
          size="md"
      >
        Next
      </Button>
    </form>
  </div>
</template>
