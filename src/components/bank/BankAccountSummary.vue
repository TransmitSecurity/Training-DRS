<script setup lang="ts">
import { CurrencyEuroIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  accountName: string
  accountNumber: string
  accountBalance: number
}>()
</script>
<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-8">
      <div><currency-euro-icon class="h-6 w-6" /></div>
      <div class="flex flex-col gap-4">
        <div class="underline">{{ props.accountName }}</div>
        <div class="text-xs">{{ props.accountNumber }}</div>
      </div>
    </div>
    <div class="flex items-center">
      <div class="text-primary font-bold">
        {{ $n(props.accountBalance, 'currency') }}
      </div>
      <ellipsis-vertical-icon class="h-6 w-6" />
    </div>
  </div>
</template>
