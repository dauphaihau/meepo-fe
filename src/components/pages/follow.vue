<template>

  <!--  Header with tabs-->
  <HeaderMini
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
  </HeaderMini>
  <div class="h-[121px]"></div>

  <!--  Users-->
  <div v-for="(user, index) of users">
    <div class="relative">
      <router-link
          class="block px-6 py-3 bg-white border-b flex flex-col cursor-pointer hover:bg-zinc-100 animate "
          :to="'/user/' + user.username"
      >
        <div class="grid grid-cols-11">
          <img
              alt="avatar"
              v-if="user.avatar_url"
              v-bind:src="user.avatar_url"
              class="rounded-full h-10 w-10 bg-black col-span-1"
          />

          <div v-else class="rounded-full h-10 w-10 bg-black col-span-1"/>

          <div class="col-span-10">
            <div class=" text-[15px]">

              <div class="flex justify-between items-center">
                <div>
                  <div class="font-bold text-black hover:underline hover:underline-offset-2 animate">{{ user.name }}
                  </div>
                  <div class="text-zinc-500">@{{ user.username }}</div>
                </div>
              </div>

              <p v-if="user.bio" class="font-normal text-gray-700 dark:text-gray-400 text-[15px]">{{ user.bio }}</p>
            </div>
          </div>
        </div>
      </router-link>

      <div class="absolute top-4 right-5" v-if="getUser.id !== user.id">
        <ToggleFollowBtn
            :show="isLoggedIn"
            :isFollowing="user.is_current_user_following"
            @click="follow(user, index)"
        />
      </div>
    </div>
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
import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";
import HeaderMini from "@components/HeaderMini.vue";

const store = useStore()
const router = useRouter()
const route = useRoute()
const { getUser, isLoggedIn, getStateRouter } = mapGetters()

const user = ref<IUser>(null)
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
