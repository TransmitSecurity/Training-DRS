<script setup lang="ts">
// This view is in charge of finishing the account creation based on
// all of the information that was collected and stored in the userSession store
import GenericLayout from '@/views/generic/GenericLayout.vue'
import CreateSpinner from '@/components/signup/ido/CreateSpinner.vue'
import FooterSection from '@/components/FooterSection.vue'
import { onBeforeMount, ref } from 'vue'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import {
  RegistrationApi,
  AuthenticationApi,
  type UserAddressUpdateDto,
  type RegisterGenericUserPasswordDto,
  type RegisterGenericUserEmailDto,
  type RegisterGenericUserPhoneDto,
} from '@transmitsecurity-dev/ts-demo-client-lib'
import { Action, reportAction } from '@/helpers/risk'
import { loadSession } from '@/helpers/session'

import { continueIdoJourney } from '@/helpers/ido'
import { useRouter } from 'vue-router'
import { handleError } from '@/helpers/errors'

const loading = ref(true)
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const userSession = userSessionStore()
const signupData = userSession.signupData
/**
 * Server APIs
 */
const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

interface SignupData {
  email?: string
  password?: string
  phone?: string
  firstName?: string
  lastName?: string
  address?: UserAddressUpdateDto
  birthday?: string
}

onBeforeMount(async () => {
  try {
    reportAction(Action.REGISTER)

    // Adapt the type of registration based on the data collected
    let response = { status: 400, statusText: 'Error' }

    const params: SignupData = {}
    if (signupData.phone) params.phone = signupData.phone
    if (signupData.email) params.email = signupData.email
    if (signupData.firstName) params.firstName = signupData.firstName
    if (signupData.lastName) params.lastName = signupData.lastName
    if (signupData.country) params.address = { ...params.address, country: signupData.country }
    if (signupData.city) params.address = { ...params.address, city: signupData.city }
    if (signupData.postalCode)
      params.address = { ...params.address, postal_code: signupData.postalCode }
    if (signupData.street) params.address = { ...params.address, street_address: signupData.street }
    if (signupData.password) params.password = signupData.password

    // If there is a password, we register the user with a password
    console.log(params)
    if (params.password !== undefined && params.email !== undefined) {
      const passwordParams = params as RegisterGenericUserPasswordDto
      console.log(passwordParams)
      response = await registerApi.registerWithPassword(passwordParams)
      loading.value = false
      if (response.status == 201) {
        // Retrieve user information and
        // indicate that the user is now authenticated
        console.log(response)
        await loadSession()
      } else {
        toast.error(response.statusText)
      }
    }

    // If there is no password, but an email, we register with an email only
    else if (params.email) {
      const emailParams = params as RegisterGenericUserEmailDto
      response = await registerApi.registerWithEmail(emailParams)
    }

    // Otherwise we register with a phone
    else if (params.phone) {
      const phoneParams = params as RegisterGenericUserPhoneDto
      response = await registerApi.registerWithPhone(phoneParams)
    }
    // And if there is nothing, it's an non managed error
    else {
      toast.error('Missing registration data')
    }

    if (response.status == 201) {
      console.log(response)
      // We save the user phone and email
      // to use it to authenticate the user later on
      // and we clear the signup data
      if (params.email) userSession.userData.email = { value: params.email }
      if (params.phone) userSession.userData.phone_number = { value: params.phone }
      userSession.clearSignupData()
      idoContinue()
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
})

async function idoContinue() {
  try {
    loading.value = true
    // Submit the response to the IDO service
    const idoResponse = await window.tsPlatform.ido.submitClientResponse('client_input', {})
    userSession.idoResponse = idoResponse
    console.log(idoResponse)
    // Continue the journey to the next form
    continueIdoJourney(idoResponse)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <generic-layout :title="$t('registration.createYourAccount')">
    <!-- Comment or uncomment below to change the experience -->
    <div class="flex justify-center">{{ $t('registration.weAreCreatingYourAccount') }}</div>
    <create-spinner />
  </generic-layout>
  <footer-section />
</template>
