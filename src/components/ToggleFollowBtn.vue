<template>

  <Button

      :isLoading="true"
      v-if="show && isFollowing"
      variant="secondary"
      class="h-[32px]"
      :class="show && isFollowing ? 'btn-following' : `after:content-['Follow']`"
  />
  <Button
      v-else
      class="h-[32px]"
  >
    {{ show && isFollowing ? 'Following' : 'Follow' }}
  </Button>
</template>

<script setup lang="ts">

import Button from "@/core/components/Button.vue";

interface Props {
  show?: boolean
  isFollowing: boolean
}

// const { show, isFollowing } = withDefaults(defineProps<Props>(), {
//   show: true
// })

const { show, isFollowing } = defineProps<Props>()

</script>

<style scoped>

.btn-following {
  @apply hover:after:content-['Unfollow'] hover:bg-red-200 hover:text-red-500  hover:ring-red-300 after:content-['Following'];
}
</style>
