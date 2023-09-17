<template>
  <div class="wrapper">
    <h2 class="title">You might like</h2>

    <div v-if="isLoading" class="flex-center min-h-[35vh]">
      <Loading variant="secondary" classes="h-7 w-7"/>
    </div>
    <!-- List of Users -->
    <div v-else class="mt-4 flex flex-col">
      <div v-for="(user) in users" :key="user.id">
        <UserSuggest :user="user"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { userAPI } from "@/apis/user";
import { mapGetters } from "@/lib/map-state";
import { useStore } from "@/store";
import { IUser } from "@/types/user";
import UserSuggest from "@components/UserSuggest.vue";
import Loading from "@/core/components/Loading.vue";

const store = useStore()
const router = useRouter()
const route = useRoute()

const { isLoggedIn, getUser } = mapGetters();
const isOpenPopover = ref(false)
const isLoading = ref(false)
const users = ref<IUser[]>([])

onMounted(() => {
  getUsers()
})

async function getUsers() {
  isLoading.value = true
  const { data } = isLoggedIn.value ?
      await userAPI.unfollowedUsersList() :
      await userAPI.getUsers();

  isLoading.value = false
  users.value = data.users.map(user => ({ ...user, is_current_user_following: false }))

}

watch(router.currentRoute, () => {
  if (route.name === 'profile') {
    getUsers()
  }
})

</script>


<style scoped>

.wrapper {
  @apply bg-zinc-100 rounded-2xl py-3 w-[348px];
  /*min-height: 672px;*/
}

.title {
  @apply text-[20px] font-bold px-4;
}

</style>
