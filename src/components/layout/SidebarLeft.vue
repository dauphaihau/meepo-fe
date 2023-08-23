<template>
  <div class="w-[275px] xl:w-[259px]"></div>

  <div class="fixed top-[11%] w-[275px] xl:w-[259px] flex flex-col gap-6 pl-4 xl:pl-0">
    <router-link to="/home" class="link" active-class="active">Home</router-link>

    <div class="link opacity-50">Explore</div>
    <div v-if="isLoggedIn" class="link opacity-50">Settings</div>
    <router-link v-if="isLoggedIn" :to="'/user/' + getUser.username" class="link" active-class="active">Profile</router-link>
    <div v-if="isLoggedIn" class="link opacity-50">Notifications</div>
    <div v-if="isLoggedIn" class="link opacity-50">Bookmarks</div>

    <AddOrUpdatePost v-if="isLoggedIn"/>
  </div>
</template>

<script setup lang="ts">
import { mapGetters } from "@/lib/map-state";
import AddOrUpdatePost from "@components/dialog/AddOrUpdatePost.vue";

const { getUser, isLoggedIn } = mapGetters()

</script>

<style scoped>

.active {
  @apply font-bold
}

.link {
  @apply text-black text-2xl hover:bg-zinc-100 py-2 px-3 rounded-full w-fit cursor-pointer
}

</style>
