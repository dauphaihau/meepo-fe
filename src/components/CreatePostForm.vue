<template>
  <!--  <div class="relative z-20">-->
  <div class="">
    <div
        class="flex flex-row px-4 border-t"
        :class="{'pt-3': currentRouteName==='home', 'py-3': currentRouteName==='post'}"
    >
      <!--         Avatar-->
      <div class="mr-4 mt-2 basis-11 h-full">
        <div
            class="h-full "
        >
          <img
              v-if="getUser.avatar_url"
              @click="router.push('/user/' + getUser.username)"
              v-bind:src="getUser.avatar_url"
              class="rounded-full h-10 w-10 bg-black cursor-pointer"
              alt="avatar"
          />
          <img
              v-else
              @click="router.push('/user/' + getUser.username)"
              src="@/assets/default-avatar.png"
              class="rounded-full h-10 w-10 bg-black cursor-pointer"
              alt="avatar"
          />
        </div>
      </div>

      <!--        Input -->
      <div class="w-full max-h-[81vh] h-fit">
        <div class="flex flex-col gap-1 bg-white col-span-10 h-full">
          <div class="">
            <div class="mt-2 flex ">

              <!--                <span class="flex select-none items-center pl-3 text-zinc-500 sm:text-sm"></span>-->

              <!--                    @focusout="onFocusOut"-->
              <textarea
                  @focus="onFocus"
                  v-model="content"
                  id="content"
                  ref="textareaRef"
                  name="content"
                  :rows="isFocus ? 2 : 0"
                  class="textarea-input "
                  placeholder="Write your content"
              />
              <!--                    :class="isFocus ? 'h-auto': 'h-[28px] overscroll-y-none'"-->


              <div v-if="!isFocus && currentRouteName === 'post'">
                <Button classes="px-6" disabledClick @click.prevent="createPost">Post</Button>
              </div>

            </div>
            <div class="relative" v-if="urlImage">
              <img alt="preview-img" :src="urlImage" class="h-auto w-full rounded-xl"/>
              <div class="rounded-full bg-black opacity-70 w-fit p-1 absolute top-2 right-2 hover:opacity-50 transition ease-out duration-300">
                <XMarkIcon @click="deleteImage" class="h-5 w-5 cursor-pointer text-white"/>
              </div>
            </div>
          </div>
          <SelectWhoCanComment
              class="relative z-[2]"
              @update:modelValue="onChangeSelect"
              v-if="currentRouteName === 'home' && isFocus"
          />
        </div>
      </div>

    </div>

    <!--     Toolbar + submit btn     -->
    <div v-if="isFocus || currentRouteName === 'home'" class="pl-[70px] pr-6 border-b">
      <div
          class="flex items-center justify-between gap-x-6 mb-2 w-full pt-2"
          :class="{'border-t': isFocus && currentRouteName === 'home'}"
      >
        <div class="flex-center">
          <div class="flex items-center gap-1.5">
            <!-- @vue-ignore -->
            <PhotoIcon @click="$refs.fileInput.click()" class="icon-btn"/>
            <input
                type="file"
                name="file"
                id="file"
                ref="fileInput"
                @change="onChangeImage"
                class="hidden"
            />

            <GifIcon class="icon-btn" v-tooltip="'Not available'"/>
            <FaceSmileIcon class="icon-btn" v-tooltip="'Not available'"/>
            <CalendarIcon class="icon-btn" v-tooltip="'Not available'"/>

          </div>

        </div>

        <Button
            classes="px-6"
            :isLoading="isLoading"
            :disabledClick="!content && !fileImage"
            @click.prevent="createPost"
        >Post
        </Button>
      </div>
    </div>
  </div>
</template>


<script setup lang="tsx">
import { defineComponent, h, markRaw, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { PhotoIcon, XMarkIcon, GifIcon, CalendarIcon, FaceSmileIcon } from "@heroicons/vue/24/outline"

import { postAPI } from '@/apis/post'
import { mapGetters } from "@/lib/map-state";
import Button from "@/core/components/Button.vue";
import SelectWhoCanComment from "@/components/SelectWhoCanComment.vue";
import { IPost } from "@/types/post";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { logger } from "@/core/helper";
import { commonAPI } from "@/apis/common";
import { customToast } from "@/lib/custom-toast";
import { toast } from "vue-sonner";

const store = useStore()
const route = useRoute()
const router = useRouter()

const emit = defineEmits<{(e: 'onCreatePost'): void}>()

const content = ref('')
const post_id = ref(0)
const fileInput = ref(null)
const isFocus = ref(false)
const isLoading = ref(false)
const whoCanComment = ref(null)
const textareaRef = ref(null)
const fileImage = ref(null)
const urlImage = ref(null)

const currentPath = route.path
const currentRouteName = route.name

const { isLoggedIn, getUser } = mapGetters()

const onChangeImage = (e) => {
  fileImage.value = e.target.files[0]
  urlImage.value = URL.createObjectURL(e.target.files[0])
}

type Payload = Partial<Pick<IPost, 'pin_status' | 'content' | 'image_url' | 'who_can_comment' | 'parent_id'>>

const createPost = async () => {

  if (isLoading.value) return

  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  isLoading.value = true

  const payload: Payload = {
    content: content.value,
    parent_id: null
  }

  if (whoCanComment.value !== null) {
    payload.who_can_comment = whoCanComment.value
  }

  if (fileImage.value) {
    const { data } = await commonAPI.uploadImage(fileImage.value);
    logger.debug('execute postAPI.uploadImage', data, 'src/components/CreatePostForm.vue')
    if (data?.url) {
      payload.image_url = data.url
    } else {
      logger.error('error upload image')
      return
    }
  }

  if (currentRouteName === 'post') {
    payload.parent_id = Number(route.params.id)
  }

  logger.debug('execute postAPI.create', payload, 'src/components/CreatePostForm.vue')
  const { status, data } = await postAPI.create(payload)

  isLoading.value = false

  if (status === 201) {
    if (!data.post || !data.post.id) {
      logger.error('response from postAPI.create, post id is null', 'src/components/CreatePostForm.vue')
    }
    customToast(
        `Your post was sent.${currentRouteName === 'home' ? ' You have 1 hour to make any edits.' : ''}`,
        {
          onClickBtn: () => router.push({ name: 'post', params: { id: data.post.id } }),
        }
    )
    emit('onCreatePost')
    content.value = ''
    fileImage.value = null
    urlImage.value = null
    post_id.value = 0;
  }

}

const onChangeSelect = (val) => {
  whoCanComment.value = val.value
}

const onFocus = () => {
  isFocus.value = true
}

const onFocusOut = () => {
  isFocus.value = false
}

const deleteImage = () => {
  urlImage.value = null
  fileImage.value = null
}

watch(content, () => {
  if (textareaRef) {
    textareaRef.value.style.height = "auto";

    let rangeVp = 70
    if (currentRouteName === 'post') {
      rangeVp = 53
    }
    const innerHeightViewPort = window.innerHeight * rangeVp / 100
    if (textareaRef.value.scrollHeight > innerHeightViewPort) {
      textareaRef.value.style.height = innerHeightViewPort + 'px';
      return
    }
    nextTick(() => {
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
    })
  }
})

</script>

<style scoped>
.textarea-input {
  @apply resize-none block flex-1  bg-transparent py-1.5 pl-1 text-zinc-900 placeholder:text-zinc-500
  focus:ring-0 focus:outline-none sm:text-sm lg:text-xl sm:leading-6;
  max-height: 100%;
}


.icon-btn {
  @apply flex items-center justify-center hover:bg-zinc-100 p-2 rounded-full mx-auto h-9 w-9 text-zinc-500 cursor-pointer transition transform duration-200 ease-in-out;
}
</style>
