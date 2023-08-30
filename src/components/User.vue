<template>
  <div
      class="relative"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
      :class="{
        'z-[1]' : isHover,
      }"
  >
    <div class="block px-4 py-3 bg-white flex flex-col animate  hover:bg-zinc-100">
      <div
          class="flex flex-grow"
          :class="!isOpenPopover && 'cursor-pointer'"
          @click="!isOpenPopover && redirectProfile"
      >
        <UserPopper :user="user" @onOpenPopover="onOpenPopover" class="mr-3 min-w-[40px]">
          <img
              v-if="user.avatar_url"
              @click="redirectProfile"
              alt="avatar"
              v-bind:src="user.avatar_url"
              class="rounded-full h-10 w-10 bg-black col-span-1"
          />
          <img
              v-else
              @click="redirectProfile"
              alt="avatar"
              src="@/assets/default-avatar.png"
              class="rounded-full h-10 w-10 bg-black col-span-1"
          />
        </UserPopper>

        <div class="col-span-10">
          <div class=" text-[15px]">

            <div class="flex justify-between items-center">
              <div>

                <UserPopper :user="user" @onOpenPopover="onOpenPopover">
                  <div
                      @click="redirectProfile"
                      class="font-bold text-black hover:underline hover:underline-offset-2 animate"
                  >{{ user.name }}</div>
                </UserPopper>

                <UserPopper :user="user">
                  <div @click="redirectProfile" class="text-zinc-500">@{{ user.username }}</div>
                </UserPopper>
                <!--                <UserPopper :user="user" @onOpenPopover="onOpenPopover">-->
                <!--                  <div @click="redirectProfile" class="text-zinc-500">@{{ user.username }}</div>-->
                <!--                </UserPopper>-->
              </div>
            </div>

            <p v-if="user.bio" class="font-normal text-gray-700 dark:text-gray-400 text-[15px]">{{ user.bio }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute top-4 right-5" v-if="getUser.id !== user.id">
      <ToggleFollowBtn
          :show="isLoggedIn"
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
  router.push('/user/' + user.username)
}

const onOpenPopover = (val) => {
  isOpenPopover.value = val
}

</script>

<style scoped>

</style>
