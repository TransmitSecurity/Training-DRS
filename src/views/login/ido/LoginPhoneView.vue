<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import SmsLogin from '@/components/login/SmsLogin.vue'
import FooterSection from '@/components/FooterSection.vue'
import { userSessionStore } from '@/store/userSession'

const userSession = userSessionStore()
const phone = userSession.userData.phone_number?.value
</script>
<template>
  <generic-layout :title="$t('authentication.login')">
    <!-- Comment or uncomment below to change the experience -->
    <sms-login :phone-number="phone" auto-send />
  </generic-layout>
  <footer-section />
</template>
