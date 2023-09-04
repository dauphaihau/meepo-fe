<template>
  <div class="w-[90px] xl:w-[259px]"></div>

  <div class="fixed top-[11%] h-[85%] w-[90px] xl:w-[259px] pl-[23px] xl:pl-0 z-[2]">
    <div class="flex flex-col h-full">

      <div class="flex flex-col gap-6 mb-6">

        <router-link
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

        <div class="link opacity-50">
          <BellIconOutline/>
          <p>Notifications</p>
        </div>

        <div class="link opacity-50">
          <BookmarkIconOutline/>
          <p>Bookmark</p>
        </div>

        <div class="link opacity-50">
          <SettingIconOutline/>
          <p>Settings</p>
        </div>

      </div>
      <AddOrUpdatePost responsive v-if="isLoggedIn"/>
      <About class="grow flex flex-col justify-end ml-3"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapGetters } from "@/lib/map-state";
import AddOrUpdatePost from "@components/dialog/AddOrUpdatePost.vue";
import { HomeIcon, UserIcon, BellIcon } from "@heroicons/vue/20/solid"
// import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid"
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  Cog8ToothIcon as SettingIconOutline,
  BellIcon as BellIconOutline,
  MagnifyingGlassIcon
} from "@heroicons/vue/24/outline"
import { useRoute, useRouter } from "vue-router";
import About from "@components/About.vue";

const { getUser, isLoggedIn } = mapGetters()

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
