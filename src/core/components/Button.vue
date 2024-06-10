<script setup lang="ts">
import { cn } from '@core/helpers/common.js';
import Loading from '@/core/components/Loading.vue';

const RADIUS_MAPS = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-full',
};

const VARIANT_MAPS = {
  primary: 'bg-black hover:opacity-80 font-semibold text-white',
  outline: 'bg-black hover:opacity-80 font-semibold text-white ring-1 ring-inset ring-zinc-300',
  secondary: 'bg-white text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 font-semibold',
};

const SIZE_MAPS = {
  sm: 'px-4 h-9 leading-7 text-sm',
  md: 'px-7 h-[42px] text-md',
  lg: 'px-9 h-12 text-lg',
  xl: 'p-11 h-14 text-xl',
};

interface IProps {
  size?: keyof typeof SIZE_MAPS
  radius?: keyof typeof RADIUS_MAPS
  variant?: keyof typeof VARIANT_MAPS
  loading?: boolean,
  disabled?: boolean,
  classes?: string,
}

const props = withDefaults(defineProps<IProps>(), {
  size: 'sm',
  radius: 'xl',
  variant: 'primary',
  classes: '',
  loading: false,
});

</script>

<template>
  <button
    :disabled="props.disabled || props.loading"
    v-bind="$attrs"
    :class="cn('button',
               SIZE_MAPS[props.size],
               VARIANT_MAPS[props.variant],
               RADIUS_MAPS[props.radius],
               {
                 'opacity-50 hover:opacity-50 cursor-default': props.loading,
                 'disabled-theme': props.disabled
               },
               props.classes,
    )"
  >
    <Loading
      v-if="props.loading"
      :variant="variant"
      classes="mr-2"
    />
    <span v-if="props.loading">Processing...</span>
    <slot v-else />
  </button>
</template>

<style scoped>

.button {
  @apply shadow-sm
  flex items-center justify-center
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
}

.disabled-theme {
  @apply bg-zinc-200/80 text-zinc-400/50 cursor-default hover:opacity-100 ring-1 ring-inset ring-zinc-300;
}

</style>
