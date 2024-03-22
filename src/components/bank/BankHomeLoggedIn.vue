<script setup lang="ts">
import { EnvelopeIcon, EllipsisVerticalIcon, CurrencyEuroIcon } from '@heroicons/vue/24/outline'
import BankActionButton from './BankActionButton.vue'
import BankAccountSummary from './BankAccountSummary.vue'
import { computed } from 'vue'
import { userSessionStore } from '@/store/userSession'

const sessionStore = userSessionStore()
const lastLogin = computed(() => {
  const d = new Date()
  return d.toLocaleDateString()
})

const transactionDate1 = computed(() => {
  const d = new Date()
  return d.toLocaleDateString()
})

const transactionDate2 = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString()
})

const transactionDate3 = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 2)
  return d.toLocaleDateString()
})
</script>

<template>
  <div class="h-full w-full">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div class="col-span-1 flex flex-col bg-secondary-focus text-primary-content px-10 py-12">
        <div class="flex justify-between">
          <div class="flex flex-col text-primary-content">
            <div class="font-bold text-lg tracking-wider">{{ $t('bank.greeting') }}</div>
            <div class="font-bold text-lg tracking-wider">{{ sessionStore.fullName }}</div>
            <div class="text-xs">{{ $t('bank.lastLogin') }} {{}}</div>
          </div>
          <div>
            <button class="flex items-center gap-x-4">
              <div class="indicator">
                <envelope-icon class="h-5 w-5 text-primary-content" />
                <span class="badge badge-xs badge-accent indicator-item"></span>
              </div>
              <div class="underline text-xs">{{ $t('bank.unread') }}</div>
            </button>
          </div>
        </div>
        <div class="card card-compact shadow-xl mt-10">
          <div class="card-body bg-primary rounded-t-md text-primary-content">
            <div class="flex justify-between">
              <div class="flex items-center gap-8">
                <div><currency-euro-icon class="h-6 w-6" /></div>
                <div class="flex flex-col">
                  <div class="tracking-wide uppercase">{{ $t('bank.myMainAccount') }}</div>
                  <div class="text-2xl tracking-widest">{{ $n(6425.78, 'currency') }}</div>
                </div>
              </div>
              <button><ellipsis-vertical-icon class="h-6 w-6" /></button>
            </div>
          </div>
          <div class="card-body bg-base-100 rounded-b-md text-base-content">
            <h2 class="card-title text-lg font-normal">{{ $t('bank.myTransactions') }}</h2>
            <div class="overflow-x-auto w-full">
              <table class="table w-full">
                <tbody>
                  <!-- row 1 -->
                  <tr>
                    <td>{{ transactionDate1 }}</td>
                    <td>{{ $t('bank.transaction1') }}</td>
                    <td class="text-right">-{{ $n(307.17, 'currency') }}</td>
                  </tr>
                  <!-- row 2 -->
                  <tr>
                    <td>{{ transactionDate2 }}</td>
                    <td>{{ $t('bank.transaction2') }}</td>
                    <td class="text-right">-{{ $n(28.99, 'currency') }}</td>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <td>{{ transactionDate3 }}</td>
                    <td>{{ $t('bank.transaction3') }}</td>
                    <td class="text-right">-{{ $n(17.49, 'currency') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-1 flex justify-center pt-4 px-4">
        <div class="flex flex-col">
          <div class="grid grid-cols-4 divide-x divide-solid my-8">
            <router-link :to="{ name: 'BankTransferSelect' }"
              ><bank-action-button icon="Transfer" text="Transfer money"
            /></router-link>
            <bank-action-button icon="Iban" text="IBAN" />
            <bank-action-button icon="Card" text="Manage cards" />
            <bank-action-button icon="Document" text="Access documents" />
          </div>
          <div
            class="grid grid-cols-4 divide-x divide-solid my-8 bg-secondary-focus py-4 px-8 text-primary-content rounded-box"
          >
            <a class="text-center link">{{ $t('bank.contact') }}</a>
            <a class="text-center link">{{ $t('bank.insurances') }}</a>
            <a class="text-center link">{{ $t('bank.simulator') }}</a>
            <a class="text-center link">{{ $t('bank.support') }}</a>
          </div>
          <!-- Accounts -->
          <div class="my-10">
            <h2 class="text-2xl font-extrabold">{{ $t('bank.myAccounts') }}</h2>
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-base-content/70 text-lg">
                  {{ sessionStore.fullName }}, Camille Dupont
                </h2>
                <bank-account-summary
                  :account-balance="381.59"
                  :account-name="$t('bank.depositAccount')"
                  account-number="40021194490"
                />
              </div>
            </div>
          </div>
          <!-- Savings -->
          <div class="my-10">
            <h2 class="text-2xl font-extrabold">{{ $t('bank.mySavings') }}</h2>
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-base-content/70 text-lg">
                  {{ $t('bank.mainSavingsAccount') }}
                </h2>
                <bank-account-summary
                  :account-balance="4504.33"
                  :account-name="$t('bank.easyAccessSavingsAccount')"
                  account-number="40021194225"
                />
                <hr class="mt-4" />
                <h2 class="card-title text-base-content/70 text-lg mt-4">
                  {{ $t('bank.secondarySavingsAccount') }}
                </h2>
                <bank-account-summary
                  :account-balance="7285.14"
                  :account-name="$t('bank.greenSavingsAccount')"
                  account-number="40021194800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
