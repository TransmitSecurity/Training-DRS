<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a password input providing a way for a user
 * to either login or signup with a password.
 */
import { type Ref, ref, toRefs, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { useToast } from 'vue-toastification'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import { useI18n } from 'vue-i18n'
import {
  emailRule,
  firstNameRule,
  lastNameRule,
  phoneRule,
  signupPasswordRule,
} from '@/helpers/validationRules'
import { useRouter } from 'vue-router'
import { RegistrationApi, AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import { helpers, required, sameAs } from '@vuelidate/validators'
import { Action, reportAction } from '@/helpers/risk'

const { t } = useI18n()
const firstName: Ref<string> = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const toast = useToast()
const loading = ref(false)

const router = useRouter()
defineEmits(['resetPassword', 'onLoginSuccess', 'onLoginError'])
const userSession = userSessionStore()

type Screen = 'userInfo' | 'passwordCreation'
const screenToShow: Ref<Screen> = ref('userInfo')
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

async function continueSignup() {
  const isFormCorrect = await dataValidation$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    screenToShow.value = 'passwordCreation'
  }
}

async function signupPassword() {
  const isFormCorrect = await passwordValidation$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    // Register a new account with a password
    loading.value = true
    try {
      reportAction(Action.REGISTER)
      const response = await registerApi.registerWithPassword({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
      })
      loading.value = false
      if (response.status == 201) {
        // Retrieve user information and
        // indicate that the user is now authenticated
        console.log(response)
        await loadSession()
        // Suggest registering webauthn, if it is supported
        if (userSession.webauthnSupported) {
          router.push({ name: 'registerWebauthn' })
        } else {
          router.push({ name: 'home' })
        }
      } else {
        toast.error(response.statusText)
      }
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  } else {
    toast.error(t('toast.error.invalidForm'))
  }
}

const dataValidationRules = {
  firstName: firstNameRule(),
  lastName: lastNameRule(),
  phone: phoneRule(),
  email: emailRule(),
}

const dataValidation$ = useVuelidate(dataValidationRules, {
  firstName,
  lastName,
  phone,
  email,
})

const passwordValidationRules = {
  password: signupPasswordRule(),
  passwordConfirmation: {
    required: helpers.withMessage(t('password.confirmNewPassword'), required),
    sameAsPassword: helpers.withMessage(t('password.passwordsDontMatch'), sameAs(password)),
    $autoDirty: true,
  },
}

const passwordValidation$ = useVuelidate(passwordValidationRules, {
  password,
  passwordConfirmation,
})

const errorFound = computed(() => {
  return dataValidation$.value.$errors && dataValidation$.value.$errors.length > 0
})

const errorMessage = computed(() => {
  if (errorFound.value) {
    return dataValidation$.value.$errors[0].$message.toString()
  } else {
    return 'Hidden error message'
  }
})
</script>

<template>
  <!-- Form asking for personal information and contact information -->
  <form
    v-if="screenToShow == 'userInfo'"
    @submit.prevent="continueSignup"
    class="flex flex-col gap-y-4 w-full"
    novalidate
  >
    <user-input
      :label="$t('userData.firstName')"
      v-model="firstName"
      :validation="dataValidation$.firstName"
      input-type="text"
      :placeholder="$t('userData.firstName')"
      autofocus
    />
    <user-input
      :label="$t('userData.lastName')"
      v-model="lastName"
      :validation="dataValidation$.lastName"
      input-type="text"
      :placeholder="$t('userData.lastName')"
    />
    <user-input
      :label="$t('userData.email')"
      v-model="email"
      :validation="dataValidation$.email"
      input-type="email"
      :placeholder="$t('userData.email')"
    />
    <user-input
      :label="$t('userData.phone')"
      v-model="phone"
      :validation="dataValidation$.phone"
      input-type="tel"
      :placeholder="$t('userData.phone')"
    />

    <!-- <div class="text-xs" :class="errorFound ? 'visible' : 'invisible'">
      <span class="text-error-content">{{ errorMessage }}</span>
    </div> -->

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
  <!-- Form asking to create a password -->
  <form
    v-if="screenToShow == 'passwordCreation'"
    @submit.prevent="signupPassword"
    class="flex flex-col gap-y-4 w-full"
    novalidate
  >
    <div class="flex-col flex gap-y-4">
      <password-input
        :label="$t('authentication.password')"
        v-model="password"
        :validation="passwordValidation$.password"
        :display-invalid-message="true"
        :placeholder="$t('authentication.password')"
        autofocus
      />
      <password-input
        :label="$t('password.confirmation')"
        v-model="passwordConfirmation"
        :validation="passwordValidation$.passwordConfirmation"
        :display-invalid-message="true"
        :display-valid-message="true"
        :valid-message="$t('password.passwordsMatch')"
        :placeholder="$t('authentication.password')"
      />
    </div>

    <div class="flex flex-col gap-y-4">
      <button
        type="submit"
        class="btn btn-block btn-primary"
        :class="loading ? 'loading loading-spinner btn-disabled' : ''"
      >
        {{ $t('global.continue') }}
      </button>
      <button @click="screenToShow = 'userInfo'" class="btn btn-ghost">
        {{ $t('global.back') }}
      </button>
    </div>
  </form>
</template>
