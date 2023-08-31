<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate';
import { Form } from 'vee-validate';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'

import { useStore } from "@/store";
import { ActionEnums, MutationEnums } from "@/types/store/root";
import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import { logger } from "@/core/helper";
import { validationLoginSchema } from "@/lib/validations/auth";
import { mapGetters } from "@/lib/map-state";

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
  logger.debug('execute validate: errors', errors.value, 'src/components/dialog/RegisterDialog.vue')
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
});

function closeDialog() {
  store.commit(MutationEnums.SET_LOGIN_DIALOG, false)
  resetForm()
}

function openDialog() {
  console.log('dauphaihau debug: open dialog')
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
}

const openRegisterDialog = () => {
  store.commit(MutationEnums.SET_REGISTER_DIALOG, true)
  closeDialog()
}

</script>


<template>
  <Button
      v-if="!isLoggedIn"
      @click="openDialog"
      class="px-8 h-[32px]"
  >
    Log In
  </Button>

  <TransitionRoot appear :show="isOpenDialog" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-50">
      <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25"/>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
          >
            <DialogPanel
                class="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white py-6 px-8 text-left shadow-xl transition-all"
            >
              <div class="mx-auto flex flex-col">
                <div class="flex flex-col gap-5 block bg-white">
                  <div class="text-center">
                    <h1 class="text-2xl mb-1 text-black">Welcome Back</h1>
                    <p class="text-sm text-gray-700 font-light">We're so excited to see you again!</p>
                  </div>
                  <div class="flex flex-col gap-5  block bg-white">
                    <form @submit.prevent="validate" class="login-form">
                      <Input
                          :disabled="isLoading"
                          classWrapper="mb-4"
                          size="md"
                          label="Email"
                          v-model="email"
                          :helper-text=" isSubmitted ? errors.email : '' "
                      />
                      <Input
                          :disabled="isLoading"
                          classWrapper="mb-4"
                          size="md"
                          label="Password"
                          v-model="password"
                          type="password"
                          :helper-text=" isSubmitted ? errors.password : '' "
                      />
                      <div class=" flex justify-end">
                        <p
                            v-tooltip="'Not available'"
                            class="text-sm mb-4 underline underline-offset-2 text-gray-700 cursor-pointer"
                        > Forgot
                          password? </p>
                      </div>
                      <Button
                          :key="isLoading.toString()"
                          :isLoading="isLoading"
                          radius="lg" class="w-full" size="md" v-on:submit.prevent="onSubmit"
                      >
                        Log in
                      </Button>
                    </form>
                    <div class="text-center">
                      <span class="text-[#787c7d] font-light mr-1">New to Meepo?</span>
                      <span
                          @click="openRegisterDialog"
                          class="hover:underline hover:underline-offset-2 cursor-pointer"
                      >Sign up </span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
