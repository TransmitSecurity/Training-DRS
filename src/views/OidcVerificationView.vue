<script setup lang="ts">
import { handleError } from '@/helpers/errors'
import { Action, reportAction } from '@/helpers/risk'
import { loadSession } from '@/helpers/session'
import { AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

onBeforeMount(async () => {
  const route = useRoute()
  const router = useRouter()
  const code = route.query.code
  const error = route.query.error
  const correlationId = route.query.correlationId
  const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)

  if (error) {
    console.error('Error', error)
    console.error('Correlation ID', correlationId)
    router.push(`/error?error=${error}&correlationId=${correlationId}`)
  } else if (!code) {
    console.error('Authorization code not found')
    router.push({ name: 'login' })
  } else {
    console.log('Authenticating user')
    // Authenticate with an OIDC token
    try {
      reportAction(Action.LOGIN)
      const response = await authApi.authenticateOidc({
        code: code.toString(),
        redirectUri: import.meta.env.VITE_TS_REDIRECT_URL,
      })
      console.log(response)
      if (response.status == 200) {
        console.log(response.data)
        await loadSession()
        router.push({ name: 'home' })
      } else {
        handleError(response.statusText)
      }
    } catch (error) {
      handleError(error)
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center h-screen pt-60"></div>
</template>
