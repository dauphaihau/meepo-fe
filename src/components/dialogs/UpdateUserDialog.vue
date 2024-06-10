<script setup lang="ts">
import { StatusCodes } from 'http-status-codes';
import { XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline';
import { $ref } from 'unplugin-vue-macros/macros';

import Dialog from '@core/components/Dialog.vue';
import Input from '@core/components/forms/Input.vue';
import Button from '@core/components/Button.vue';
import { useUpdateProfile } from '@services/user.ts';
import { useUploadImage } from '@services/common.ts';
import DateBirthInput from '@components/DateBirthInput.vue';
import { IRequestDataUpdateProfile, IUser } from '@/types/user.ts';
import { useDialogStore } from '@stores/dialog.ts';
import { useAuthStore } from '@stores/auth.ts';
import { useNotificationStore } from '@stores/notification.ts';
import { logger } from '@core/helpers/logger.ts';
import FormGroup from '@core/components/forms/FormGroup.vue';
import Textarea from '@core/components/forms/Textarea.vue';

const { user: currentUser } = useAuthStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const user = dialogStore.data as IUser;

const {
  mutateAsync: updateProfile,
} = useUpdateProfile(currentUser.id);

const {
  mutateAsync: uploadImage,
} = useUploadImage();

let isLoadingSubmit = $ref(false);
const name = $ref(user?.name ?? '');
const bio = $ref(user?.bio ?? '');
const location = $ref(user?.location ?? '');
const website = $ref(user?.website ?? '');
const dob = $ref(user?.dob);
let fileImage = $ref<File | null>(null);
let urlImage = $ref(user?.avatar_url);

const errorDate = ref('');

const onChangeImage = ({ target }: Event) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  fileImage = target.files[0];
  urlImage = URL.createObjectURL(target.files[0]);
};

const onSubmit = async () => {
  const payload: IRequestDataUpdateProfile = {
    name,
    bio,
    location,
    website,
  };

  if (typeof dob === 'string') {
    payload.dob = dob;
  }

  isLoadingSubmit = true;

  if (fileImage) {
    const url = await handleUploadImage();
    if (url) payload.avatar_url = url;
  }

  const { status, data } = await updateProfile(payload);
  isLoadingSubmit = false;

  switch (status) {
    case StatusCodes.OK:
      closeDialog();
      authStore.user = data.user;
      notificationStore.notify({
        text: 'Your profile was updated',
      });
      break;
    default:
      notificationStore.notify({
        text: 'Something wrong',
      });
  }
};

const handleUploadImage = async (): Promise<string | undefined> => {
  const { data } = await uploadImage(fileImage);
  logger.debug('execute handleUploadImage', data, 'src/components/dialogs/UpdateUserDialog.vue');
  if (data?.url) {
    return data.url;
  }
  logger.error('error upload image', 'src/components/dialogs/UpdateUserDialog.vue');
};

function closeDialog() {
  dialogStore.close();
}

</script>

<template>
  <Dialog
    :show="dialogStore.showDialog === 'update-profile'"
    :close="closeDialog"
    class-panel="
        md:min-w-[600px] md:max-w-[600px]
        md:min-h-[930px] md:max-h-[930px]
        relative overflow-hidden
        p-0 mt-0 md:mt-5
      "
  >
    <template #panel>
      <!--              Header ( Actions )-->
      <div class="px-4 absolute top-0 left-0 z-20 flex items-center h-[53px] w-full bg-white">
        <div class="flex-initial w-20">
          <XMarkIcon
            class="text-black h-9 w-9 cursor-pointer hover:bg-zinc-100 rounded-full p-2"
            @click="closeDialog"
          />
        </div>
        <h1 class="text-[15px] md:text-[20px] text-black  font-semibold flex-initial w-[29rem]">
          Edit Profile
        </h1>
        <Button
          classes="h-[32px]"
          :loading="isLoadingSubmit"
          :disabled="!name"
          @click="onSubmit"
        >
          Save
        </Button>
      </div>

      <div class="mx-auto flex flex-col mt-12 pb-8">
        <!--                Background-->
        <div class="bg-zinc-300 h-32 md:h-[198px] mx-0.5 mt-1">
          <input
            id="file"
            type="file"
            name="file"
            accept="image/*"
            class="invisible md:h-[198px]"
          >
        </div>
        <div class="flex flex-col gap-5 px-6 -mt-12">
          <div class="flex flex-col gap-5">
            <!-- Avatar-->
            <div class="mb-2 relative max-h-[81.5px] max-w-[81.5px] md:max-h-[112px] md:max-w-[112px] rounded-full ring-[5px] ring-white">
              <img
                v-if="urlImage"
                alt="preview-img"
                :src="urlImage"
                class="avatar"
              >
              <img
                v-else
                alt="preview-img"
                src="@/assets/default-avatar.png"
                class="avatar"
              >
              <input
                id="file"
                ref="imageInput"
                type="file"
                name="file"
                :disabled="isLoadingSubmit"
                accept="image/*"
                class="hidden"
                @change="onChangeImage"
              >

              <!-- @vue-ignore -->
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 bg-black opacity-60 rounded-full"
                @click="$refs.imageInput.click()"
              >
                <PhotoIcon class="h-5 w-5 text-white" />
              </div>
            </div>

            <!-- Info profile -->
            <form
              class="space-y-5"
              @keyup.enter.prevent="onSubmit"
            >
              <FormGroup label="Name">
                <Input
                  v-model="name"
                  :disabled="isLoadingSubmit"
                  size="md"
                />
              </FormGroup>

              <FormGroup
                label="Bio"
                :help="`${bio.length}/160`"
              >
                <Textarea
                  v-model="bio"
                  maxlength="160"
                  :disabled="isLoadingSubmit"
                />
              </FormGroup>

              <FormGroup
                class="mb-6"
                :error="errorDate"
                label="Date of birth"
                description="Month, Day and Year"
              >
                <DateBirthInput
                  v-model="dob"
                  :disabled="isLoadingSubmit"
                  class-wrapper="mb-8 md:w-[400px]"
                />
              </FormGroup>
              <FormGroup
                label="Location"
              >
                <Input
                  v-model="location"
                  :disabled="isLoadingSubmit"
                  size="md"
                />
              </FormGroup>
              <FormGroup
                label="Website"
              >
                <Input
                  v-model="website"
                  :disabled="isLoadingSubmit"
                  size="md"
                />
              </FormGroup>
            </form>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>

.avatar {
  @apply rounded-full h-[81.5px] w-[81.5px] md:h-[112px] md:w-[112px];
}

</style>
