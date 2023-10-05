<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";

import Dialog from "@/core/components/Dialog.vue";
import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import DateBirthInput from "@/components/DateBirthInput.vue";
import { useStore } from "@/store";
import { ActionEnums, MutationEnums } from "@/types/store/root";
import { logger } from "@/core/helper";
import { validationRegisterSchema } from "@/lib/validations/user";
import { mapGetters } from "@/lib/map-state";

const store = useStore()
const router = useRouter()
const { getOpenRegisterDialog: isOpenDialog, isLoggedIn } = mapGetters()

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
const { value: dob } = useField<string>('dob');

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
  router.push({ name: 'home' })
  resetForm()
});

const openLoginDialog = () => {
  if (isLoading.value) return
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
  closeDialog()
}

function closeDialog() {
  if (isLoading.value) return
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
  <Dialog
      :show="isOpenDialog"
      :closeDialog="closeDialog"
      classPanel="md:min-w-[465px] md:max-w-[465px] md:mt-20"
  >
    <template
        v-if="!isLoggedIn"
        v-slot:trigger
    >
      <Button
          class="w-full"
          variant="secondary"
          @click="openDialog"
      >Sign Up
      </Button>
    </template>

    <template v-slot:panel>
      <div class="mx-auto flex flex-col gap-8">
        <div class="flex flex-col">
          <h1 class="text-2xl mb-4 text-black text-center">Create account</h1>
          <div class="flex flex-col gap-5">
            <form @submit.prevent="validate">
              <Input
                  :disabled="isLoading"
                  :helperText="isSubmitted ? errors.name : '' "
                  classWrapper="mb-4"
                  size="md"
                  label="Name"
                  v-model="name"
              />
              <Input
                  :disabled="isLoading"
                  :helperText="isSubmitted ? errors.username : '' "
                  classWrapper="mb-4"
                  size="md"
                  label="Username"
                  v-model="username"
              />
              <Input
                  :disabled="isLoading"
                  :helperText="isSubmitted ? errors.email : '' "
                  classWrapper="mb-4"
                  size="md"
                  label="Email"
                  v-model="email"
              />
              <Input
                  :disabled="isLoading"
                  :helperText="isSubmitted ? errors.password : '' "
                  type="password"
                  classWrapper="mb-4"
                  size="md"
                  label="Password"
                  v-model="password"
              />
              <DateBirthInput
                  v-model="dob"
                  label="Date of birth"
                  classWrapper="mb-8"
                  :helperText="isSubmitted ? errors.dob : '' "
                  :disabled="isLoading"
              />
              <Button
                  :isLoading="isLoading"
                  v-on:submit.prevent="validate"
                  radius="lg"
                  class="w-full"
                  size="md"
              >
                Sign Up
              </Button>
            </form>

            <div class="text-center">
              <span class="text-zinc-500 mr-1">Already have an account?</span>
              <span @click="openLoginDialog" class="text-link">Login</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
