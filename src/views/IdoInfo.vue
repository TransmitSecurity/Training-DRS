<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import DisplayMessage from '@/components/info/ido/DisplayMessage.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>
<template>
  <generic-layout :title="$t('registration.createYourAccount')">
    <!-- Comment or uncomment below to change the experience -->
    <display-message />
  </generic-layout>
  <footer-section />
</template>
