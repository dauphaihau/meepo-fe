<script setup lang="ts">
import { watch, ref } from "vue";

import Posts from "@/components/Posts.vue";
import { FILTER_POST_BY } from "@/config/const";
import { mapGetters } from "@/lib/map-state";
import HeaderMainContent from "@components/layout/HeaderMainContent.vue";

const { isLoggedIn, getKeyMutatePosts } = mapGetters()
const tabs = [{ name: 'For you', id: FILTER_POST_BY.DEFAULT }, { name: 'Following', id: FILTER_POST_BY.FOLLOWING }]
const currentTab = ref(0)
const keyPostsComp = ref(0)

function changeTab(index) {
  if (index === currentTab.value) return
  keyPostsComp.value += 1
  currentTab.value = index
}

watch(getKeyMutatePosts, () => {
  keyPostsComp.value++
})

</script>

<template>
  <div>

    <!--    Header-->
    <HeaderMainContent v-if="isLoggedIn">
      <template v-slot:tabs>
        <div class="grid grid-cols-2">
          <div v-for="tab of tabs">
            <div
                @click="changeTab(tab.id)"
                class="flex-center py-4 hover:bg-[#e7e7e8] relative cursor-pointer"
            >
              <div
                  class="font-semibold text-sm lg:text-base"
                  :class="tab.id === currentTab ? 'text-black' : 'text-zinc-500' "
              >{{ tab.name }}
              </div>
              <div v-if="tab.id === currentTab" class="bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full"/>
            </div>
          </div>
        </div>
      </template>
    </HeaderMainContent>

    <Posts
        :by="currentTab"
        :key="keyPostsComp"
        :class="isLoggedIn ? 'pt-[54px] md:pt-[45px] lg:pt-16': 'pt-[15px]'"
    />
  </div>
</template>

<style scoped>
</style>
