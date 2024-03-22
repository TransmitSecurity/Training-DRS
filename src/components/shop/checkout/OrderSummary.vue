<script setup lang="ts">
import { toRefs } from 'vue'
import CheckoutItem from '@/components/shop/checkout/CheckoutItem.vue'
import type { OrderDto } from '@transmitsecurity-dev/ts-demo-client-lib'
const props = defineProps<{
  order: OrderDto
}>()

const { order } = toRefs(props)
</script>
<template>
  <div>
    <div class="px-4 mx-auto lg:px-8">
      <div class="flex items-baseline gap-4">
        <p class="font-normal">{{ $t('shop.orderDate') }}</p>
        <p class="font-light">
          {{ $d(new Date(order.createdAt)) }}
        </p>
      </div>

      <div class="mt-6">
        <h2>{{ $t('shop.productsOrdered') }}</h2>
        <div class="flow-root mt-4">
          <ul class="-my-4 divide-y divide-base-content/10">
            <li
              v-for="item in order.items"
              :key="item.product.id"
              class="flex items-center justify-between py-4"
            >
              <CheckoutItem
                :id="item.product.id"
                :name="item.product.name"
                :description="item.product.description"
                :image="item.product.image"
                :quantity="item.quantity"
                :price="item.product.price"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-6">
        <div class="flex justify-between">
          <h3 class="text-2xl font-light tracking-widest">{{ $t('shop.total') }}</h3>
          <p class="text-sm">{{ $n(order.total, 'currency') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
