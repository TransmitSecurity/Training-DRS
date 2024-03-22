<script setup lang="ts">
import { CheckIcon, HomeIcon } from '@heroicons/vue/24/outline'
import ButtonCard from '@/components/bank/ButtonCard.vue'
</script>

<template>
  <div class="h-full">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div class="col-span-1 flex flex-col">
        <div class="relative">
          <img
            src="@/assets/community.jpg"
            alt="hero"
            class="h-[36rem] sm:h-[50rem] w-full object-cover"
          />
          <div class="absolute flex w-full flex-col top-0">
            <div class="flex flex-col items-center mt-10">
              <p class="text-center text-xl sm:text-4xl font-bold text-white">
                Working together to enhance our lives.
              </p>
            </div>
          </div>
          <div class="absolute flex w-full flex-col bottom-1/4 text-xs md:text-base">
            <div class="flex flex-col items-center mt-10">
              <div class="card bg-primary shadow-xl w-10/12">
                <div class="card-body text-primary-content">
                  <h2 class="card-title">New year, new house?</h2>
                  <p>Learn how you can finance your project</p>
                  <div class="card-actions">
                    <button
                      class="btn btn-outline bg-primary-content text-primary border-none text-xs md:text-base"
                    >
                      Discover financing options
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="relative">
          <img
            src="@/assets/family.jpg"
            alt="hero"
            class="h-[20rem] sm:h-[25rem] w-full object-cover"
          />
          <div class="absolute flex w-full flex-col bottom-0">
            <div class="flex flex-col items-center mb-10">
              <p class="text-center text-xl sm:text-4xl font-bold text-white">
                Your life, our mission
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-1 flex justify-center pt-4">
        <div class="flex flex-col">
          <div class="pb-4 text-center">
            <h2 class="font-bold text-xl">Insurance, mortgage, loan, moving out...</h2>
            <p>What do you need?</p>
          </div>
          <div class="grid grid-cols-1 gap-12 p-4 md:w-96">
            <button-card title="Simulator" description="Mortgage Loan Simulator" icon="Home" />

            <button-card title="Cards" description="Select your credit card" icon="CreditCard" />

            <button-card
              title="Simulator"
              description="Consumer Credit Simulator"
              icon="ShoppingCart"
            />

            <button-card
              title="Insurance"
              description="Insure your house or your car"
              icon="Shield"
            />
          </div>
          <p class="mt-10">Contact an advisor now: +300 029 3922 0990</p>
        </div>
      </div>
    </div>
  </div>
</template>
