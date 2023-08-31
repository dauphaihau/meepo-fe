<template>
  <div class="top-16 w-[656px]">
    <Combobox v-model="selected" v-slot="{open}">
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
              :class="{'!bg-white': isFocus, 'pr-8': query }"
              @input="(e) => {query = e.target.value; handleSearch(e)} "
              v-on:keyup.enter="handleEnter"
              :displayValue="() => query"
          />
          <!--              v-if="!query"-->

          <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2 z-[1]"
              :class="{'w-full': !isFocus}"
          />
          <XCircleIcon
              v-if="query"
              @click.stop="query = ''"
              class="absolute text-zinc-500 hover:text-black animate h-6 w-6 cursor-pointer absolute top-2 right-3 z-[2]"
          />
          <!--              @click.stop="query = ''; isFocus = true"-->

        </div>


        <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
          <!--            @after-leave="query = ''"-->

          <!--              :hold="true"-->
          <!--              :hold="!isFocus"-->
          <ComboboxOptions
              class="options"
              :class="{'ring-1': isFocus && (people.length > 0 || storedSearches.length > 0 || query)}"
          >

            <!--            History search-->
            <!--                v-if="storedSearches.length > 0 && !query"-->
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
            <div v-if="people && people.length > 0" class="border-t">
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
                    <img
                        v-if="person.avatar_url"
                        alt="avatar"
                        v-bind:src="person.avatar_url"
                        class="rounded-full h-10 w-10 bg-black"
                    />
                    <img
                        v-else
                        alt="avatar"
                        src="@/assets/default-avatar.png"
                        class="rounded-full h-10 w-10 bg-black"
                    />
                    <div>
                      <div
                          class=" truncate text-[15px] max-h-[18px]"
                          :class="{ 'font-medium': selected, 'font-semibold': !selected }"
                      >
                        {{ person.name }}
                      </div>
                      <div class=" truncate text-zinc-500">@{{ person.username }}</div>
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
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/outline'

import { commonAPI } from "@/apis/common";
import { IUser } from "@/types/user";
import { IPost } from "@/types/post";
import { debounce } from "@/core/helper";

const { query: queryVal } = defineProps<{query: string}>()
const emit = defineEmits<{
  (e: 'changeRoute', value?: string)
}>()

const router = useRouter()
const route = useRoute()

const username = route.params.username

const selected = ref(null)
const comboboxButtonRef = ref(null)
const query = ref(queryVal)
const isFocus = ref(false)
const isEntered = ref(false)
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

const handleSearch = debounce((e) => {
  query.value = e.target.value
  if (isEntered.value) return
  getSearch(e.target.value)
}, 500)

const handleFocus = () => {
  isFocus.value = true
  // getSearch(query.value)
}

const getSearch = async (value?: string) => {
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

const handleEnter = () => {
  if (!query.value) {
    isFocus.value = false
    return
  }
  isEntered.value = true

  // query.value = e.target.value
  // getSearch(e.target.value)

  if (!storedSearches.value.includes(query.value)) {
    storedSearches.value.unshift(query.value)
    localStorage.storedSearches = JSON.stringify(storedSearches.value)
  }

  handleRedirect('search')
  // handleRedirect(selected.value)
}

const handleRedirect = (type, data?: IUser & IPost) => {
  switch (type) {
    case 'search':
      if (!route.query?.f) {
        route.query.f = 'top'
      }
      router.push({
        name: 'search',
        query: {
          q: query.value,
          f: route.query.f
        }
      })
      // emit('changeRoute', query.value)
      break
    case 'post':
      router.push('/posts/' + data.id)
      emit('changeRoute')
      break
    case 'user':
      router.push('/user/' + data.username)
      emit('changeRoute')
  }

}

const removeSearch = (search) => {
  const storedSearchesArr = JSON.parse(localStorage.storedSearches)
  storedSearches.value = storedSearchesArr.filter((s) => s !== search)
  localStorage.storedSearches = JSON.stringify(storedSearches.value)
  isFocus.value = true
}

</script>

<style scoped>

.wrapper-input {
  @apply relative cursor-pointer overflow-hidden bg-zinc-100 hover:bg-white animate text-left border border-zinc-200  sm:text-sm flex items-center pl-4;
  width: 600px;
}

.input {
  @apply w-full border-0 border-none py-2.5 pl-3 text-sm leading-5 placeholder:text-[#818182] text-black focus:outline-none bg-zinc-100 hover:bg-white focus:bg-white focus:pr-8;
  width: 550px;
}


.options {
  @apply absolute max-h-96 max-w-[598px] ml-[1px] w-full overflow-auto rounded-b-md bg-white text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm
}
</style>
