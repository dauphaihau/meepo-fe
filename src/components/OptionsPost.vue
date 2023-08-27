<template>
  <AddOrUpdatePost
      :key="keyAddPostDialog"
      :showDialogFromProps="showAddOrUpdatePost"
      :hideTrigger="true"
      :dataPost="dataPost"
  />

  <Menu as="div" class="relative inline-block text-left h-5" v-slot="{open}">
    <MenuButton>
      <EllipsisHorizontalIcon
          :class="classDotIcon"
          class="h-5 w-5 flex justify-center items-center rounded-full cursor-pointer text-gray-500 hover:bg-zinc-200"
      />
    </MenuButton>

    <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <!--        ref="popperRef"-->
      <MenuItems
          ref="popperRef"
          :class="open ? 'z-40': 'z-10'"
          class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="">
          <MenuItem v-slot="{ active }">
            <span
                @click="onDelete"
                :class="[active ? 'bg-gray-100 text-gray-900 rounded-tl-md rounded-tr-md' : 'text-gray-700', 'block px-4 py-2 text-sm']"
            >Delete</span>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <span
                @click="showAddOrUpdatePost = true; keyAddPostDialog += 1"
                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
            >Edit</span>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <span
                @click="onPin"
                :class="[active ? 'bg-gray-100 text-gray-900 rounded-bl-md rounded-br-md' : 'text-gray-700', 'block px-4 py-2 text-sm']"
            >
              <!--                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"-->
              {{
                dataPost.pin_status_int === PIN_STATUS.PIN ? 'Unpin from profile' : 'Pin to your profile'
              }}
            </span>
          </MenuItem>
          <!--          <MenuItem v-slot="{ active }">-->
          <!--            <span-->
          <!--                :class="[active ? 'bg-gray-100 text-gray-900 rounded-bl-md rounded-br-md' : 'text-gray-700', 'block px-4 py-2 text-sm']"-->
          <!--            >Change who can reply</span>-->
          <!--          </MenuItem>-->
        </div>
      </MenuItems>
    </transition>
  </Menu>

</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { toast } from "vue-sonner";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisHorizontalIcon, } from '@heroicons/vue/24/outline'

import { postAPI } from "@/apis/post";
import AddOrUpdatePost from "@/components/dialog/AddOrUpdatePost.vue";
import { IPost, PIN_STATUS } from "@/types/post";
import { useRoute } from "vue-router";

const route = useRoute()

interface Props {
  dataPost: IPost
  classDotIcon?: string
}

const { dataPost, classDotIcon } = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onDeletePostChildComp'): void,
  (e: 'onCloseMenu'): void
  (e: 'onPinPost'): void
}>()

const showAddOrUpdatePost = ref<boolean>(false);
const keyAddPostDialog = ref(0);
const popperRef = ref(null)
const currentRouteName = route.name

watch(popperRef, (value, oldValue: HTMLElement | any ) => {
  if (oldValue?.textContent) {
    emit('onCloseMenu')
  }
})

const onDelete = async () => {
  const { status } = await postAPI.delete(dataPost.id)
  if (status >= 200) {
    toast('Your post was deleted')
    emit('onDeletePostChildComp')
  }
}

const onPin = async () => {
  const payload = { pin_status: dataPost.pin_status_int === PIN_STATUS.PIN ? PIN_STATUS.UNPIN : PIN_STATUS.PIN }
  const { status } = await postAPI.update(dataPost.id, payload)
  if (status === 200) {
    dataPost.pin_status_int = payload.pin_status
    emit('onPinPost')
  }
}

</script>

<style scoped>

</style>
