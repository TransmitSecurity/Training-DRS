<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import OrderSummary from '@/components/shop/checkout/OrderSummary.vue'
import CustomerServiceInfo from '@/components/shop/checkout/CustomerServiceInfo.vue'
import DeliveryStatus from '@/components/shop/checkout/DeliveryStatus.vue'
import { OrdersApi, type OrderDto } from '@transmitsecurity-dev/ts-demo-client-lib'
import { handleError } from '@/helpers/errors'
import NotFoundPage from '@/components/NotFoundPage.vue'
import FooterSection from '@/components/FooterSection.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const ordersApi = new OrdersApi(undefined, import.meta.env.VITE_BACKEND_URL)

const order: Ref<OrderDto | null> = ref(null)

const loading = ref(true)
const notFound = ref(false)

onBeforeMount(async () => {
  try {
    console.log('Retrieving order information')
    const queryResult = await ordersApi.getOrder(parseInt(route.params.id.toString()))
    console.log(queryResult)
    order.value = queryResult.data
  } catch (error) {
    notFound.value = true
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
    <div class="lg:max-w-6xl self-center w-full flex-grow">
      <!-- Order not found -->
      <not-found-page v-if="order === null && !loading">
        {{ $t('shop.orderNotFound') }}
      </not-found-page>

      <div v-if="loading">Loading</div>

      <!-- Order information -->
      <div class="flex justify-center" v-if="order !== null">
        <div class="flex flex-col items-center flex-grow">
          <section class="flex flex-grow w-full">
            <div class="mx-auto flex-grow md:px-2">
              <div class="grid grid-cols-1 gap-y-4 md:grid-cols-5 md:gap-x-4 md:gap-y-0 mt-8">
                <!-- Order summary -->
                <div class="md:col-span-3 flex flex-col gap-2">
                  <OrderSummary :order="order" class="py-6 bg-base-100 shop-card rounded-box" />

                  <DeliveryStatus class="p-6 bg-base-100 shop-card rounded-box" />
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
    <footer-section />
  </div>
</template>
