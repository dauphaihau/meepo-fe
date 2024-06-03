<script setup lang="ts">
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

import Input from '@/core/components/forms/Input.vue';
import Button from '@/core/components/Button.vue';
import { useStore } from '@/store';
import { authService } from '@services/auth.ts';
import { ActionEnums, MutationEnums } from '@/types/store/root';
import { validationPasswordSchema } from '@/validations/user';

const emit = defineEmits<{
  (e: 'changeStep')
}>();

const { token } = defineProps<{token: string}>();

const store = useStore();
const router = useRouter();

const isSubmitted = ref(false);
const isLoading = ref(false);

const {
  handleSubmit, errors,
} = useForm({
  validationSchema: validationPasswordSchema,
  validateOnMount: false,
});

const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');

const validate = (e: Event) => {
  isSubmitted.value = true;
  if (Object.keys(errors.value).length === 0) {
    onSubmit(e);
  }
};

const onSubmit = handleSubmit(async () => {
  isLoading.value = true;
  const { status, data } = await authService.resetPassword({
    token,
    password: password.value,
  });
  if (status === 401) {
    store.commit(MutationEnums.SHOW_TOAST, {
      message: 'Invalid or expired code',
    });
    isLoading.value = false;
    return;
  }
  if (status === 200 && data?.user) {
    // store.commit(MutationEnums.SET_USER_INFO, data.user)
    await store.dispatch(ActionEnums.LOGIN, {
      user: {
        email: data?.user.email,
        password: password.value,
      },
    });
    emit('changeStep');
    router.push({ name: 'home' });
  }
  isLoading.value = false;
});

</script>

<template>
  <div class="mb-4">
    <div class="mb-4">
      <h1 class="text-2xl text-black font-bold mb-2">
        Choose a new password
      </h1>
      <h2 class="text-[15px] text-zinc-500 leading-6">
        Make sure your password must has at least 8 characters that
        include at least 1 lowercase character,
        1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)
      </h2>
    </div>
    <form @submit.prevent="validate">
      <Input
        v-model="password"
        :disabled="isLoading"
        type="password"
        class-wrapper="mb-4"
        size="md"
        label="Password"
        :helper-text=" isSubmitted && errors.password ? 'Invalid Password' : ''"
      />
      <Input
        v-model="confirmPassword"
        :disabled="isLoading"
        type="password"
        class-wrapper="mb-6"
        size="md"
        label="Confirm Password"
        :helper-text=" isSubmitted ? errors.confirmPassword : ''"
      />
      <Button
        :is-loading="isLoading"
        :disabled-click="!password || !confirmPassword"
        radius="lg"
        class="w-full"
        size="md"
        @submit.prevent="validate"
      >
        Change Password
      </Button>
    </form>
  </div>
</template>
