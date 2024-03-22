<script lang="ts" setup>
const categories = ['male', 'female']
</script>

<template>
  <div class="relative">
    <img src="@/assets/banner.jpg" alt="hero" class="h-[30rem] sm:h-[35rem] w-full object-cover" />
    <div class="absolute flex w-full items-center flex-col top-1/2">
      <div class="">
        <p class="text-center text-4xl sm:text-5xl font-bold text-white">
          {{ $t('shop.brandMessage') }}
        </p>
      </div>
      <div class="space-x-3 sm:mt-32 md:mt-44 mt-24">
        <router-link :to="`/category/${categories[0]}`" class="btn btn-primary">
          {{ $t('shop.shopMen') }}
        </router-link>
        <router-link :to="`/category/${categories[1]}`" class="btn btn-primary">
          {{ $t('shop.shopWomen') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
