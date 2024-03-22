<script setup lang="ts">
import { MinusIcon, PlusIcon, XMarkIcon as XIcon } from '@heroicons/vue/24/outline'
import { cartStore } from '@/store/cart'

const props = defineProps<{
  id: string
  name: string
  description: string
  image: string
  quantity: number
  price: number
}>()

const cartSession = cartStore()
async function addToCart() {
  cartSession.addToCart(props.id)
}

async function removeFromCart() {
  cartSession.removeFromCart(props.id)
}

async function deleteFromCart() {
  cartSession.deleteFromCart(props.id)
}
</script>

<template>
  <div class="flex p-2 border-b pb-4">
    <img :src="props.image" alt="product" class="w-24 h-24" />
    <div class="ml-5 flex flex-col justify-between">
      <div>
        <p class="font-semibold">{{ props.name }}</p>
        <p class="text-base-content/70">{{ props.description }}</p>
      </div>
      <div class="border-2 p-1 items-center flex w-20 justify-between space-x-1">
        <button @click="removeFromCart">
          <MinusIcon class="w-4 h-4 text-base-content/60 hover:text-base-content" />
        </button>
        <p class="text-sm">{{ props.quantity }}</p>
        <button @click="addToCart">
          <PlusIcon class="w-4 h-4 text-base-content/60 hover:text-base-content" />
        </button>
      </div>
    </div>
    <div class="flex flex-1 justify-between flex-col items-end">
      <button @click="deleteFromCart">
        <XIcon
          class="w-5 h-5 hover:rotate-90 transition-all duration-500 text-base-content/60 hover:text-base-content"
        />
      </button>
      <p>{{ $n(props.price, 'currency') }}</p>
    </div>
  </div>
</template>
