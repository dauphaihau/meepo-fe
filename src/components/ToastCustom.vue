<template>
  <div
      v-if="!hideToast"
      class="flex gap-2 text-sm justify-center items-center bg-black text-white border-black py-2.5 px-5 rounded-lg"
  >
    <div>{{ message }}</div>
    <div
        v-if="onClickBtn"
        @click="clickBtn"
        class="font-bold cursor-pointer"
    >{{ labelBtn }}
    </div>
  </div>
</template>

<script setup>
// import { toast } from "vue-sonner";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const { message, onClickBtn, labelBtn } = defineProps({
  message: { type: String },
  labelBtn: { type: String, default: 'View' },
  onClickBtn: { type: Function },
})

const hideToast = ref(false)

const clickBtn = () => {
  onClickBtn()
  hideToast.value = true

  // error after build & production
  //   toast.dismiss()
}

</script>

<style>
[data-sonner-toaster] {
  @apply flex-center
}
</style>
