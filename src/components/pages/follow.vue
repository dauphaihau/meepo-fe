<template>

  <!--  Header with tabs-->
  <HeaderMainContent
      :title="user?.name"
      :subTitle="user?.username"
      :backTo="`/user/${currentRouteUsername}`"
  >
    <template v-slot:tabs>
      <div class="tabs">
        <div @click="redirect('followers')" class="tab">
          <div
              class="font-semibold"
              :class="currentRouteName === 'followers' ? 'text-black' : 'text-zinc-500'"
          >Followers
          </div>
          <div v-if="currentRouteName === 'followers'" class="active-underline"/>
        </div>
        <div @click="redirect('following')" class="tab">
          <div
              class="font-semibold "
              :class="currentRouteName === 'following' ? 'text-black' : 'text-zinc-500'"
          >Following
          </div>
          <div v-if="currentRouteName === 'following'" class="active-underline"/>
        </div>
      </div>
    </template>
  </HeaderMainContent>

  <div class="h-16"></div>

  <!--  Users-->
  <div v-for="(user) of users">
    <User :user="user"/>
  </div>
</template>


<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { userAPI } from "@/apis/user";
import { mapGetters } from "@/lib/map-state";
import { useStore } from "@/store";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import HeaderMainContent from "@components/layout/HeaderMainContent.vue";
import User from "@components/User.vue";

const store = useStore()
const router = useRouter()
const route = useRoute()
const { getUser, isLoggedIn, getStateRouter } = mapGetters()

const user = ref<IUser>(null)
const triggerRef = ref(null)
const users = ref<IUser[] | []>([])
const currentRouteUsername = route.params.username
const currentRouteName = route.name

onMounted(() => {
  getUsers()
})

onBeforeMount(() => {
  if (getStateRouter.value && getStateRouter.value.username === currentRouteUsername) {
    user.value = getStateRouter.value
  }
})

const getUsers = async () => {
  const { data } =
      currentRouteName === 'following' ?
          await userAPI.followingByUser(currentRouteUsername)
          : await userAPI.followersByUser(currentRouteUsername);

  users.value = data.users
  user.value = data.by_user
  store.commit(MutationEnums.SET_STATE_ROUTER, data.by_user)
}

const redirect = (name) => {
  router.push({
    name,
    params: { username: currentRouteUsername, },
  })
}

</script>

<style scoped>

.tabs {
  @apply grid grid-cols-2 w-[599px] z-10;
}

.tab {
  @apply flex-center py-4 hover:bg-[#e7e7e8] animate relative cursor-pointer;
}

.tab .active-underline {
  @apply bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full;
}

</style>
