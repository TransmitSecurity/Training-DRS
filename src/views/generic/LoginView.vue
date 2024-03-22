<script setup lang="ts">
import LogoOnBase from '@/components/logo/LogoOnBase.vue'
import PasswordLogin from '@/components/login/PasswordLogin.vue'
import EmailLogin from '@/components/login/EmailLogin.vue'
import SmsLogin from '@/components/login/SmsLogin.vue'
import EmailWebauthnLogin from '@/components/login/EmailWebauthnLogin.vue'
import PasswordWebauthnLogin from '@/components/login/PasswordWebauthnLogin.vue'
import GenericLayout from '@/views/generic/GenericLayout.vue'
</script>
<template>
  <generic-layout
    :title="$t('authentication.signInToYourAccount')"
    show-alternative-option
    :option-description="$t('authentication.dontHaveAccount')"
    :option-link="$t('authentication.signup')"
    option-route="signup"
  >
    <!-- Change this to another component, examples below-->
    <!-- <email-login /> -->
    <!-- <sms-login /> -->
    <!-- <password-login /> -->
    <!-- <email-webauthn-login /> -->
    <password-webauthn-login />
  </generic-layout>
</template>
