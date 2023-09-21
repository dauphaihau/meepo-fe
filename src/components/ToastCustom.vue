<template>
  <div class="flex gap-2 text-sm justify-center items-center">
    <div>{{ message }}</div>
    <div
        v-if="to"
        class="font-bold cursor-pointer"
        @click="clickView"
    >View
    </div>
  </div>
</template>

<script setup>

import { toast } from "vue-sonner";
import { useRouter } from "vue-router";

const router = useRouter()
const { message, to } = defineProps(['message', 'to'])

const clickView = () => {
  router.push(to);
  toast.dismiss()
}

</script>

<style scoped>

</style>
