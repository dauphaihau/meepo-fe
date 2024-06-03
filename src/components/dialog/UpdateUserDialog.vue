<script setup lang="ts">
import { ref } from 'vue';
import { Form } from 'vee-validate';

import Dialog from '@/core/components/Dialog.vue';
import Input from '@/core/components/forms/Input.vue';
import Button from '@/core/components/Button.vue';
import { mapGetters } from '@/lib/map-state';
import { userService } from '@/services/user';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { PhotoIcon } from '@heroicons/vue/24/outline';
import { commonService } from '@/services/common';
import DateBirthInput from '@/components/DateBirthInput.vue';
import { IUser } from '@/types/user';
import { logger } from '@/core/helper';
import { MutationEnums } from '@/types/store/root';
import { useStore } from '@/store';

const emits = defineEmits<{(e: 'onUpdateProfile', value: Partial<IUser>)}>();
const { user } = defineProps<{user: IUser}>();
const { getUser } = mapGetters();
const store = useStore();

const showDialog = ref(false);
const isLoading = ref(false);
const name = ref(user.name);
const bio = ref(user.bio);
const location = ref(user.location);
const website = ref(user.website);
const dob = ref(user.dob);
const fileImage = ref(null);
const urlImage = ref(user.avatar_url);

const errorDate = ref('');

const onChangeImage = (e) => {
  fileImage.value = e.target.files[0];
  urlImage.value = URL.createObjectURL(e.target.files[0]);
};

type Payload = {
  user: Partial<IUser>
}

const onSubmit = async () => {
  isLoading.value = true;
  let payload: Payload = {
    user: {
      name: name.value,
      bio: bio.value,
      location: location.value,
      website: website.value,
    },
  };

  if (typeof dob.value === 'string') {
    payload.user.dob = dob.value;
  }

  if (fileImage.value) {
    const { data } = await commonService.uploadImage(fileImage.value);
    logger.debug('execute postAPI.uploadImage', data, 'src/components/CreatePostForm.vue');
    if (data?.url) {
      payload.user.avatar_url = data.url;
    }
    else {
      logger.error('error upload image');
      return;
    }
  }

  const { status, data } = await userService.updateProfile(getUser.value.id, payload);
  isLoading.value = false;
  if (status === 200) {
    store.commit(MutationEnums.SHOW_TOAST, {
      message: 'Your profile was updated',
    });
    emits('onUpdateProfile', data.user);
    store.commit(MutationEnums.SET_USER_INFO, data.user);
    closeDialog();
  }
};

function closeDialog() {
  showDialog.value = false;
}

function openDialog() {
  showDialog.value = true;
}

</script>

<template>
  <Dialog
    :show="showDialog"
    :close-dialog="closeDialog"
    :hide-close-btn="true"
    class-panel="
        md:min-w-[600px] md:max-w-[600px]
        md:min-h-[930px] md:max-h-[930px]
        relative overflow-hidden
        p-0 mt-0 md:mt-5
      "
  >
    <!--    <div class="overscroll-y-none"></div>-->
    <template #trigger>
      <Button
        variant="secondary"
        @click="openDialog"
      >
        Edit Profile
      </Button>
    </template>


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
          :key="isLoading.toString()"
          classes="h-[32px]"
          :is-loading="isLoading"
          :disabled-click="!name"
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
          <!--                      @change="set"-->
        </div>
        <div class="flex flex-col gap-5 px-6 -mt-12">
          <div class="flex flex-col gap-5">
            <!--                    Avatar-->
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

            <!--                    Info profile-->
            <form
              class="space-y-5"
              @keyup.enter.prevent="onSubmit"
            >
              <Input
                v-model="name"
                size="md"
                label="Name"
                :disabled="isLoading"
              />
              <Input
                v-model="bio"
                label="Bio"
                shape="textarea"
                class="w-full"
                class-helper-text="text-zinc-500 text-[0.75rem]"
                :helper-text="bio ? `${bio.length}/160` : '0/160'"
                maxlength="160"
                :disabled="isLoading"
              />
              <DateBirthInput
                v-model="dob"
                :disabled="isLoading"
                :helper-text="errorDate"
                class-wrapper="mb-8 md:w-[400px]"
                label="Date of birth"
              />
              <Input
                v-model="location"
                :disabled="isLoading"
                size="md"
                label="Location"
              />
              <Input
                v-model="website"
                :disabled="isLoading"
                size="md"
                label="Website"
              />
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
