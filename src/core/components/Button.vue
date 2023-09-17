<template>
  <button
      v-bind="$attrs"
      :class="cn('button', SIZE_MAPS[size], VARIANT_MAPS[variant], RADIUS_MAPS[radius],
        {'opacity-50 hover:opacity-50 cursor-default': isLoading },
        classes
      )"
  >
    <Loading
        v-if="isLoading"
        :variant="variant"
        classes="mr-2"
    />
    <span v-if="isLoading">Processing...</span>
    <slot v-else/>
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/core/helper.js'
import Loading from "@/core/components/Loading.vue";

const RADIUS_MAPS = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-full',
}

const VARIANT_MAPS = {
  primary: 'bg-black hover:opacity-80 font-semibold text-white',
  secondary: 'bg-white text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 font-semibold'
}

const SIZE_MAPS = {
  sm: 'px-4 h-9 leading-7 text-sm',
  md: 'px-7 h-[42px] text-md',
  lg: 'px-9 h-12 text-lg',
  xl: 'p-11 h-14 text-xl',
}


// interface Props {
//   size?: keyof typeof SIZE_MAPS
//   radius?: keyof typeof RADIUS_MAPS
//   variant?: keyof typeof VARIANT_MAPS
//   isLoading?: boolean,
// }

/*
 use withDefaults doesn't update component when props change
  -> force use :key each component to update component
*/

// const { size, variant, radius, isLoading } = withDefaults(defineProps<Props>(), {
//   size: 'sm', radius: 'xl', variant: 'primary'
// })


const { size, variant, radius, isLoading, classes } = defineProps({
  classes: {
    type: String,
  },
  size: {
    type: String,
    default: 'sm',
    // validator(value: string): boolean {
    //   return Object.keys(SIZE_MAPS).includes(value)
    // }
  },
  variant: {
    // type: ['primary', 'secondary'],
    type: String,
    default: 'primary',
    // validator(value: string): boolean {
    //   return ['primary', 'secondary'].includes(value)
      // return Object.keys(VARIANT_MAPS).includes(value)
    // }
  },
  radius: {
    type: String,
    default: 'xl',
    // validator(value: string): boolean {
    //   return Object.keys(RADIUS_MAPS).includes(value)
    // }
  },
  isLoading: { type: Boolean },
})


</script>


<style scoped>

.button {
  @apply shadow-sm
  flex items-center justify-center
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
  disabled:bg-zinc-200/80 disabled:text-zinc-400/50 disabled:cursor-default disabled:hover:opacity-100
  disabled:ring-1 disabled:ring-inset disabled:ring-zinc-300
}

</style>
