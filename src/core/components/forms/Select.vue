<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue';

import { cn } from '@core/helpers/common.js';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

export type TOption = {
 id: string | number
 name: string
  disabled?: boolean
}

interface IProps {
  modelValue: string
  size?: 'sm'
  label?: string
  helperText?: string
  name: string
  placeholder?: string
  options: TOption[]
  disabled?: boolean
  classWrapper?: string
  classOptions?: string
  classBtn?: string
  defaultValue?: number | null
}

const props = withDefaults(defineProps<IProps>(), {
  name : '',
  placeholder: '',
  size : 'sm',
  classWrapper : '',
  classBtn : '',
  classOptions : '',
  label : '',
  helperText : '',
  modelValue : '',
  disabled : false,
  defaultValue: 0,
  options: () => [
    { id: 1, name: 'Example 1' },
    { id: 2, name: 'Example 2' },
    { id: 3, name: 'Example 3' },
  ],
});

let {
  name,
  placeholder,
  classOptions,
  classBtn,
  options,
} = props;

const emit = defineEmits<{
  (e: 'update:modelValue', value: TOption): void
}>();

const indexOption = computed(() => {
  const idx = options.findIndex(d => d.name === props.modelValue);
  if (idx !== -1) {
    return idx;
  }
  return props.defaultValue;
});

const onChangeSelect = (option: TOption) => {
  emit('update:modelValue', option);
};

</script>

<template>
  <div :class="classWrapper">
    <Listbox
      v-slot="{ open }"
      :default-value="options[indexOption]"
      :name="name"
      v-bind="$attrs"
      @update:model-value="onChangeSelect"
    >
      <div class="relative mt-1">
        <ListboxButton
          v-slot="{ value }"
          class="list-button"
          :class="cn(
            disabled ? 'bg-[#f7f8f9] text-[#c2c3c4] ring-1 ring-inset ring-zinc-300' : 'bg-white',
            classBtn
          )"
        >
          <span class="block truncate">{{ value?.name }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              class="h-5 w-5 text-zinc-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <div
          v-if="open"
          class="fixed inset-0"
        />
        <!--      <div v-if="open" class="fixed inset-0 bg-black opacity-30" />-->

        <transition
          v-if="!disabled"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="list-options"
            :class="classOptions"
          >
            <ListboxOption
              v-for="(option, index) in props.options"
              v-slot="{ active, selected }"
              :key="option.name"
              :value="option"
              :disabled="option?.disabled && option.disabled"
              as="div"
            >
              <li
                v-if="placeholder && index > 0 "
                :class="[
                  active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-900',
                  'relative cursor-pointer select-none py-2 pl-3 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                >{{ option.name }}</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<style scoped>

.list-button {
  @apply
  relative cursor-default rounded-md text-left sm:text-sm shadow-sm
  pl-3 pr-10
  w-full h-[42px]
  ring-1 ring-inset ring-zinc-300
  focus-within:ring-2 focus-within:ring-inset focus-within:ring-black focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2
  focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-black
  ;
}


.list-options {
  @apply w-full absolute mt-1 max-h-52 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm;
}

</style>
