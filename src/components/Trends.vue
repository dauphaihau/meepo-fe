<template>
  <div
      class="h-fit rounded-2xl"
      :class="!isExplorePage && 'bg-zinc-100'"
  >
    <div
        class="py-3 h-fit rounded-2xl"
        :class="!isExplorePage && 'w-[348px] bg-zinc-100'"
    >
      <h2 class="title">What’s happening</h2>
      <!--      <h2 class="text-2xl font-black px-3">Trend for you</h2>-->

      <div v-if="isLoading" class="flex-center min-h-[35vh]">
        <Loading variant="secondary" classes="h-7 w-7"/>
      </div>

      <!-- List Hashtags -->
      <div
          v-else-if="!isLoading && hashtags.length > 0"
          class="flex flex-col w-full mt-4"
      >
<!--          :class="isExplorePage && 'gap-4'"-->
        <div v-for="(hashtag, index) in hashtags" :key="index">
          <div
              @click="search(hashtag.name)"
              class="block text-zinc-500 cursor-pointer"
              :class="isExplorePage ? 'hover:bg-zinc-100/50 p-3' : 'hover:bg-zinc-200/50 px-3 py-2'"
          >
            <p class="text-[13px]">Trending in Vietnam</p>
            <h5 class="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
              #{{ hashtag.name }}
            </h5>
            <p class="text-[13px] font-normal text-zinc-600">{{ hashtag.count }} posts</p>
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
import Loading from "@/core/components/Loading.vue";

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)

const isExplorePage = route.name === 'explore'

const hashtags = ref<IHashtag[]>([])

onMounted(async () => {
  isLoading.value = true
  const { data } = await postAPI.listHashtags()
  isLoading.value = false
  hashtags.value = data.hashtags
})

const search = (value) => {
  router.push({
    name:'search',
    query: {
      q: value,
      f: 'top'
    }
  })
}

</script>

<style scoped>
.title {
  @apply text-[20px] font-bold px-4;
}
</style>
