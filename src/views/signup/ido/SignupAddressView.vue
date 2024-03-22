<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import AddressForm from '@/components/signup/ido/AddressForm.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>
<template>
  <generic-layout
    :title="$t('registration.createYourAccount')"
    show-alternative-option
    :option-description="$t('authentication.alreadyHaveAccount')"
    :option-link="$t('authentication.login')"
    option-route="login"
  >
    <!-- Comment or uncomment below to change the experience -->
    <address-form />
  </generic-layout>
  <footer-section />
</template>
