<script setup lang="ts">
import AccountSelection from '@/components/bank/AccountSelection.vue'
import BeneficiarySelection from '@/components/bank/BeneficiarySelection.vue'
import FooterSection from '@/components/FooterSection.vue'
import type { Account } from '@/helpers/account'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import Datepicker from '@vuepic/vue-datepicker'
import { ref } from 'vue'
import { userSessionStore } from '@/store/userSession'

import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const sessionStore = userSessionStore()
const { t } = useI18n()

const sendingAccounts: Account[] = [
  {
    holder: sessionStore.fullName || '',
    balance: 6425.78,
    name: t('bank.depositAccount'),
    number: '40021194485',
  },
  {
    holder: `${sessionStore.fullName}, Camille Dupont`,
    balance: 381.59,
    name: t('bank.depositAccount'),
    number: '40021194490',
  },
]
const transferDate = ref<Date>(new Date())
const amount = ref(0)
const beneficiaryAccounts = ['Aeklys', 'Martin', 'Jeremy Duwez', 'Nina']

const selectedAccount = ref<Account | null>(null)
function selectAccount(account: Account) {
  selectedAccount.value = account
}

const selectedBeneficiary = ref('')
function selectBeneficiary(beneficiary: string) {
  selectedBeneficiary.value = beneficiary
}

function validateTransfer() {
  if (selectedAccount.value !== null) {
    sessionStore.bankData.transfer.selectedAccount = selectedAccount.value
  }
  sessionStore.bankData.transfer.amount = amount.value
  sessionStore.bankData.transfer.date = transferDate.value

  sessionStore.bankData.transfer.beneficiaryAccount = selectedBeneficiary.value
  router.push({ name: 'BankTransferValidate' })
}
</script>
<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div class="col-span-1 flex justify-center pt-4 md:order-last overflow-y-scroll max-h-screen">
        <div class="flex flex-col flex-1 px-10">
          <h2 class="font-bold text-3xl pb-4">{{ $t('bank.transfer.transferMoney') }}</h2>
          <div class="mt-8">
            <h3 class="font-medium mb-2">{{ $t('bank.transfer.accountToDebit') }}</h3>
            <account-selection
              :accounts="sendingAccounts"
              class="mt-4"
              @account-selected="selectAccount"
            />
          </div>

          <div class="mt-12">
            <div class="flex justify-between">
              <h3 class="font-medium mb-2 flex justify-between">
                {{ $t('bank.transfer.accountToCredit') }}
              </h3>
              <div class="link flex items-center text-primary gap-x-2">
                <plus-circle-icon class="w-8 h-8" /> {{ $t('bank.addABeneficiary') }}
              </div>
            </div>
            <beneficiary-selection
              :beneficiaries="beneficiaryAccounts"
              @select-beneficiary="selectBeneficiary"
              class="mt-4"
            />
          </div>

          <form
            @submit.prevent="validateTransfer"
            class="grid grid-cols-1 mb-10 md:mb-0 md:grid-cols-2 md:gap-x-4 my-12"
          >
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">{{ $t('bank.amount') }}</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                :placeholder="$t('bank.transfer.transferAmount')"
                v-model="amount"
                class="input input-bordered w-full"
              />
            </label>
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">{{ $t('bank.transfer.transferDate') }}</span>
              </div>
              <Datepicker
                :enable-time-picker="false"
                format="dd/MM/yyyy"
                v-model="transferDate"
                input-class-name="input input-bordered w-full"
              />
            </label>
            <button class="btn btn-primary md:col-span-2 mt-8" type="submit">
              {{ $t('global.next') }}
            </button>
          </form>
        </div>
      </div>
      <div class="col-span-1 flex flex-col">
        <div class="relative">
          <img
            src="@/assets/family.jpg"
            alt="hero"
            class="h-[36rem] sm:h-[50rem] w-full object-cover"
          />
          <div class="absolute flex w-full flex-col top-0">
            <div class="flex flex-col items-center mt-4">
              <div class="card bg-base-100 shadow-xl w-10/12">
                <div class="card-body">
                  <h2 class="card-title">{{ $t('bank.transfer.immediateTransferAd.title') }}</h2>
                  <p class="text-justify">
                    {{ $t('bank.transfer.immediateTransferAd.content') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute flex w-full flex-col bottom-1/4 text-xs md:text-base">
            <div class="flex flex-col items-center mt-10">
              <div class="card bg-primary shadow-xl w-10/12">
                <div class="card-body text-primary-content">
                  <h2 class="card-title">{{ $t('bank.transfer.passkeysAd.title') }}</h2>
                  <p class="text-justify">
                    {{ $t('bank.transfer.passkeysAd.content1') }}
                  </p>
                  <p>{{ $t('bank.transfer.passkeysAd.content2') }}</p>
                  <div class="card-actions">
                    <button
                      class="btn btn-outline bg-primary-content text-primary border-none text-xs md:text-base"
                    >
                      {{ $t('bank.transfer.passkeysAd.learnMore') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="relative">
          <img
            src="@/assets/community.jpg"
            alt="hero"
            class="h-[12rem] sm:h-[20rem] w-full object-cover"
          />
        </div>
      </div>
    </div>

    <footer-section />
  </div>
</template>
