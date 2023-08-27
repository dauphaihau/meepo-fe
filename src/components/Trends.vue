<template>
  <div
      v-if="hashtags.length > 0" class="h-fit rounded-2xl"
      :class="!isExplorePage && 'bg-zinc-100'"
  >
    <div
        class="py-3"
        :class="!isExplorePage && 'w-[348px]'"
    >
      <h2 class="text-2xl font-black px-3">Trend for you</h2>
      <!-- List Hashtags -->
      <div class="mt-6 flex flex-col w-full"
      :class="isExplorePage && 'gap-4'"
      >
        <div v-for="(hashtag, index) in hashtags" :key="index">
          <div
              @click="search(hashtag.name)"
              class="block text-gray-500 cursor-pointer"
              :class="isExplorePage ? 'hover:bg-zinc-100/50 p-3' : 'hover:bg-zinc-200/50 px-3 py-2'"
          >
<!--              class="block max-w-sm text-gray-500 hover:bg-zinc-200"-->

            <p class="text-[13px]">Trending in Vietnam</p>
            <h5 class="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
              #{{ hashtag.name }}
            </h5>
            <p class="text-[13px] font-normal text-gray-600">{{ hashtag.count }} posts</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { postAPI } from "@/apis/post";
import { IHashtag } from "@/types/post";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()

const isExplorePage = route.name === 'explore'

const hashtags = ref<IHashtag[]>([])

onMounted(async () => {
  const { data } = await postAPI.listHashtags()
  hashtags.value = data.hashtags
})

const search = (value) => {
  router.push({
    path: 'search',
    query: {
      q: value,
      f: 'top'
      // f: route.query.f
    }
  })
}

</script>

<style scoped>
</style>
