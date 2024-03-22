<script setup lang="ts">
import HomeLuxuryShop from '@/components/shop/luxe/HomeLuxuryShop.vue'
import HeroHome from '@/components/blog/HeroHome.vue'
import BankHome from '@/components/bank/BankHome.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>

<template>
  <main class="flex flex-col items-center w-full bg-base-100 home">
    <bank-home />
    <!-- <home-luxury-shop /> -->
    <!-- <botanical-gardens-home /> -->
    <!-- <hero-home /> -->
  </main>
  <footer-section />
</template>
