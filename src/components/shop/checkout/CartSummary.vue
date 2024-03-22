<script setup lang="ts">
import { toRefs } from 'vue'
import CheckoutItem from '@/components/shop/checkout/CheckoutItem.vue'
import type { CartDto } from '@transmitsecurity-dev/ts-demo-client-lib'
const props = defineProps<{
  cart: CartDto
}>()

const { cart } = toRefs(props)
</script>
<template>
  <div>
    <div class="px-4 mx-auto lg:px-8">
      <div>
        <p class="font-bold text-sm">
          {{ $t('shop.youHaveXItemsInYourCart', cart.quantity) }}
        </p>
      </div>

      <div class="mt-6">
        <div class="flow-root">
          <ul class="-my-4 divide-y divide-base-content/10">
            <li
              v-for="cartItem in cart.items"
              :key="cartItem.product.id"
              class="flex items-center justify-between py-4"
            >
              <CheckoutItem
                :id="cartItem.product.id"
                :name="cartItem.product.name"
                :description="cartItem.product.description"
                :image="cartItem.product.image"
                :quantity="cartItem.quantity"
                :price="cartItem.product.price"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-6">
        <div class="flex justify-between">
          <h3 class="text-lg tracking-widest font-light">{{ $t('shop.subTotal') }}</h3>
          <p class="text-sm">{{ $n(cart.price, 'currency') }}</p>
        </div>
        <div class="flex flex-col">
          <h3 class="text-lg tracking-widest font-light">{{ $t('shop.delivery') }}</h3>
          <p class="text-xs">{{ $t('shop.shippingCostsAreFree') }}</p>
        </div>
        <div class="flex justify-between">
          <h3 class="text-2xl font-light tracking-widest">{{ $t('shop.total') }}</h3>
          <p class="text-sm">{{ $n(cart.price, 'currency') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
