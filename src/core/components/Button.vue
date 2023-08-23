<template>
  <button
      :disabled="disabled"
      :class="cn('button', SIZE_MAPS[size], VARIANT_MAPS[variant], RADIUS_MAPS[radius],
      {'opacity-50 hover:opacity-50  cursor-default': isLoading},
      )"
      v-bind="$attrs"
  >
    <Loading v-if="isLoading" classes="w-3.5 h-3.5"/>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/core/helper.js'
import Loading from "@/core/components/Loading.vue";

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  radius?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary'
  variant?: 'primary' | 'secondary'
  isLoading?: boolean,
}

// @ts-ignore
const { size, variant, radius, isLoading, disable: buttonDisabled } = withDefaults(defineProps<Props>(), {
  size: 'sm', radius: 'xl', color: 'primary', variant: 'primary'
})

const disabled = isLoading || buttonDisabled

const RADIUS_MAPS = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-full',
}

const VARIANT_MAPS = {
  primary: 'bg-black hover:opacity-80 font-semibold text-white',
  secondary: 'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 font-semibold'
}

const SIZE_MAPS = {
  sm: 'px-4 h-9 leading-7 text-sm',
  md: 'px-7 h-[42px] text-md',
  lg: 'px-9 h-12 text-lg',
  xl: 'p-11 h-14 text-xl',
}

</script>


<style scoped>
/*disabled:bg-gray-200 disabled:text-[#aeb5bc] disabled:hover:opacity-100*/

.button {
  @apply shadow-sm disabled:opacity-50 disabled:cursor-default
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
  flex items-center justify-center
}

</style>
