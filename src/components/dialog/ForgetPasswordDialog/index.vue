<script setup lang="ts">
import { ref, watch } from 'vue';

import { useStore } from '@/store';
import { MutationEnums } from '@/types/store/root';
import { mapGetters } from '@/lib/map-state';
import Dialog from '@/core/components/Dialog.vue';
import RequestInfoUser from '@components/dialog/ForgetPasswordDialog/RequestInfoUser.vue';
import VerifyCode from '@components/dialog/ForgetPasswordDialog/VerifyCode.vue';
import ResetPassword from '@components/dialog/ForgetPasswordDialog/ResetPassword.vue';
import Success from '@components/dialog/ForgetPasswordDialog/Success.vue';

const store = useStore();
const { getOpenForgotPasswordDialog: isOpenDialog } = mapGetters();

const token = ref('');
const currentStep = ref(0);

const openLoginDialog = () => {
  store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
  closeDialog();
};

function closeDialog() {
  store.commit(MutationEnums.SET_FORGOT_PASSWORD_DIALOG, false);
}

function changeStep(value) {
  if (value) {
    token.value = value;
  }
  currentStep.value++;
}

watch(isOpenDialog, (value) => {
  if (value) {
    currentStep.value = 0;
  }
});

</script>

<template>
  <Dialog
    :show="isOpenDialog"
    :close-dialog="closeDialog"
    class-panel="md:max-w-[480px] md:mt-20 transform bg-white py-6 px-10 flex flex-col justify-center"
  >
    <template #panel>
      <div class="flex flex-col bg-white">
        <RequestInfoUser
          v-if="currentStep === 0"
          @change-step="changeStep"
        />
        <VerifyCode
          v-if="currentStep === 1"
          @change-step="changeStep"
        />
        <ResetPassword
          v-if="currentStep === 2"
          :token="token"
          @change-step="changeStep"
        />
        <Success
          v-if="currentStep === 3"
          @close-dialog="closeDialog"
        />

        <div
          v-if="currentStep === 0"
          class="text-center mt-4"
        >
          <span class="text-zinc-500 mr-1">Already have an account?</span>
          <span
            class="text-link"
            @click="openLoginDialog"
          >Login</span>
        </div>
      </div>
    </template>
  </Dialog>
</template>
