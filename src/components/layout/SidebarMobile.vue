<template>
  <div class="md:hidden">

    <!-- Overlay -->
    <div
        v-if="show"
        @click="() => emit('setShowSidebar', false)"
        class="fixed inset-0 bg-black opacity-30 z-[9] h-screen"
    />

    <div
        class="fixed top-0 min-h-0 h-screen bg-white w-[75%] transition-all duration-500 z-[10] py-3"
        :class="show ? 'left-0' : '-left-80'"
    >
      <router-link class="px-3 block w-fit" :to="'/user/' + getUser.username">
        <img
            v-if="getUser.avatar_url"
            alt="avatar"
            :src="getUser.avatar_url"
            class="h-10 w-10 lg:h-10 lg:w-10 rounded-full "
        />
        <img
            v-else
            alt="avatar"
            src="@/assets/default-avatar.png"
            class="h-10 w-10 lg:h-10 lg:w-10 rounded-full "
        />
      </router-link>

      <div class="mt-2 space-y-2 px-3">
        <div>
          <h3 class="text-[15px] font-bold  text-zinc-900">{{ getUser?.name }}</h3>
          <p class="max-w-2xl text-sm text-zinc-500">@{{ getUser?.username }}</p>
        </div>
        <div class="flex gap-4 ">
          <div
              @click="redirect('followers')"
              class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
          >
            <span class="font-bold text-[14px]">{{ getUser?.followers_count ?? 0 }}</span>
            <span class="text-zinc-500 text-[14px]">Follower</span>
          </div>

          <div
              @click="redirect('following')"
              class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
          >
            <span class="font-bold text-[14px]">{{ getUser?.followed_count ?? 0 }}</span>
            <span class="text-zinc-500 text-[14px]">Following</span>
          </div>
        </div>

      </div>

      <div class="mt-3">
        <router-link
            v-if="isLoggedIn" class="link" :to="'/user/' + getUser.username"
            v-slot="{ href,  navigate, isActive, isExactActive }"
            active-class="active"
        >
          <UserIcon v-if="route.name === 'profile'"/>
          <UserIconOutline v-else/>
          <p>Profile</p>
        </router-link>
        <div
            v-if="isLoggedIn"
            class="link opacity-50"
        >
          <BellIconOutline/>
          <p>Notifications</p>
        </div>
        <div
            v-if="isLoggedIn"
            class="link opacity-50"
        >
          <BookmarkIconOutline/>
          <p>Bookmarks</p>
        </div>

      </div>

      <div class="border-t mx-4 my-1"/>


      <!--    Settings and Support    -->
      <div>
        <div class="flex trigger justify-between items-center px-3" @click="openSetting = !openSetting">
          <div class="!text-[15px] font-semibold">
            Settings and Support
          </div>
          <ChevronDownIcon v-if="!openSetting" class="h-4 w-4"/>
          <ChevronUpIcon v-else class="h-4 w-4 text-zinc-500"/>
        </div>
        <div class="child-trigger" @click="logout" v-if="openSetting">
          <ArrowLeftOnRectangleIcon/>
          Log Out
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { UserIcon } from "@heroicons/vue/20/solid"
import {
  UserIcon as UserIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  BellIcon as BellIconOutline,
  ChevronDownIcon, ChevronUpIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/vue/24/outline"

import { mapGetters } from "@/lib/map-state";
import { store } from "@/store";
import { ActionEnums } from "@/types/store/root";

const { show } = defineProps<{show: boolean}>()
const emit = defineEmits<{(e: 'setShowSidebar', value: boolean): void}>()

const router = useRouter()
const route = useRoute()

const { getUser, isLoggedIn } = mapGetters()

const openSetting = ref(false)

const logout = () => {
  store.dispatch(ActionEnums.LOGOUT)
  router.push({ name: 'explore' })
}

function redirect(name) {
  localStorage.setItem('state', JSON.stringify(getUser.value))
  router.push({
    name,
    params: { username: getUser.value.username, },
  });
}

</script>


<style scoped>

.base {
  @apply flex items-center gap-4 hover:bg-zinc-100/80 animate text-black cursor-pointer px-3
}

.link {
  @apply base text-2xl py-3
}

.link svg {
  @apply h-6 w-6 stroke-[2]
}

.link p {
  @apply tracking-wide font-semibold text-[20px]
}


.trigger {
  @apply base text-[15px] py-2.5
}

.child-trigger {
  @apply base text-[15px] py-[10px] font-semibold
}

.child-trigger svg {
  @apply h-5 w-5
}

.trigger svg {
  @apply h-5 w-5
}

</style>
