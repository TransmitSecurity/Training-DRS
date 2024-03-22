<script setup lang="ts">
import { computed, onBeforeMount, ref, type Ref } from 'vue'
import ProductCard from '@/components/shop/product/ProductCard.vue'
import { ProductApi, type ProductDto } from '@transmitsecurity-dev/ts-demo-client-lib'
import HeroSection from './HeroSection.vue'
import CategoryCard from '@/components/shop/product/CategoryCard.vue'

const productApi = new ProductApi(undefined, import.meta.env.VITE_BACKEND_URL)

const products: Ref<Array<ProductDto>> = ref([])
const menProducts = computed(() => {
  const men = products.value.filter(p => p.category === 'MALE')
  return men
})
const womenProducts = computed(() => {
  const women = products.value.filter(p => p.category === 'FEMALE')
  return women
})

onBeforeMount(async () => {
  const queryResult = await productApi.getProductsByCategories('FEMALE,MALE')
  products.value = queryResult.data
  console.log('Retrieved products')
  console.log(queryResult.data)
})
</script>

<template>
  <div class="flex flex-col bg-base-100 home min-h-screen">
    <div class="lg:max-w-6xl self-center w-full">
      <!-- <section class="container flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 mt-8 sm:mt-24"> -->
      <hero-section class="mt-8" />

      <!-- Categories -->
      <div class="mt-12 flex flex-col gap-4">
        <div class="flex justify-start">
          <h1 class="font-medium text-2xl">{{ $t('shop.categories') }}</h1>
        </div>
        <div
          class="container mt-5 pb-5 grid grid-cols-2 gap-8 justify-between"
          v-if="womenProducts.length > 0 && menProducts.length > 0"
        >
          <CategoryCard
            id="female"
            :name="$t('shop.womenFashion')"
            :image="womenProducts[0].image2"
          />
          <CategoryCard id="male" :name="$t('shop.menFashion')" :image="menProducts[0].image2" />
        </div>
        <div class="flex mt-5 pb-5"></div>
      </div>
      <!-- Women's fashion -->
      <div class="flex flex-col items-start" v-if="womenProducts.length > 0">
        <div class="flex justify-start">
          <h1 class="font-medium text-2xl">{{ $t('shop.womenFashion') }}</h1>
        </div>
        <div
          class="container mt-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-8 justify-content-between"
        >
          <ProductCard
            v-for="product in womenProducts.slice(0, 4)"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :image="product.image"
            :price="product.price"
          />
        </div>
        <div class="flex mt-5 pb-5"></div>
      </div>
      <!-- Mens' fashion -->
      <div class="flex flex-col items-start" v-if="menProducts.length > 0">
        <div class="flex justify-start">
          <h1 class="font-medium text-2xl">{{ $t('shop.menFashion') }}</h1>
        </div>
        <div
          class="container mt-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-8 justify-content-between"
        >
          <ProductCard
            v-for="product in menProducts.slice(0, 4)"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :image="product.image"
            :price="product.price"
          />
        </div>
        <div class="flex mt-5 pb-5"></div>
      </div>
      <!-- </section> -->
    </div>
  </div>
</template>
