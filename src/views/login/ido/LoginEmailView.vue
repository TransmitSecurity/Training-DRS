<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import EmailLogin from '@/components/login/EmailLogin.vue'
import FooterSection from '@/components/FooterSection.vue'
import { userSessionStore } from '@/store/userSession'

const userSession = userSessionStore()
const email = userSession.userData.email?.value
</script>
<template>
  <generic-layout :title="$t('authentication.login')">
    <!-- Comment or uncomment below to change the experience -->
    <email-login :email-address="email" />
  </generic-layout>
  <footer-section />
</template>
