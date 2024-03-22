<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import OrderSummary from '@/components/shop/checkout/OrderSummary.vue'
import { Action, reportAction } from '@/helpers/risk'
import { cartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'
import CheckoutSteps from '@/components/shop/checkout/CheckoutSteps.vue'
import CustomerServiceInfo from '@/components/shop/checkout/CustomerServiceInfo.vue'
import { OrdersApi, type OrderDto } from '@transmitsecurity-dev/ts-demo-client-lib'
import { handleError } from '@/helpers/errors'
import NotFoundPage from '@/components/NotFoundPage.vue'
import DeliveryStatus from '@/components/shop/checkout/DeliveryStatus.vue'

const router = useRouter()
const cartSession = cartStore()
const cartRefs = storeToRefs(cartSession)
const ordersApi = new OrdersApi(undefined, import.meta.env.VITE_BACKEND_URL)
const { cart } = cartRefs
const order: Ref<OrderDto | null> = ref(null)
const loading = ref(true)

// When this page is visited, immediately create an order
// from the current cart
onBeforeMount(async () => {
  try {
    if (cart.value.quantity > 0) {
      const actionToken = await reportAction(Action.CHECKOUT)
      const orderId = await cartSession.createOrder(actionToken)
      console.log(orderId)
      if (orderId) {
        order.value = (await ordersApi.getOrder(orderId)).data
      }
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
})

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="flex flex-col bg-base-200 checkout-view min-h-screen">
    <div class="lg:max-w-6xl self-center w-full">
      <!-- Steps -->
      <checkout-steps
        class="mt-8 mb-12"
        :current-step="3"
        :steps="[$t('shop.cart'), $t('shop.deliveryAndPayment'), $t('global.confirmation')]"
      />

      <not-found-page v-if="order === null && !loading">{{
        $t('shop.orderNotFound')
      }}</not-found-page>

      <div class="flex justify-center" v-if="order !== null && !loading">
        <div class="flex flex-col items-center flex-grow">
          <section class="flex flex-grow w-full">
            <div class="mx-auto flex-grow md:px-2">
              <div class="grid grid-cols-1 gap-y-4 md:grid-cols-5 md:gap-x-4 md:gap-y-0">
                <!-- Order summary -->
                <div class="md:col-span-3 flex flex-col gap-2">
                  <OrderSummary :order="order" class="py-6 bg-base-100 shop-card rounded-box" />

                  <DeliveryStatus class="p-6 bg-base-100 shop-card rounded-box" status="transit" />
                  <div class="bg-base-100 flex justify-center px-4 py-4 shop-card rounded-box">
                    <button class="btn btn-primary px-20" @click="goHome">
                      {{ $t('global.goHome') }}
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
