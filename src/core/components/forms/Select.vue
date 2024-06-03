<template>
  <div>
    <Listbox
      v-slot="{open}"
      v-model="selectedOption"
      @update:model-value="onChangeSelect"
    >
      <div class="relative mt-1">
        <ListboxButton
          class="list-button"
          :class="cn(classWrapper,
                     disabled ? 'bg-[#f7f8f9] text-[#c2c3c4] ring-1 ring-inset ring-zinc-300' : 'bg-white'
          )"
        >
          <span class="block truncate">{{ selectedOption.name }}</span>
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
            :class="classWrapper"
          >
            <ListboxOption
              v-for="(option, index) in data"
              v-slot="{ active, selected }"
              :key="option.name"
              :value="option"
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


<script setup lang="ts">
// @ts-nocheck

import { onBeforeMount, onMounted, ref } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue';

import { cn, toUpperCaseFirstL } from '@/core/helper.js';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { logger } from '@/core/helper';

interface Props {
  modelValue: string
  classWrapper?: string
  size?: 'sm'
  label?: string
  helperText?: string
  name: string
  placeholder?: string
  data: {name: string}[]
  disabled?: boolean
}

/*
 use withDefaults doesn't update component when props change
  -> force use :key each component to update component
*/

// let {
//   name,
//   placeholder,
//   size,
//   classWrapper,
//   data,
//   label,
//   helperText,
//   modelValue,
//   shape,
//   disabled
// } = withDefaults(defineProps<Props>(), {
//   data: [
//     { name: 'November' },
//     { name: 'July' },
//     { name: 'August' },
//   ]
// });

let {
  name,
  placeholder,
  size,
  classWrapper,
  data,
  label,
  helperText,
  modelValue,
  disabled,
} = defineProps({
  data: {
    type: Array,
    default: [
      { name: 'Option 1' },
      { name: 'Option 2' },
      { name: 'Option 3' },
    ],
  },
  name: { type: String },
  modelValue: { type: String },
  classWrapper: { type: String, default: '' },
  size: { type: String, default: 'sm' },
  label: { type: String },
  helperText: { type: String, default: '' },
  classHelperText: { type: String, default: '' },
  placeholder: { type: String },
  disabled: { type: Boolean },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: {name: string, value: string}): void
}>();

const selectedOption = ref(data[0]);

onBeforeMount(() => {
  if (modelValue) {
    let option = data.find(d => d.name === modelValue);
    if (!option) {
      logger.error(`Select input execute onBeforeMount: not found option at select input with name ${name}`, 'src/core/components/forms/Select.vue');
      option = { name: toUpperCaseFirstL(name) };
    }
    data.unshift(option);
    selectedOption.value = data[0];
    return;
  }

  if (placeholder) {
    data.unshift({ name: placeholder });
    selectedOption.value = data[0];
  }
});

const onChangeSelect = (val) => {
  emit('update:modelValue', { name, value: val.name });
};

</script>


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

.label {
  @apply block text-sm font-medium leading-6 text-zinc-900;
}

</style>
