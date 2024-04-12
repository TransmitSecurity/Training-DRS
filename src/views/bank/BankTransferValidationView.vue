<script setup lang="ts">
import SelectAccountSummary from "@/components/bank/SelectAccountSummary.vue";
import FooterSection from "@/components/FooterSection.vue";
import { computed, ref } from "vue";
import { userSessionStore } from "@/store/userSession";
import { useI18n } from "vue-i18n";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRouter } from "vue-router";
import { Action, reportAction } from "@/helpers/risk";

const router = useRouter();
const sessionStore = userSessionStore();
const transfer = sessionStore.bankData.transfer;
const i18n = useI18n();
console.log(transfer.amount);

const amount = computed(() => {
  return i18n.n(transfer.amount, "currency");
});

function validateTransfer() {
  // WEBINAR ACTION - Report the transaction action
   reportAction(Action.TRANSACTION)
  router.push({ name: "home" });
}
</script>
<template>
  <div class="min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div
        class="col-span-1 flex justify-center pt-4 md:order-last overflow-y-scroll max-h-screen"
      >
        <div class="flex flex-col flex-1 px-10">
          <h2 class="font-bold text-3xl pb-4">Summary</h2>
          <div class="mt-8">
            <h3 class="font-medium mb-2">Account to debit</h3>
            <select-account-summary
              class="px-4 py-2 rounded-box border box-border"
              :account="transfer.selectedAccount"
            />
          </div>

          <div class="mt-12">
            <div class="flex justify-between">
              <h3 class="font-medium mb-2 flex justify-between">
                Account to credit
              </h3>
            </div>
            <div class="px-4 py-2 rounded-box border box-border">
              {{ transfer.beneficiaryAccount }}
            </div>
          </div>

          <div class="mt-12">
            <div class="flex justify-between">
              <h3 class="font-medium mb-2 flex justify-between">Amount</h3>
            </div>
            <div class="px-4 py-2 rounded-box border box-border">
              {{ amount }}
            </div>
          </div>

          <div class="mt-12">
            <div class="flex justify-between">
              <h3 class="font-medium mb-2 flex justify-between">
                Transfer date
              </h3>
            </div>
            <div class="px-4 py-2 rounded-box border box-border">
              {{ transfer.date.toDateString() }}
            </div>
          </div>

          <div class="flex justify-between items-center mt-12">
            <router-link to="/" class="link link-primary">Cancel</router-link>
            <div class="flex gap-x-4">
              <router-link
                :to="{ name: 'BankTransferSelect' }"
                class="btn btn-ghost border border-primary"
              >
                Edit
              </router-link>
              <button @click="validateTransfer" class="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
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
                  <h2 class="card-title">
                    Your transfer in less than 10 seconds
                  </h2>
                  <p class="text-justify">
                    Need to send money to friends or family quickly? Find in
                    your beneficiaries who is eligible to instant payment and
                    send them money in less than 10 seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute flex w-full flex-col bottom-1/4 text-xs md:text-base"
          >
            <div class="flex flex-col items-center mt-10">
              <div class="card bg-primary shadow-xl w-10/12">
                <div class="card-body text-primary-content">
                  <h2 class="card-title">More security with Passkeys</h2>
                  <p class="text-justify">
                    Passkeys offer the convenience of fast and easy
                    authentication, and provides a
                    <b>security stronger than a password</b> combined with an
                    SMS code.
                  </p>
                  <p>
                    Even better, with passkeys,
                    <b>no application is required.</b>
                  </p>
                  <div class="card-actions">
                    <button
                      class="btn btn-outline bg-primary-content text-primary border-none text-xs md:text-base"
                    >
                      Learn more about passkeys
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
