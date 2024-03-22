<script setup lang="ts">
import { PhoneIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { CIcon } from '@coreui/icons-vue'
import { cibCcVisa, cibCcMastercard, cibCcAmex, cibCcPaypal, cibCcJcb } from '@coreui/icons'
</script>

<template>
  <div>
    <div
      class="flex flex-col divide-y divide-base-200 gap-y-2 bg-base-100 py-4 px-4 shop-card rounded-box"
    >
      <h2 class="tracking-widest font-light">{{ $t('shop.customerService') }}</h2>
      <div class="grid grid-cols-8 gap-8 pt-4">
        <!-- Row 1 -->
        <div class="flex flex-col items-start self-center col-span-1">
          <phone-icon class="w-4 h-4" />
        </div>
        <div class="flex flex-col items-start col-span-7">
          <span class="tracking-wide font-light">{{ $t('shop.storesAndOnlineOrders') }}</span>
          <span class="tracking-wider font-extralight">{{ $t('shop.servicePhoneNumber') }}</span>
          <span class="text-xs">{{ $t('shop.serviceHours') }}</span>
        </div>
        <!-- Row 2 -->
        <div class="flex flex-col items-start self-center col-span-1">
          <phone-icon class="w-4 h-4" />
        </div>
        <div class="flex flex-col items-start col-span-7">
          <span class="tracking-wide font-light">{{ $t('shop.contactGlobalHotline') }}</span>
          <span class="tracking-wider font-extralight">{{ $t('shop.servicePhoneNumber') }}</span>
          <span class="text-xs">{{ $t('shop.serviceHours') }}</span>
        </div>
        <div class="col-span-4 flex flex-col items-center self-center">
          <truck-icon class="w-6 h-6" />
          <span class="text-xs">{{ $t('shop.freeDelivery') }}</span>
        </div>
        <div class="col-span-4 flex flex-col items-center self-center">
          <shield-check-icon class="w-6 h-6" />
          <span class="text-xs">{{ $t('shop.securePayments') }}</span>
        </div>
        <div class="col-span-8 flex justify-around gap-8">
          <CIcon :icon="cibCcAmex" height="30" weight="30" />
          <CIcon :icon="cibCcVisa" height="30" weight="30" />
          <CIcon :icon="cibCcMastercard" height="30" weight="30" />
          <CIcon :icon="cibCcJcb" height="30" weight="30" />
          <CIcon :icon="cibCcPaypal" height="30" weight="30" />
        </div>
      </div>
    </div>
  </div>
</template>
