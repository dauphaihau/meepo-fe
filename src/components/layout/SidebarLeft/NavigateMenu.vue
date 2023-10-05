<template>
  <nav>
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
      <p>Bookmarks</p>
    </div>

    <div class="link opacity-50">
      <SettingIconOutline/>
      <p>Settings</p>
    </div>

  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { HomeIcon, UserIcon } from "@heroicons/vue/20/solid"
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  Cog8ToothIcon as SettingIconOutline,
  BellIcon as BellIconOutline,
  MagnifyingGlassIcon,
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
