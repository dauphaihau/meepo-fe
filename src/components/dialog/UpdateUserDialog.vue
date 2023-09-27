<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate';

import Dialog from "@/core/components/Dialog.vue";
import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import { mapGetters } from "@/lib/map-state";
import { userAPI } from "@/apis/user";
import { XMarkIcon } from "@heroicons/vue/24/outline"
import { PhotoIcon } from "@heroicons/vue/24/outline"
import { commonAPI } from "@/apis/common";
import DateBirthInput from "@/components/DateBirthInput.vue";
import { IUser } from "@/types/user";
import { logger } from "@/core/helper";
import { MutationEnums } from "@/types/store/root";
import { useStore } from "@/store";
import { customToast } from "@/lib/custom-toast";

const emits = defineEmits<{(e: 'onUpdateProfile', value: Partial<IUser>)}>()
const { user } = defineProps<{user: IUser}>()
const { getUser } = mapGetters()
const store = useStore()

const showDialog = ref(false);
const isLoading = ref(false);
const name = ref(user.name);
const bio = ref(user.bio);
const location = ref(user.location);
const website = ref(user.website);
const dob = ref(user.dob);
const fileImage = ref(null)
const urlImage = ref(user.avatar_url)

const errorDate = ref('');

const onChangeImage = (e) => {
  fileImage.value = e.target.files[0]
  urlImage.value = URL.createObjectURL(e.target.files[0])
}

type Payload = {
  user: Partial<IUser>
}

const onSubmit = async () => {
  isLoading.value = true
  let payload: Payload = {
    user: {
      name: name.value,
      bio: bio.value,
      location: location.value,
      website: website.value,
    },
  };

  if (typeof dob.value === 'string') {
    payload.user.dob = dob.value
  }

  if (fileImage.value) {
    const { data } = await commonAPI.uploadImage(fileImage.value);
    logger.debug('execute postAPI.uploadImage', data, 'src/components/CreatePostForm.vue')
    if (data?.url) {
      payload.user.avatar_url = data.url
    } else {
      logger.error('error upload image')
      return
    }
  }

  const { status, data } = await userAPI.updateProfile(getUser.value.id, payload)
  isLoading.value = false
  if (status === 200) {
    customToast('Your profile was updated')
    emits('onUpdateProfile', data.user)
    store.commit(MutationEnums.SET_USER_INFO, data.user);
    closeDialog()
  }
}

function closeDialog() {
  showDialog.value = false
}

function openDialog() {
  showDialog.value = true
}

</script>

<template>

  <Dialog
      :show="showDialog"
      :closeDialog="closeDialog"
      classPanel="w-full min-w-[600px] min-h-[930px] max-h-[930px] relative px-0 py-0 mt-5 overflow-hidden"
      :hideCloseBtn="true"
  >
    <template v-slot:trigger>
      <Button @click="openDialog" variant="secondary">Edit Profile</Button>
    </template>


    <template v-slot:panel>
      <!--              Header ( Actions )-->
      <div class="px-4 absolute top-0 left-0 z-20 flex items-center h-[53px] w-full bg-white">
        <div class="flex-initial w-20">
          <XMarkIcon
              @click="closeDialog"
              class="text-black h-9 w-9 cursor-pointer hover:bg-zinc-100 rounded-full p-2"
          />
        </div>
        <h1 class="text-3xl text-black text-[20px] font-semibold flex-initial w-[29rem]">Edit Profile </h1>
        <Button
            :key="isLoading.toString()"
            :isLoading="isLoading"
            :disabledClick="!name"
            @click="onSubmit"
        >Save
        </Button>
      </div>

      <div class="mx-auto flex flex-col mt-12 pb-8">

        <!--                Background-->
        <div class="bg-zinc-300 h-[198px] mx-0.5 mt-1">
          <input
              type="file"
              name="file"
              id="file"
              accept="image/*"
              class="invisible h-[198px]"
          />
          <!--                      @change="set"-->
        </div>
        <div class="flex flex-col gap-5 px-6 -mt-12">
          <div class="flex flex-col gap-5">

            <!--                    Avatar-->
            <div class="mb-2 relative max-h-[112px] max-w-[112px] rounded-full ring-[5px] ring-white">
              <img
                  v-if="urlImage"
                  alt="preview-img"
                  :src="urlImage"
                  class='rounded-full h-[112px] w-[112px]'
              />
              <img
                  v-else
                  alt="preview-img"
                  src="@/assets/default-avatar.png"
                  class='rounded-full h-[112px] w-[112px]'
              />
              <input
                  type="file"
                  name="file"
                  id="file"
                  accept="image/*"
                  ref="imageInput"
                  class="hidden"
                  @change="onChangeImage"
              />

              <!-- @vue-ignore -->
              <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 bg-black opacity-60 rounded-full"
                  @click="$refs.imageInput.click()"
              >
                <PhotoIcon class="h-5 w-5 text-white"/>
              </div>
            </div>


            <!--                    Info profile-->
            <form v-on:keyup.enter.prevent="onSubmit" class="space-y-5">
              <Input
                  size="md"
                  label="Name"
                  v-model="name"
                  :disabled="isLoading"
              />
              <Input
                  label="Bio"
                  v-model="bio"
                  shape="textarea"
                  class="w-full"
                  classHelperText="text-zinc-500 text-[0.75rem]"
                  :helperText="bio ? `${bio.length}/160` : '0/160'"
                  maxlength="160"
                  :disabled="isLoading"
              />
              <DateBirthInput
                  :disabled="isLoading"
                  :helperText="errorDate"
                  classWrapper="mb-8"
                  label="Date of birth"
                  v-model="dob"
              />
              <Input
                  :disabled="isLoading"
                  size="md"
                  label="Location"
                  v-model="location"
              />
              <Input
                  :disabled="isLoading"
                  size="md"
                  label="Website"
                  v-model="website"
              />
            </form>
          </div>

        </div>
      </div>
    </template>
  </Dialog>

</template>
