<script setup lang="ts">
import SignupLuxuryShop from '@/components/shop/luxe/SignupLuxuryShop.vue'
import CheckoutSteps from '@/components/shop/checkout/CheckoutSteps.vue'
import CartSummary from '@/components/shop/checkout/CartSummary.vue'
import { cartStore } from '@/store/cart'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'

const toast = useToast()
const router = useRouter()
const cartSession = cartStore()
const cartRefs = storeToRefs(cartSession)
const { cart } = cartRefs
</script>
<template>
  <div class="flex flex-col bg-base-200 signup-view min-h-screen">
    <!-- <generic-login-view /> -->

    <div class="lg:max-w-6xl self-center w-full mb-12">
      <!-- Steps -->
      <checkout-steps
        class="mt-8 mb-8"
        :current-step="2"
        :steps="[$t('shop.cart'), $t('shop.deliveryAndPayment'), $t('global.confirmation')]"
      />
      <signup-luxury-shop
        redirect-route-name="checkoutConfirmation"
        :create-button-text="$t('shop.createAccountAndPay')"
      >
        <template v-slot:aboveForm>
          <div class="collapse collapse-arrow mt-4 bg-base-100 shop-card rounded-box">
            <input type="checkbox" />
            <div class="collapse-title text-xl font-medium">
              {{ $t('shop.orderSummary') }}
              <span class="ml-8">{{ $n(cart.price, 'currency') }}</span>
            </div>
            <CartSummary :cart="cart" class="collapse-content" />
          </div>
        </template>
      </signup-luxury-shop>
    </div>
  </div>
</template>
