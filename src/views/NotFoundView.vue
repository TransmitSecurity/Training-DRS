<script setup lang="ts">
import NotFoundPage from '@/components/NotFoundPage.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>
<template>
  <not-found-page>
    {{ $t('global.pageNotFound') }}
  </not-found-page>
  <footer-section />
</template>
