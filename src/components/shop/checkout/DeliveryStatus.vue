<script setup lang="ts">
import { userSessionStore } from '@/store/userSession'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    status?: 'delivered' | 'transit'
  }>(),
  { status: 'delivered' },
)
const sessionStore = userSessionStore()
const address = sessionStore.address
const street = ref(address.street_address || '')
const city = ref(address.city || '')
const country = ref(address.country || '')
const postalCode = ref(address.postal_code || '')

const fullName = ref(sessionStore.fullName)
</script>
<template>
  <div>
    <div class="grid grid-cols-2">
      <div class="col-span-1 font-light">{{ $t('shop.deliveryStatus') }}</div>
      <div class="col-span-1 font-light">
        {{ props.status === 'delivered' ? $t('shop.delivered') : $t('shop.transit') }}
      </div>
      <div
        class="col-span-1 col-start-2 font-light text-xs flex link"
        v-if="props.status === 'delivered'"
      >
        {{ $t('shop.iDidNotReceive') }}
      </div>
      <div class="col-span-1 font-light mt-4">{{ $t('shop.deliveredTo') }}</div>
      <div class="col-span-1 font-light mt-4">{{ fullName }}</div>
      <h2 class="col-span-2 mt-4">{{ $t('userData.deliveryAddress') }}</h2>
      <div class="col-span-1 font-light text-sm">{{ $t('userData.street') }}</div>
      <div class="col-span-1 font-light text-sm">{{ street }}</div>
      <div class="col-span-1 font-light text-sm">{{ $t('userData.zipCode') }}</div>
      <div class="col-span-1 font-light text-sm">{{ postalCode }}</div>
      <div class="col-span-1 font-light text-sm">{{ $t('userData.city') }}</div>
      <div class="col-span-1 font-light text-sm">{{ city }}</div>
      <div class="col-span-1 font-light text-sm">{{ $t('userData.country') }}</div>
      <div class="col-span-1 font-light text-sm">{{ country }}</div>
    </div>
  </div>
</template>
