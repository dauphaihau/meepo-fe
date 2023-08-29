<template>
  <Listbox
      @update:modelValue="onChangeSelect"
      v-model="selectedOption"
      v-slot="{open}"
  >
    <div class="relative mt-1">
      <ListboxButton class="list-button" :class="classWrapper">
        <span class="block truncate">{{ selectedOption.name }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <div v-if="open" class="fixed inset-0"/>
      <!--      <div v-if="open" class="fixed inset-0 bg-black opacity-30" />-->

      <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <ListboxOptions
            class="list-options"
            :class="classWrapper"
        >
          <ListboxOption
              v-slot="{ active, selected }"
              v-for="(option, index) in data"
              :key="option.name"
              :value="option"
              as="div"
          >
            <li
                v-if="placeholder && index > 0 "
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-3 pr-4',
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
</template>


<script setup lang="ts">
// @ts-nocheck
import { onBeforeMount, onMounted, ref } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { logger } from "@/core/helper";

interface Props {
  modelValue: string
  classWrapper?: string
  size?: 'sm'
  label?: string
  helperText?: string
  name: string
  placeholder?: string
  data: {name: string}[]
  shape?: 'input'
}

//    @ts-ignore
let {
  name,
  placeholder,
  size,
  classWrapper,
  data,
  label,
  helperText,
  modelValue,
  shape
} = withDefaults(defineProps<Props>(), {
  data: [
    { name: 'November' },
    { name: 'July' },
    { name: 'August' },
  ]
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: {name: string, value: string}): void
}>()

const selectedOption = ref(data[0])

onBeforeMount(() => {
  if (modelValue) {
    selectedOption.value = data[1]
    const option = data.find(d => d.name === modelValue)
    if (!option) {
      logger.warn(`Select input execute onBeforeMount: not found option at select input with name ${name}`)
    }
    selectedOption.value = option || data[0]
    return
  }

  if (placeholder) {
    data.unshift({ name: placeholder })
    selectedOption.value = data[0]
  }
})

const onChangeSelect = (val) => {
  emit('update:modelValue', { name, value: val.name })
}

</script>


<style scoped>

.list-button {
  @apply relative cursor-default rounded-md bg-white h-[42px] pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300
  focus-within:ring-2 focus-within:ring-inset focus-within:ring-black focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2
  focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm
  ;
}


.list-options {
  @apply absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm;
}

.label {
  @apply block text-sm font-medium leading-6 text-gray-900;
}

</style>
