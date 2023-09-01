<template>
  <Popover v-slot="{ open, close }" class="relative" :class="classPopover">

    <PopoverButton
        :class="open ? '' : 'text-opacity-90'"
        class="focus:outline-none inline-flex items-center"
        @mouseover="(e) => hoverPopover(e, open)"
        @mouseleave="closePopover(close)"
    >
      <slot/>
    </PopoverButton>
    <!--    <PopoverOverlay class="fixed inset-0 bg-black opacity-30" />-->
    <!--    <PopoverOverlay :class="open && 'fixed inset-0'" />-->

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
          class="absolute z-[3] bg-white rounded-xl mt-0.5 w-10 -translate-x-28 transform px-4 sm:px-0 lg:max-w-3xl"
      >

        <div class="overflow-hidden bg-white w-[300px] max-w-[300px] p-4 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
          <div v-if="isLoading" class="flex-center h-32">
            <Loading/>
          </div>
          <div v-else>
            <div class="flex justify-between mb-2">
              <img
                  @click="redirectProfilePage(close)"
                  v-if="user?.avatar_url"
                  alt="avatar"
                  v-bind:src="user.avatar_url"
                  class="rounded-full h-16 w-16 bg-black col-span-1 cursor-pointer"
              />
              <img
                  v-else
                  @click="redirectProfilePage(close)"
                  alt="avatar"
                  src="@/assets/default-avatar.png"
                  class="rounded-full h-16 w-16 bg-black col-span-1 cursor-pointer"
              />

              <ToggleFollowBtn
                  v-if="getUser.id !== user?.id"
                  :show="true"
                  @click="unOrFollow"
                  :isFollowing="user?.is_current_user_following"
              />
            </div>
            <div
                @click="redirectProfilePage(close)"
                class="text-[15px] font-bold text-black hover:underline hover:underline-offset-2 animate cursor-pointer"
            >
              {{ user?.name }}
            </div>
            <div @click="redirectProfilePage(close)" class="text-[15px] text-zinc-500 mb-2 cursor-pointer w-fit">@{{
                user?.username
              }}
            </div>
            <p class="font-normal text-zinc-700 dark:text-zinc-400 text-[15px] mb-2">{{ user?.bio }}</p>
            <div>
              <div class="flex gap-4">
                <div
                    @click="redirectFollowPage('followers')"
                    class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
                >
                  <span class="font-bold text-[14px] text-black">{{ user?.followers_count ?? 0 }}</span>
                  <span class="text-zinc-500 text-[14px]">Follower</span>
                </div>

                <div
                    @click="redirectFollowPage('following')"
                    class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
                >
                  <span class="font-bold text-[14px] text-black">{{ user?.followed_count ?? 0 }}</span>
                  <span class="text-zinc-500 text-[14px]">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>

  </Popover>
</template>


<script setup lang="ts">
import { ref, watch } from "vue";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import Loading from "@/core/components/Loading.vue";
import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";
import { IUser } from "@/types/user";
import { useRouter } from "vue-router";
import { userAPI } from "@/apis/user";
import { MutationEnums } from "@/types/store/root";
import { mapGetters } from "@/lib/map-state";
import { useStore } from "@/store";
import { logger } from "@/core/helper";

const router = useRouter()
const store = useStore()
const { isLoggedIn, getUser } = mapGetters()
const popoverHover = ref(false)
const isLoading = ref(false)
const popoverTimeout = ref()

interface IProps {
  userData?: Partial<IUser>
  username?: string
  classPopover?: string
}

let { userData: userDataFromProp, username, classPopover } = defineProps<IProps>()
const emit = defineEmits<{
  (e: 'onOpenPopover', value: boolean)
}>()

const userNameProp = ref(username ?? userDataFromProp?.username)
const user = ref(null)

const hoverPopover = (e: any, open: boolean): void => {
  popoverHover.value = true

  if (popoverTimeout.value) clearTimeout(popoverTimeout.value)
  popoverTimeout.value = setTimeout(() => {
    if (!open && !isLoading.value) {
      e.target.parentNode.click()
      getProfile()
    }
  }, 300)
}

const closePopover = (close: any): void => {
  popoverHover.value = false

  if (popoverTimeout.value) clearTimeout(popoverTimeout.value)
  popoverTimeout.value = setTimeout(() => {
    if (!popoverHover.value) {
      close()
    }
  }, 300)
}

async function getProfile() {
  if (user.value && user.value?.username === userNameProp.value) {
    return
  }

  if (!userNameProp.value) {
    logger.error('execute getProfile: username is undefined', 'src/components/UserPopper.vue')
    return
  }

  isLoading.value = true
  const { data } = await userAPI.getProfile(userNameProp.value)
  isLoading.value = false

  if (data) {
    user.value = data.user
  }
}

async function unOrFollow() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  if (!user.value || !user.value?.id) {
    logger.error('execute getProfile: user is undefined', 'src/components/UserPopper.vue')
    return
  }

  const { status } = user.value?.is_current_user_following && user.value.is_current_user_following ?
      await userAPI.unfollow(user.value.id) : await userAPI.follow(user.value.id)

  if (status === 200) {
    user.value.is_current_user_following = !user.value?.is_current_user_following
    if (userDataFromProp) {
      userDataFromProp.is_current_user_following = !userDataFromProp?.is_current_user_following
    }
    user.value.followers_count = user.value.is_current_user_following ? user.value.followers_count + 1 : user.value.followers_count - 1
  }
}

function redirectFollowPage(name) {
  localStorage.setItem('state', JSON.stringify(user.value))
  router.push({
    name,
    params: { username: user.value.username, },
  });
}

function redirectProfilePage(close) {
  router.push('/user/' + user.value.username)
  close()
}

watch(popoverHover, (value: any) => {
  emit('onOpenPopover', value)
})

</script>

<style scoped>

</style>
