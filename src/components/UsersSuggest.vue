<template>
  <div class="wrapper">
    <h2 class="title">You might like</h2>
    <div>
      <!-- List of Users -->
      <div class="mt-4 flex flex-col gap-4">
        <div v-for="(user) in users" :key="user.id">
          <UserSuggest :user="user"/>
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
import UserPopper from "@components/UserPopper.vue";
import User from "@components/User.vue";
import UserSuggest from "@components/UserSuggest.vue";

const store = useStore()
const router = useRouter()

const { isLoggedIn, getUser } = mapGetters();
const isOpenPopover = ref(false)
const users = ref<IUser[]>([])

onMounted(async () => {
  const { data } = isLoggedIn.value ?
      await userAPI.unfollowedUsersList():
      await userAPI.getUsers();
  users.value = data.users.map(user => ({ ...user, is_current_user_following: false }))
})

const unOrFollow = async (user: IUser, index) => {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
  const { status } = user.is_current_user_following ? await userAPI.unfollow(user.id) : await userAPI.follow(user.id)
  if (status === 200) {
    users.value[index].is_current_user_following = !users.value[index].is_current_user_following
  }
}

const onOpenPopover = (val) => {
  isOpenPopover.value = val
}

const redirectProfile = (user: IUser) => {
  router.push('/user/' + user.username)
}

</script>


<style scoped>

.wrapper {
  @apply bg-zinc-100 rounded-2xl py-3 w-[348px];
  /*min-height: 672px;*/
}

.title {
  @apply text-[22px] font-black px-4;
}

</style>
