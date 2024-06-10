<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { StatusCodes } from 'http-status-codes';
import { storeToRefs } from 'pinia';
import {
  CalendarIcon, FaceSmileIcon, GifIcon, PhotoIcon, XMarkIcon
} from '@heroicons/vue/24/outline';

import { useCreatePost } from '@/services/post';
import Button from '@/core/components/Button.vue';
import SelectWhoCanComment from '@/components/SelectWhoCanComment.vue';
import { ICreatePost } from '@/types/post';
import { useUploadImage } from '@/services/common';
import { IOptionSelectWhoCanComment } from '@components/SelectWhoCanComment.vue';
import { useAuthStore } from '@stores/auth.ts';
import { useDialogStore } from '@stores/dialog.ts';
import { useNotificationStore } from '@stores/notification.ts';
import { logger } from '@core/helpers/logger.ts';

const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const { isLoggedIn, user } = storeToRefs(useAuthStore());

const content = ref('');
const fileInput = ref(null);
const isFocus = ref(false);
const whoCanComment = ref(null);
const textareaRef = ref(null);
const fileImage = ref(null);
const urlImage = ref(null);

const {
  isPending: isPendingCreatePost,
  mutateAsync: createPost,
} = useCreatePost();

const {
  isPending: isPendingUploadImage,
  mutateAsync: uploadImage,
} = useUploadImage();

const queryClient = useQueryClient();

const onChangeFile = ({ target }: Event) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  fileImage.value = target.files[0];
  urlImage.value = URL.createObjectURL(target.files[0]);
};

const handleCreatePost = async () => {
  if (!isLoggedIn.value) {
    dialogStore.showDialog = 'login';
    return;
  }

  const payload: ICreatePost = {
    content: content.value,
    parent_id: null,
  };

  if (whoCanComment.value !== null) {
    payload.who_can_comment = whoCanComment.value;
  }

  if (fileImage.value) {
    const { data } = await uploadImage(fileImage.value);
    logger.debug('execute postAPI.uploadImage', data, 'src/components/CreatePostForm.vue');
    if (data?.url) {
      payload.image_url = data.url;
    }
    else {
      logger.error('error upload image');
      return;
    }
  }

  logger.debug('execute postAPI.create', payload, 'src/components/CreatePostForm.vue');
  const { status, data } = await createPost(payload);

  if (status === StatusCodes.CREATED) {
    if (!data.post || !data.post.id) {
      logger.error('response from postAPI.create, post id is null', 'src/components/CreatePostForm.vue');
    }

    notificationStore.notify({
      text: 'Your post was sent. You have 1 hour to make any edits.',
      btnRight: {
        title: 'View',
        onClick: () => router.push({ name: 'post', params: { id: data.post.id } }),
      },
    });

    content.value = '';
    fileImage.value = null;
    urlImage.value = null;

    await nextTick(() => {
      textareaRef.value.style.height = 'auto';
    });

    await queryClient.invalidateQueries({
      queryKey: ['get-posts'],
    });
  }
};

const onChangeSelectWhoCanComment = (val: IOptionSelectWhoCanComment) => {
  whoCanComment.value = val.value;
};

const onFocus = () => {
  isFocus.value = true;
};

// const onFocusOut = () => {
//   isFocus.value = false;
// };

const deleteImage = () => {
  urlImage.value = null;
  fileImage.value = null;
};

watch(content, () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';

    let rangeVp = 70;
    const innerHeightViewPort = window.innerHeight * rangeVp / 100;
    if (textareaRef.value.scrollHeight > innerHeightViewPort) {
      textareaRef.value.style.height = innerHeightViewPort + 'px';
      return;
    }
    nextTick(() => {
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
    });
  }
});

</script>

<template>
  <div class="hidden md:block border-b">
    <div class="flex flex-row px-4 border-t pt-3">
      <!--         Avatar-->
      <div class="mr-4 mt-2 basis-11 h-full">
        <div
          class="h-full "
        >
          <img
            v-if="user?.avatar_url"
            :src="user?.avatar_url"
            class="rounded-full h-10 w-10 bg-black cursor-pointer"
            alt="avatar"
            @click="router.push('/user/' + user?.username)"
          >
          <img
            v-else
            src="@/assets/default-avatar.png"
            class="rounded-full h-10 w-10 bg-black cursor-pointer"
            alt="avatar"
            @click="router.push('/user/' + user?.username)"
          >
        </div>
      </div>

      <!--        Input -->
      <div class="w-full">
        <div class="w-full max-h-[81vh] h-fit overflow-y-scroll">
          <div class="flex flex-col gap-1 bg-white col-span-10 h-full">
            <div class="mt-2 flex ">
              <textarea
                id="content"
                ref="textareaRef"
                v-model="content"
                name="content"
                :rows="isFocus ? 2 : 0"
                class="textarea-input "
                placeholder="Write your content"
                maxlength="1400"
                @focus="onFocus"
              />
            </div>

            <div
              v-if="urlImage"
              class="relative mt-3"
            >
              <img
                alt="preview-img"
                :src="urlImage"
                class="h-auto w-full rounded-xl"
              >
              <div
                class="rounded-full bg-black opacity-70 w-fit p-1
                 absolute top-2 right-2 hover:opacity-50 transition ease-out duration-300"
              >
                <XMarkIcon
                  class="h-5 w-5 cursor-pointer text-white"
                  @click="deleteImage"
                />
              </div>
            </div>
          </div>
        </div>

        <SelectWhoCanComment
          v-if="isFocus"
          class="relative z-[2]"
          @update:model-value="onChangeSelectWhoCanComment"
        />
        <div :class="isFocus && 'border-b'" />
      </div>
    </div>

    <!--     Toolbar + submit btn     -->
    <div class="pl-[70px] pr-4">
      <div class="flex items-center justify-between gap-x-6 mb-2 w-full pt-2">
        <div class="flex-center">
          <div class="flex items-center gap-1.5">
            <!-- @vue-ignore -->
            <PhotoIcon
              class="icon-btn"
              @click="$refs.fileInput.click()"
            />
            <input
              id="file"
              ref="fileInput"
              type="file"
              name="file"
              accept="image/*"
              class="hidden"
              @change="onChangeFile"
            >

            <GifIcon
              v-tooltip="'Not available'"
              class="icon-btn"
            />
            <FaceSmileIcon
              v-tooltip="'Not available'"
              class="icon-btn"
            />
            <CalendarIcon
              v-tooltip="'Not available'"
              class="icon-btn"
            />
          </div>
        </div>

        <Button
          classes="px-6"
          :loading="isPendingUploadImage || isPendingCreatePost"
          :disabled="!content && !fileImage"
          @click.prevent="handleCreatePost"
        >
          Post
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.textarea-input {
  @apply resize-none block flex-1  bg-transparent py-1.5 pl-1 text-zinc-900 placeholder:text-zinc-500
  focus:ring-0 focus:outline-none sm:text-sm lg:text-xl sm:leading-6;
  max-height: 100%;
}


.icon-btn {
  @apply flex items-center justify-center hover:bg-zinc-100 p-2 rounded-full mx-auto h-9 w-9 text-zinc-500
  cursor-pointer transition transform duration-200 ease-in-out;
}
</style>
