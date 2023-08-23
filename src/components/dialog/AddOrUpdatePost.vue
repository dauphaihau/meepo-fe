<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUpdated } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot, } from '@headlessui/vue'
import { useRoute, useRouter } from "vue-router";
import { CalendarIcon, FaceSmileIcon, GifIcon, PhotoIcon, XMarkIcon } from "@heroicons/vue/24/outline"
import { toast } from "vue-sonner";

import Input from "@/core/components/forms/Input.vue";
import Button from "@/core/components/Button.vue";
import { postAPI } from "@/apis/post";
import SelectWhoCanComment from "@/components/SelectWhoCanComment.vue";
import { IPost, WHO_CAN_COMMENT } from "@/types/post";
import { useStore } from "@/store";
import { mapGetters } from "@/lib/map-state.ts";
import { MutationEnums } from "@/types/store/root";
import { logger } from "@/core/helper";
import { commonAPI } from "@/apis/common";

interface Props {
  showDialogFromProps?: boolean,
  hideTrigger?: boolean,
  dataPost?: IPost,
}

const { showDialogFromProps, hideTrigger, dataPost } = defineProps<Props>()

const store = useStore()
const router = useRouter()
const route = useRoute()

const { getAuthToken, isLoggedIn, getUser } = mapGetters()

const showDialog = ref(false);
const fileImage = ref(null)
const urlImage = ref(null)
const textareaRef = ref(null)
const content = ref('')
const whoCanComment = ref(0)
const currentRouteName = route.name

// error: Argument of type 'boolean' is not assignable to parameter of type 'object'.
// @ts-ignore
watch(showDialogFromProps, () => {
  content.value = dataPost?.content
  if (showDialogFromProps) {
    urlImage.value = dataPost.image_url
    whoCanComment.value = dataPost.who_can_comment_int ?? WHO_CAN_COMMENT.EVERYONE
    openDialog()
  }
}, { deep: true, immediate: true })

onMounted(() => {
  calcHeighTextarea()
})

type Payload = Partial<Pick<IPost, 'pin_status' | 'content' | 'image_url' | 'who_can_comment' | 'parent_id'>>

const createPost = async () => {

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  const payload: Payload = {
    content: content.value,
    parent_id: null
  }

  if (whoCanComment.value !== null) {
    payload.who_can_comment = whoCanComment.value
  }

  if (fileImage.value) {
    payload.image_url = await uploadImage()
  }

  logger.debug('execute postAPI.create', payload, 'src/components/dialog/AddOrUpdatePost.vue')
  const { status } = await postAPI.create(payload)

  if (status === 201) {
    toast('Your post was sent')
    if (currentRouteName !== 'post') {
      store.commit(MutationEnums.MUTATE_POSTS)
    }
    closeDialog()
  }
}

const updatePost = async () => {

  const payload: Payload = {
    content: content.value,
    image_url: urlImage.value,
    parent_id: dataPost.parent_id
  }

  if (whoCanComment.value !== null) {
    payload.who_can_comment = whoCanComment.value
  }

  if (fileImage.value) {
    payload.image_url = await uploadImage()
  }

  logger.debug('execute postAPI.update', payload, 'src/components/dialog/AddOrUpdatePost.vue')
  const { status } = await postAPI.update(dataPost.id, payload)
  if (status === 200) {
    toast('Your post was updated')
    store.commit(MutationEnums.MUTATE_POSTS)
    closeDialog()
  }

}

const uploadImage = async () => {
  const responseUploadImage = await commonAPI.uploadImage(fileImage.value);
  logger.debug('execute postAPI.uploadImage', responseUploadImage, 'src/components/CreatePostForm.vue')
  if (responseUploadImage?.data?.url) {
    return responseUploadImage.data.url
  } else {
    logger.error('error upload image')
    return
  }

}

const deleteImage = () => {
  urlImage.value = null
  fileImage.value = null
}

const onChangeSelect = (val) => {
  whoCanComment.value = val.value
}

const onChangeImage = (e) => {
  fileImage.value = e.target.files[0]
  urlImage.value = URL.createObjectURL(e.target.files[0])
}

function closeDialog() {
  showDialog.value = false
  if (!dataPost) {
    fileImage.value = null
    content.value = ''
    urlImage.value = null
  }
}

function openDialog() {
  showDialog.value = true
}

function calcHeighTextarea() {
  if (textareaRef && textareaRef?.value) {
    textareaRef.value.style.height = "auto";

    let rangeVp = 70
    const innerHeightViewPort = window.innerHeight * rangeVp / 100

    nextTick(() => {
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
      if (textareaRef.value.scrollHeight > innerHeightViewPort) {
        textareaRef.value.style.height = innerHeightViewPort + 'px';
        return
      }
    })
  }

}

watch(content, () => {
  calcHeighTextarea()
})

</script>


<template>
  <Button v-if="!hideTrigger" size="md" class="w-2/3" @click="openDialog">Post</Button>

  <textarea
      ref="textareaRef"
      v-model="content"
      class="hidden"
  />

  <TransitionRoot appear :show="showDialog" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-40">
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

      <div class="fixed inset-0 overflow-y-auto ">
        <!--        <div class="flex min-h-full items-center justify-center p-4 text-center">-->


        <!--        <div class="flex min-h-full items-center justify-center text-center  min-w-[600px] min-h-[90vh] relative top-[5%]">-->
        <div class="flex justify-center text-center  min-w-[600px]  mt-20">
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
                class="w-full max-w-[600px] max-h-[90vh] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all relative"
            >

              <!--              Header ( Actions )-->
              <div class="px-4 absolute top-0 left-0 z-20 bg-white rounded-2xl grid grid-cols-8 items-center h-[53px] w-full">
                <XMarkIcon
                    @click="closeDialog"
                    class="text-black h-9 w-9 cursor-pointer col-span-1 hover:bg-gray-100 rounded-full p-2 animate"
                />
              </div>


              <div class=" mt-12 px-4">
                <div class="flex flex-row h-full">
                  <!--         Avatar-->
                  <div class="mr-4 mt-2 basis-11 h-full">
                    <div v-if="getUser.avatar_url" class="h-full mt-[11px]">
                      <img
                          @click="router.push('/user/' + getUser.username)"
                          v-bind:src="getUser.avatar_url"
                          class="rounded-full h-10 w-10 bg-black cursor-pointer"
                          alt="avatar"
                      />
                    </div>
                    <div v-else class="rounded-full h-10 w-10 bg-black"/>
                  </div>

                  <!--        Input -->
                  <div class="w-full max-h-[81vh]">
                    <div class="flex flex-col gap-1 bg-white col-span-10 h-full">
                      <div class="sm:col-span-4 ">
                        <div class="mt-2 flex ">
                          <textarea
                              ref="textareaRef"
                              v-model="content"
                              id="content"
                              name="content"
                              class="textarea-input"
                              placeholder="Write your content"
                          />

                        </div>
                        <div class="relative" v-if="urlImage">
                          <img alt="preview-img" :src="urlImage" class="h-auto w-full rounded-xl"/>
                          <div class="rounded-full bg-black opacity-70 w-fit p-1 absolute top-2 right-2 hover:opacity-50 transition ease-out duration-300">
                            <XMarkIcon @click="deleteImage" class="text-gray-500 h-5 w-5 cursor-pointer text-white"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>

                <div>
                  <SelectWhoCanComment :defaultValue="whoCanComment" @update:modelValue="onChangeSelect"/>
                  <div class="border-b my-4"/>
                  <!--     Toolbar input     -->
                  <div class="flex items-center justify-between gap-x-6 mb-2 w-full">
                    <div class="flex items-center gap-1.5">

                      <!-- @vue-ignore -->
                      <PhotoIcon @click="$refs.file.click()" class="icon-btn"/>
                      <input
                          type="file"
                          name="file"
                          id="file"
                          ref="file"
                          @change="onChangeImage"
                          class="hidden"
                      />
                      <!--                    class="invisible"-->

                      <GifIcon class="icon-btn"/>
                      <FaceSmileIcon class="icon-btn"/>
                      <CalendarIcon class="icon-btn"/>

                    </div>

                    <div>
                      <!--                      <Button v-if="isEditing" class="button" @click="updatePost">Update</Button>-->
                      <Button v-if="dataPost" class="button" @click="updatePost">Update</Button>
                      <Button v-else :disabled="!content" @click.prevent="createPost">Post</Button>
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


<style scoped>

.textarea-input {
  @apply resize-none block flex-1  bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-500
  focus:ring-0 focus:outline-none sm:text-sm lg:text-xl sm:leading-6;
  max-height: 100%;
}

.icon-btn {
  @apply flex items-center justify-center hover:bg-zinc-100 p-2 rounded-full mx-auto h-9 w-9 text-gray-500 cursor-pointer
}

</style>
