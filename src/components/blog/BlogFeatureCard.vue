<script setup lang="ts">
import { toRefs } from 'vue'
const props = defineProps<{
  featureTitle: string
  featureDescription: string
}>()

const { featureTitle, featureDescription } = toRefs(props)
</script>
<template>
  <div class="p-8 space-y-3 border-2 border-primary rounded-xl">
    <span class="inline-block text-primary">
      <slot></slot>
    </span>

    <h1 class="text-2xl font-semibold text-base-content capitalize">{{ featureTitle }}</h1>

    <p class="text-base-content/70">{{ featureDescription }}</p>
  </div>
</template>
