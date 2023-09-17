<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate';
import { Form } from 'vee-validate';

import { useStore } from "@/store";
import { ActionEnums, MutationEnums } from "@/types/store/root";
import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import { logger } from "@/core/helper";
import { validationLoginSchema } from "@/lib/validations/user";
import { mapGetters } from "@/lib/map-state";
import Dialog from "@/core/components/Dialog.vue";

const store = useStore()
const { getOpenLoginDialog: isOpenDialog, isLoggedIn, getUser } = mapGetters();

const isSubmitted = ref(false);
const isLoading = ref(false);

const { handleSubmit, errors, resetForm, setErrors, setFieldError } = useForm({
  validationSchema: validationLoginSchema,
  validateOnMount: false
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const validate = (e: Event) => {
  isSubmitted.value = true
  if (Object.keys(errors.value).length === 0) {
    onSubmit(e)
  }
}

const onSubmit = handleSubmit(async (vals) => {
  const data = { user: vals };
  isLoading.value = true
  logger.debug('Login Dialog execute onSubmit', data, 'src/components/dialog/LoginDialog.vue')
  const message = await store.dispatch(ActionEnums.LOGIN, data)
  isLoading.value = false
  if (message) {
    setFieldError('email', message)
    return
  }
  resetForm()
})

function closeDialog() {
  if (isLoading.value) return
  store.commit(MutationEnums.SET_LOGIN_DIALOG, false)
  isSubmitted.value = false
  resetForm()
}

function openDialog() {
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
}

const openRegisterDialog = () => {
  if (isLoading.value) return
  store.commit(MutationEnums.SET_REGISTER_DIALOG, true)
  closeDialog()
}

const openForgotPasswordDialog = () => {
  if (isLoading.value) return
  store.commit(MutationEnums.SET_FORGOT_PASSWORD_DIALOG, true)
  closeDialog()
}

</script>

<template>
  <Dialog
      :show="isOpenDialog"
      :closeDialog="closeDialog"
      classPanel="min-w-[400px] max-w-sm"
  >
    <template
        v-if="!isLoggedIn"
        v-slot:trigger
    >
      <Button
          @click="openDialog"
          class="px-8 h-[32px]"
      >Log In
      </Button>
    </template>

    <template v-slot:panel>
      <div class="flex flex-col gap-5">
        <div class="text-center">
          <h1 class="text-2xl mb-1 text-black">Welcome Back</h1>
          <p class="text-sm text-zinc-700 font-light">We're so excited to see you again!</p>
        </div>
        <div class="flex flex-col gap-5 ">
          <form @submit.prevent="validate" class="login-form">
            <Input
                :disabled="isLoading"
                classWrapper="mb-4"
                size="md"
                label="Email"
                v-model="email"
                :helper-text="isSubmitted ? errors.email : '' "
            />
            <Input
                :disabled="isLoading"
                classWrapper="mb-4"
                size="md"
                label="Password"
                v-model="password"
                type="password"
                :helper-text="isSubmitted ? errors.password : '' "
            />
            <div class=" flex justify-end">
              <p
                  @click="openForgotPasswordDialog"
                  class="text-sm mb-4 text-link"
              >Forgot password?</p>
            </div>
            <Button
                :isLoading="isLoading"
                radius="lg"
                class="w-full"
                size="md"
                v-on:submit.prevent="onSubmit"
            >
              Log in
            </Button>
          </form>
          <div class="flex justify-center text-sm">
            <p class="text-zinc-500 mr-1">New to Meepo?</p>
            <p
                @click="openRegisterDialog"
                class="text-link"
            >Sign up </p>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
