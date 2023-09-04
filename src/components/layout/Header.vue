<template>
  <header class="header">
    <nav class="nav" aria-label="Global">
      <div class="w-[275px] xl:w-[241px]">
        <router-link to="/" class="flex gap-1 items-center  h-full w-fit 2xl:pl-2 pl-2.5">
          <img class="h-10 w-auto" src="@assets/logo.png" alt=""/>
          <span class="text-xl font-bold text-black">Meepo</span>
        </router-link>
      </div>

      <div class="lg:hidden">
        <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700"
            @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
        </button>
      </div>

      <!--      Search bar-->
      <SearchAll
          v-if="routerIsReady"
          :query="query"
          @changeRoute="changeRoute"
          :key="keySearchAllComp"
      />

      <div class="hidden lg:block lg:flex lg:flex-1 lg:justify-end items-center">
        <LoginDialog/>
        <RegisterDialog/>
        <Menu v-if="isLoggedIn" as="div" class="ml-2 relative inline-block text-left">
          <MenuButton>
            <div class="flex gap-2 hover:bg-zinc-300/50 py-1 pl-1 pr-3.5 rounded-full animate">
              <img
                  v-if="getUser.avatar_url"
                  alt="avatar"
                  :src="getUser.avatar_url"
                  class="h-10 w-10 rounded-full "
              />
              <img
                  v-else
                  alt="avatar"
                  src="@/assets/default-avatar.png"
                  class="h-10 w-10 rounded-full "
              />
              <div class="text-left max-w-[150px]">
                <h3 class="text-[13px] font-bold text-zinc-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ getUser?.name }}</h3>
                <p class="max-w-2xl text-sm text-zinc-500 overflow-hidden text-ellipsis">@{{ getUser?.username }}</p>
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
            <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="">
                <!--              <div class="py-1">-->

                <div class="rounded-tl-md"></div>

                <MenuItem v-slot="{ active }">
                  <a
                      href="#"
                      :class="[active ? 'bg-zinc-100 text-zinc-900 rounded-tl-md rounded-tr-md' : 'text-zinc-700', 'block px-4 py-2 text-sm']"
                  >Account settings</a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                      href="#"
                      :class="[active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm']"
                  >Support</a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                      href="#"
                      :class="[active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm']"
                  >License</a>
                </MenuItem>

                <MenuItem v-slot="{ active }">
                  <span
                      class="cursor-pointer"
                      @click="logout"
                      :class="[active ? 'bg-zinc-100 text-zinc-900 rounded-bl-md rounded-br-md' : 'text-zinc-700', 'block px-4 py-2 text-sm']"
                  >Logout</span>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import { Bars3Icon, } from '@heroicons/vue/24/outline'
import LoginDialog from "@/components/dialog/LoginDialog.vue";
import RegisterDialog from "@/components/dialog/RegisterDialog.vue";
import { ActionEnums } from "@/types/store/root";
import { useStore } from "@/store";
import { mapGetters } from "@/lib/map-state";
import SearchAll from "@components/layout/SearchBar.vue";
import { useRoute, useRouter } from "vue-router";

const store = useStore()
const route = useRoute()
const router = useRouter()

const { getOpenLoginDialog: isOpenDialog, isLoggedIn, getUser } = mapGetters()

const mobileMenuOpen = ref(false)
const routerIsReady = ref(false)
const keySearchAllComp = ref(0)
const query = ref('')

onMounted(async () => {
  await router.isReady()
  routerIsReady.value = true

  if (route.query?.q) {
    query.value = route.query.q as string
  }
})

const changeRoute = () => {
  keySearchAllComp.value++
}

watch(router.currentRoute, () => {
  if (route.query?.q) {
    query.value = route.query.q as string
    keySearchAllComp.value++
  }
})

const logout = () => store.dispatch(ActionEnums.LOGOUT)

</script>

<style scoped>
.header {
  @apply bg-white fixed top-0 w-full z-40 h-fit  border-b border-zinc-200 px-6;
}

.nav {
  @apply mx-auto max-w-7xl xl:max-w-[76rem] py-2 flex
}
</style>
