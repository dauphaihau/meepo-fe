<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Select from '@/core/components/forms/Select.vue';
import { logger } from '@core/helpers/logger.ts';
import { TOption } from '@core/components/forms/Select.vue';
import { USER_CONFIG } from '@config/user.ts';

// strict isValid()
dayjs.extend(customParseFormat);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

interface Props {
  helperText?: string
  disabled?: boolean
  defaultValue?: null | number,
  classWrapper?: string
  label?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  helperText: '',
  disabled: false,
  classWrapper : '',
  label : '',
  modelValue: '',
  defaultValue: 0,
});

const {
  defaultValue,
} = props;

const dob = ref({ month: '', day: '', year: '' });
const month = ref('');
const day = ref('');
const year = ref('');

const months = [
  { id: 0, name: 'January' },
  { id: 1, name: 'February' },
  { id: 2, name: 'March' },
  { id: 3, name: 'April' },
  { id: 4, name: 'May' },
  { id: 5, name: 'June' },
  { id: 6, name: 'July' },
  { id: 7, name: 'August' },
  { id: 8, name: 'September' },
  { id: 9, name: 'October' },
  { id: 10, name: 'November' },
  { id: 11, name: 'December' },
];

const years = new Array(new Date().getFullYear() - USER_CONFIG.MIN_YEAR_BIRTH)
  .fill('')
  .map((_, i) => ({
    id: i,
    name: (USER_CONFIG.MIN_YEAR_BIRTH + i + 1).toString(),
  }))
  .reverse();

onBeforeMount(() => {
  if (props.modelValue && typeof props.modelValue === 'string') {
    const formatModelValue = dayjs(props.modelValue).format('YYYY-MMMM-D');
    if (!formatModelValue.includes('-')) {
      logger.error(`Invalid format date: with modelValue is ${props.modelValue} `, 'src/components/DateBirthInput.vue');
      return;
    }
    const dobSplit = formatModelValue.split('-');
    dob.value = {
      year: dobSplit[0],
      month: dobSplit[1],
      day: dobSplit[2],
    };
  }
});

const keyDaySelectComponent = ref(0);
const numsDay = ref(31);

const days = computed(() => {
  return new Array(numsDay.value).fill('').map((_, i) => ({
    id: i,
    name: (i + 1).toString(),
  }));
});

const onChangeSelect = (nameSelect: string, option: TOption) => {
  switch (nameSelect) {
    case 'month':
      month.value = option.name;
      break;
    case 'day':
      day.value = option.name;
      break;
    case 'year':
      year.value = option.name;
      break;
  }

  let defDay = day.value ? day.value : 1;
  const defMonth = month.value ? month.value : 1;
  const defYear = year.value ? year.value : USER_CONFIG.MIN_YEAR_BIRTH;

  const isValid = dayjs(`${defYear}-${defMonth}-${defDay}`, 'YYYY-MMMM-D', true).isValid();
  if (!isValid) {
    dob.value.day = '';
    defDay = 1;
    keyDaySelectComponent.value++;
  }

  const newNumsDay = dayjs(`${defYear}-${defMonth}-${defDay}`).daysInMonth();
  if (newNumsDay !== numsDay.value) {
    numsDay.value = newNumsDay;
  }

  if (props.modelValue) {
    const output = `${year.value ? year.value : dob.value.year}-${month.value ? month.value : dob.value.month}-${day.value ? day.value : dob.value.day} `;
    emit('update:modelValue', output);
    return;
  }

  if (![month.value, day.value, year.value].includes('')) {
    const output = `${year.value}-${month.value}-${day.value}`;
    emit('update:modelValue', output);
  }
};

</script>

<template>
  <div class="flex flex-wrap space-x-1.5 md:space-x-2 w-full mb-1">
    <Select
      v-model="dob.month"
      class-wrapper="w-[40%]"
      :options="months"
      :disabled="props.disabled"
      placeholder="Month"
      name="month"
      :default-value="defaultValue"
      @update:model-value="(opt) => onChangeSelect('month', opt)"
    />
    <Select
      :key="keyDaySelectComponent"
      v-model="dob.day"
      class-wrapper="w-[26%]"
      :options="days"
      :disabled="props.disabled"
      placeholder="Day"
      name="day"
      :default-value="defaultValue"
      @update:model-value="(opt) => onChangeSelect('day', opt)"
    />
    <Select
      v-model="dob.year"
      :options="years"
      class-wrapper="w-[30%]"
      :disabled="props.disabled"
      placeholder="Year"
      name="year"
      :default-value="defaultValue"
      @update:model-value="(opt) => onChangeSelect('year', opt)"
    />
  </div>
</template>

<style scoped>

</style>
