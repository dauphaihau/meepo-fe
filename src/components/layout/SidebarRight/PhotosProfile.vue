<template>
  <div v-if="posts.length === 2" class="grid grid-cols-2 gap-[3px]">
    <div v-for="(post, index) of posts">
      <img
          @click="router.push('/posts/' + post.id)"
          v-bind:src="post.image_url" alt="post" class="h-[195px] w-[195px] cursor-pointer"
          :class="{
            'rounded-tl-2xl rounded-bl-2xl': index === 0,
            'rounded-tr-2xl rounded-br-2xl': index === 1,
            }"
      >

    </div>
  </div>

  <div v-else-if="posts.length === 3" class="flex gap-[2px]">
    <div class="flex flex-col flex-wrap max-h-[222px] gap-[2px]">
      <div v-for="(post, index) of posts">
        <img
            @click="router.push('/posts/' + post.id)"
            v-bind:src="post.image_url" alt="post" class=" cursor-pointer w-[170px]"
            :class="{
                    'h-[222px]': index === 0,
                    'h-[110px]': index >= 1,
            'rounded-tl-2xl rounded-bl-2xl': index === 0,
            'rounded-tr-2xl': index === 1,
            'rounded-br-2xl': index === 2,
            }"
        >

      </div>
    </div>
  </div>

  <div v-else-if="posts.length === 4" class="grid grid-cols-2 gap-[3px]">
    <div v-for="(post, index) of posts">
      <img
          @click="router.push('/posts/' + post.id)"
          v-bind:src="post.image_url" alt="post" class="h-[110px] w-[173px] cursor-pointer"
          :class="{
            'rounded-tl-2xl': index === 0,
            'rounded-tr-2xl': index === 1,
            'rounded-bl-2xl': index === 2,
            'rounded-br-2xl': index === 3,
            }"
      >

    </div>
  </div>

  <div v-else-if="posts.length === 5" class="w-full">
    <div class="flex flex-wrap gap-[3px]">
      <div v-for="(post, index) of posts">
        <img
            @click="router.push('/posts/' + post.id)"
            v-bind:src="post.image_url" alt="post" class="h-[110px]  cursor-pointer"
            :class="{
                    'w-[113px]': index > 1,
                    'w-[172px]': index < 2,
            'rounded-tl-2xl': index === 0,
            'rounded-tr-2xl': index === 1,
            'rounded-bl-2xl': index === 2,
            'rounded-br-2xl': index === 4,
            }"
        >

      </div>
    </div>
  </div>

  <div v-else-if="posts.length >= 6" class="grid grid-cols-3 gap-[3px]">
    <div v-for="(post, index) of posts">
      <img
          @click="router.push('/posts/' + post.id)"
          v-bind:src="post.image_url" alt="post" class="h-[110px] w-[143px] cursor-pointer"
          :class="{
            'rounded-tl-2xl': index === 0,
            'rounded-tr-2xl': index === 2,
            'rounded-bl-2xl': index === 3,
            'rounded-br-2xl': index === 5,
            }"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { FILTER_POST_BY } from "@/config/const";
import { postAPI } from "@/apis/post";

const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const posts = ref([])

let currentRouteName
let currentRouteUsername

onMounted(async () => {
  await router.isReady();
  await getPosts()
})

const getPosts = async () => {
  isLoading.value = true

  currentRouteUsername = route.params.username
  currentRouteName = route.name

  const payload = {
    by: FILTER_POST_BY.MEDIA,
    username: currentRouteUsername,
    limit: 6
  }

  const { data } = await postAPI.list(payload)
  // posts.value = data.slice(0, 3)
  posts.value = data.posts
  isLoading.value = false
}

watch(router.currentRoute, () => {
  if (route.name === 'profile') {
    getPosts()
  }
})

</script>

<style scoped>

</style>
