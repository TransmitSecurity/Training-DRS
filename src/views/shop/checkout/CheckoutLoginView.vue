<script setup lang="ts">
import LoginLuxuryShop from '@/components/shop/luxe/LoginLuxuryShop.vue'
import CheckoutSteps from '@/components/shop/checkout/CheckoutSteps.vue'
</script>
<template>
  <div class="flex flex-col bg-base-200 login min-h-screen">
    <div class="lg:max-w-6xl self-center w-full">
      <!-- Steps -->
      <checkout-steps
        class="mt-8"
        :current-step="2"
        :steps="[$t('shop.cart'), $t('shop.deliveryAndPayment'), $t('global.confirmation')]"
      />
      <login-luxury-shop
        redirect-after-login="checkoutDelivery"
        redirect-for-signup="checkoutSignup"
      />
    </div>
  </div>
</template>
