<script setup lang="ts">
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

import Dialog from '@/core/components/Dialog.vue';
import Input from '@/core/components/forms/Input.vue';
import Button from '@/core/components/Button.vue';
import DateBirthInput from '@/components/DateBirthInput.vue';
import { useStore } from '@/store';
import { ActionEnums, MutationEnums } from '@/types/store/root';
import { logger } from '@/core/helper';
import { validationRegisterSchema } from '@/validations/user';
import { mapGetters } from '@/lib/map-state';

const store = useStore();
const router = useRouter();
const { getOpenRegisterDialog: isOpenDialog, isLoggedIn } = mapGetters();

const {
  handleSubmit, errors, resetForm, setFieldError,
} = useForm({
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
  isSubmitted.value = true;
  logger.debug('execute validate: errors', errors.value, 'src/components/dialog/RegisterDialog.vue');
  if (Object.keys(errors.value).length === 0) {
    onSubmit(e);
  }
};

const onSubmit = handleSubmit(async (values) => {
  const data = { user: values };
  isLoading.value = true;
  const message = await store.dispatch(ActionEnums.REGISTER, data);
  isLoading.value = false;
  if (message) {
    if (message.includes('username') && message.includes('email')) {
      setFieldError('username', 'Duplicate username');
      setFieldError('email', 'Duplicate email');
      return;
    }

    if (message.includes('username')) {
      setFieldError('username', message);
    }

    if (message.includes('email')) {
      setFieldError('email', message);
    }
    return;
  }
  router.push({ name: 'home' });
  resetForm();
});

const openLoginDialog = () => {
  if (isLoading.value) return;
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
  closeDialog();
};

function closeDialog() {
  if (isLoading.value) return;
  store.commit(MutationEnums.SET_REGISTER_DIALOG, false);
  errorDate.value = '';
  resetForm();
  isSubmitted.value = false;
}

function openDialog() {
  store.commit(MutationEnums.SET_REGISTER_DIALOG, true);
}

</script>

<template>
  <Dialog
    :show="isOpenDialog"
    :close-dialog="closeDialog"
    class-panel="md:min-w-[465px] md:max-w-[465px] md:mt-20"
  >
    <template
      v-if="!isLoggedIn"
      #trigger
    >
      <Button
        class="w-full"
        variant="secondary"
        @click="openDialog"
      >
        Sign Up
      </Button>
    </template>

    <template #panel>
      <div class="mx-auto flex flex-col gap-8">
        <div class="flex flex-col">
          <h1 class="text-2xl mb-4 text-black text-center">
            Create account
          </h1>
          <div class="flex flex-col gap-5">
            <form @submit.prevent="validate">
              <Input
                v-model="name"
                :disabled="isLoading"
                :helper-text="isSubmitted ? errors.name : '' "
                class-wrapper="mb-4"
                size="md"
                label="Name"
              />
              <Input
                v-model="username"
                :disabled="isLoading"
                :helper-text="isSubmitted ? errors.username : '' "
                class-wrapper="mb-4"
                size="md"
                label="Username"
              />
              <Input
                v-model="email"
                :disabled="isLoading"
                :helper-text="isSubmitted ? errors.email : '' "
                class-wrapper="mb-4"
                size="md"
                label="Email"
              />
              <Input
                v-model="password"
                :disabled="isLoading"
                :helper-text="isSubmitted ? errors.password : '' "
                type="password"
                class-wrapper="mb-4"
                size="md"
                label="Password"
              />
              <DateBirthInput
                v-model="dob"
                label="Date of birth"
                class-wrapper="mb-8"
                :helper-text="isSubmitted ? errors.dob : '' "
                :disabled="isLoading"
              />
              <Button
                :is-loading="isLoading"
                radius="lg"
                class="w-full"
                size="md"
                @submit.prevent="validate"
              >
                Sign Up
              </Button>
            </form>

            <div class="text-center">
              <span class="text-zinc-500 mr-1">Already have an account?</span>
              <span
                class="text-link"
                @click="openLoginDialog"
              >Login</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
