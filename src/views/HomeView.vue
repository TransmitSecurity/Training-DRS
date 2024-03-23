<script setup lang="ts">
import BankHomeLoggedIn from '@/components/bank/BankHomeLoggedIn.vue'
import BankHomeLoggedOut from '@/components/bank/BankHomeLoggedOut.vue'
import { userSessionStore } from '@/store/userSession'

import { storeToRefs } from 'pinia'
import FooterSection from '@/components/FooterSection.vue'

const userSession = userSessionStore()
const userSessionRefs = storeToRefs(userSession)
</script>

<template>
  <bank-home-logged-in v-if="userSession.isAuthenticated" />
  <bank-home-logged-out v-else />
  <footer-section />
</template>
