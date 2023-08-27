<template>
  <Popover v-slot="{ open, close }" class="relative">

    <PopoverButton
        :class="open ? '' : 'text-opacity-90'"
        class="focus:outline-none"
        @mouseover="(e) => hoverPopover(e, open)"
        @mouseleave="closePopover(close)"
    >
      <slot/>
    </PopoverButton>

    <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-350 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
          @mouseover.prevent="popoverHover = true"
          @mouseleave.prevent="closePopover(close)"
          class="absolute left-[-90px] bg-white rounded-xl mt-3 w-10 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"
          :class="open ? ' z-[99999]' : 'z-[-10]'"
      >

        <div class="overflow-hidden bg-white w-[300px] p-4 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="flex justify-between mb-2">
            <img
                v-if="user.avatar_url"
                alt="avatar"
                v-bind:src="user.avatar_url"
                class="rounded-full h-16 w-16 bg-black col-span-1"
            />
            <div v-else class="rounded-full h-16 w-16 bg-black col-span-1"/>

            <ToggleFollowBtn
                v-if="getUser.id !== user.id"
                :show="true"
                @click="unOrFollow"
                :isFollowing="user?.is_current_user_following"
            />
          </div>

          <div class="font-bold text-black hover:underline hover:underline-offset-2 animate">
            {{ user?.name }}
          </div>
          <div class="text-zinc-500 mb-2">@{{ user?.username }}</div>
          <p class="font-normal text-zinc-700 dark:text-zinc-400 text-[15px] mb-2">
            {{ user?.bio }}</p>

          <div>

            <div class="flex gap-4">

              <div
                  @click="redirect('followers')"
                  class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
              >
                <span class="font-bold text-[14px] text-black">{{ user?.followers_count ?? 0 }}</span>
                <span class="text-zinc-500 text-[14px]">Follower</span>
              </div>

              <div
                  @click="redirect('following')"
                  class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
              >
                <span class="font-bold text-[14px] text-black">{{ user?.followed_count ?? 0 }}</span>
                <span class="text-zinc-500 text-[14px]">Following</span>
              </div>
            </div>
          </div>

        </div>
      </PopoverPanel>
    </transition>

  </Popover>
</template>


<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";
import { IUser } from "@/types/user";
import { useRouter } from "vue-router";
import { userAPI } from "@/apis/user";
import { MutationEnums } from "@/types/store/root";
import { mapGetters } from "@/lib/map-state";
import { useStore } from "@/store";
import { IPost } from "@/types/post";

const router = useRouter()
const store = useStore()
const { isLoggedIn, getUser } = mapGetters()
const popoverHover = ref(false)
const popoverTimeout = ref()

interface IProps {
  user: Partial<IUser> & Partial<Pick<IPost, 'user_id'>>
  prefixAuthor?: boolean
}

let { user, prefixAuthor } = defineProps<IProps>()
const emit = defineEmits<{
  (e: 'onOpenPopover', value: boolean)
}>()

onBeforeMount(() => {
  if (prefixAuthor && user) {
    Object.keys(user).forEach((key) => {
      if (key.startsWith('author_')) {
        const nonPrefix = key.replace('author_', '')
        user[nonPrefix] = user[key]
      }
    })
  }
})

const hoverPopover = (e: any, open: boolean): void => {
  popoverHover.value = true
  if (!open) {
    e.target.parentNode.click()
  }
}

const closePopover = (close: any): void => {
  popoverHover.value = false
  if (popoverTimeout.value) clearTimeout(popoverTimeout.value)
  popoverTimeout.value = setTimeout(() => {
    if (!popoverHover.value) {
      close()
    }
  }, 100)
}

async function unOrFollow() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
  const userId = prefixAuthor ? user.user_id : user.id
  const { status } = user?.is_current_user_following ? await userAPI.unfollow(userId) : await userAPI.follow(userId)
  if (status === 200) {
    user.is_current_user_following = !user?.is_current_user_following
  }
}

function redirect(name) {
  localStorage.setItem('state', JSON.stringify(this.user))
  router.push({
    name,
    params: { username: user.username, },
  });
}

watch(popoverHover, (value: any) => {
  emit('onOpenPopover', value)
})

</script>

<style scoped>

</style>
