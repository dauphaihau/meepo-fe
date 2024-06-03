<template>
  <div
    :class="show ? 'bottom-5 md:-bottom-1' : '-bottom-32'"
    class="
      fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10]
      min-w-[100vw] md:min-w-0 md:max-w-[400px]
      transition-all duration-500
"
  >
    <div
      class="
          bg-black text-white text-sm
          flex items-center justify-between
          md:rounded-lg py-2.5 px-4
        "
    >
      <div
        class="font-medium"
        :class="{'max-w-[80%]': dataToast?.onClickBtn}"
      >
        {{ dataToast?.message }}
      </div>

      <div
        v-if="dataToast?.onClickBtn"
        class="font-bold cursor-pointer md:ml-12"
        @click="() => {dataToast.onClickBtn(); show = false; clearDataToast()}"
      >
        {{ dataToast?.labelBtn ?? 'View' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { mapGetters } from '@/lib/map-state';
import { store } from '@/store';
import { MutationEnums } from '@/types/store/root';

const router = useRouter();

const { getDataToast: dataToast } = mapGetters();

const show = ref(false);

watch(dataToast, () => {
  if (dataToast.value) {
    show.value = true;
    setTimeout(() => {
      show.value = false;
      clearDataToast();
    }, 3500);
  }
});

const clearDataToast = () => {
  setTimeout(() => {
    store.commit(MutationEnums.SHOW_TOAST, null);
  }, 200);
};

</script>

<style scoped>
</style>
