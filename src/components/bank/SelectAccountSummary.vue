<script setup lang="ts">
import { BanknotesIcon } from '@heroicons/vue/24/outline'
import type { Account } from '@/helpers/account'

const props = defineProps<{
  account: Account
}>()
</script>
<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-4">
      <div><banknotes-icon class="h-6 w-6" /></div>
      <div class="flex flex-col">
        <div class="uppercase tracking-wider text-primary">{{ props.account.holder }}</div>
        <div class="text-xs flex gap-4">
          <span class="font-bold">{{ props.account.name }}</span>
          <span class="font-light">n° {{ props.account.number }}</span>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div class="text-primary font-bold">
        {{ $n(props.account.balance, 'currency') }}
      </div>
    </div>
  </div>
</template>
