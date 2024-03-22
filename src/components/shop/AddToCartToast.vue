<script setup lang="ts">
import i18n from '@/helpers/i18n'
import { computed } from 'vue'
const { t, n } = i18n.global
const props = defineProps<{
  image: string
  brand: string
  name: string
  price: string
}>()

const price = computed(() => {
  return n(parseFloat(props.price), 'currency')
})
</script>
<template>
  <div class="grid grid-cols-3 text-base-content bg-base-100 toast-product-added gap-x-10">
    <div class="flex items-center">
      <img class="h-32 w-32 object-cover rounded-md" :src="props.image" />
    </div>
    <div class="grid col-span-2 content-between">
      <div class="flex flex-col mb-1">
        <span class="text-base-content/80">{{ props.brand }}</span>
        <span class="text-xl font-bold">{{ props.name }}</span>
        <span class="text-xl mb-1">{{ price }}</span>
        <span>{{ t('shop.addedToCart') }}</span>
      </div>
    </div>

    <div class="col-span-3 grid sm:grid-cols-2 gap-x-4 mt-2">
      <button @click="$emit('showCart')" class="btn btn-primary">
        {{ t('shop.viewCart') }}
      </button>
      <button @click="$emit('checkout')" class="btn btn-primary">
        {{ t('shop.checkoutNow') }}
      </button>
    </div>
  </div>
</template>
