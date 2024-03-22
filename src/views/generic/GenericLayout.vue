<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    showAlternativeOption?: boolean
    optionDescription?: string
    optionLink?: string
    optionRoute?: string
  }>(),
  { showAlternativeOption: false },
)
</script>
<template>
  <div class="flex flex-grow flex-col px-6 py-12 lg:px-8 bg-base-200">
    <div class="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-base-content">
        {{ props.title }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <slot></slot>
    </div>

    <div class="mt-5 text-center" v-if="showAlternativeOption">
      <p class="text-sm">
        {{ props.optionDescription }}
        <router-link :to="{ name: props.optionRoute }" class="link text-accent">
          {{ props.optionLink }}
        </router-link>
      </p>
    </div>
  </div>
</template>
