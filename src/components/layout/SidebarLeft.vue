<template>
  <header>

    <div class="w-[90px] lg:min-w-[259px] xl:w-[259px]"></div>

    <div class="fixed top-3 lg:top-2 h-[85%] w-[90px] xl:w-[259px] lg:pl-[23px] xl:pl-0">
      <div class="flex flex-col h-full">
        <div class="flex flex-col items-center lg:items-start gap-4 lg:gap-6 mb-6">

          <router-link
              :to="isLoggedIn ? '/home' : '/explore' "
              class="font-black text-black font-[Alphabets4] py-2 px-3 lg:px-4 text-4xl "
          >m
          </router-link>

          <router-link
              v-if="isLoggedIn"
              class="link" to="/home"
              v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <HomeIcon v-if="isActive"/>
            <HomeIconOutline v-else/>
            <p :class="isActive && 'active'">Home</p>
          </router-link>

          <router-link
              class="link" to="/explore"
              v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <MagnifyingGlassIcon :class="( route.name === 'search' || isActive ) && 'active' && 'stroke-[3]'"/>
            <p :class="( route.name === 'search' || isActive ) && 'active'">Explore</p>
          </router-link>

          <router-link
              v-if="isLoggedIn" class="link" :to="'/user/' + getUser.username"
              v-slot="{ href,  navigate, isActive, isExactActive }"
              active-class="active"
          >
            <UserIcon v-if="route.name === 'profile'"/>
            <UserIconOutline v-else/>
            <p :class="route.name === 'profile' && 'active'">Profile</p>
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
            <p>Bookmark</p>
          </div>

          <div class="link opacity-50">
            <SettingIconOutline/>
            <p>Settings</p>
          </div>

        </div>
        <AddOrUpdatePost responsive v-if="isLoggedIn"/>
      </div>
    </div>

    <div class="fixed bottom-5 ml-[26px] lg:ml-0 z-[9]">
      <Menu v-if="isLoggedIn" as="div" class="relative">
        <MenuButton>
          <div class="flex gap-2 hover:bg-zinc-300/50 lg:py-2 lg:pl-2 lg:pr-6 rounded-full animate">
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
            <div class="hidden lg:block text-left max-w-[150px]">
              <h3 class="text-[13px] font-bold text-zinc-900 overflow-hidden text-ellipsis whitespace-nowrap">
                {{ getUser?.name }}
              </h3>
              <p class="text-sm text-zinc-500 overflow-hidden text-ellipsis whitespace-nowrap">@{{ getUser?.username }}</p>
            </div>
          </div>
        </MenuButton>

        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute left-0 bottom-14 lg:bottom-16 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="">
              <!--              <div class="py-1">-->
              <div class="rounded-tl-lg"></div>
              <MenuItem v-slot="{ active }">
                <a
                    v-tooltip="'Not available'"
                    href="#"
                    :class="[active ? 'bg-zinc-100 text-zinc-900 rounded-tl-2xl rounded-tr-2xl' : 'text-zinc-700', 'block px-4 py-2 text-sm']"
                >Add an existing account</a>
              </MenuItem>

              <MenuItem v-slot="{ active }">
                <span
                    class="cursor-pointer"
                    @click="logout"
                    :class="[active ? 'bg-zinc-100 text-zinc-900 rounded-bl-2xl rounded-br-2xl' : 'text-zinc-700', 'block px-4 py-2 text-sm']"
                >Logout</span>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { mapGetters } from "@/lib/map-state";
import AddOrUpdatePost from "@components/dialog/AddOrUpdatePost.vue";
import { HomeIcon, UserIcon, BellIcon } from "@heroicons/vue/20/solid"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  Cog8ToothIcon as SettingIconOutline,
  BellIcon as BellIconOutline,
  MagnifyingGlassIcon
} from "@heroicons/vue/24/outline"
import { useRoute, useRouter } from "vue-router";
import { ActionEnums } from "@/types/store/root";
import { store } from "@/store";

const { getUser, isLoggedIn } = mapGetters()

const logout = () => {
  store.dispatch(ActionEnums.LOGOUT)
  router.push({ name: 'explore' })
}

const route = useRoute()
const router = useRouter()

</script>

<style scoped>

.link {
  @apply
  flex items-center gap-3
  text-black text-2xl hover:bg-zinc-200 animate py-2 px-3 lg:px-4 rounded-full w-fit cursor-pointer
}

.link .active {
  @apply font-bold
}

.link svg {
  @apply h-7 w-7
}

.link p {
  @apply hidden xl:block tracking-wide
}

</style>
