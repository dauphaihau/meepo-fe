<script setup lang="ts">

interface Props {
  size?: keyof typeof SIZE_MAPS
  label?: string
  help?: string
  error?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  label: '',
  help: '',
  error: '',
  description: '',
});

const {
  label,
  description,
  size,
} = props;

const SIZE_MAPS = {
  sm: 'text-[0.75rem]',
  md: 'text-sm',
};

</script>

<template>
  <!--  <div :class="classWrapper">-->
  <div>
    <label
      v-if="label"
      :for="label"
      class="label"
      :class="[SIZE_MAPS[size]]"
    >
      {{ label }}
    </label>
    <p
      v-if="description"
      class="text-zinc-500"
      :class="[SIZE_MAPS[size]]"
    >
      {{ description }}
    </p>
    <div class="my-1">
      <slot />
    </div>
    <p
      v-if="props.error"
      class="text-red-500"
      :class="[SIZE_MAPS[size]]"
    >
      {{ props.error }}
    </p>
    <p
      v-if="props.help && !props.error"
      class="text-zinc-500"
      :class="[SIZE_MAPS[size]]"
    >
      {{ props.help }}
    </p>
  </div>
</template>

<style scoped>

.label {
  @apply block text-sm font-medium leading-6 text-zinc-900;
}

</style>
