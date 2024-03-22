<script setup lang="ts">
import PasswordUpdate from './PasswordUpdate.vue'
import EmailUpdate from './EmailUpdate.vue'
import PhoneUpdate from './PhoneUpdate.vue'
</script>
<template>
  <div class="divide-y divide-base-200/50">
    <div class="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 class="text-lg leading-6 font-medium text-base-content">
          {{ $t('account.profile.contact') }}
        </h2>
        <p class="mt-1 text-sm text-base-content/60">
          {{ $t('account.security.updateVerifyContactInfo') }}
        </p>
      </div>

      <!-- Email update / verification -->
      <div class="mt-6 grid grid-cols-12 gap-6">
        <div class="col-span-12 sm:col-span-7">
          <email-update />
        </div>
      </div>

      <!-- Phone update / verification -->
      <div class="mt-6 grid grid-cols-12 gap-6">
        <div class="col-span-12 sm:col-span-7">
          <phone-update />
        </div>
      </div>
    </div>

    <div class="pt-6 divide-y divide-gray-200">
      <div class="px-4 sm:px-6">
        <div>
          <h2 class="text-lg leading-6 font-medium text-base-content">
            {{ $t('authentication.password') }}
          </h2>
          <p class="mt-1 text-sm text-base-content/60">
            {{ $t('account.security.updateYourPassword') }}
          </p>
        </div>

        <password-update />
      </div>
    </div>
  </div>
</template>
