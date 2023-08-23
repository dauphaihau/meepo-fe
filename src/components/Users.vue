<template>
  <div class="wrapper">
    <h2 class="title">You might like</h2>
    <div>
      <!-- List of Users -->
      <div class="mt-6 flex flex-col gap-4">
        <div v-for="(user, index) in users" :key="user.id">
          <div class="relative">

            <router-link
                :to="'/user/' + user.username"
                class="block max-w-sm flex justify-between items-center hover:bg-zinc-200 px-3 py-2.5 cursor-pointer"
            >
              <div class="flex items-center gap-2">

                <div>
                  <div class="rounded-full h-10 w-10 bg-black col-span-1"/>
                </div>

                <div>
                  <h5 class="text-[15px] font-bold text-zinc-900 dark:text-white">
                    {{ user.name ?? '-' }}
                  </h5>
                  <p class="text-[15px] font-normal text-zinc-700 dark:text-zinc-400">@{{ user.username }}</p>
                </div>
              </div>
            </router-link>
            <div class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-72 z-30">
              <ToggleFollowBtn
                  :show="true"
                  :isFollowing="user.is_current_user_following"
                  @click="follow(user, index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";

import { userAPI } from "@/apis/user";
import { mapGetters } from "@/lib/map-state";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";

const store = useStore()
const router = useRouter()

const { isLoggedIn, getUser } = mapGetters();
const users = ref<IUser[]>([])

onMounted(async () => {
  const { data } = isLoggedIn ?
      await userAPI.getUsers() :
      await userAPI.unfollowedUsersList();
  users.value = data.users.map(user => ({ ...user, is_current_user_following: false }))
})

const follow = async (user: IUser, index) => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
  const { status } = user.is_current_user_following ? await userAPI.unfollow(user.id) : await userAPI.follow(user.id)
  if (status === 200) {
    users.value[index].is_current_user_following = !users.value[index].is_current_user_following
  }
}

</script>


<style scoped>

.wrapper {
  @apply bg-zinc-100 rounded-2xl py-3 w-[348px];
  /*min-height: 672px;*/
}

.title {
  @apply text-2xl font-black px-3;
}

</style>
