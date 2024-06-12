<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

import { UserInGetList } from '@/types/user';
import UserPopper from '@components/UserPopper.vue';
import { truncateText } from '@core/helpers/common.ts';
import { useAuthStore } from '@stores/auth.ts';
import ToggleFollowBtn from '@components/ToggleFollowBtn.vue';
import { PAGE_PATHS } from '@config/const.ts';
import AvatarUser from '@components/AvatarUser.vue';

type TProps = {
  user: UserInGetList
};

const router = useRouter();
const minTabletScreen = useMediaQuery('(min-width: 768px)');
const authStore = useAuthStore();

const isHover = ref(false);
const isOpenPopover = ref(false);

const props = defineProps<TProps>();
const user = ref<UserInGetList>({ ...props.user });

const redirectProfile = () => {
  if (user.value?.username) {
    router.push(`${PAGE_PATHS.USER}/${user.value.username}`);
  }
};

const onOpenPopover = (val: boolean) => {
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
      class="px-4 py-3 bg-white flex flex-col animate hover:bg-zinc-100"
      :class="{'cursor-pointer': !isOpenPopover }"
      @click="!isOpenPopover && redirectProfile()"
    >
      <div class="flex flex-grow">
        <UserPopper
          :username="user.username"
          class="mr-3 min-w-[40px] h-10"
          @on-open-popover="onOpenPopover"
        >
          <AvatarUser
            :avatar-url="user.avatar_url"
            :username="user.username"
          />
        </UserPopper>

        <div class="text-[15px]">
          <UserPopper
            :username="user.username"
            class="h-5"
            @on-open-popover="onOpenPopover"
          >
            <div
              class="font-bold text-black hover:underline hover:underline-offset-2 animate"
              @click="redirectProfile"
            >
              @{{ truncateText(user?.name, minTabletScreen ? 25 : 15, '...') }}
            </div>
          </UserPopper>

          <UserPopper
            :username="user.username"
            class="h-5"
          >
            <div
              class="text-zinc-500"
              @click="redirectProfile"
            >
              @{{ truncateText(user?.username, minTabletScreen ? 25 : 15, '...') }}
            </div>
          </UserPopper>
        </div>
      </div>
    </div>

    <div
      v-if="authStore.user?.id !== user.id"
      class="absolute top-4 right-5"
    >
      <ToggleFollowBtn
        v-model="user.is_current_user_following"
        :user-id="user.id"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
