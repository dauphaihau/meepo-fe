<template>
  <div
      class="wrapper"
      :class="slots.tabs ?'border-b' : scrollHeight > 0 ? 'border-b':'border-b-white'"
  >
    <div v-if="title || subTitle" class="flex gap-4 items-center h-14 px-4">
      <ArrowLeftIcon
          class="h-9 w-9 cursor-pointer hover:bg-zinc-300 animate rounded-full p-2"
          aria-hidden="true"
          @click="backTo ? router.push(backTo) : router.back()"
      />
      <div>
        <h3 class="text-[20px] font-bold leading-6">{{ title }}</h3>
        <p v-if="subTitle" class="text-zinc-500 text-sm">{{ subTitle }}</p>
      </div>
    </div>
    <slot name="tabs"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import { onBeforeUnmount, onMounted, ref, useSlots } from "vue";

interface Props {
  title?: string
  subTitle?: string
  backTo?: string
}

let { title, subTitle, backTo } = defineProps<Props>()

const router = useRouter()
const slots = useSlots()
const scrollHeight = ref(0)

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

onMounted(async () => {
  window.addEventListener("scroll", onScroll)
})

const onScroll = (e) => {
  scrollHeight.value = e.target.documentElement.scrollTop;
}

</script>

<style scoped>
.wrapper {
  @apply fixed top-0 pt-[60px] w-[600px] border z-30 backdrop-blur-xl bg-white/70;
  margin-left: -1px;
}

</style>
