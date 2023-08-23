<template>
  <div class="h-fit bg-zinc-100 rounded-2xl">
    <div class="p-3 w-[348px]">
      <h2 class="text-2xl font-black ">Trend for you</h2>
      <div>
        <!-- List Hashtags -->
        <div class="mt-6 flex flex-col gap-4">
          <div v-for="(hashtag, index) in hashtags" :key="index">
            <div class="block max-w-sm text-gray-500">
              <p class="text-[13px]">Trending in Vietnam</p>
              <h5 class="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
                {{ hashtag.name }}
              </h5>
              <p class="text-[13px] font-normal text-gray-600">{{ hashtag.count }} posts</p>
            </div>
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

const hashtags = ref<IHashtag[]>([])

onMounted(async () => {
  const { data } = await postAPI.listHashtags()
  hashtags.value = data.hashtags
})

</script>

<style scoped>
</style>
