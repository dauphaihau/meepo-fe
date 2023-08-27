<template>
  <div class="relative"
       @mouseover="isHover = true"
       @mouseleave="isHover = false"
       :class="isHover ? ' z-20' : 'z-10'"
  >
    <div
        class="block max-w-sm flex justify-between items-center px-4 py-2.5 hover:bg-zinc-200/50 animate relative"
        :class="!isOpenPopover && 'cursor-pointer '"
        @click="!isOpenPopover && redirectProfile"
    >
      <div class="flex items-center gap-2">
        <UserPopper v-if="user.avatar_url" :user="user" @onOpenPopover="onOpenPopover">
          <div class="before:absolute">
            <img
                @click="redirectProfile"
                alt="avatar"
                v-bind:src="user.avatar_url"
                class="rounded-full h-10 w-10 bg-black col-span-1"
            />
          </div>
        </UserPopper>
        <UserPopper :user="user" v-else @onOpenPopover="onOpenPopover">
          <div class="before:absolute">
            <div
                @click="redirectProfile"
                class="rounded-full h-10 w-10 bg-black col-span-1"
            />
          </div>
        </UserPopper>

        <div class="mb-1">
          <UserPopper :user="user" @onOpenPopover="onOpenPopover" class=" max-h-[18px]">
            <p
                @click="redirectProfile"
                class="before:absolute text-[15px] font-bold text-zinc-900 hover:underline hover:underline-offset-2"
            >
              {{ user.name ?? '-' }}
            </p>
          </UserPopper>
          <UserPopper :user="user" @onOpenPopover="onOpenPopover" class="mb-1">
            <p @click="redirectProfile" class="text-[15px] font-normal text-zinc-500">
              @{{ user.username ?? '-' }}
            </p>
          </UserPopper>
        </div>

      </div>
    </div>

    <div class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-72 z-30">
      <ToggleFollowBtn
          :show="true"
          :isFollowing="user.is_current_user_following"
          @click="unOrFollow(user)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { userAPI } from "@/apis/user";
import { mapGetters } from "@/lib/map-state";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";
import UserPopper from "@components/UserPopper.vue";

const store = useStore()
const router = useRouter()
const route = useRoute()
const isHover = ref(false)
const isOpenPopover = ref(false)

const { getUser, isLoggedIn, getStateRouter } = mapGetters()
const { user } = defineProps<{user: IUser}>()

const currentRouteUsername = route.params.username
const currentRouteName = route.name

onMounted(() => {})

const unOrFollow = async (user: IUser) => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  const { status } = user.is_current_user_following ? await userAPI.unfollow(user.id) : await userAPI.follow(user.id)

  if (status === 200) {
    user.is_current_user_following = !user.is_current_user_following
  }
}

const redirectProfile = () => {
  if (!isOpenPopover.value) {
    return
  }
  router.push('/user/' + user.username)
}

const onOpenPopover = (val) => {
  isOpenPopover.value = val
}

</script>

<style scoped>

</style>
