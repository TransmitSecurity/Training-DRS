<script setup lang="ts">
import { toRefs } from 'vue'

import { CheckIcon } from '@heroicons/vue/24/outline'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'
const props = withDefaults(
  defineProps<{
    label: string
    data: string
    verified?: boolean
    verifyRouteName: string
  }>(),
  { verified: false },
)

const { label, data, verified } = toRefs(props)
</script>

<template>
  <div class="form-control w-full max-w-md">
    <label class="label">
      <span class="label-text text-xs text-base-content">{{ label }}</span>
      <div v-if="verified" class="badge badge-info bg-info/20 text-xs gap-2">
        <CheckIcon class="h-4 w-4 text-info-content" />
        {{ $t('userData.verified') }}
      </div>
      <router-link
        :to="{ name: verifyRouteName }"
        v-if="!verified"
        class="text-warning pr-1 text-xs flex items-center w-max underline"
      >
        <ExclamationCircleIcon class="h-4 w-4 text-warning/70" />
        <span>{{ $t('userData.notVerified') }}</span>
      </router-link>
    </label>
    <input type="text" disabled class="input input-bordered w-full" :value="data" />
  </div>
</template>
