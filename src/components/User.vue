<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { userService } from '@/services/user';
import { mapGetters } from '@/lib/map-state';
import { useStore } from '@/store';
import { MutationEnums } from '@/types/store/root';
import { IUser } from '@/types/user';
import ToggleFollowBtn from '@components/ToggleFollowBtn.vue';
import UserPopper from '@components/UserPopper.vue';
import { logger, truncateText } from '@/core/helper';
import { useMediaQuery } from '@vueuse/core';
import { StatusCodes } from 'http-status-codes';

const store = useStore();
const router = useRouter();
const isTabletScreen = useMediaQuery('(min-width: 768px)');

const isHover = ref(false);
const isOpenPopover = ref(false);
const keyUserPopper = ref(0);

const { getUser, isLoggedIn } = mapGetters();
const { user } = defineProps<{user: IUser}>();
const is_current_user_following = ref(user.is_current_user_following);

const unOrFollow = async () => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
    return;
  }

  if (!user || !user?.id) {
    logger.error('execute unOrFollow: user is undefined', 'src/components/User.vue');
    return;
  }

  const { status } = is_current_user_following.value ?
    await userService.unfollow(user.id) :
    await userService.follow(user.id);

  if (status === StatusCodes.OK) {
    is_current_user_following.value = !is_current_user_following.value;
    keyUserPopper.value++;
  }
};

const redirectProfile = () => {
  router.push('/user/' + user.username);
};

const onOpenPopover = (val) => {
  isOpenPopover.value = val;
};

</script>

<template>
  <div
    class="relative"
    :class="{'z-[1]': isHover}"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      class="block px-4 py-3 bg-white flex flex-col animate hover:bg-zinc-100"
      :class="{'cursor-pointer': !isOpenPopover }"
      @click="!isOpenPopover && redirectProfile()"
    >
      <div class="flex flex-grow">
        <UserPopper
          :key="keyUserPopper"
          :user-data="user"
          class="mr-3 min-w-[40px] h-10"
          @on-open-popover="onOpenPopover"
        >
          <img
            v-if="user.avatar_url"
            alt="avatar"
            :src="user.avatar_url"
            class="rounded-full h-10 w-10 bg-black "
            @click="redirectProfile"
          >
          <img
            v-else
            alt="avatar"
            src="@/assets/default-avatar.png"
            class="rounded-full h-10 w-10 bg-black "
            @click="redirectProfile"
          >
        </UserPopper>

        <div class="text-[15px]">
          <UserPopper
            :key="keyUserPopper"
            :user-data="user"
            class="h-5"
            @on-open-popover="onOpenPopover"
          >
            <div
              class="font-bold text-black hover:underline hover:underline-offset-2 animate"
              @click="redirectProfile"
            >
              @{{ truncateText(user?.name, isTabletScreen ? 25 : 15, '...') }}
            </div>
          </UserPopper>
          <UserPopper
            :user-data="user"
            class="h-5"
          >
            <div
              class="text-zinc-500"
              @click="redirectProfile"
            >
              @{{ truncateText(user?.username, isTabletScreen ? 25 : 15, '...') }}
            </div>
          </UserPopper>
        </div>
      </div>
    </div>

    <div
      v-if="getUser.id !== user.id"
      class="absolute top-4 right-5"
    >
      <ToggleFollowBtn
        :show="isLoggedIn"
        :is-following="is_current_user_following"
        @click="unOrFollow"
      />
<!--        :is-following="user.is_current_user_following"-->
    </div>
  </div>
</template>

<style scoped>

</style>
