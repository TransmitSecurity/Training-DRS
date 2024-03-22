<script setup lang="ts">
import {
  CreditCardIcon,
  HomeIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  icon: 'Home' | 'ShoppingCart' | 'CreditCard' | 'Shield'
}>()

const componentToLoad = computed(() => {
  switch (props.icon) {
    case 'Home':
      return HomeIcon

    case 'ShoppingCart':
      return ShoppingCartIcon

    case 'CreditCard':
      return CreditCardIcon

    case 'Shield':
      return ShieldCheckIcon

    default:
      return HomeIcon
  }
})
</script>
<template>
  <div
    class="bg-base-300 text-base-content hover:bg-primary hover:text-primary-content hover:cursor-pointer border-none grid grid-cols-2 max-h-44"
  >
    <div class="col-span-1">
      <div class="p-8 max-h-36 bg-primary aspect-square flex items-center justify-center">
        <component :is="componentToLoad" class="h-10 w-10 text-primary-content" />
      </div>
    </div>
    <div class="col-span-1 px-4 py-2">
      <h2 class="uppercase font-bold mb-4">{{ props.title }}</h2>
      <p class="uppercase">{{ props.description }}</p>
    </div>
  </div>
</template>
