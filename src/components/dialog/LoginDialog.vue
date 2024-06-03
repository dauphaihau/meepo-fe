<script setup lang="ts">
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useMediaQuery } from '@vueuse/core';

import { useStore } from '@/store';
import { ActionEnums, MutationEnums } from '@/types/store/root';
import Input from '@/core/components/forms/Input.vue';
import Button from '@/core/components/Button.vue';
import { logger } from '@/core/helper';
import { validationLoginSchema } from '@/validations/user';
import { mapGetters } from '@/lib/map-state';
import Dialog from '@/core/components/Dialog.vue';

const isLargeScreen = useMediaQuery('(min-width: 1024px)');

const store = useStore();
const router = useRouter();
const { getOpenLoginDialog: isOpenDialog, isLoggedIn, getUser } = mapGetters();

const isSubmitted = ref(false);
const isLoading = ref(false);

const {
  handleSubmit, errors, resetForm, setFieldError,
} = useForm({
  validationSchema: validationLoginSchema,
  validateOnMount: false,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const validate = (e: Event) => {
  isSubmitted.value = true;
  if (Object.keys(errors.value).length === 0) {
    onSubmit(e);
  }
};

const onSubmit = handleSubmit(async (vals) => {
  const data = { user: vals };
  isLoading.value = true;
  logger.debug('Login Dialog execute onSubmit', data, 'src/components/dialog/LoginDialog.vue');
  const message = await store.dispatch(ActionEnums.LOGIN, data);
  isLoading.value = false;
  if (message) {
    setFieldError('email', message);
    return;
  }
  router.push({ name: 'home' });
  closeDialog();
  resetForm();
});

function closeDialog() {
  if (isLoading.value) return;
  store.commit(MutationEnums.SET_LOGIN_DIALOG, false);
  isSubmitted.value = false;
  resetForm();
}

function openDialog() {
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
}

const openRegisterDialog = () => {
  if (isLoading.value) return;
  store.commit(MutationEnums.SET_REGISTER_DIALOG, true);
  closeDialog();
};

const openForgotPasswordDialog = () => {
  if (isLoading.value) return;
  store.commit(MutationEnums.SET_FORGOT_PASSWORD_DIALOG, true);
  closeDialog();
};

</script>

<template>
  <Dialog
    :show="isOpenDialog"
    :close-dialog="closeDialog"
    class-panel="min-w-[100vw] md:min-w-[400px] md:max-w-sm md:mt-20 flex flex-col justify-center"
  >
    <template
      v-if="!isLoggedIn"
      #trigger
    >
      <Button
        :variant="isLargeScreen ? 'primary' : 'outline'"
        class="w-full"
        @click="openDialog"
      >
        Log In
      </Button>
    </template>

    <template #panel>
      <div class="flex flex-col gap-5">
        <div class="text-center">
          <h1 class="text-2xl mb-1 text-black">
            Welcome Back
          </h1>
          <p class="text-sm text-zinc-700 font-light">
            We're so excited to see you again!
          </p>
        </div>
        <div class="flex flex-col gap-5 ">
          <form
            class="login-form"
            @submit.prevent="validate"
          >
            <Input
              v-model="email"
              :disabled="isLoading"
              class-wrapper="mb-4"
              size="md"
              label="Email"
              :helper-text="isSubmitted ? errors.email : '' "
            />
            <Input
              v-model="password"
              :disabled="isLoading"
              class-wrapper="mb-4"
              size="md"
              label="Password"
              type="password"
              :helper-text="isSubmitted ? errors.password : '' "
            />
            <div class=" flex justify-end">
              <p
                class="text-sm mb-4 text-link"
                @click="openForgotPasswordDialog"
              >
                Forgot password?
              </p>
            </div>
            <Button
              :is-loading="isLoading"
              radius="lg"
              class="w-full"
              size="md"
              @submit.prevent="onSubmit"
            >
              Log in
            </Button>
          </form>
          <div class="flex justify-center text-sm">
            <p class="text-zinc-500 mr-1">
              New to Meepo?
            </p>
            <p
              class="text-link"
              @click="openRegisterDialog"
            >
              Sign up
            </p>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
