<template>
  <div>

    <!--    Header-->
    <!--    <HeaderMini title="Explore">-->
    <HeaderMini title="Explore"/>
    <div class="h-[70px]"></div>

    <Trends/>

    <!--    <Posts-->
    <!--        v-if="!isUserNotExist"-->
    <!--        :author="user"-->
    <!--        :by="currentTab"-->
    <!--        :key="keyPostsComp"-->
    <!--        :hideInput="true"-->
    <!--    />-->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import HeaderMini from "@components/HeaderMini.vue";
import Trends from "@components/Trends.vue";

const route = useRoute()
const router = useRouter()
const store = useStore()

const currentRouteName = route.name
const currentRouteUsername = route.params.username
const keyPostsComp = ref(0)

const tabs = ['Top', 'Latest', 'People', 'Media'].map((name) => ({ name }))
const currentTab = ref(0)

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
