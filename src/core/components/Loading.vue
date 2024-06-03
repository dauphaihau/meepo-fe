<template>
  <div>
    <svg
      :class="cn('animate-spin w-3.5 h-3.5',
                 VARIANT_MAPS[variant],
                 classes
      )"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25
          stroke-[4]"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/core/helper.js';

// interface Props {
//   classes?: string
//   variant?: 'primary' | 'secondary'
// }
//
// const { classes, variant } = withDefaults(defineProps<Props>(), {
//   variant: 'primary'
// })

const { classes, variant } = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  classes: {
    type: String,
  },
});

const VARIANT_MAPS = {
  primary: 'fill-black text-white',
  secondary: 'fill-white text-black',
};

</script>

<style scoped>

</style>
