<script setup lang="ts">
import { ref } from 'vue';
import { GlobeAsiaAustraliaIcon } from '@heroicons/vue/20/solid';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/20/solid';
import { POST_WHO_CAN_COMMENT } from '@config/post.ts';

interface Props {
  defaultValue: number
}

export interface OptionSelectWhoCanComment {
  title: string
  value: POST_WHO_CAN_COMMENT
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: POST_WHO_CAN_COMMENT.EVERYONE,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: {title: string}): void
}>();

const options: OptionSelectWhoCanComment[] = [
  { title: 'Everyone', value: POST_WHO_CAN_COMMENT.EVERYONE },
  { title: 'People you follow', value: POST_WHO_CAN_COMMENT.FOLLOWED },
];

const selectedOption = ref(options[props.defaultValue]);

// const onChangeSelect = (val) => {};

</script>

<template>
  <div class="w-fit relative z-10">
    <Listbox
      v-model="selectedOption"
      @update:model-value="value => emit('update:modelValue', value)"
    >
      <div class="relative mt-1">
        <ListboxButton
          class="flex items-center gap-2 text-zinc-500 font-semibold my-2 hover:bg-zinc-200
           w-fit rounded-full px-2 py-1 cursor-pointer border-none animate"
        >
          <!--          @input="onChangeSelect"-->

          <GlobeAsiaAustraliaIcon class=" h-4 w-4" />
          <div class="text-sm">
            {{ selectedOption.title }} can comment
          </div>
        </ListboxButton>


        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute bottom-10 md:bottom-auto mt-1 max-h-60 w-full overflow-auto
             rounded-xl bg-white text-base shadow-lg
               ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="opt in options"
              v-slot="{ active, selected }"
              :key="opt.title"
              :value="opt"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-900',
                  'relative cursor-pointer select-none py-2 pl-4 pr-10',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                >{{ opt.title }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-5 flex items-center text-black"
                >
                  <CheckIcon
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
