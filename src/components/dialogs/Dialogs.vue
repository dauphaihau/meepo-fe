<script setup lang="ts">
import LoginDialog from '@components/dialogs/LoginDialog.vue';
import RegisterDialog from '@components/dialogs/RegisterDialog.vue';
import ForgotPasswordDialog from '@components/dialogs/ForgetPasswordDialog/index.vue';
import UpdateUserDialog from '@components/dialogs/UpdateUserDialog.vue';
import { useDialogStore } from '@stores/dialog.ts';
import ReplyPostDialog from '@components/dialogs/ReplyPostDialog.vue';
import UpdatePostDialog from '@components/dialogs/UpdatePostDialog.vue';
import CreatePostDialog from '@components/dialogs/CreatePostDialog.vue';

const dialogStore = useDialogStore();

</script>

<template>
  <LoginDialog />
  <RegisterDialog />
  <ForgotPasswordDialog />
  <CreatePostDialog />

  <div v-if="dialogStore.data">
    <UpdatePostDialog />
    <ReplyPostDialog />
    <UpdateUserDialog />
  </div>
</template>

<style scoped>

</style>
