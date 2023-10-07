<template>
  <EditPostDialog
      :key="keyAddPostDialog"
      :showDialogFromProps="showAddOrUpdatePost"
      :hideTrigger="true"
      :dataPost="dataPost"
  />

  <Menu as="div" class="relative inline-block text-left h-5" v-slot="{open}">
    <MenuButton>
      <EllipsisHorizontalIcon
          :class="classDotIcon"
          class="h-5 w-5 flex justify-center items-center rounded-full cursor-pointer text-zinc-500 hover:bg-zinc-200"
      />
    </MenuButton>
    <div v-if="open" class="fixed inset-0"/>
    <!--    <div v-if="open" class="fixed inset-0 bg-black opacity-30" />-->

    <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div ref="menuItemsRef">
          <span
              v-if="!confirmDelete"
              @click="confirmDelete = true"
              class="menu-item text-zinc-900 hover:bg-zinc-100 rounded-tl-xl rounded-tr-xl"
          >
            <TrashIcon class="icon"/>
            Delete</span>
          <MenuItem v-else v-slot="{ active }">
            <span
                @click="onDelete"
                :class="[active ? 'active text-red-400 rounded-tl-xl rounded-tr-xl' : 'text-red-400', 'menu-item']"
            >
              <CheckIcon class="icon"/>
              Confirm</span>
          </MenuItem>

          <MenuItem v-if="dataPost.isExpiresEdit && dataPost.edited_posts_count < 5" v-slot="{ active }" as="div">
            <span
                @click="showAddOrUpdatePost = true; keyAddPostDialog += 1"
                :class="[active ? 'bg-zinc-100 text-zinc-900' : 'inactive', 'menu-item']"
            >
              <PencilIcon class="icon"/>
              Edit</span>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <span
                @click="onPin"
                :class="[active ? 'active rounded-bl-xl rounded-br-xl' : 'inactive', 'menu-item']"
            >
              <SolidStarIcon v-if="dataPost.pin_status_int === PIN_STATUS.PIN" class="icon"/>
              <StarIcon v-else class="icon"/>
              {{ dataPost.pin_status_int === PIN_STATUS.PIN ? 'Unpin from profile' : 'Pin to your profile' }}
            </span>
          </MenuItem>
          <!--          <MenuItem v-slot="{ active }">-->
          <!--            <span-->
          <!--                :class="[active ? 'bg-zinc-100 text-zinc-900 rounded-bl-md rounded-br-md' : 'text-zinc-700', 'block px-4 py-2 text-sm']"-->
          <!--            >Change who can reply</span>-->
          <!--          </MenuItem>-->
        </div>
      </MenuItems>
    </transition>
  </Menu>

</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisHorizontalIcon, TrashIcon, CheckIcon, PencilIcon, StarIcon } from '@heroicons/vue/24/outline'
import { StarIcon as SolidStarIcon } from '@heroicons/vue/20/solid'

import { postAPI } from "@/apis/post";
import EditPostDialog from "@/components/dialog/AddOrUpdatePost.vue";
import { IPost, PIN_STATUS } from "@/types/post";
import { useRoute, useRouter } from "vue-router";
import { store } from "@/store";
import { MutationEnums } from "@/types/store/root";

const route = useRoute()
const router = useRouter()

interface Props {
  dataPost: IPost
  classDotIcon?: string
}

const { dataPost, classDotIcon } = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onDeletePostChildComp'): void,
  (e: 'onPinPost'): void
}>()

const showAddOrUpdatePost = ref(false);
const keyAddPostDialog = ref(0);
const menuItemsRef = ref(null)
const confirmDelete = ref(false)
const currentRouteName = route.name

watch(menuItemsRef, () => {
  confirmDelete.value = false
})

const onDelete = async () => {
  const { status } = await postAPI.delete(dataPost.id)
  if (status === 200) {
    store.commit(MutationEnums.SHOW_TOAST, {
      message: 'Your post was deleted'
    })
    emit('onDeletePostChildComp')
    if (currentRouteName === 'history') router.push('/')
  }
}

const onPin = async () => {
  const payload = { pin_status: dataPost.pin_status_int === PIN_STATUS.PIN ? PIN_STATUS.UNPIN : PIN_STATUS.PIN }
  const { status } = await postAPI.update(dataPost.id, payload)
  if (status === 200) {
    store.commit(MutationEnums.SHOW_TOAST, {
      message: `Your post was ${payload.pin_status === PIN_STATUS.PIN ? 'pinned' : 'unpinned'} to your profile.`,
    })
    dataPost.pin_status_int = payload.pin_status
    emit('onPinPost')
  }
}

</script>

<style scoped>

.active {
  @apply bg-zinc-100;
}

.inactive {
  @apply text-zinc-700;
}

.menu-item {
  @apply block px-4 py-2 text-sm cursor-pointer flex items-center gap-2;
}

.icon {
  @apply w-4 stroke-[2];
}

</style>
