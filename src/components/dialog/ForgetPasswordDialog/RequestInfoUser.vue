<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import { useStore } from "@/store";
import { userAPI } from "@/apis/user";
import { MutationEnums } from "@/types/store/root";

const store = useStore()
const emit = defineEmits<{
  (e: 'changeStep')
}>()

const isLoading = ref(false);
const inputQuery = ref(null);
const query = ref('');
const errorQuery = ref('');

onMounted(() => {
  // nextTick(() => {
  //   inputQuery.value.focus();
  // });
})

const onSubmit = async () => {
  isLoading.value = true
  const { status } = await userAPI.forgetPassword(query.value)
  isLoading.value = false

  if (status === 404) {
    errorQuery.value = 'Sorry, we could not find your account.'
  }
  if (status === 200) {
    emit('changeStep')
  }
}

</script>

<template>
  <div>
    <div class="mb-4">
      <h1 class="text-2xl text-black font-bold mb-2">Find your Meepo account</h1>
      <h2 class="text-base text-zinc-600 leading-6">Enter the email or username associated with your account to change
        your password.</h2>
    </div>
    <form @submit.prevent="onSubmit">
      <Input
          ref="inputQuery"
          :disabled="isLoading"
          classWrapper="mb-4"
          size="md"
          label="Email, username"
          :helperText="errorQuery"
          v-model="query"
      />
      <Button
          :disabledClick="!query"
          :isLoading="isLoading"
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
