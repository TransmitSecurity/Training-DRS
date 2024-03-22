<script setup lang="ts">
/**
 * This component displays a form with an email input
 * to either login or signup with an email OTP.
 */
import { type Ref, ref, toRefs, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { emailRule, loginPasswordRule } from '@/helpers/validationRules'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { AuthenticationApi, UserApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import { Action, reportAction } from '@/helpers/risk'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import FaceIdIcon from '@/components/icons/FaceIdIcon.vue'
import TouchIdIcon from '@/components/icons/TouchIdIcon.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const email: Ref<string> = ref('')
const password = ref('')
const toast = useToast()
const loading = ref(false)
const showPasskey = ref(true)

const props = withDefaults(
  defineProps<{
    signup?: boolean
    redirectAfterLogin?: string
    redirectForSignup?: string
  }>(),
  { signup: false, redirectAfterLogin: 'home', redirectForSignup: 'signup' },
)
const { signup } = toRefs(props)
const router = useRouter()
defineEmits(['onLoginSuccess', 'onLoginError'])
const userSession = userSessionStore()

type Screen = 'passwordForm' | 'emailForm'
const screenToShow = ref<Screen>('emailForm')

/**
 * Server APIs
 */
const be = import.meta.env.VITE_BACKEND_URL
const authApi = new AuthenticationApi(undefined, be)
const userApi = new UserApi(undefined, be)

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
  // Abort any conditional mediation started when the user leaves the login page
  await window.tsPlatform.webauthn.authenticate.autofill.abort()
})

function redirectUser() {
  router.push({ name: props.redirectAfterLogin })
}

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
      onSuccess: loginWebauthnAutofill,
      onError: onWebauthnAutofillError,
    })
  } else {
    console.log('Autofill not supported')
  }
}

async function loginPassword() {
  // Authenticate with a password
  loading.value = true
  try {
    reportAction(Action.LOGIN)
    const response = await authApi.authenticatePassword({
      email: email.value,
      password: password.value,
    })
    if (response.status == 200) {
      console.log(response.data)
      await loadSession()
      redirectUser()
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function loginWebauthn() {
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
    redirectUser()
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function loginWebauthnAutofill(webauthnEncodedResult: string) {
  try {
    reportAction(Action.LOGIN)
    const response = await authApi.authenticateWebauthn({ webauthnEncodedResult })
    console.log(response)
    console.log(response.data)
    await loadSession()
    redirectUser()
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function onWebauthnAutofillError(error: any) {
  console.error(error)
  // TODO re-initialize webauthnAutofill
}

async function loginOrSignup() {
  const isFormCorrect = await vEmail$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    // Check if the user exists
    const user = await userApi.userExists({ email: email.value })
    if (user.data.exists) {
      screenToShow.value = 'passwordForm'
    } else {
      router.push({ name: props.redirectForSignup, query: { email: email.value } })
    }
  } else {
    toast.error(t('toast.error.invalidForm'))
  }
}

// Email validation
const vEmail$ = useVuelidate({ email: emailRule() }, { email: email })

// Password validation
const vPassword$ = useVuelidate({ password: loginPasswordRule() }, { password: password })
</script>
<template>
  <div class="flex flex-grow flex-col px-4 py-12 lg:px-8 bg-base-200 login">
    <!-- Email form -->
    <div
      v-if="screenToShow == 'emailForm'"
      class="bg-base-100 login-form flex flex-col self-center w-full max-w-4xl pb-20 px-4"
    >
      <div class="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
        <h1 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-base-content">
          {{ $t('menu.account') }}
        </h1>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <p class="text-sm">Please enter your email below to access or create your account</p>
        <form @submit.prevent="loginOrSignup">
          <user-input
            :label="$t('userData.email')"
            v-model="email"
            :validation="vEmail$.email"
            input-type="email"
            :display-invalid-message="true"
            :placeholder="$t('userData.email')"
            autocomplete="username webauthn"
          />
          <div class="flex justify-center mt-4">
            <button class="btn btn-primary w-full" type="submit">
              {{ $t('global.continue') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password & passkey form -->
    <div
      v-if="screenToShow == 'passwordForm'"
      class="bg-base-100 login-form flex flex-col self-center w-full max-w-4xl pb-20 px-4"
    >
      <div class="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
        <h1 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-base-content">
          {{ $t('authentication.login') }}
        </h1>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <p class="text-sm">Please enter your password below to access your account</p>
        <form @submit.prevent="loginPassword">
          <password-input
            :label="$t('authentication.password')"
            v-model="password"
            :validation="vPassword$.password"
            :display-invalid-message="false"
            :placeholder="$t('authentication.password')"
            autocomplete="password webauthn"
          />
          <div class="flex justify-center mt-4">
            <button
              class="btn btn-primary w-full"
              :class="loading ? 'loading loading-spinner btn-disabled' : ''"
              type="submit"
            >
              {{ $t('authentication.login') }}
            </button>
          </div>
        </form>

        <div
          v-if="showPasskey"
          class="flex items-center my-4 before:flex-1 before:border-t before:border-base-300 before:mt-0.5 after:flex-1 after:border-t after:border-base-300 after:mt-0.5"
        >
          <p class="text-center font-semibold mx-4 mb-0">{{ $t('authentication.or') }}</p>
        </div>

        <form
          v-if="showPasskey"
          @submit.prevent="loginWebauthn"
          class="flex flex-col gap-y-4 w-full bg-base-200 login-form-alt p-5 rounded-btn"
          novalidate
        >
          <h2 class="text-center">Sign in with a passkey</h2>
          <div class="flex flex-row justify-center gap-4">
            <face-id-icon class="w-10 fill-primary stroke-primary" />
            <hr />
            <touch-id-icon class="w-10 fill-primary stroke-primary" />
          </div>
          <button type="submit" class="btn btn-block btn-primary">
            {{ $t('authentication.login') }}
          </button>
        </form>
      </div>
      <div class="flex justify-center mt-8">
        <a class="link flex" @click="screenToShow = 'emailForm'"
          ><chevron-left-icon class="w-4" /> {{ $t('global.back') }}</a
        >
      </div>
    </div>
  </div>
</template>
