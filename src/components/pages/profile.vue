<template>

  <div v-if="isLoading" class="flex-center min-h-[35vh]">
    <Loading/>
  </div>

  <div v-else>
    <!--    Header-->
    <HeaderMini
        :title="!isUserNotExist ? user?.name : 'Profile' "
        :subTitle="`${user?.posts_count ?? 0 } posts`"
    />
    <div class="h-12"></div>

    <!--    Background-->
    <div class="bg-zinc-300 h-[198px]">
      <input
          type="file"
          name="file"
          id="file"
          class="invisible h-[198px]"
      />
      <!--          @change="set"-->
    </div>

    <!--    User Info-->
    <div class="px-4 -mt-16">

      <!--      Avatar, Edit user-->
      <div class="flex justify-between items-center">

        <div v-if="user.avatar_url" class="rounded-full border-white border-4 bg-white h-[133.5px] w-[141.5px] mb-6">
          <img
              alt="avatar"
              :src="user.avatar_url"
              class="h-[133.5px] w-[149px] rounded-full "
          />
        </div>
        <div v-else class="rounded-full border-white border-4 bg-black h-[135px] w-[135px] mb-6"/>

        <div class="pt-8">
          <UpdateUserDialog
              v-if="currentRouteUsername === getUser.username"
              :user="user"
              @onUpdateProfile="onUpdateProfile"
          />
        </div>
      </div>

      <div class="sm:px-0 flex justify-between items-center mb-4">

        <div class="space-y-3  w-full">

          <!--        Name, Username, Follow - Message btn   -->
          <div class="flex justify-between">
            <div>
              <h3 class="text-[20px] font-bold  text-gray-900">{{ user?.name }}</h3>
              <p v-if="!isUserNotExist" class="max-w-2xl text-sm text-gray-500">@{{ user?.username }}</p>
            </div>

            <div v-if="!isUserNotExist">
              <div
                  class="flex items-center gap-2"
                  v-if="currentRouteUsername !== getUser.username"
              >
                <div class="flex-center p-1.5 border border-zinc-300 rounded-full">

                  <EnvelopeIcon
                      v-tooltip="'Not available'"
                      class="h-[21px] w-[21px] cursor-pointer"
                      aria-hidden="true"
                  />
                  <!--                      @click="onClickMessage"-->

                </div>

                <ToggleFollowBtn
                    :show="true"
                    :isFollowing="isFollowing"
                    @click="unOrFollow"
                />
              </div>

            </div>
          </div>

          <p
              v-if="user?.bio"
              v-html="formatTextWithHashTags(user.bio)"
          />

          <!--          Location, Calendar-->
          <div class="flex flex-wrap gap-4 items-center">

            <div v-if="user?.location" class="flex gap-1 items-center">
              <MapPinIcon
                  class="h-5 w-5 cursor-pointer text-gray-500 text-[15px]"
                  aria-hidden="true"
              />
              <div class="text-gray-500 text-[15px]">
                {{ user.location }}
              </div>
            </div>

            <div v-if="user?.dob" class="flex gap-1 items-center">
              <CakeIcon
                  class="h-5 w-5 cursor-pointer text-gray-500 text-[15px]"
                  aria-hidden="true"
              />
              <div class="text-gray-500 text-[15px]">
                Born {{ user.dob }}
              </div>
            </div>

            <div v-if="user?.website" class="flex gap-1 items-center">
              <LinkIcon
                  class="h-5 w-5 cursor-pointer text-gray-500 text-[15px]"
                  aria-hidden="true"
              />
              <Link
                  :to="user.website.includes('http') ? user.website : `https://${user.website}`"
                  class=" text-[15px] text-[#4a99e9] hover:underline hover:underline-offset-2 font-normal"
              >
                {{ user.hostWebsite }}
              </Link>
            </div>

            <div v-if="user?.created_at" class="flex gap-1 items-center">
              <CalendarDaysIcon
                  class="h-5 w-5 cursor-pointer text-gray-500 text-[15px]"
                  aria-hidden="true"
              />
              <div class="text-gray-500 text-[15px]">
                Joined {{ user.created_at }}
              </div>
            </div>
          </div>

          <!--                    Count following, follow-->
          <div class="flex gap-4 " v-if="!isUserNotExist">

            <div
                @click="redirect('followers')"
                class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <span class="font-bold text-[14px]">{{ user?.followers_count ?? 0 }}</span>
              <span class="text-gray-500 text-[14px]">Follower</span>
            </div>

            <div
                @click="redirect('following')"
                class="hover:underline hover:underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <span class="font-bold text-[14px]">{{ user?.followed_count ?? 0 }}</span>
              <span class="text-gray-500 text-[14px]">Following</span>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!--    Tabs-->
    <div v-if="!isUserNotExist" class="grid grid-cols-4 border-b bg-white z-10">
      <div v-for="(tab, index) of tabs">
        <div @click="changeTab(index)" class="flex-center py-4 hover:bg-[#e7e7e8] relative cursor-pointer">
          <div
              class="font-semibold"
              :class="index === currentTab ? 'text-black' : 'text-gray-500' "
          >{{ tab.name }}
          </div>
          <div v-if="index === currentTab" class="bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full"/>
        </div>
      </div>
    </div>

    <!--    Response error 404 -->
    <div v-if="isUserNotExist" class="max-w-[20rem] mx-auto mt-20">
      <div class="space-y-2">
        <div class="text-3xl font-bold">This account doesn’t exist</div>
        <div class="text-gray-500 font-semibold">Try searching for another.</div>
      </div>
    </div>


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

import Loading from "@/core/components/Loading.vue";
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
import { formatTextWithHashTags } from "@/core/helper";

const route = useRoute()
const router = useRouter()
const store = useStore()

const { getUser, isLoggedIn } = mapGetters()

const isLoading = ref(true)
const isUserNotExist = ref(false)
const isFollowing = ref(false)
const keyPostsComp = ref(0)

const tabs = ['Posts', 'Comments', 'Likes', 'Media'].map((name) => ({ name }))
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
    user.value.dob = dayjs(data.user.dob).format('MMMM DD, YYYY')
    user.value.hostWebsite = data.user.website && data.user.website.includes('http') ? new URL(data.user.website).host : data.user.website

    if (getUser.value.id) {
      isFollowing.value = data.user?.is_current_user_following
    }
  }
}

async function unOrFollow() {
  if (!isLoggedIn.value) {
    store.commit(MutationEnums.SET_LOGIN_DIALOG, true)
    return
  }
  const { status } = isFollowing.value ? await userAPI.unfollow(user.value.id) : await userAPI.follow(user.value.id)
  if (status === 200) {
    isFollowing.value = !isFollowing.value
  }
}

const onUpdateProfile = (values) => {
  values.created_at = dayjs(values.created_at).format('MMMM YYYY')
  values.dob = dayjs(values.dob).format('MMMM DD  YYYY')
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
  localStorage.setItem('state', JSON.stringify(user.value))
  router.push({
    name,
    params: { username: currentRouteUsername, },
  });
}

</script>


<style scoped></style>
