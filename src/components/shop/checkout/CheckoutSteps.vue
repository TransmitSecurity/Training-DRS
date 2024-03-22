<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  steps: string[]
  currentStep: number
}>()

const { steps, currentStep } = toRefs(props)
</script>

<template>
  <div class="flex">
    <ul class="steps shop-steps w-full">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        data-content=""
        :class="index < currentStep ? 'step-primary' : ''"
      >
        {{ step }}
      </li>
    </ul>
  </div>
</template>
