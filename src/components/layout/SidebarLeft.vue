<template>
<!--  <div class="w-[275px] xl:w-[259px]"></div>-->
  <div class="w-[90px] xl:w-[259px]"></div>

<!--  <div class="fixed top-[11%] w-[275px] xl:w-[259px] pl-4 xl:pl-0">-->
  <div class="fixed top-[11%] w-[90px] xl:w-[259px] pl-[23px] xl:pl-0">
    <div class=" flex flex-col gap-6 mb-6">

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
        <MagnifyingGlassIcon/>
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
  </div>
</template>

<script setup lang="ts">
import { mapGetters } from "@/lib/map-state";
import AddOrUpdatePost from "@components/dialog/AddOrUpdatePost.vue";
import { HomeIcon, UserIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/vue/20/solid"
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  Cog8ToothIcon as SettingIconOutline,
  BellIcon as BellIconOutline,
} from "@heroicons/vue/24/outline"
import { useRoute, useRouter } from "vue-router";

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
