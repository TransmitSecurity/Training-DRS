<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import CartSummary from '@/components/shop/checkout/CartSummary.vue'
import { cartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'
import CheckoutSteps from '@/components/shop/checkout/CheckoutSteps.vue'
import CustomerServiceInfo from '@/components/shop/checkout/CustomerServiceInfo.vue'
import { userSessionStore } from '@/store/userSession'

const router = useRouter()
const userSession = userSessionStore()
const cartSession = cartStore()
const cartRefs = storeToRefs(cartSession)
const { cart } = cartRefs

async function checkoutDelivery() {
  if (userSession.isAuthenticated) {
    // User is already logged in, continue to delivery information
    router.push({ name: 'checkoutDelivery' })
  } else {
    // Log user in
    router.push({ name: 'checkoutLogin' })
  }
}
</script>

<template>
  <div class="flex flex-col bg-base-200 checkout-view min-h-screen">
    <div class="lg:max-w-6xl self-center w-full">
      <!-- Steps -->
      <checkout-steps
        class="mt-8 mb-12"
        :current-step="1"
        :steps="[$t('shop.cart'), $t('shop.deliveryAndPayment'), $t('global.confirmation')]"
      />
      <div v-if="cart.quantity === 0">
        <p class="text-center">
          {{ $t('shop.cartSideBar.empty') }}
          <br />
          <br />
          <span class="text-base-content/70">
            {{ $t('shop.cartSideBar.emptyMessage') }}
          </span>
        </p>
      </div>

      <div class="flex justify-center" v-if="cart.quantity !== 0">
        <div class="flex flex-col items-center flex-grow">
          <section class="flex flex-grow w-full">
            <h1 class="sr-only">{{ $t('shop.checkout') }}</h1>
            <div class="mx-auto flex-grow md:px-2">
              <div class="grid grid-cols-1 gap-y-4 md:grid-cols-5 md:gap-x-4 md:gap-y-0">
                <!-- Order summary -->
                <div class="md:col-span-3 flex flex-col gap-2">
                  <CartSummary :cart="cart" class="py-6 bg-base-100 shop-card rounded-box" />
                  <div class="bg-base-100 flex justify-between px-8 py-4 shop-card rounded-box">
                    <p class="tracking-widest text-lg font-light">{{ $t('shop.thisIsAGift') }}</p>
                    <input type="checkbox" class="checkbox rounded-none" />
                  </div>
                  <div class="bg-base-100 flex justify-center px-4 py-4 shop-card rounded-box">
                    <button class="btn btn-primary px-20" @click="checkoutDelivery">
                      {{ $t('global.continue') }}
                    </button>
                  </div>
                </div>

                <!-- Customer service information  -->
                <CustomerServiceInfo class="md:col-span-2" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
