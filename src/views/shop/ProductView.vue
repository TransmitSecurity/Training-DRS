<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { POSITION, useToast } from 'vue-toastification'
import AddToCartToast from '@/components/shop/AddToCartToast.vue'
import ClothingProduct from '@/components/shop/product/ClothingProduct.vue'
import { ProductApi, type ProductDto } from '@transmitsecurity-dev/ts-demo-client-lib'
import { cartStore } from '@/store/cart'
import NotFoundPage from '@/components/NotFoundPage.vue'
import FooterSection from '@/components/FooterSection.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const cartSession = cartStore()
const productApi = new ProductApi(undefined, import.meta.env.VITE_BACKEND_URL)

const product: Ref<ProductDto | null> = ref(null)
const loading = ref(true)
const notFound = ref(false)

onBeforeMount(async () => {
  try {
    console.log('Retrieving product information')
    const queryResult = await productApi.getProductById(route.params.id.toString())
    console.log(queryResult)
    product.value = queryResult.data
  } catch (error) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

async function addToCart(productId: string) {
  await cartSession.addToCart(productId)
  showAddToCartToast()
}

function showCart() {
  toast.clear()
  cartSession.toggleShowCart()
}

function checkout() {
  toast.clear()
  router.push({ name: 'checkout' })
}

function showAddToCartToast() {
  if (!product.value) return
  toast(
    {
      component: AddToCartToast,
      props: {
        brand: product.value.brand,
        name: product.value.name,
        price: product.value.price.toFixed(2),
        image: product.value.image,
      },
      listeners: {
        checkout: checkout,
        showCart: showCart,
      },
    },
    {
      position: POSITION.BOTTOM_CENTER,
      icon: false,
      toastClassName: 'bg-base-100 toast-product-added',
      closeButtonClassName: 'text-base-content',
      closeOnClick: false,
      timeout: 3500,
    },
  )
}
</script>

<template>
  <div class="pt-8 bg-base-100 product-view min-h-screen flex flex-col">
    <div class="flex-grow mb-8">
      <not-found-page v-if="notFound">
        {{ $t('shop.productNotFound') }}
      </not-found-page>

      <div class="flex flex-col" v-if="loading">Loading</div>

      <div
        class="px-2 flex flex-col bg-base-100 product-view"
        v-if="!notFound && !loading && product"
      >
        <clothing-product @add-to-cart="addToCart(product.id)" :product="product" />
      </div>
    </div>

    <footer-section />
  </div>
</template>
