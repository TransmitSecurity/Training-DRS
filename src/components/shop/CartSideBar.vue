<script setup lang="ts">
import { XMarkIcon as XIcon } from '@heroicons/vue/24/outline'

import { useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, type Ref } from 'vue'
import CartItem from '@/components/shop/CartItem.vue'
import { cartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'

const cartSession = cartStore()
const router = useRouter()
const props = defineProps<{
  show: boolean
}>()

const proceedToCheckout = () => {
  emit('toggleShow')
  router.push({ name: 'checkout' })
}

const cartStoreRef = storeToRefs(cartSession)
const { cart } = cartStoreRef

onBeforeMount(async () => {
  try {
    await cartSession.refreshCart()
    // The ts platform SDK is not loaded yet, we need to wait
    // for it to be loaded and then initialize webauthn
    document.addEventListener('userLoggedIn', async function (e) {
      // When the user logs in, try to save his cart first
      // the new cart overrides the old one
      if (cartSession.cart.quantity > 0) {
        await cartSession.overrideCart()
      } else {
        await cartSession.refreshCart()
      }
    })
    document.addEventListener('userLoggedOut', async function (e) {
      await cartSession.clearCart()
    })
  } catch (error) {
    console.log('Error when retrieving cart')
    console.error(error)
  }
})

const cartQuantity = computed(() => {
  if (cart && cart.value) return cart.value.quantity
  else return 0
})

const cartPrice = computed(() => {
  if (cart && cart.value) return cart.value.price
  else return 0
})

const emit = defineEmits(['toggleShow'])
</script>

<template>
  <div
    class="bg-base-content right-0 top-0 w-full z-40 bg-opacity-60 flex fixed justify-end h-screen"
    :class="{ hidden: !props.show }"
    @click="emit('toggleShow')"
  />
  <div
    class="fixed z-50 right-0 w-full sm:w-[30rem] h-screen bg-base-100 transition-all duration-500 shadow"
    :class="{ 'translate-x-0': props.show, 'translate-x-full': !props.show }"
  >
    <div class="h-screen flex flex-col justify-between">
      <div class="flex items-center border-b p-4">
        <button @click="emit('toggleShow')" class="hover:rotate-90 transition-all duration-500">
          <XIcon class="w-9 h-9" />
        </button>
        <div class="justify-center flex flex-1">
          <p class="font-semibold">{{ $t('shop.cartSideBar.title') }}</p>
        </div>
      </div>
      <div class="flex-1 overflow-scroll mt-2 px-4">
        <div class="space-y-5 overflow-y-scroll">
          <div v-if="!cart || cart.quantity === 0">
            <p>
              {{ $t('shop.cartSideBar.empty') }}
              <br />
              <br />
              <span class="text-base-content/80">
                {{ $t('shop.cartSideBar.emptyMessage') }}
              </span>
            </p>
          </div>
          <div v-else v-for="cartItem in cart.items" :key="cartItem.product.id">
            <CartItem
              :id="cartItem.product.id"
              :name="cartItem.product.name"
              :description="cartItem.product.description"
              :image="cartItem.product.image"
              :quantity="cartItem.quantity"
              :price="cartItem.product.price"
            />
          </div>
        </div>
      </div>
      <div class="space-y-2 p-5">
        <div class="flex justify-between">
          <p class="font-semibold">{{ $t('shop.subTotal') }}</p>
          <p>{{ $n(cart ? cart.price : 0, 'currency') }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-semibold">{{ $t('shop.cartSideBar.shipping') }}</p>
          <p>{{ $t('shop.cartSideBar.free') }}</p>
        </div>

        <button
          :disabled="!cart || cart.quantity == 0"
          :class="!cart || cart.quantity == 0 ? 'btn-disabled' : ''"
          class="btn btn-primary"
          @click="proceedToCheckout"
        >
          <p class="font-semibold">{{ $t('shop.cartSideBar.checkout') }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
