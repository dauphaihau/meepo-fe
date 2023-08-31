<script setup lang="ts">
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { Form } from 'vee-validate';
import dayjs from 'dayjs';

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
import { toast } from "vue-sonner";
import { MutationEnums } from "@/types/store/root";
import { useStore } from "@/store";

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
    toast('Your profile was updated')
    dob.value = dayjs(data.user.dob).format('DD MMMM YYYY')
    emits('onUpdateProfile', data.user)
    store.commit(MutationEnums.SET_USER_INFO, data.user);
    closeModal()
  }
}

function closeModal() {
  showDialog.value = false
}

function openModal() {
  showDialog.value = true
}

</script>


<template>

  <Button @click="openModal" variant="secondary">Edit Profile</Button>

  <TransitionRoot appear :show="showDialog" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-40">
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
        <div class="flex min-h-full items-center justify-center text-center">
          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-[600px] max-h-[930px] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all relative">
              <!--              Header ( Actions )-->
              <div class="px-4 absolute top-0 left-0 z-20 flex items-center h-[53px] w-full">
                <div class="flex-initial w-20">
                  <XMarkIcon
                      @click="closeModal"
                      class="text-black h-9 w-9 cursor-pointer hover:bg-zinc-100 rounded-full p-2"
                  />
                </div>
                <h1 class="text-3xl text-black text-[20px] font-semibold flex-initial w-[29rem]">Edit Profile </h1>
                <Button
                    :key="isLoading.toString()"
                    :isLoading="isLoading"
                    :disabled="!name"
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
                      class="invisible h-[198px]"
                  />
                  <!--                      @change="set"-->
                </div>
                <div class="flex flex-col gap-5 px-6 -mt-12">
                  <div class="flex flex-col gap-5">

                    <!--                    Avatar-->
                    <div class="mb-2 relative h-[112px] w-[112px] rounded-full ring-[5px] ring-white">
                      <img
                          v-if="urlImage"
                          alt="preview-img"
                          :src="urlImage"
                          class='rounded-full'
                      />
                      <img
                          v-else
                          alt="preview-img"
                          src="@/assets/default-avatar.png"
                          class='rounded-full'
                      />
                      <input
                          type="file"
                          name="file"
                          id="file"
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
                      <Input size="md" label="Name" v-model="name"/>
                      <Input label="Bio" v-model="bio" shape="textarea" class="w-full"/>
                      <DateBirthInput
                          :helperText="errorDate"
                          classWrapper="mb-8"
                          label="Date of birth"
                          v-model="dob"
                      />
                      <Input size="md" label="Location" v-model="location"/>
                      <Input size="md" label="Website" v-model="website"/>
                    </form>
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
