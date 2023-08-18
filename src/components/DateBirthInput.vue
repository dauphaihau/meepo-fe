<template>
  <div :class="classWrapper">

    <label v-if="label" for="username" class="label">{{ label }}</label>

    <div class="flex gap-2 w-full mb-1">
      <Select
          :data="months"
          @update:modelValue="onChangeSelect"
          classWrapper="w-[145px]"
          placeholder="Month"
          name="month"
          v-model="dob.month"
      />
      <Select
          @update:modelValue="onChangeSelect"
          placeholder="Day"
          :data="days" classWrapper="w-[124px]" name="day"
          v-model="dob.day"
      />
      <Select
          @update:modelValue="onChangeSelect"
          placeholder="Year"
          :data="years" classWrapper="w-[115px]" name="year"
          v-model="dob.year"
      />
    </div>
    <p v-if="helperText" class='text-red-500 text-[0.75rem]'>{{ helperText }}</p>
  </div>

</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import Select from "@/core/components/forms/Select.vue";

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

interface Props {
  classWrapper?: string
  label?: string
  helperText?: string
}

/*
   error type cause by IDE: https://stackoverflow.com/questions/76313288/error-when-using-both-withdefaults-and-defineprops-in-script-setup-in-vite-v
   issue happens only for non-boolean fields: https://stackoverflow.com/questions/76322580/after-update-of-vue-3-withdefaults-throws-a-typescript-error
 */
// @ts-ignore
const { classWrapper, label, helperText } = withDefaults(defineProps<Props>(), {
  helperText: '',
})

const dob = ref({ month: '', day: '', year: '' })

const month = ref('')
const day = ref('')
const year = ref('')

const months = ref([])
const days = ref([])
const years = ref([])

onBeforeMount(() => {
  months.value = [
    { name: 'January' },
    { name: 'February' },
    { name: 'March' },
    { name: 'April' },
    { name: 'May' },
    { name: 'June' },
    { name: 'July' },
    { name: 'August' },
    { name: 'September' },
    { name: 'October' },
    { name: 'November' },
    { name: 'December' },
  ]

  days.value = new Array(31).fill("").map((_, i) => ({
    name: (i + 1).toString()
  }));

  years.value = new Array(43).fill("").map((_, i) => ({
    name: (1980 + i + 1).toString()
  })).reverse();

})

const onChangeSelect = (option: {name: string, value: string}) => {
  switch (option.name) {
    case 'month':
      month.value = option.value
      break
    case 'day':
      day.value = option.value
      break
    case 'year':
      year.value = option.value
      break
  }

  if (![month.value, day.value, year.value].includes('')) {
    const output = `${year.value}-${month.value}-${day.value}`
    emit('update:modelValue', output)
  }
}
</script>


<style scoped>
/*disabled:bg-gray-200 disabled:text-[#aeb5bc] disabled:hover:opacity-100*/

.label {
  @apply block text-sm font-medium leading-6 text-gray-900;
}

.input {
  @apply block flex-1 border-0 border-none bg-transparent  pl-1 pr-2
  text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6;
}

</style>
