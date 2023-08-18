<script setup lang="ts">
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useField, useForm } from "vee-validate";

import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import DateBirthInput from "@/components/DateBirthInput.vue";
import { useStore } from "@/store";
import { ActionEnums, MutationEnums } from "@/types/store/root";
import { logger } from "@/core/helper";
import { validationRegisterSchema } from "@/lib/validations/auth";
import { mapGetters } from "@/lib/map-state";

const store = useStore()
const { getOpenRegisterDialog: isOpenDialog } = mapGetters()

const { handleSubmit, errors, resetForm, setFieldError, values } = useForm({
  validationSchema: validationRegisterSchema,
  validateOnMount: false,
});

const errorDate = ref('');
const isSubmitted = ref(false);
const isLoading = ref(false);

const { value: name } = useField<string>('name');
const { value: username } = useField<string>('username');
const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');
const { value: dob } = useField('dob');

const validate = (e: Event) => {
  isSubmitted.value = true
  logger.debug('execute validate: errors', errors.value, 'src/components/dialog/RegisterDialog.vue')
  if (Object.keys(errors.value).length === 0) {
    onSubmit(e)
  }
}

const onSubmit = handleSubmit(async (values) => {
  const data = { user: values };
  isLoading.value = true
  logger.debug('RegisterDialog execute onSubmit', data, 'src/components/dialog/RegisterDialog.vue')
  const message = await store.dispatch(ActionEnums.REGISTER, data)
  isLoading.value = false
  if (message) {
    if (message.includes('username') && message.includes('email')) {
      setFieldError('username', 'Duplicate username')
      setFieldError('email', 'Duplicate email')
      return
    }

    if (message.includes('username')) {
      setFieldError('username', message)
    }

    if (message.includes('email')) {
      setFieldError('email', message)
    }
    return
  }
  resetForm()
});

const openLoginDialog = () => {
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
  closeDialog()
}

function closeDialog() {
  store.commit(MutationEnums.SET_REGISTER_DIALOG, false)
  errorDate.value = ''
  resetForm()
  isSubmitted.value = false
}

function openDialog() {
  store.commit(MutationEnums.SET_REGISTER_DIALOG, true)
}

</script>


<template>
  <div class="ml-3">
    <button
        type="button"
        @click="openDialog"
        class="rounded-full bg-black px-8 py-1.5  text-sm font-semibold text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Sign Up
    </button>
  </div>


  <TransitionRoot appear :show="isOpenDialog" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-10">
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
            <DialogPanel class="w-full max-w-[480px] transform rounded-2xl bg-white py-6 px-10 text-left align-middle shadow-xl transition-all">
              <div class="mx-auto flex flex-col gap-8">
                <div class="flex flex-col bg-white">
                  <h1 class="text-2xl mb-4 text-black text-center">Create an account</h1>
                  <div class="flex flex-col gap-5 bg-white">
                    <form @submit.prevent="validate" class="login-form">
                      <Input
                          :disabled="isLoading"
                          :helper-text="isSubmitted ? errors.name : '' "
                          classWrapper="mb-4" size="md" label="Name" v-model="name"
                      />
                      <Input
                          :disabled="isLoading"
                          :helper-text="isSubmitted ? errors.username : '' "
                          classWrapper="mb-4" size="md" label="Username" v-model="username"
                      />
                      <Input
                          :disabled="isLoading"
                          :helper-text="isSubmitted ? errors.email : '' "
                          classWrapper="mb-4" size="md" label="Email" v-model="email"
                      />
                      <Input
                          :disabled="isLoading"
                          :helper-text="isSubmitted ? errors.password : '' "
                          type="password"
                          classWrapper="mb-4" size="md" label="Password" v-model="password"
                      />
                      <DateBirthInput
                          v-model="dob"
                          label="Date of birth"
                          classWrapper="mb-8"
                          :helperText="isSubmitted ? errors.dob : '' "
                      />
                      <Button :disabled="isLoading" v-on:submit.prevent="validate" radius="lg" class="w-full" size="md">
                        Sign Up
                      </Button>
                    </form>

                    <div class="text-center">
                      <span class="text-[#787c7d] font-light mr-1">Already have an account?</span>
                      <span @click="openLoginDialog" class="hover:underline hover:underline-offset-2 cursor-pointer">Login</span>
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
