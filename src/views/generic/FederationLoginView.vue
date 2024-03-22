<script setup lang="ts">
import { AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {
  /**
   * Server APIs
   */
  const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
  const request = await authApi.authorizationRequestOidc(import.meta.env.VITE_TS_REDIRECT_URL)
  console.log('Initializing authorization request')
  window.location.replace(request.data.url)
})
</script>
<template>
  <div></div>
</template>
