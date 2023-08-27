<template>
  <div v-if="!isLoading">

    <!--    Header-->
    <!--    <HeaderMini title="Explore">-->
    <HeaderMini title="Explore"/>
    <div class="h-[70px]"></div>

    <Trends/>

    <Posts
        v-if="!isUserNotExist"
        :author="user"
        :by="currentTab"
        :key="keyPostsComp"
        :hideInput="true"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import dayjs from 'dayjs';
import { EnvelopeIcon, CalendarDaysIcon, MapPinIcon, LinkIcon, CakeIcon } from '@heroicons/vue/24/outline'

import Posts from "@/components/Posts.vue";
import UpdateUserDialog from "@/components/dialog/UpdateUserDialog.vue";
import { userAPI } from "@/apis/user";
import { useRoute, useRouter } from "vue-router";
import { mapGetters } from "@/lib/map-state";
import { MutationEnums } from "@/types/store/root";
import { IUser } from "@/types/user";
import { useStore } from "@/store";
import Link from "@/core/components/Link.vue";
import ToggleFollowBtn from "@components/ToggleFollowBtn.vue";
import HeaderMini from "@components/HeaderMini.vue";
import Trends from "@components/Trends.vue";

const route = useRoute()
const router = useRouter()
const store = useStore()

console.log('dauphaihau debug: route-query', route.query)

const { getUser, isLoggedIn } = mapGetters()

const currentRouteName = route.name
const isLoading = ref(true)
const isUserNotExist = ref(false)
const isFollowing = ref(false)
const keyPostsComp = ref(0)

const tabs = ['Top', 'Latest', 'People', 'Media'].map((name) => ({ name }))
const currentTab = ref(0)

const user = ref<IUser & {hostWebsite?: string}>()
const host = ref('')

const currentRouteUsername = route.params.username

onMounted(() => {
  getProfile()
})

async function getProfile() {
  const { data, status } = await userAPI.getProfile(currentRouteUsername)
  isLoading.value = false

  isUserNotExist.value = status === 404

  if (status === 404) {
    user.value.name = '@' + currentRouteUsername
    return
  }

  if (data) {
    user.value = data.user
    user.value.created_at = dayjs(data.user.created_at).format('MMMM YYYY')
    user.value.dob = dayjs(data.user.dob).format('DD MMMM YYYY')
    user.value.hostWebsite = data.user.website && data.user.website.includes('http') ? new URL(data.user.website).host : data.user.website

    if (getUser.value.id) {
      isFollowing.value = data.user?.is_current_user_following
    }
  }
}

async function unOrFollow() {
  validateLogin()
  const { status } = isFollowing.value ? await userAPI.unfollow(user.value.id) : await userAPI.follow(user.value.id)
  if (status === 200) {
    isFollowing.value = !isFollowing.value
  }
}

function validateLogin() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
}

const onUpdateProfile = (values) => {
  values.created_at = dayjs(values.created_at).format('MMMM YYYY')
  values.dob = dayjs(values.dob).format('DD MMMM YYYY')
  values.hostWebsite = values.website && values.website.includes('http') ? new URL(values.website).host : values.website
  user.value = { ...user.value, ...values }
  keyPostsComp.value++
}

function changeTab(index) {
  if (index === currentTab.value) return
  keyPostsComp.value += 1
  currentTab.value = index
}

function redirect(name) {
  localStorage.setItem('state', JSON.stringify(this.user))
  router.push({
    name,
    params: { username: currentRouteUsername, },
  });
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
