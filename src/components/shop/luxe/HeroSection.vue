<script lang="ts" setup>
const categories = ['male', 'female']
</script>

<template>
  <div class="relative justify-center flex flex-grow">
    <img src="@/assets/banner.jpg" alt="hero" class="h-[30rem] sm:h-[35rem] object-cover w-full" />
    <div class="absolute flex flex-col top-3/4">
      <div class="">
        <h1 class="text-center text-2xl sm:text-4xl font-bold text-white">
          {{ $t('shop.brandMessage') }}
        </h1>
      </div>
    </div>
  </div>
</template>
