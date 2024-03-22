<script setup lang="ts">
import { ref } from 'vue'
import SelectAccountSummary from './SelectAccountSummary.vue'
import type { Account } from '@/helpers/account'

const props = defineProps<{
  accounts: Account[]
}>()

const emits = defineEmits(['accountSelected'])
const open = ref(false)
const selectedAccount = ref<Account | null>(null)
function selectAccount(account: Account) {
  selectedAccount.value = account
  open.value = false
  emits('accountSelected', account)
}
</script>

<template>
  <div
    class="collapse collapse-arrow rounded-box border border-base-200 bg-base-100 shadow-md py-2 px-0"
  >
    <input type="checkbox" v-model="open" />
    <div class="collapse-title font-medium">
      <div v-if="selectedAccount === null">{{ $t('bank.transfer.selectSendingAccount') }}</div>
      <div v-else>
        <select-account-summary class="hover:cursor-pointer px-4 py-2" :account="selectedAccount" />
      </div>
    </div>
    <div class="collapse-content px-0">
      <hr />
      <div v-for="account in props.accounts" v-bind:key="account.number">
        <select-account-summary
          @click="selectAccount(account)"
          class="hover:bg-base-200/50 hover:cursor-pointer px-4 py-2"
          :account="account"
        />
      </div>
    </div>
  </div>
</template>
