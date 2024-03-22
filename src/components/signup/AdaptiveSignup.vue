<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a country selection to signup
 * based on the country, the signup experience is adapted:
 * - UK: address, phone, SMS OTP
 * - France: name, surname, password
 * - Spain: name, address, email OTP
 */
import { ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'

import { countryRule, emailRule } from '@/helpers/validationRules'
import { useRouter } from 'vue-router'
import { RegistrationApi, AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { userSessionStore } from '@/store/userSession'
import NameSignup from './NameSignup.vue'
import AddressSignup from './AddressSignup.vue'
import PasswordWebauthnSignup from './PasswordWebauthnSignup.vue'

const loading = ref(false)

const router = useRouter()
const userSession = userSessionStore()
type Screen = 'country' | 'password' | 'phone' | 'address' | 'name' | 'emailOtp' | 'phoneOtp'
const screenToShow = ref<Screen>('country')

const signupData = userSession.signupData

// Validations

// Form 1 validation - email and country
const vEmailForm$ = useVuelidate(
  {
    email: emailRule(),
    country: countryRule(),
  },
  {
    email: signupData.email,
    country: signupData.country,
  },
)

/**
 * Server APIs
 */
const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

onMounted(() => {
  if (userSession.tsPlatformLoaded) {
    checkWebauthnSupport()
  } else {
    // The ts platform SDK is not loaded yet, we need to wait
    // for it to be loaded and then initialize webauthn
    document.addEventListener('tsPlatformLoaded', function (e) {
      checkWebauthnSupport()
    })
  }
})

async function checkWebauthnSupport() {
  console.log('Verifying if webauthn is supported')
  window.tsPlatform.webauthn.isPlatformAuthenticatorSupported().then((supported: boolean) => {
    userSession.setWebAuthnSupported(supported)
    console.log(`Webauthn is ${supported ? '' : 'not'} supported`)
  })
}

// async function loginPassword() {
//   const isFormCorrect = (await v$.value.email.$validate()) && (await v$.value.password.$validate())
//   console.log(`formCorrect ${isFormCorrect}`)
//   if (isFormCorrect) {
//     // Register a new account with a password
//     loading.value = true
//     try {
//       reportAction(Action.REGISTER)
//       const response = await registerApi.registerWithPassword({
//         email: email.value,
//         password: password.value,
//       })
//       loading.value = false
//       if (response.status == 201) {
//         // Retrieve user information and
//         // indicate that the user is now authenticated
//         console.log(response)
//         await loadSession()
//         // Suggest registering webauthn, if it is supported
//         if (userSession.webauthnSupported) {
//           router.push({ name: 'registerWebauthn' })
//         } else {
//           router.push({ name: 'home' })
//         }
//       } else {
//         toast.error(response.statusText)
//       }
//     } catch (error) {
//       handleError(error)
//     } finally {
//       loading.value = false
//     }
//   } else {
//     toast.error(t('toast.error.invalidForm'))
//   }
// }

async function startSignup() {
  // eslint-disable-next-line no-undef
  const idoResponse: IdoServiceResponse = await window.tsPlatform.ido.startJourney(
    'country_signup',
    {
      flowId: 'random',
      additionalParams: { country: signupData.country },
    },
  )
  // Save the orchestration state in the pinia store
  userSession.idoSerializedState = window.tsPlatform.ido.serializedState()
  console.log(idoResponse)
  console.log(idoResponse.data.text)
}

async function continueSignup() {
  window.tsPlatform.ido.restoreFromSerializedState(userSession.idoSerializedState)
}
</script>

<template>
  <div>
    <!-- First form shown : email + country -->
    <form
      v-if="screenToShow == 'country'"
      @submit.prevent="startSignup"
      class="flex flex-col gap-y-4 w-full"
      novalidate
    >
      <div class="flex-col flex gap-y-4">
        <user-input
          :label="$t('userData.email')"
          v-model="signupData.email"
          :validation="vEmailForm$.email"
          input-type="email"
          :display-invalid-message="false"
          :placeholder="$t('userData.email')"
          autofocus
        />
        <select class="select select-bordered" v-model="signupData.country">
          <option selected>France</option>
          <option>UK</option>
          <option>Spain</option>
          <option>Netherlands</option>
          <option>United States</option>
          <option>Japan</option>
          <option>Australia</option>
        </select>
      </div>

      <div class="flex flex-col gap-y-1">
        <button
          type="submit"
          class="btn btn-block btn-primary"
          :class="loading ? 'loading loading-spinner btn-disabled' : ''"
        >
          {{ $t('authentication.signup') }}
        </button>
      </div>
    </form>

    <!-- Intermediate screens - only collect info -->
    <address-signup v-if="screenToShow == 'address'" />
    <name-signup v-if="screenToShow == 'name'" />

    <!-- Final screens - will create the account -->
    <password-webauthn-signup v-if="screenToShow == 'password'" />
  </div>
</template>
