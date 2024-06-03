<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import {
  CakeIcon, CalendarDaysIcon, EnvelopeIcon, LinkIcon, MapPinIcon
} from '@heroicons/vue/24/outline';
import { useMediaQuery } from '@vueuse/core';

import UpdateUserDialog from '@/components/dialog/UpdateUserDialog.vue';
import { useGetProfileUser, userService } from '@/services/user';
import { mapGetters } from '@/lib/map-state';
import { MutationEnums } from '@/types/store/root';
import { IUser } from '@/types/user';
import { useStore } from '@/store';
import Link from '@/core/components/Link.vue';
import ToggleFollowBtn from '@components/ToggleFollowBtn.vue';
import { formatTextWithHashTags, truncateText } from '@/core/helper';
import { StatusCodes } from 'http-status-codes';

type User = IUser & { hostWebsite?: string };

const route = useRoute();
const router = useRouter();
const store = useStore();
const isTabletScreen = useMediaQuery('(min-width: 768px)');

const { getUser, isLoggedIn } = mapGetters();

const isUserNotExist = ref(false);
const isFollowing = ref(false);
const keyPostsComp = ref(0);
const keyUpdateUserDialog = ref(0);

const currentRouteUsername = route.params.username;

const {
  data,
  isFetched,
} = useGetProfileUser(route.params.username as string);

const user = ref<User>(null);

watch(isFetched, () => {
  if (data.value?.user) {
    user.value = { ...data.value.user };
    user.value.created_at = dayjs(user.value.created_at).format('MMMM YYYY');
    user.value.hostWebsite = user.value.website && user.value.website.includes('http') ? new URL(user.value.website).host : user.value.website;

    isFollowing.value = data.value.user?.is_current_user_following;
  }
}, { immediate: true });

async function unOrFollow() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
    return;
  }
  const { status } = isFollowing.value ?
    await userService.unfollow(user.value.id) :
    await userService.follow(user.value.id);
  if (status === StatusCodes.OK) {
    isFollowing.value = !isFollowing.value;
  }
}

const onUpdateProfile = (values: Partial<IUser>) => {
  values.created_at = dayjs(values.created_at).format('MMMM YYYY');
  if (values.website) {
    user.value.hostWebsite = values.website && values.website.includes('http') ? new URL(values.website).host : values.website;
  }
  user.value = { ...user.value, ...values };
  keyPostsComp.value++;
  setTimeout(() => {
    keyUpdateUserDialog.value++;
  }, 500);
};

function redirectPage(name: string) {
  localStorage.setItem('state', JSON.stringify(user.value));
  router.push({
    name,
    params: { username: currentRouteUsername },
  });
}

function onClickMessage() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true);
    return;
  }

  if (!isTabletScreen.value) {
    localStorage.setItem('room', JSON.stringify({
      participant_username: user.value.username,
      participant_name: user.value.name,
      participant_avatar_url: user.value.avatar_url,
    }));
    router.push('/room');
    return;
  }
  store.commit(MutationEnums.MESSAGE_TO_USER, {
    username: user.value.username,
    name: user.value.name,
  });
}

</script>

<template>
  <div v-if="user">
    <!--    Background-->
    <div class="bg-zinc-300 h-32 md:h-[198px]">
      <input
        id="file"
        type="file"
        name="file"
        class="invisible h-32 md:h-[198px]"
      >
      <!--          @change="set"-->
    </div>

    <!--      Avatar, Edit user-->
    <div class="px-4 -mt-10 md:-mt-20">
      <div class="flex justify-between items-center">
        <div class="rounded-full ring-white ring-4 bg-white mb-4">
          <img
            v-if="user?.avatar_url"
            alt="avatar"
            :src="user?.avatar_url"
            class="avatar"
          >
          <img
            v-else
            alt="avatar"
            src="@/assets/default-avatar.png"
            class="avatar"
          >
        </div>

        <div class="pt-10 md:pt-16">
          <div v-if="!isUserNotExist">
            <div
              v-if="currentRouteUsername !== getUser.username"
              class="flex items-center gap-2"
            >
              <div class="flex-center p-1.5 border border-zinc-300 rounded-full">
                <EnvelopeIcon
                  v-tooltip="'Message'"
                  class="h-[21px] w-[21px] cursor-pointer"
                  aria-hidden="true"
                  @click="onClickMessage"
                />
              </div>

              <ToggleFollowBtn
                :show="true"
                :is-following="isFollowing"
                @click="unOrFollow"
              />
            </div>
          </div>
          <UpdateUserDialog
            v-if="currentRouteUsername === getUser.username && user"
            :key="keyUpdateUserDialog"
            :user="user"
            @on-update-profile="onUpdateProfile"
          />
        </div>
      </div>

      <div class="sm:px-0 flex justify-between items-center mb-4">
        <div class="space-y-3 w-full">
          <!--        Name, Username, Follow - Message btn   -->
          <div class="flex justify-between">
            <div>
              <h3 class="text-[20px] font-bold  text-zinc-900">
                {{ truncateText(user?.name, 20, '...') }}
              </h3>
              <p
                v-if="!isUserNotExist"
                class="max-w-2xl text-sm text-zinc-500"
              >
                @{{ truncateText(user?.username, 20, '...') }}
              </p>
              <h3
                v-else
                class="text-[20px] font-bold  text-zinc-900"
              >
                @{{ truncateText(route.params?.username.toString(), 20, '...') }}
              </h3>
            </div>
          </div>

          <p
            v-if="user?.bio"
            v-html="formatTextWithHashTags(user.bio)"
          />

          <!--          Location, Calendar-->
          <div class="flex flex-wrap gap-4 items-center">
            <div
              v-if="user?.location"
              class="flex gap-1 items-center"
            >
              <MapPinIcon
                class="h-5 w-5 text-zinc-500 text-[15px]"
                aria-hidden="true"
              />
              <div class="text-zinc-500 text-[15px]">
                {{ user.location }}
              </div>
            </div>

            <div
              v-if="user?.dob"
              class="flex gap-1 items-center"
            >
              <CakeIcon
                class="h-5 w-5 text-zinc-500 text-[15px]"
                aria-hidden="true"
              />
              <div class="text-zinc-500 text-[15px]">
                Born {{ dayjs(user.dob).format('MMMM DD, YYYY') }}
              </div>
            </div>

            <div
              v-if="user?.website"
              class="flex gap-1 items-center"
            >
              <LinkIcon
                class="h-5 w-5 text-zinc-500 text-[15px]"
                aria-hidden="true"
              />
              <Link
                :to="user.website.includes('http') ? user.website : `https://${user.website}`"
                class=" text-[15px] text-[#4a99e9] hover:underline hover:underline-offset-2 font-normal"
              >
                {{ user.hostWebsite }}
              </Link>
            </div>

            <div
              v-if="user?.created_at"
              class="flex gap-1 items-center"
            >
              <CalendarDaysIcon
                class="h-5 w-5 text-zinc-500 text-[15px]"
                aria-hidden="true"
              />
              <div class="text-zinc-500 text-[15px]">
                Joined {{ user.created_at }}
              </div>
            </div>
          </div>

          <!--                    Count following, follow-->
          <div
            v-if="!isUserNotExist"
            class="flex gap-4 "
          >
            <div
              class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
              @click="redirectPage('followers')"
            >
              <span class="font-bold text-[14px]">{{ user?.followers_count ?? 0 }}</span>
              <span class="text-zinc-500 text-[14px]">Follower</span>
            </div>

            <div
              class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
              @click="redirectPage('following')"
            >
              <span class="font-bold text-[14px]">{{ user?.followed_count ?? 0 }}</span>
              <span class="text-zinc-500 text-[14px]">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.avatar {
  @apply rounded-full h-[81.5px] w-[81.5px] md:h-[133.5px] md:w-[133.5px];
}

</style>
