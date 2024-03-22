<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import SmsLogin from '@/components/login/SmsLogin.vue'
import EmailLogin from '@/components/login/EmailLogin.vue'
import EmailWebauthnLogin from '@/components/login/EmailWebauthnLogin.vue'
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
    <email-login signup />
    <!-- <email-webauthn-login signup /> -->
  </generic-layout>
  <footer-section />
</template>
