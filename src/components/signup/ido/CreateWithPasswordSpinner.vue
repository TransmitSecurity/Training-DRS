<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a password input providing a way for a user
 * to either login or signup with a password.
 */
import { onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { RegistrationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import { Action, reportAction } from '@/helpers/risk'
import { continueIdoJourney } from '@/helpers/ido'

const toast = useToast()

const userSession = userSessionStore()
const signupData = userSession.signupData

/**
 * Server APIs
 */
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

onMounted(async () => {
  await createUserWithPassword()
  await idoContinue()
})

async function createUserWithPassword() {
  // Register a new account with a password
  try {
    reportAction(Action.REGISTER)
    const response = await registerApi.registerWithPassword({
      email: signupData.email,
      address: {
        city: signupData.city,
        country: signupData.country,
        postal_code: signupData.postalCode,
        street_address: signupData.street,
      },
      password: signupData.password,
    })
    if (response.status == 201) {
      console.log(response)
      await loadSession()
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    signupData.password = ''
  }
}

async function idoContinue() {
  try {
    // Submit the response to the IDO service
    const idoResponse = await window.tsPlatform.ido.submitClientResponse('client_input', {})
    userSession.idoResponse = idoResponse
    console.log(idoResponse)
    // Continue the journey to the next form
    continueIdoJourney(idoResponse)
  } catch (error) {
    console.error(error)
  }
}
</script>
<template>
  <div>
    <div class="flex flex-col gap-y-4 w-full">
      <div class="flex-col flex gap-y-4">
        <button class="btn loading loading-lg btn-ghost"></button>
      </div>
    </div>
  </div>
</template>
