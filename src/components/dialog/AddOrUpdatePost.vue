<script setup lang="ts">
import {
  ref, watch, nextTick, onMounted
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  CalendarIcon, FaceSmileIcon, GifIcon, PhotoIcon, XMarkIcon
} from '@heroicons/vue/24/outline';
import { PencilIcon } from '@heroicons/vue/24/outline';

import { formatTextWithHashTags, truncateText } from '@/core/helper';
import Dialog from '@/core/components/Dialog.vue';
import Button from '@/core/components/Button.vue';
import { useCreatePost, useUpdatePost } from '@/services/post';
import SelectWhoCanComment from '@/components/SelectWhoCanComment.vue';
import {
  ICreatePost, IPostTemp, IUpdatePost
} from '@/types/post';
import { useStore } from '@/store';
import { mapGetters } from '@/lib/map-state.ts';
import { MutationEnums } from '@/types/store/root';
import { logger } from '@/core/helper';
import { useUploadImage } from '@/services/common';
import { useMediaQuery } from '@vueuse/core';
import { StatusCodes } from 'http-status-codes';
import { useQueryClient } from '@tanstack/vue-query';
import { OptionSelectWhoCanComment } from '@components/SelectWhoCanComment.vue';
import { POST_WHO_CAN_COMMENT } from '@config/post.ts';

type PostTypes = { time?: string, date?: string } & IPostTemp

interface Props {
  showDialogFromProps?: boolean,
  hideTrigger?: boolean,
  dataPost?: IPostTemp,
  dataPostReply?: PostTypes,
  responsive?: boolean,
}

const {
  showDialogFromProps, hideTrigger, dataPost, responsive, dataPostReply,
} = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onClose'): void,
}>();

const {
  isPending: isPendingCreatePost,
  mutateAsync: createPost,
} = useCreatePost();

const {
  isPending: isPendingUpdatePost,
  mutateAsync: updatePost,
} = useUpdatePost();

const {
  isPending: isPendingUploadImage,
  mutateAsync: uploadImage,
} = useUploadImage();

const queryClient = useQueryClient();

const isTabletScreen = useMediaQuery('(min-width: 768px)');
const store = useStore();
const router = useRouter();
const route = useRoute();

const currentRouteName = route.name;
const postId = route.params.id;

const { isLoggedIn, getUser } = mapGetters();

const showDialog = ref(false);
const isLoading = ref(false);
const textareaRef = ref(null);
const fileImage = ref(null);
const urlImage = ref(null);
const content = ref('');
const whoCanComment = ref(0);

// error: Argument of type 'boolean' is not assignable to parameter of type 'object'.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
watch(showDialogFromProps, () => {
  content.value = dataPost?.content;
  if (showDialogFromProps) {
    if (dataPost) {
      urlImage.value = dataPost?.image_url;
      whoCanComment.value = dataPost?.who_can_comment_int ?? POST_WHO_CAN_COMMENT.EVERYONE;
    }
    openDialog();
  }
}, { deep: true, immediate: true });

onMounted(() => {
  calcHeightTextarea();
});

const handleCreatePost = async () => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
    return;
  }

  const payload: ICreatePost = {
    content: content.value,
    parent_id: null,
  };

  if (whoCanComment.value !== null && !dataPostReply) {
    payload.who_can_comment = whoCanComment.value;
  }

  if (fileImage.value) {
    payload.image_url = await handleUploadImage();
  }

  if (dataPostReply) {
    payload.parent_id = Number(dataPostReply.id);
  }

  const { status, data } = await createPost(payload);

  if (status === StatusCodes.CREATED) {

    store.commit(MutationEnums.SHOW_TOAST, {
      message: `Your post was sent.${dataPostReply ? '' : ' You have 1 hour to make any edits.'}`,
      onClickBtn: () => router.push({ name: 'post', params: { id: data.post.id } }),
      line: dataPostReply ? 1 : 2,
    });

    await queryClient.invalidateQueries({
      queryKey: ['get-posts'],
    });
    closeDialog();
  }
};

const handleUpdatePost = async () => {

  const payload: IUpdatePost = {
    id: dataPost.id,
    content: content.value,
    image_url: urlImage.value,
    parent_id: dataPost.parent_id,
  };

  if (whoCanComment.value !== null) {
    payload.who_can_comment = whoCanComment.value;
  }

  if (fileImage.value) {
    payload.image_url = await handleUploadImage();
  }

  logger.debug('execute postAPI.update', payload, 'src/components/dialog/AddOrUpdatePost.vue');

  const { status } = await updatePost(payload);

  if (status === StatusCodes.OK) {
    const payloadToast = {
      message: 'Your post has been edited',
      onClickBtn: () => router.push({ name: 'post', params: { id: dataPost.id } }),
    };

    if (currentRouteName === 'post') {
      delete payloadToast.onClickBtn;
    }

    store.commit(MutationEnums.SHOW_TOAST, payloadToast);

    if (currentRouteName === 'post' && dataPost.id === Number(postId)) {
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
  }
};

const handleUploadImage = async () => {
  const { data } = await uploadImage(fileImage.value);
  logger.debug('execute postAPI.uploadImage', data, 'src/components/CreatePostForm.vue');
  if (data?.url) {
    return data.url;
  }
  logger.error('error upload image');
};

const deleteImage = () => {
  if (isLoading.value) {
    return;
  }
  urlImage.value = null;
  fileImage.value = null;
};

const onChangeSelectWhoCanComment = (val: OptionSelectWhoCanComment) => {
  whoCanComment.value = val.value;
};

const onChangeImage = (e) => {
  fileImage.value = e.target.files[0];
  urlImage.value = URL.createObjectURL(e.target.files[0]);
};

function closeDialog() {
  if (isLoading.value) {
    return;
  }

  showDialog.value = false;
  emit('onClose');
  if (!dataPost) {
    fileImage.value = null;
    content.value = '';
    urlImage.value = null;
  }
}

function openDialog() {
  showDialog.value = true;
}

function calcHeightTextarea() {
  if (textareaRef.value && textareaRef?.value) {
    textareaRef.value.style.height = 'auto';

    let rangeVp;
    if (!isTabletScreen) {
      rangeVp = 70;
    }
    else {
      rangeVp = dataPostReply ? 30 : 70;
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

const handleDisabledUpdate = (): boolean => {

  if (content.value !== dataPost?.content) {
    return false;
  }

  if (whoCanComment.value !== dataPost.who_can_comment_int) {

    if (content.value || fileImage.value || urlImage.value) {
      return false;
    }
  }

  if (urlImage.value !== dataPost.image_url) {
    if (content.value) {
      return false;
    }
  }

  return true;
};

</script>

<template>
  <div>
    <textarea
      ref="textareaRef"
      v-model="content"
      :disabled="isLoading"
      class="hidden"
    />

    <Dialog
      :show="showDialog"
      :close-dialog="closeDialog"
      :title="`${dataPostReply ? 'Reply' : dataPost ? 'Edit' : 'Create'} Post`"
      class-panel="
      min-h-screen md:min-h-0 max-h-[90vh]
      md:min-w-[600px] md:max-w-[600px]
      md:mt-12 align-middle px-4 py-2"
    >
      <template #trigger>
        <div :class="responsive && 'hidden xl:block'">
          <Button
            v-if="!hideTrigger"
            size="md"
            class="w-2/3"
            @click="openDialog"
          >
            Post
          </Button>
        </div>
        <div
          v-if="responsive"
          class="xl:hidden relative cursor-pointer md:ml-[19px] "
          @click="openDialog"
        >
          <PencilIcon class="h-[52px] p-4 absolute z-10 top-0 left-0 text-white" />
          <div
            class="bg-black z-[-1] absolute top-0 left-0
          h-[52px] w-[52px] rounded-full shadow-pencil-icon"
          />
        </div>
      </template>

      <template #panel>
        <div class="mt-12">
          <!--   Info post to reply      -->
          <div
            v-if="dataPostReply"
            class="mb-2"
          >
            <div class="flex flex-row">
              <!--         Avatar-->
              <div class="mr-4 basis-11 pb-12 min-w-[40px]">
                <div>
                  <img
                    v-if="dataPostReply?.author_avatar_url || dataPostReply?.author?.avatar_url"
                    :src="dataPostReply?.author_avatar_url || dataPostReply?.author?.avatar_url"
                    class="rounded-full h-10 w-10 bg-black"
                    alt="avatar"
                  >
                  <img
                    v-else
                    src="@/assets/default-avatar.png"
                    class="rounded-full h-10 w-10 bg-black"
                    alt="avatar"
                  >
                </div>

                <div
                  class="items-stretch flex-shrink-0 border basis-auto min-h-0 min-w-0
                   flex-grow mx-auto w-[2px] h-full mt-2"
                />
              </div>


              <!--    Info author  +  content post  -->
              <div class="w-full max-h-[50vh] md:min-h-[10vh] overflow-y-scroll">
                <div class="flex justify-between">
                  <!--              info author-->
                  <div class="flex flex-shrink gap-2 text-[15px]">
                    <div class="font-bold text-black before:absolute">
                      {{
                        truncateText(dataPostReply.author_name ?? dataPostReply.author.name, isTabletScreen ? 20 : 10, '...')
                      }}
                    </div>
                    <div class="text-zinc-500 inline-flex gap-1">
                      <div class="before:absolute">
                        @{{
                          truncateText(dataPostReply.author_username ?? dataPostReply.author.username, isTabletScreen ? 20 : 10, '...')
                        }}
                      </div>
                      · {{ truncateText(dataPostReply?.time, 8) }}
                      <div
                        v-if="dataPostReply?.edited_posts_count > 0 && currentRouteName !== 'history'"
                        class="inline flex gap-1"
                      >
                        ·
                        <PencilIcon class="h-auto w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="font-normal text-zinc-700 dark:text-zinc-400
                 text-[15px] whitespace-pre-line  mt-1.5 break-words"
                >
                  <p v-html="formatTextWithHashTags(dataPostReply?.content)" />
                  <p>{{ dataPostReply?.image_url }}</p>

                  <!--                  <div class="text-zinc-500 text-sm mt-3 pb-5">-->
                  <!--                    Replying to @{{ dataPostReply.author_username ?? dataPostReply.author.username }}-->
                  <!--                  </div>-->
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-row h-full">
            <!--         Avatar-->
            <div class="mr-4 mt-2 basis-11 h-full min-w-[40px]">
              <div class="h-full mt-[5px]">
                <img
                  v-if="getUser.avatar_url"
                  :src="getUser.avatar_url"
                  class="rounded-full h-10 w-10 bg-black cursor-pointer"
                  alt="avatar"
                  @click="router.push('/user/' + getUser.username)"
                >
                <img
                  v-else
                  src="@/assets/default-avatar.png"
                  class="rounded-full h-10 w-10 bg-black cursor-pointer"
                  alt="avatar"
                  @click="router.push('/user/' + getUser.username)"
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
              v-if="!dataPostReply"
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
                  :disabled="isLoading"
                  type="file"
                  name="file"
                  accept="image/*"
                  class="hidden"
                  @change="onChangeImage"
                >
                <!--                    class="invisible"-->

                <GifIcon class="icon-btn" />
                <FaceSmileIcon class="icon-btn" />
                <CalendarIcon class="icon-btn" />
              </div>

              <div>
                <!--                      <Button v-if="isEditing" class="button" @click="handleUpdatePost">Update</Button>-->
                <!--                          :disabled="!content && !fileImage"-->
                <Button
                  v-if="dataPost"
                  :disabled-click="handleDisabledUpdate()"
                  :is-loading="isPendingUploadImage || isPendingUpdatePost"
                  class="button"
                  @click="handleUpdatePost"
                >
                  Update
                </Button>
                <Button
                  v-else
                  :disabled-click="!content && !fileImage"
                  :is-loading="isPendingUploadImage || isPendingCreatePost"
                  @click.prevent="handleCreatePost"
                >
                  {{ dataPostReply ? 'Reply' : 'Post' }}
                </Button>
              </div>
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

.shadow-pencil-icon {
  box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 8px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px;
}

</style>
