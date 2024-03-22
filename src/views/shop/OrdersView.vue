<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'
import { detectMobile } from '@/helpers/mobile'
import { OrdersApi, type OrderDto } from '@transmitsecurity-dev/ts-demo-client-lib'
import { handleError } from '@/helpers/errors'
import FooterSection from '@/components/FooterSection.vue'
import CustomerServiceInfo from '@/components/shop/checkout/CustomerServiceInfo.vue'
const orderApi = new OrdersApi(undefined, import.meta.env.VITE_BACKEND_URL)

onBeforeMount(async () => {
  try {
    const result = await orderApi.getOrders()
    orders.value = result.data
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
})
const loading = ref(true)
const orders: Ref<Array<OrderDto>> = ref([])
</script>

<template>
  <div class="flex flex-col bg-base-200 orders-view min-h-screen">
    <div class="md:max-w-xl self-center w-full flex-grow mt-8 mb-8 px-2 sm:px-0">
      <div v-if="orders.length > 0" class="w-full overflow-hidden mb-10">
        <div class="flex justify-start mb-10">
          <h1 class="text-2xl">{{ $t('shop.order.yourOrders') }}</h1>
        </div>
        <div v-if="loading">{{ $t('global.loading') }}</div>
        <div
          v-else
          class="w-full overflow-x-auto bg-base-100 shop-card shadow-2xl rounded-box grid gap-y-1 py-2 divide-y divide-base-100"
        >
          <div v-for="order in orders" v-bind:key="order.id" class="grid grid-cols-6 py-2">
            <div
              class="col-span-2 flex items-center ml-4 -space-x-14 md:-space-x-10"
              :class="order.items.length > 1 ? 'hover:-space-x-4' : 'hover:-space-x-8'"
            >
              <template v-for="(item, index) in order.items" v-bind:key="index">
                <img
                  v-if="index < 3"
                  :src="item.product.image"
                  :class="order.items.length == 1 ? 'hover:w-28' : ''"
                  class="h-20 w-20 object-cover rounded-md border-base-content border-2 transition-all ease-linear"
                />
              </template>
            </div>
            <div class="col-span-4 flex flex-col px-10">
              <div class="grid grid-cols-2">
                <div class="flex flex-col">
                  <h4 class="text-sm font-bold">
                    {{ $t('shop.order.orderNumber') }}{{ order.id }}
                  </h4>
                  <div class="text-xs text-base-content/60">
                    {{
                      detectMobile()
                        ? new Date(order.createdAt).toLocaleDateString()
                        : new Date(order.createdAt).toDateString()
                    }}
                  </div>
                  <div class="mt-2 text-sm">{{ order.quantity }} {{ $t('shop.order.items') }}</div>
                </div>
                <div class="flex flex-col space-y-2">
                  <div class="text-sm sm:text-xl font-bold">{{ $n(order.total, 'currency') }}</div>

                  <div class="flex">
                    <button
                      class="btn btn-primary text-xs sm:text-base"
                      @click="$router.push({ name: 'order', params: { id: order.id } })"
                    >
                      {{ $t('shop.order.viewDetails') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full text-center">
        <p>{{ $t('shop.order.noOders') }}</p>
      </div>
      <customer-service-info />
    </div>
    <footer-section />
  </div>
</template>
