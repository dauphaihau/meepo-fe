<template>
  <nav
      class="fixed bottom-0 w-full z-[3] transition-all duration-500  border-t"
      :class="{'opacity-50': direction === 'down'}"
  >
    <div class="grid grid-cols-4 gap-4 bg-white h-[52px] w-full">

      <router-link
          class="link" to="/home"
          v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <HomeIcon v-if="isActive"/>
        <HomeIconOutline v-else/>
      </router-link>

      <router-link
          class="link" to="/explore"
          v-slot="{ href, navigate, isActive, isExactActive }"
      >
        <MagnifyingGlassIcon :class="( route.name === 'search' || isActive ) && 'active' && 'stroke-[3]'"/>
      </router-link>

      <router-link
          v-if="isLoggedIn" class="link" :to="'/user/' + getUser.username"
          v-slot="{ href,  navigate, isActive, isExactActive }"
          active-class="active"
      >
        <UserIcon v-if="route.name === 'profile'"/>
        <UserIconOutline v-else/>
      </router-link>
<!--      <div class="link opacity-30">-->
<!--        <BellIcon v-if="route.name === 'notifications'"/>-->
<!--        <BellIconOutline v-else/>-->
<!--      </div>-->

      <router-link
          class="link"
          to="/messages"
          v-slot="{ href,  navigate, isActive, isExactActive }"
          active-class="active"
      >
        <EnvelopeIcon v-if="route.name === 'messages'"/>
        <EnvelopeIconOutline v-else/>
      </router-link>
    </div>
  </nav>

</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { HomeIcon, UserIcon, EnvelopeIcon, BellIcon } from "@heroicons/vue/20/solid"
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  MagnifyingGlassIcon,
  EnvelopeIcon as EnvelopeIconOutline,
  BellIcon as BellIconOutline,
} from "@heroicons/vue/24/outline"

import { mapGetters } from "@/lib/map-state";
import { useScrollDirection } from "@/core/hooks/useScrollDirection";

const { getUser, isLoggedIn } = mapGetters()

const direction = useScrollDirection()
const route = useRoute()
const router = useRouter()

</script>

<style scoped>

.link {
  @apply
  flex items-center justify-center gap-3
  text-black text-2xl md:hover:bg-zinc-200 animate py-2 px-3 lg:px-4 rounded-full md:w-fit cursor-pointer
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
