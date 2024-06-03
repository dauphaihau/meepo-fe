<template>
  <div :class="classWrapper">
    <label
      v-if="label"
      for="username"
      class="label"
    >{{ label }}</label>
    <div class="my-1">
      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">
        <textarea
          v-if="shape === 'textarea'"
          type="text"
          class="input resize-none py-2"
          rows="4"
          :value="modelValue"
          v-bind="$attrs"
          @input="onChangeInput"
        />
        <!--            @input="$emit('update:modelValue', handleInputChange($event))"-->

        <!--            v-if="shape === 'input'"-->
        <input
          :value="modelValue"
          class="input"
          :class="cn('input', SIZE_MAPS[size])"
          v-bind="$attrs"
          @input="onChangeInput"
        >
        <!--            @input="$emit('update:modelValue', handleInputChange($event))"-->
      </div>
    </div>
    <p
      v-if="helperText"
      :class="classHelperText"
      class="text-red-500 text-[0.75rem]"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/core/helper.js';

interface Props {
  modelValue?: string | number
  classWrapper?: string
  size?: keyof typeof SIZE_MAPS
  label?: string
  shape?: 'input' | 'textarea'
  helperText?: string
  classHelperText?: string
}

const {
  size,
  classWrapper,
  classHelperText,
  label,
  helperText,
  shape,
// } = defineProps<Props>()
// use withDefaults doesn't update component when props change
} = withDefaults(defineProps<Props>(), {
  size: 'sm', shape: 'input', helperText: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>();

const onChangeInput = (event) => {
  emit('update:modelValue', event.target.value);
};

// const handleInputChange = (event: Event) => {
//   return (event.target as HTMLInputElement).value
// }

const SIZE_MAPS = {
  sm: 'h-9',
  md: 'h-[42px]',
};
</script>


<style scoped>
/*disabled:bg-zinc-200 disabled:text-[#aeb5bc] disabled:hover:opacity-100*/

.label {
  @apply block text-sm font-medium leading-6 text-zinc-900;
}


/*disabled:bg-zinc-200*/
.input {
  @apply block flex-1 border-0 border-none bg-transparent
  disabled:bg-[#f7f8f9] disabled:text-[#c2c3c4] disabled:ring-1 disabled:ring-inset disabled:ring-zinc-300 rounded-md
  pl-3 pr-2

  text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6;
}

</style>
