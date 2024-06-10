<script setup lang="ts">
import {
  CalendarIcon, FaceSmileIcon, GifIcon, PhotoIcon, XMarkIcon
} from '@heroicons/vue/24/outline';
import { useMediaQuery } from '@vueuse/core';
import { StatusCodes } from 'http-status-codes';
import { useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import Dialog from '@core/components/Dialog.vue';
import Button from '@core/components/Button.vue';
import { useUpdatePost } from '@services/post.ts';
import { IResponseGetPost, IUpdatePost } from '@/types/post.ts';
import { useUploadImage } from '@services/common.ts';
import { useAuthStore } from '@stores/auth.ts';
import { useDialogStore } from '@stores/dialog.ts';
import { useNotificationStore } from '@stores/notification.ts';
import SelectWhoCanComment, { IOptionSelectWhoCanComment } from '@components/SelectWhoCanComment.vue';
import { POST_WHO_CAN_COMMENT } from '@config/post.ts';
import { logger } from '@core/helpers/logger.ts';

const queryClient = useQueryClient();
const dialogStore = useDialogStore();
const { user } = storeToRefs(useAuthStore());
const isTabletScreen = useMediaQuery('(min-width: 768px)');
const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();

const currentRouteName = route.name;
const postId = route.params.id;

const dataPost = computed(() => dialogStore.data as IResponseGetPost);

const {
  isPending: isPendingUpdatePost,
  mutateAsync: updatePost,
} = useUpdatePost();

const {
  isPending: isPendingUploadImage,
  mutateAsync: uploadImage,
} = useUploadImage();

const textareaRef = ref(null);
const fileImage = ref(null);
const urlImage = ref(null);
const content = ref();
const whoCanComment = ref(POST_WHO_CAN_COMMENT.EVERYONE);

const disabledBtnUpdate = computed(() => {
  if (!content.value) {
    return true;
  }
  if (content.value !== dataPost.value?.content) {
    return false;
  }
  if (whoCanComment.value !== dataPost.value.who_can_comment_int) {
    if (content.value || fileImage.value || urlImage.value) {
      return false;
    }
  }
  if (urlImage.value !== dataPost.value.image_url) {
    if (content.value) {
      return false;
    }
  }
  return true;
});

watch(() => dialogStore.data, () => {
  if (dataPost.value) {
    content.value = dataPost.value?.content;
    urlImage.value = dataPost.value?.image_url;
    whoCanComment.value = dataPost.value?.who_can_comment_int ?? POST_WHO_CAN_COMMENT.EVERYONE;
  }
}, { deep: true, immediate: true });

onMounted(() => {
  calcHeightTextarea();
});

const handleUpdatePost = async () => {
  const payload: IUpdatePost = {
    id: dataPost.value.id,
    content: content.value,
    image_url: urlImage.value,
    parent_id: dataPost.value.parent_id,
    who_can_comment: whoCanComment.value,
  };

  if (fileImage.value) {
    payload.image_url = await handleUploadImage();
  }

  logger.debug('execute postAPI.update', payload, 'src/components/dialog/UpdatePostDialog.vue');

  const { status } = await updatePost(payload);

  if (status !== StatusCodes.OK) {
    notificationStore.notify({
      text: 'Something wrong',
    });
    return;
  }

  const notification = {
    text: 'Your post has been edited',
    btnRight: {
      title: 'View',
      onClick: () => router.push({ name: 'post', params: { id: dataPost.value.id } }),
    },
  };
  if (currentRouteName === 'post') {
    delete notification.btnRight;
  }
  notificationStore.notify(notification);

  queryClient.removeQueries({
    queryKey: ['detail-post', dataPost.value.id],
  });

  if (currentRouteName === 'post' && dataPost.value.id === Number(postId)) {
    await queryClient.invalidateQueries({
      queryKey: ['detail-post'],
    });
  }
  else {
    await queryClient.invalidateQueries({
      queryKey: ['get-posts'],
    });
  }
  closeDialog();
};

const handleUploadImage = async () => {
  const { data } = await uploadImage(fileImage.value);
  logger.debug('execute postAPI.uploadImage', data, 'src/components/ReplyPostDialog.vue');
  if (data?.url) {
    return data.url;
  }
  logger.error('error upload image');
};

const deleteImage = () => {
  if (isPendingUpdatePost.value) {
    return;
  }
  urlImage.value = null;
  fileImage.value = null;
};

const onChangeImage = ({ target }: Event) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  fileImage.value = target.files[0];
  urlImage.value = URL.createObjectURL(target.files[0]);
};

const onChangeSelectWhoCanComment = (val: IOptionSelectWhoCanComment) => {
  whoCanComment.value = val.value;
};

function closeDialog() {
  if (isPendingUpdatePost.value) {
    return;
  }
  dialogStore.close();
  fileImage.value = null;
  content.value = '';
  urlImage.value = null;
}

function calcHeightTextarea() {
  if (textareaRef.value && textareaRef?.value) {
    textareaRef.value.style.height = 'auto';

    let rangeVp: number;
    if (!isTabletScreen) {
      rangeVp = 70;
    }
    else {
      rangeVp = 30;
    }
    const innerHeightViewPort = window.innerHeight * rangeVp / 100;

    nextTick(() => {
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
      if (textareaRef.value.scrollHeight > innerHeightViewPort) {
        textareaRef.value.style.height = innerHeightViewPort + 'px';
        return;
      }
    });
  }
}

watch(content, () => {
  calcHeightTextarea();
});

</script>

<template>
  <div>
    <textarea
      ref="textareaRef"
      v-model="content"
      :disabled="isPendingUpdatePost"
      class="hidden"
    />

    <Dialog
      :show="dialogStore.showDialog === 'update-post'"
      :close="closeDialog"
      title="Edit Post"
      class-panel="
      min-h-screen md:min-h-0 max-h-[90vh]
      md:min-w-[600px] md:max-w-[600px]
      md:mt-12 align-middle px-4 py-2"
    >
      <template #panel>
        <div class="mt-12">
          <div class="flex flex-row h-full">
            <!--         Avatar-->
            <div class="mr-4 mt-2 basis-11 h-full min-w-[40px]">
              <div class="h-full mt-[5px]">
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="rounded-full h-10 w-10 bg-black cursor-pointer"
                  alt="avatar"
                  @click="router.push('/user/' + user.username)"
                >
                <img
                  v-else
                  src="@/assets/default-avatar.png"
                  class="rounded-full h-10 w-10 bg-black cursor-pointer"
                  alt="avatar"
                  @click="router.push('/user/' + user.username)"
                >
              </div>
            </div>

            <!--        Input -->
            <div class="w-full md:max-h-[71vh] md:min-h-[10vh] overflow-y-scroll">
              <textarea
                id="content"
                ref="textareaRef"
                v-model="content"
                name="content"
                class="textarea-input"
                placeholder="Write your content"
                maxlength="1400"
              />

              <div
                v-if="urlImage"
                class="relative mt-3 mb-1"
              >
                <img
                  alt="preview-img"
                  :src="urlImage"
                  class="h-auto w-full rounded-xl"
                >
                <div
                  class="rounded-full bg-black opacity-70 w-fit p-1
                 absolute z-[1] top-2 right-2 hover:opacity-60 transition ease-out duration-300"
                >
                  <XMarkIcon
                    class="text-white h-5 w-5 cursor-pointer text-white"
                    @click="deleteImage"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="hidden md:block h-[100px]" />

          <div class="absolute bottom-2 left-0 z-[1] bg-white w-full rounded-2xl px-4 pt-1">
            <SelectWhoCanComment
              :default-value="whoCanComment"
              @update:model-value="onChangeSelectWhoCanComment"
            />
            <div class="border-b mt-4 mb-2" />
            <!--     Toolbar input     -->
            <div class="flex items-center justify-between gap-x-6 w-full">
              <div class="flex items-center gap-1.5">
                <!-- @vue-ignore -->
                <PhotoIcon
                  class="icon-btn"
                  @click="$refs.file.click()"
                />
                <input
                  id="file"
                  ref="file"
                  :disabled="isPendingUpdatePost"
                  type="file"
                  name="file"
                  accept="image/*"
                  class="hidden"
                  @change="onChangeImage"
                >

                <GifIcon class="icon-btn" />
                <FaceSmileIcon class="icon-btn" />
                <CalendarIcon class="icon-btn" />
              </div>
              <Button
                :disabled="disabledBtnUpdate"
                :loading="isPendingUploadImage || isPendingUpdatePost"
                class="button"
                @click="handleUpdatePost"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>

.textarea-input {
  @apply w-full resize-none block flex-1 bg-transparent
  py-1.5 pl-1
  text-zinc-900 placeholder:text-zinc-500 sm:text-sm lg:text-xl
  focus:ring-0 focus:outline-none sm:leading-6;
  max-height: 100%;
}

.icon-btn {
  @apply flex items-center justify-center hover:bg-zinc-100 p-2 rounded-full mx-auto h-9 w-9 text-zinc-500 cursor-pointer
}

</style>
