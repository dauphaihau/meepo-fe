<script setup lang="ts">

import SidebarMobile from '@components/layout/SidebarMobile.vue';
</script>

<template>
  <SidebarMobile
    :show="showSidebarMobile"
    @set-show-sidebar="(val) => showSidebarMobile = val"
  />
</template>

<style scoped>

</style>
