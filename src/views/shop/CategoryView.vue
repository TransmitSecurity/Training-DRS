<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'

import ProductCard from '@/components/shop/product/ProductCard.vue'
import { ProductApi, type ProductDto } from '@transmitsecurity-dev/ts-demo-client-lib'
import { useRoute } from 'vue-router'
import FooterSection from '@/components/FooterSection.vue'
const route = useRoute()
const { category } = route.params as unknown as { category: string }

const productApi = new ProductApi(undefined, import.meta.env.VITE_BACKEND_URL)

const products: Ref<Array<ProductDto>> = ref([])

onBeforeMount(async () => {
  const queryResult = await productApi.getProductsByCategory(category.toUpperCase())
  products.value = queryResult.data
  console.log('Retrieved products')
  console.log(queryResult.data)
})
</script>

<template>
  <div class="pt-16 bg-base-100 category-view min-h-screen flex flex-col">
    <div class="p-2 flex-grow mb-8">
      <div class="flex justify-center mb-4">
        <h1 class="font-bold text-2xl capitalize">
          {{
            category === 'male'
              ? $t('views.productView.category1.title').toLowerCase()
              : $t('views.productView.category2.title').toLowerCase()
          }}
        </h1>
      </div>
      <div class="flex justify-center">
        <div
          class="grid justify-center grid-cols-2 gap-8 sm:gap-10 sm:grid-flow-row sm:grid-cols-3"
          v-if="products"
        >
          <div v-for="product in products" :key="product.id">
            <ProductCard
              :id="product.id"
              :name="product.name"
              :image="product.image"
              :price="product.price"
            />
          </div>
        </div>
      </div>
    </div>
    <footer-section />
  </div>
</template>
