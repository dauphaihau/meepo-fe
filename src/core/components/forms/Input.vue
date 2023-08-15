<template>

  <div :class="classWrapper">
    <label v-if="label" for="username" class="label">{{ label }}</label>
    <div class="my-1">
      <!--      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">-->
      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">

        <span
            class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"
        ></span>
        <!--        :class="disabled && 'bg-gray-200'"-->

        <textarea
            v-if="shape === 'textarea'"
            type="text"
            class="input resize-none py-2"
            rows="4"
            :value="modelValue"
            @input="updateTitle"
            v-bind="$attrs"
        />
        <input
            v-if="shape === 'input'"
            class="input"
            :class="cn('input', SIZE_MAPS[size])"
            :value="modelValue"
            @input="updateTitle"
            v-bind="$attrs"
        />
      </div>
    </div>
    <p v-if="helperText" class='text-red-500 text-[0.75rem]'>{{ helperText }}</p>
  </div>

</template>

<script setup lang="ts">
import { cn } from '@/core/helper.js'

const { size, classWrapper, label, helperText, modelValue, shape } = defineProps({
  modelValue: { type: String, default: '' },
  classWrapper: { type: String },
  size: { type: String, default: 'sm' },
  label: { type: [String, Boolean], },
  shape: { type: String, default: 'input' },
  helperText: { type: String, default: '' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const updateTitle = (event) => {
  emit('update:modelValue', event.target.value)
}

const SIZE_MAPS = {
  sm: 'h-9',
  md: 'h-[42px]',
}
</script>


<style scoped>
/*disabled:bg-gray-200 disabled:text-[#aeb5bc] disabled:hover:opacity-100*/

.label {
  @apply block text-sm font-medium leading-6 text-gray-900;
}


/*disabled:bg-gray-200*/
.input {
  @apply block flex-1 border-0 border-none bg-transparent
  pl-1 pr-2
  text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6;
}

</style>
