<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';

import { cn } from '@/core/helper.js';

interface Props {
  show: boolean,
  closeDialog: () => void,
  classPanel?: string
  title?: string
  hideCloseBtn?: boolean
}

const {
  show, closeDialog, classPanel, hideCloseBtn, title, 
} = defineProps<Props>();

</script>

<template>
  <slot name="trigger" />

  <TransitionRoot
    appear
    :show="show"
    as="template"
  >
    <Dialog
      as="div"
      class="relative z-[5]"
      @close="closeDialog"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-zinc-300 bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto flex justify-center text-center">
        <!--                        as="template"-->
        <TransitionChild
          class="w-full md:w-auto"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            :class="cn(
              'transform transition-all md:rounded-2xl bg-white py-6 px-8 text-left shadow-xl',
              'w-full min-h-screen md:min-h-0',
              // 'overflow-hidden',
              classPanel
            )"
          >
            <div>
              <div
                v-if="title"
                class="absolute top-3 left-4 text-xl text-black max-w-sm truncate font-medium"
              >
                {{ title }}
              </div>
              <XMarkIcon
                v-if="!hideCloseBtn"
                class="absolute top-2 right-2 text-black h-9 w-9 cursor-pointer hover:bg-zinc-100 rounded-full p-2 animate"
                @click="closeDialog"
              />
            </div>

            <slot name="panel" />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>

</style>
