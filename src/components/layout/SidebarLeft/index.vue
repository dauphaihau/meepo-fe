<script setup lang="ts">

import { PencilIcon } from '@heroicons/vue/20/solid';
import MenuUser from '@components/layout/SidebarLeft/MenuUser.vue';
import NavigatePage from '@components/layout/SidebarLeft/NavigateMenu.vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@stores/auth.ts';
import Button from '@core/components/Button.vue';
import { useDialogStore } from '@stores/dialog.ts';

const { isLoggedIn } = storeToRefs(useAuthStore());
const dialogStore = useDialogStore();

const showCreatePost = () => {
  dialogStore.showDialog = 'create-post';
};

</script>

<template>
  <header class="w-0 md:w-auto md:ml-8 lg:ml-0">
    <div class="hidden md:block">
      <div class="w-sidebar" />

      <div class="w-sidebar fixed top-3 lg:top-2 h-[85%] lg:pl-[23px] xl:pl-0">
        <NavigatePage class="flex flex-col items-center lg:items-start gap-4 lg:gap-6 mb-6" />

        <div class="lg:hidden">
          <Button
            v-if="isLoggedIn"
            size="md"
            class="!px-3 ml-6"
            @click="showCreatePost"
          >
            <PencilIcon class="h-5 w-5" />
          </Button>
        </div>

        <div class="hidden lg:flex">
          <Button
            v-if="isLoggedIn"
            size="md"
            class="w-2/3"
            @click="showCreatePost"
          >
            Post
          </Button>
        </div>
      </div>

      <MenuUser class="fixed bottom-5 ml-[26px] lg:ml-0 z-[5]" />
    </div>
  </header>
</template>

<style scoped>

.w-sidebar {
  @apply md:w-[90px] lg:min-w-[259px] lg:w-[259px];
}
</style>
