<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import PasswordForm from '@/components/signup/ido/PasswordForm.vue'
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
    <password-form />
  </generic-layout>
  <footer-section />
</template>
