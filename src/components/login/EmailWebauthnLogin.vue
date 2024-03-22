<script setup lang="ts">
/**
 * This component displays a form with an email input
 * to either login or signup with an email OTP.
 */
import { type Ref, ref, toRefs, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { emailRule } from '@/helpers/validationRules'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { RegistrationApi, AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import OtpSent from './otp/OtpSent.vue'
import { Action, reportAction } from '@/helpers/risk'

const { t } = useI18n()
const email: Ref<string> = ref('')
const toast = useToast()
const loading = ref(false)
const showOtpErrorMessage = ref(false)

const props = withDefaults(
  defineProps<{
    signup?: boolean
  }>(),
  { signup: false },
)
const { signup } = toRefs(props)
const router = useRouter()
defineEmits(['onLoginSuccess', 'onLoginError'])
const userSession = userSessionStore()

type Screen = 'emailForm' | 'otpForm'
const screenToShow = ref<Screen>('emailForm')

/**
 * Server APIs
 */
const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

onMounted(() => {
  // If this is an authentication, webauthn could be used
  if (!signup.value) {
    if (userSession.tsPlatformLoaded) {
      initializeWebauthn()
    } else {
      // The ts platform SDK is not loaded yet, we need to wait
      // for it to be loaded and then initialize webauthn
      document.addEventListener('tsPlatformLoaded', function (e) {
        initializeWebauthn()
      })
    }
  }
})

onBeforeRouteLeave(async () => {
  // Abord any conditional mediation started when the user leaves the login page
  await window.tsPlatform.webauthn.authenticate.autofill.abort()
})

async function initializeWebauthn() {
  console.log('Verifying if webauthn is supported')
  window.tsPlatform.webauthn.isPlatformAuthenticatorSupported().then((supported: boolean) => {
    userSession.setWebAuthnSupported(supported)
    console.log(`Webauthn is ${supported ? '' : 'not'} supported`)
  })

  console.log('Verifying if autofill is supported')
  const autofillSupported = window.tsPlatform.webauthn.isAutofillSupported()
  if (autofillSupported) {
    console.log('Initializing conditional UI')
    // First, abort any conditional mediation started when the user leaves the login page
    await window.tsPlatform.webauthn.authenticate.autofill.abort()
    // Then activate a new conditional mediation
    await window.tsPlatform.webauthn.authenticate.autofill.activate({
      onSuccess: authenticateWithWebauthnAutofill,
      onError: onWebauthnAutofillError,
    })
  } else {
    console.log('Autofill not supported')
  }
}

async function createAccount() {
  // Register a new account
  loading.value = true
  try {
    reportAction(Action.REGISTER)
    const response = await registerApi.registerWithEmail({
      email: email.value,
    })
    loading.value = false
    if (response.status == 201) {
      console.log(response)
      screenToShow.value = 'otpForm'
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function authenticateWithEmailOtp() {
  try {
    const response = await authApi.authenticateEmailOtpSend({
      email: email.value,
    })
    if (response.status == 200) {
      console.log(response.data)
      screenToShow.value = 'otpForm'
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function authenticateWithWebauthn() {
  try {
    // Abort autofill login
    await window.tsPlatform.webauthn.authenticate.autofill.abort()
    // Proceed to traditional login
    reportAction(Action.LOGIN)
    const webauthnEncodedResult = await window.tsPlatform.webauthn.authenticate.modal(email.value)
    const response = await authApi.authenticateWebauthn({ webauthnEncodedResult })
    console.log(response)
    console.log(response.data)
    await loadSession()
    router.push({ name: 'home' })
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function authenticateWithWebauthnAutofill(webauthnEncodedResult: string) {
  try {
    reportAction(Action.LOGIN)
    const response = await authApi.authenticateWebauthn({ webauthnEncodedResult })
    console.log(response)
    console.log(response.data)
    await loadSession()
    router.push({ name: 'home' })
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function onWebauthnAutofillError(error: any) {
  handleError(error)
}

async function authenticate() {
  loading.value = true
  if (userSession.webauthnSupported) {
    authenticateWithWebauthn()
  } else {
    authenticateWithEmailOtp()
  }
}

async function loginOrSignup() {
  const isFormCorrect = await v$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    if (signup.value) {
      createAccount()
    } else {
      authenticate()
    }
  } else {
    toast.error(t('toast.error.invalidForm'))
  }
}

async function resendOtp() {
  loading.value = true
  try {
    const response = await authApi.authenticateEmailOtpSend({
      email: email.value,
    })
    if (response.status == 200) {
      toast.success(t('otp.codeSent'))
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function validateOtp(email: string, otp: string) {
  loading.value = true
  try {
    reportAction(Action.LOGIN)
    const response = await authApi.authenticateEmailOtpValidate({ email, passcode: otp })
    if (response.status == 200) {
      console.log(response.data)
      await loadSession()
      if (signup.value && userSession.webauthnSupported) {
        router.push({ name: 'registerWebauthn' })
      } else {
        router.push({ name: 'home' })
      }
    }
  } catch (error) {
    handleError(error)
    showOtpErrorMessage.value = true
  } finally {
    loading.value = false
  }
}

function resetOtpErrorMessage() {
  showOtpErrorMessage.value = false
}

function cancelOtpValidation() {
  screenToShow.value = 'emailForm'
}

const v$ = useVuelidate({ email: emailRule() }, { email: email })

const errorFound = computed(() => {
  return v$.value.$errors && v$.value.$errors.length > 0
})

const errorMessage = computed(() => {
  if (errorFound.value) {
    return v$.value.$errors[0].$message.toString()
  } else {
    return 'Hidden error message'
  }
})
</script>

<template>
  <!-- OTP code form -->
  <otp-sent
    v-if="screenToShow == 'otpForm'"
    :contact="email"
    @resend-otp="resendOtp"
    @validate-otp="validateOtp"
    @change="resetOtpErrorMessage"
    :show-error="showOtpErrorMessage"
    show-back-label
    :back-label="$t('global.cancel')"
    :loading="loading"
    @back="cancelOtpValidation"
    class="py-8"
  />

  <!-- Email form -->
  <form
    v-if="screenToShow == 'emailForm'"
    @submit.prevent="loginOrSignup"
    class="flex flex-col gap-y-4 w-full"
    novalidate
  >
    <div class="flex-col flex gap-y-4">
      <user-input
        :label="$t('userData.email')"
        v-model="email"
        :validation="v$.email"
        input-type="email"
        :display-invalid-message="false"
        :placeholder="$t('userData.email')"
        :autocomplete="signup ? 'username' : 'username webauthn'"
      />
    </div>

    <div class="text-xs" :class="errorFound ? 'visible' : 'invisible'">
      <span class="text-error-content">{{ errorMessage }}</span>
    </div>

    <div class="flex flex-col gap-y-1">
      <button
        type="submit"
        class="btn btn-block btn-primary"
        :class="loading ? 'loading loading-spinner btn-disabled' : ''"
      >
        {{ signup ? $t('authentication.signup') : $t('authentication.login') }}
      </button>
    </div>
  </form>
</template>
