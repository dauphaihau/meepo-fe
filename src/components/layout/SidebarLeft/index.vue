<template>
  <header>
    <div class="hidden md:block">

      <div class="w-sidebar"/>

      <div class="w-sidebar fixed top-3 lg:top-2 h-[85%] lg:pl-[23px] xl:pl-0">
        <NavigatePage class="flex flex-col items-center lg:items-start gap-4 lg:gap-6 mb-6"/>
        <CreatePostDialog responsive v-if="isLoggedIn"/>
      </div>

      <MenuUser class="fixed bottom-5 ml-[26px] lg:ml-0 z-[5]"/>
    </div>

    <!-- Mobile  -->
    <div class="md:hidden">
      <div
          v-if="showCreatePostDialog"
          class="fixed right-16 z-[3] transition-all duration-500"
          :class="[{'opacity-50': direction === 'down'}, dataToast ? dataToast.line === 2 ? 'bottom-44' : 'bottom-36' : 'bottom-28']"
      >
        <CreatePostDialog responsive v-if="isLoggedIn"/>
      </div>

      <NavigatePageMobile
          class="fixed bottom-0 w-full z-[3] transition-all duration-500  border-t"
          :class="{'opacity-50': direction === 'down'}"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, watch } from "vue";

import { mapGetters } from "@/lib/map-state";
import CreatePostDialog from "@components/dialog/AddOrUpdatePost.vue";
import { useScrollDirection } from "@/core/hooks/useScrollDirection";
import MenuUser from "@components/layout/SidebarLeft/MenuUser.vue";
import NavigatePage from "@components/layout/SidebarLeft/NavigateMenu.vue";
import NavigatePageMobile from "@components/layout/SidebarLeft/NavigateMenuMobile.vue";

const { isLoggedIn, getDataToast: dataToast } = mapGetters()

const direction = useScrollDirection()
const router = useRouter()

const showCreatePostDialog = ref(true)

watch(router.currentRoute, (value) => {
  showCreatePostDialog.value = !['room', 'messages'].includes(value.name as string)
})

</script>

<style scoped>

.w-sidebar {
  @apply md:w-[90px] lg:min-w-[259px] lg:w-[259px];
}
</style>
