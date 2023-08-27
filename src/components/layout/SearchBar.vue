<template>
  <div class="top-16 w-[656px]">
    <Combobox v-model="selected">
      <div class="relative mt-1">
        <div
            class="wrapper-input group"
            :class="{
              '!bg-white': isFocus,
              'rounded-full': !isFocus || storedSearches.length === 0 && people.length === 0 && !query,
              'rounded-t-3xl': isFocus && (people.length > 0 || storedSearches.length > 0 || query),
          }"
        >
          <MagnifyingGlassIcon class="h-5 w-5 text-zinc-500"/>
          <ComboboxInput
              placeholder="Search Meepo"
              @focus="handleFocus"
              @focusout="isFocus = false"
              class="input group-hover:bg-white animate w-[570px]"
              @input="(e) => {query = e.target.value; handleSearch(e)} "
              v-on:keyup.enter="handleEnter"
              :displayValue="() => query"
          />

          <!--              v-if="!query"-->
          <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2 z-10"
              :class="{'w-full': !isFocus}"
          />
          <!--          <XCircleIcon-->
          <!--              v-if="query"-->
          <!--              @click="query = ''"-->
          <!--              class="absolute text-zinc-500 h-6 w-6 cursor-pointer absolute top-2 right-3"-->
          <!--          />-->
        </div>


        <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
          <!--            @after-leave="query = ''"-->


          <ComboboxOptions
              class="options"

              :class="{'ring-1': isFocus && (people.length > 0 || storedSearches.length > 0 || query)}"
          >

            <!--            History search-->
            <ComboboxOption
                v-if="storedSearches.length > 0 && !query"
                v-for="searchValue in storedSearches"
                as="div"
                :key="searchValue"
                :value="searchValue"
                v-slot="{ selected, active }"
            >
              <div
                  @click="query = searchValue; handleEnter()"
                  class="flex items-center gap-2 px-4 cursor-pointer hover:bg-zinc-100 py-3 animate"
              >
                <MagnifyingGlassIcon class="h-5 w-5 min-w-[1.25rem]"/>
                <p class="text-sm grow overflow-hidden text-ellipsis whitespace-nowrap">{{ searchValue }}</p>
                <div @click.stop="removeSearch(searchValue)">
                  <XCircleIcon v-tooltip="'remove'" class="h-5 w-5"/>
                </div>
              </div>
            </ComboboxOption>

            <ComboboxOption>

              <div
                  v-if="query"
                  class="flex items-center gap-2 px-4 cursor-pointer hover:bg-zinc-100 py-3 animate"
                  @click="handleRedirect('search')"
              >
                <MagnifyingGlassIcon class="h-5 w-5 min-w-[1.25rem]"/>
                <p class="text-sm grow overflow-hidden text-ellipsis whitespace-nowrap">Search for "{{ query }}"</p>
              </div>
            </ComboboxOption>

            <!--             Post-->
            <!--            <div v-if="posts && posts.length > 0">-->
            <!--              <p class="pl-10 font-bold py-3">Posts</p>-->
            <!--              <ComboboxOption-->
            <!--                  v-for="post in posts"-->
            <!--                  as="template"-->
            <!--                  :key="post.id"-->
            <!--                  :value="post"-->
            <!--                  v-slot="{ selected, active }"-->
            <!--              >-->
            <!--                <li-->
            <!--                    @click="handleRedirect('post', post)"-->
            <!--                    class="relative cursor-default select-none py-4 pl-10 pr-4"-->
            <!--                    :class="{-->
            <!--                              'bg-[#f3f4f5] text-black': active,-->
            <!--                              'text-zinc-900': !active,-->
            <!--                            }"-->
            <!--                >-->
            <!--                  <span-->
            <!--                      class="block truncate"-->
            <!--                      :class="{ 'font-medium': selected, 'font-normal': !selected }"-->
            <!--                  >-->
            <!--                    {{ post.content }}-->
            <!--                  </span>-->
            <!--                  <span-->
            <!--                      v-if="selected"-->
            <!--                      class="absolute inset-y-0 left-0 flex items-center pl-3"-->
            <!--                      :class="{ 'text-white': active, 'text-teal-600': !active }"-->
            <!--                  >-->
            <!--                    <CheckIcon class="h-5 w-5" aria-hidden="true"/>-->
            <!--                  </span>-->
            <!--                </li>-->
            <!--              </ComboboxOption>-->
            <!--              <div class="border-zinc-100 border"></div>-->
            <!--            </div>-->


            <!--            Trending-->
            <!--            <div v-if="postsTrending.length > 0">-->
            <!--              <p class="pl-10 font-bold py-3">Trending Today</p>-->
            <!--              <ComboboxOption-->
            <!--                  v-for="post in postsTrending"-->
            <!--                  as="div"-->
            <!--                  :key="post.id"-->
            <!--                  :value="post"-->
            <!--                  v-slot="{ selected, active }"-->
            <!--              >-->
            <!--                <li-->
            <!--                    class="relative cursor-default select-none py-4 pl-10 pr-4"-->
            <!--                    :class="{-->
            <!--                              'bg-[#f3f4f5] text-black': active,-->
            <!--                              'text-zinc-900': !active,-->
            <!--                            }"-->
            <!--                >-->
            <!--                  <span-->
            <!--                      class="block truncate"-->
            <!--                      :class="{ 'font-medium': selected, 'font-normal': !selected }"-->
            <!--                  >-->
            <!--                    {{ post.content }}-->
            <!--                  </span>-->
            <!--                  <span-->
            <!--                      v-if="selected"-->
            <!--                      class="absolute inset-y-0 left-0 flex items-center pl-3"-->
            <!--                      :class="{ 'text-white': active, 'text-teal-600': !active }"-->
            <!--                  >-->
            <!--                    <CheckIcon class="h-5 w-5" aria-hidden="true"/>-->
            <!--                  </span>-->
            <!--                </li>-->
            <!--              </ComboboxOption>-->
            <!--            </div>-->


            <!--             People-->
            <div v-if="people && people.length > 0">
              <p class="pl-10 font-bold pt-3 pb-2">People</p>
              <!--                  as="template"-->
              <ComboboxOption
                  v-for="person in people"
                  as="div"
                  :key="person.id"
                  :value="person"
                  v-slot="{ selected, active }"
              >

                <li
                    @click="handleRedirect('user', person)"
                    class="relative cursor-pointer select-none py-4 pl-10 pr-4 block"
                    :class="{
                  'bg-[#f3f4f5] text-black': active,
                  'text-zinc-900': !active,
                }"
                >
                  <div class="flex gap-2">
                    <div class="rounded-full h-10 w-10 bg-black"/>
                    <div>
                      <span
                          class="block truncate"
                          :class="{ 'font-medium': selected, 'font-normal': !selected }"
                      >
                        {{ person.name }}
                      </span>
                      <span class="block truncate text-zinc-500">@{{ person.username }}</span>
                    </div>
                  </div>
                </li>
              </ComboboxOption>

            </div>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { MagnifyingGlassIcon, XMarkIcon, XCircleIcon } from '@heroicons/vue/24/outline'

import { commonAPI } from "@/apis/common";
import { IUser } from "@/types/user";
import { IPost } from "@/types/post";

const { query: queryVal } = defineProps<{query: string}>()
const emit = defineEmits<{
  (e: 'changeRoute', value?: string)
}>()

const router = useRouter()
const route = useRoute()

const username = route.params.username

const selected = ref(null)
const query = ref(queryVal)
const isFocus = ref(false)
const people = ref([]);
const posts = ref([]);
const postsTrending = ref([]);
const storedSearches = ref([]);

onMounted(async () => {
  await router.isReady()

  if (localStorage.storedSearches) {
    storedSearches.value = JSON.parse(localStorage.storedSearches)
  }
})

watch(router.currentRoute, () => {
  if (route.name !== 'search') {
    query.value = ''
  }
})

const debounce = (fn, delay = 300) => {
  let timeout

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const handleSearch = debounce((e) => {
  query.value = e.target.value
  search(e.target.value)
}, 500)

const handleFocus = () => {
  isFocus.value = true
  search(query.value)
}

const search = async (value = '') => {
  if (!value) {
    people.value = []
    return
  }
  const { data } = await commonAPI.searchAll({ q: value })
  people.value = data.users
  posts.value = data.posts
  // postsTrending.value = data.posts_trending
}

const handleOutFocus = () => {
  isFocus.value = false
}

const handleRedirect = (type, data?: IUser & IPost) => {
  switch (type) {
    case 'search':
      if (!route.query?.f) {
        route.query.f = 'top'
      }
      router.push({
        path: 'search',
        query: {
          q: query.value,
          f: route.query.f
        }
      })
      emit('changeRoute', query.value)
      break
    case 'post':
      router.push('/posts/' + data.id)
      emit('changeRoute')
      break
    default:
      router.push('/user/' + data.username)
      emit('changeRoute')
  }

}

const handleEnter = () => {
  // query.value = e.target.value
  // search(e.target.value)

  if (!storedSearches.value.includes(query.value)) {
    storedSearches.value.push(query.value)
    localStorage.storedSearches = JSON.stringify(storedSearches.value)
  }

  handleRedirect('search')
  // handleRedirect(selected.value)
}

const removeSearch = (search) => {
  const storedSearchesArr = JSON.parse(localStorage.storedSearches)
  storedSearches.value = storedSearchesArr.filter((s) => s !== search)
  localStorage.storedSearches = JSON.stringify(storedSearches.value)
}

</script>

<style scoped>

.wrapper-input {
  @apply relative cursor-pointer overflow-hidden bg-zinc-100 hover:bg-white animate text-left border border-zinc-200  sm:text-sm flex items-center pl-4;
  width: 600px;
}

.input {
  @apply w-full border-0 border-none py-2.5 pl-3 text-sm leading-5 placeholder:text-[#818182] text-black focus:outline-none bg-zinc-100 hover:bg-white focus:bg-white;
  width: 550px;
}


.options {
  @apply absolute max-h-96 max-w-[598px] ml-[1px] w-full overflow-auto rounded-b-md bg-white text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm
}
</style>
