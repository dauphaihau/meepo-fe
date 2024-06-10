<script lang="ts" setup>

interface IProps {
  show?: boolean
  close: () => void,
}

const { show, close } = defineProps<IProps>();

</script>

<template>
  <Teleport to="body">
    <div class="md:hidden">
      <!-- Overlay -->
      <div
        v-if="show"
        class="fixed inset-0 bg-black opacity-30 z-10 h-screen"
        @click="close"
      />

      <div
        class="fixed top-0 min-h-0 h-screen bg-white w-[75%] transition-all duration-500 z-10 py-3"
        :class="show ? 'left-0' : '-left-80'"
      >
        <slot name="panel" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

</style>
