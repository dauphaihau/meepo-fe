<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/vue';
import {
  CheckIcon, EllipsisHorizontalIcon, PencilIcon, StarIcon, TrashIcon
} from '@heroicons/vue/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/vue/20/solid';

import { useDeletePost, useUpdatePost } from '@services/post.ts';
import EditPostDialog from '@components/dialog/AddOrUpdatePost.vue';
import { IPostTemp, IUpdatePost } from '@/types/post.ts';
import { useRoute, useRouter } from 'vue-router';
import { store } from '@/store';
import { MutationEnums } from '@/types/store/root.ts';
import { StatusCodes } from 'http-status-codes';
import { useQueryClient } from '@tanstack/vue-query';
import dayjs from 'dayjs';
import { logger } from '@core/helper.ts';
import { POST_CONFIG, POST_PIN_STATUS } from '@config/post.ts';

interface Props {
  dataPost: IPostTemp
  classDotIcon?: string
}

const route = useRoute();
const router = useRouter();

const currentRouteName = route.name;
const postId = route.params.id;

const { dataPost, classDotIcon } = defineProps<Props>();

const showAddOrUpdatePost = ref(false);
const keyAddPostDialog = ref(0);
const menuItemsRef = ref(null);
const confirmDelete = ref(false);
const pinStatus = ref(dataPost.pin_status_int);

const isExpiresEdit = computed(() => {
  if (dataPost?.created_at) {
    return !dayjs().isBefore(dayjs(dataPost.created_at).add(POST_CONFIG.HOUR_EXPIRES_EDIT, 'h'));
  }
  logger.error(`dataPost of created_at be ${dataPost?.created_at}`, 'src/components/OptionsPost.vue');
  return true;
});

const queryClient = useQueryClient();

const {
  mutateAsync: deletePost,
} = useDeletePost(dataPost.id);

const {
  mutateAsync: updatePost,
} = useUpdatePost();

watch(menuItemsRef, () => {
  confirmDelete.value = false;
});

const handleDeletePost = async () => {
  const { status } = await deletePost();
  if (status === StatusCodes.OK) {
    store.commit(MutationEnums.SHOW_TOAST, {
      message: 'Your post was deleted',
    });

    if (
      (currentRouteName === 'post' && dataPost.id === Number(postId)) ||
        currentRouteName === 'history'
    ) {
      await router.push('/');
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['get-posts'],
    });

    if (currentRouteName === 'post') {
      await queryClient.invalidateQueries({
        queryKey: ['detail-post', Number(postId)],
      });
    }
  }
};

const handlePinPost = async () => {
  const payload: IUpdatePost = {
    id: dataPost.id,
    pin_status: pinStatus.value === POST_PIN_STATUS.PIN ? POST_PIN_STATUS.UNPIN : POST_PIN_STATUS.PIN,
  };
  const { status } = await updatePost(payload);
  if (status === StatusCodes.OK) {
    store.commit(MutationEnums.SHOW_TOAST, {
      message: `Your post was ${payload.pin_status === POST_PIN_STATUS.PIN ? 'pinned' : 'unpinned'} to your profile.`,
    });
    pinStatus.value = payload.pin_status;
    if (currentRouteName === 'profile') {
      await queryClient.invalidateQueries({
        queryKey: ['get-posts'],
      });
    }
  }
};

const handleShowAddOrUpdatePost = () => {
  showAddOrUpdatePost.value = true;
  keyAddPostDialog.value++;
};

</script>

<template>
  <EditPostDialog
    :key="keyAddPostDialog"
    :show-dialog-from-props="showAddOrUpdatePost"
    :hide-trigger="true"
    :data-post="dataPost"
  />

  <Menu
    v-slot="{open}"
    as="div"
    class="relative inline-block text-left h-5"
  >
    <MenuButton>
      <EllipsisHorizontalIcon
        :class="classDotIcon"
        class="h-5 w-5 flex justify-center items-center rounded-full
         cursor-pointer text-zinc-500 hover:bg-zinc-200"
      />
    </MenuButton>

    <div
      v-if="open"
      class="fixed inset-0"
    />

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="menu-items">
        <div ref="menuItemsRef">
          <span
            v-if="!confirmDelete"
            class="menu-item text-zinc-900 hover:bg-zinc-100 rounded-tl-xl rounded-tr-xl"
            @click="confirmDelete = true"
          >
            <TrashIcon class="icon" />
            Delete
          </span>

          <MenuItem
            v-else
            v-slot="{ active }"
          >
            <span
              :class="['menu-item', active ? 'active text-red-400 rounded-tl-xl rounded-tr-xl' : 'text-red-400']"
              @click="handleDeletePost"
            >
              <CheckIcon class="icon" />
              Confirm
            </span>
          </MenuItem>

          <MenuItem
            v-if="!isExpiresEdit && dataPost.edited_posts_count < 5"
            v-slot="{ active }"
            as="div"
          >
            <span
              :class="['menu-item', active ? 'active' : 'inactive']"
              @click="handleShowAddOrUpdatePost"
            >
              <PencilIcon class="icon" />
              Edit
            </span>
          </MenuItem>

          <MenuItem v-slot="{ active }">
            <span
              :class="['menu-item', active ? 'active rounded-bl-xl rounded-br-xl' : 'inactive']"
              @click="handlePinPost"
            >
              <SolidStarIcon
                v-if="pinStatus === POST_PIN_STATUS.PIN"
                class="icon"
              />
              <StarIcon
                v-else
                class="icon"
              />
              {{ pinStatus === POST_PIN_STATUS.PIN ? 'Unpin from profile' : 'Pin to your profile' }}
            </span>
          </MenuItem>

          <!--          <MenuItem v-slot="{ active }">-->
          <!--            <span-->
          <!--                :class="['menu-item', active ? 'active rounded-bl-md rounded-br-md' : 'inactive']"-->
          <!--            >Change who can reply</span>-->
          <!--          </MenuItem>-->
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style scoped>

.menu-items {
  @apply absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl
  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none;
}

.menu-item {
  @apply px-4 py-2 text-sm cursor-pointer flex items-center gap-2;
}

.icon {
  @apply w-4 stroke-[2];
}

.active {
  @apply bg-zinc-100 ;
}

.inactive {
  @apply text-zinc-700;
}

</style>
