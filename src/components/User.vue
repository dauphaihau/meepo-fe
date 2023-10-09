<template>
  <div
      class="relative"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
      :class="{'z-[1]': isHover}"
  >
    <div
        class="block px-4 py-3 bg-white flex flex-col animate hover:bg-zinc-100"
        :class="{'cursor-pointer': !isOpenPopover }"
        @click="!isOpenPopover && redirectProfile()"
    >
      <div class="flex flex-grow">
        <UserPopper :key="keyUserPopper" :userData="user" @onOpenPopover="onOpenPopover" class="mr-3 min-w-[40px] h-10">
          <img
              v-if="user.avatar_url"
              @click="redirectProfile"
              alt="avatar"
              v-bind:src="user.avatar_url"
              class="rounded-full h-10 w-10 bg-black "
          />
          <img
              v-else
              @click="redirectProfile"
              alt="avatar"
              src="@/assets/default-avatar.png"
              class="rounded-full h-10 w-10 bg-black "
          />
        </UserPopper>

        <div class="text-[15px]">
          <UserPopper :key=keyUserPopper :userData="user" @onOpenPopover="onOpenPopover" class="h-5">
            <div
                @click="redirectProfile"
                class="font-bold text-black hover:underline hover:underline-offset-2 animate"
            >

              @{{ truncateText(user?.name, isTabletScreen ? 25 : 15, '...') }}
            </div>
          </UserPopper>
          <UserPopper :userData="user" class="h-5">
            <div @click="redirectProfile" class="text-zinc-500">
              @{{ truncateText(user?.username, isTabletScreen ? 25 : 15, '...') }}
            </div>
          </UserPopper>
        </div>
      </div>
    </div>

    <div class="absolute top-4 right-5" v-if="getUser.id !== user.id">
      <ToggleFollowBtn
          :show="isLoggedIn"
          :isFollowing="user.is_current_user_following"
          @click="unOrFollow"
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
import { logger, truncateText } from "@/core/helper";
import { useMediaQuery } from "@vueuse/core";

const store = useStore()
const router = useRouter()
const route = useRoute()
const isTabletScreen = useMediaQuery('(min-width: 768px)')

const isHover = ref(false)
const isOpenPopover = ref(false)
const keyUserPopper = ref(0)

const { getUser, isLoggedIn } = mapGetters()
const { user } = defineProps<{user: IUser}>()

const currentRouteName = route.name

onMounted(() => {})

const unOrFollow = async () => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }

  if (!user || !user?.id) {
    logger.error('execute unOrFollow: user is undefined', 'src/components/User.vue')
    return
  }

  const { status } = user.is_current_user_following ? await userAPI.unfollow(user.id) : await userAPI.follow(user.id)

  if (status === 200) {
    user.is_current_user_following = !user.is_current_user_following
    keyUserPopper.value++
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
