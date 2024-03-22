<script setup lang="ts">
import BankHomeLoggedIn from './BankHomeLoggedIn.vue'
import BankHomeLoggedOut from './BankHomeLoggedOut.vue'
import { userSessionStore } from '@/store/userSession'

import { storeToRefs } from 'pinia'

const userSession = userSessionStore()
const userSessionRefs = storeToRefs(userSession)
</script>

<template>
  <bank-home-logged-in v-if="userSession.isAuthenticated" />
  <bank-home-logged-out v-else />
</template>
