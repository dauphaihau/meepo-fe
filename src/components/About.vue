<template>
    <Popover v-slot="{ open }" class="fixed bottom-10 left-16 z-[5]">
      <PopoverButton
          :class="open ? '' : 'text-opacity-90'"
          class="focus:outline-none"
      >
        <!--        <div class=" rounded-full bottom-1 drop-shadow-2xl cursor-pointer h-9 w-9 bg-white hover:bg-zinc-200/20 animate shadow-2xl border flex items-center justify-center">-->
        <div class=" rounded-full bottom-1 drop-shadow-2xl cursor-pointer h-9 w-9 bg-white hover:bg-opacity-10 animate shadow-2xl border flex items-center justify-center">
          ?
        </div>
      </PopoverButton>

      <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel class="absolute z-[10] left-0 bottom-14 translate-x-0 transform ">
          <div class="group relative flex rounded-2xl bg-zinc-50 transition-shadow shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5 w-[350px]">
            <div class="pointer-events-none">
              <div class="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
                <svg
                    aria-hidden="true"
                    class="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
                >
                  <defs>
                    <pattern id=":R5ahdcqla:" width="72" height="56" patternUnits="userSpaceOnUse" x="50%" y="-6">
                      <path d="M.5 56V.5H72" fill="none"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" stroke-width="0" fill="url(#:R5ahdcqla:)"></rect>
                  <svg x="50%" y="-6" class="overflow-visible">
                    <rect stroke-width="0" width="73" height="57" x="-72" y="112"></rect>
                    <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
                  </svg>
                </svg>

              </div>

              <div
                  class="absolute inset-0 rounded-2xl bg-gradient-to-r from-zinc-100 to-zinc-200 opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
                  style="mask-image: radial-gradient(180px at 200.5px 69px, white, transparent);"
              />

              <div
                  class="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
                  style="mask-image: radial-gradient(180px at 200.5px 69px, white, transparent);"
              >
                <svg
                    aria-hidden="true"
                    class="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
                >
                  <defs>
                    <pattern id=":R1dahdcqla:" width="72" height="56" patternUnits="userSpaceOnUse" x="50%" y="-6">
                      <path d="M.5 56V.5H72" fill="none"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" stroke-width="0" fill="url(#:R1dahdcqla:)"></rect>
                  <svg x="50%" y="-6" class="overflow-visible">
                    <rect stroke-width="0" width="73" height="57" x="-72" y="112"></rect>
                    <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
                  </svg>
                </svg>
              </div>
            </div>

            <div class="absolute inset-0 rounded-2xl ring-zinc-900/5 ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20"/>


            <div class="relative rounded-2xl px-4 pb-4 pt-4">

              <div class="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-emerald-300/10 dark:group-hover:ring-emerald-400">
                <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    class="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400"
                >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10 16.5c4.142 0 7.5-3.134 7.5-7s-3.358-7-7.5-7c-4.142 0-7.5 3.134-7.5 7 0 1.941.846 3.698 2.214 4.966L3.5 17.5c2.231 0 3.633-.553 4.513-1.248A8.014 8.014 0 0 0 10 16.5Z"
                  ></path>
                  <path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.5h5M8.5 11.5h3"></path>
                </svg>
              </div>

              <h3 class="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
                <p>
                  <!--                  <span class="absolute inset-0 rounded-2xl"></span>-->
                  About
                </p>
              </h3>
              <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                This project was inspired from Twitter, Reddit and  built with Vue.js, Tailwind, Typescript, Ruby on Rails,
                Postgresql
              </p>
              <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Reach me out via <a
                  class=" underline-offset-2 underline hover:text-black"
                  href="mailto:dauphaihau@gmail.com"
              >dauphaihau@gmail.com</a>
              </p>
            </div>

          </div>

        </PopoverPanel>
      </transition>
    </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

</script>
