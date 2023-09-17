<template>

  <div :class="classWrapper">
    <label v-if="label" for="username" class="label">{{ label }}</label>
    <div class="my-1">
      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black">
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
    <p v-if="helperText" :class="classHelperText" class='text-red-500 text-[0.75rem]'>{{ helperText }}</p>
  </div>

</template>

<script setup lang="ts">
import { cn } from '@/core/helper.js'

const { size, classWrapper, classHelperText, label, helperText, modelValue, shape } = defineProps({
  modelValue: { type: String, default: '' },
  classWrapper: { type: String },
  size: { type: String, default: 'sm', },
  label: { type: [String, Boolean], },
  shape: { type: String, default: 'input' },
  helperText: { type: String, default: '' },
  classHelperText: { type: String, default: '' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const updateTitle = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const SIZE_MAPS = {
  sm: 'h-9',
  md: 'h-[42px]',
}
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
