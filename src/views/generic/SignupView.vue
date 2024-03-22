<script setup lang="ts">
import LogoOnBase from '@/components/logo/LogoOnBase.vue'
import PasswordLogin from '@/components/login/PasswordLogin.vue'
import EmailLogin from '@/components/login/EmailLogin.vue'
import SmsLogin from '@/components/login/SmsLogin.vue'
import EmailWebauthnLogin from '@/components/login/EmailWebauthnLogin.vue'
import PasswordWebauthnSignup from '@/components/signup/PasswordWebauthnSignup.vue'
import PasswordWebauthnSignupFull from '@/components/signup/PasswordWebauthnSignupFull.vue'
import GenericLayout from '@/views/generic/GenericLayout.vue'
</script>
<template>
  <generic-layout
    :title="$t('registration.createYourAccount')"
    show-alternative-option
    :option-description="$t('authentication.alreadyHaveAccount')"
    :option-link="$t('authentication.login')"
    option-route="login"
  >
    <!-- Change this to another component, examples below-->
    <!-- <email-login signup /> -->
    <!-- <password-login signup /> -->
    <!-- <email-webauthn-login signup /> -->
    <!-- <sms-login signup /> -->
    <!-- <password-webauthn-signup /> -->
    <password-webauthn-signup-full />
  </generic-layout>
</template>
