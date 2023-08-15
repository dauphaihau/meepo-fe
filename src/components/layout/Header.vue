<template>
  <header class="header">
    <nav class="nav" aria-label="Global">
      <div class="col-span-1">
        <router-link to="/" class="flex gap-1 items-center  h-full w-fit 2xl:pl-2">
          <img class="h-10 w-auto" src="../../assets/logo.png" alt=""/>
          <span class="text-xl font-bold text-black">Meepo</span>
        </router-link>
      </div>

      <div class="col-span-1 lg:hidden">
        <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
        </button>
      </div>

      <div class="col-span-3"></div>

      <div class="hidden lg:block col-span-1 lg:flex lg:flex-1 lg:justify-end items-center">

        <LoginDialog v-if="!isLoggedIn"/>
        <SignUpDialog v-if="!isLoggedIn"/>

        <Menu v-if="isLoggedIn" as="div" class="ml-2 relative inline-block text-left">
          <div>
            <MenuButton>
              <div class="h-8 w-8 bg-zinc-300 flex justify-center items-center rounded-full cursor-pointer text-black">
                {{ getUser.name ? getUser.name.charAt(0).toUpperCase() : '' }}
              </div>
            </MenuButton>
          </div>

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
                      :class="[active ? 'bg-gray-100 text-gray-900 rounded-tl-md rounded-tr-md' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                  >Account settings</a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                      href="#"
                      :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                  >Support</a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                      href="#"
                      :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                  >License</a>
                </MenuItem>

                <MenuItem v-slot="{ active }">
                  <span
                      @click="logout"
                      :class="[active ? 'bg-gray-100 text-gray-900 rounded-bl-md rounded-br-md' : 'text-gray-700', 'block px-4 py-2 text-sm']"
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
import { ref } from 'vue'

import { Bars3Icon, } from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import LoginDialog from "@/components/dialog/LoginDialog.vue";
import SignUpDialog from "@/components/dialog/RegisterDialog.vue";
import { mapGetters } from "@/lib/map-state";
import { ActionEnums } from "@/store/types";
import { useStore } from "@/store";

const store = useStore()


const { isLoggedIn, getUser } = mapGetters()
const mobileMenuOpen = ref(false)

const logout = () => store.dispatch(ActionEnums.LOGOUT)

</script>

<style scoped>
.header {
  @apply bg-white fixed top-0 w-full z-50 h-fit  border-b border-zinc-200 px-6;
}

.nav {
  @apply mx-auto grid grid-cols-5 max-w-7xl py-2 lg:px-0
}

</style>
