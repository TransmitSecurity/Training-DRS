<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a password input providing a way for a user
 * to either login or signup with a password.
 */
import { type Ref, ref, toRefs, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { useToast } from 'vue-toastification'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import { useI18n } from 'vue-i18n'
import { emailRule, loginPasswordRule, signupPasswordRule } from '@/helpers/validationRules'
import { useRouter } from 'vue-router'
import { RegistrationApi, AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import { Action, reportAction } from '@/helpers/risk'

const { t } = useI18n()
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const toast = useToast()
const loading = ref(false)

const props = withDefaults(
  defineProps<{
    signup?: boolean
  }>(),
  { signup: false },
)
const { signup } = toRefs(props)
const router = useRouter()
defineEmits(['resetPassword', 'onLoginSuccess', 'onLoginError'])
const userSession = userSessionStore()

/**
 * Server APIs
 */
const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

async function loginPassword() {
  const isFormCorrect = (await v$.value.email.$validate()) && (await v$.value.password.$validate())
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    if (signup.value) {
      // Register a new account with a password
      loading.value = true
      try {
        reportAction(Action.REGISTER)
        const response = await registerApi.registerWithPassword({
          email: email.value,
          password: password.value,
        })
        loading.value = false
        if (response.status == 201) {
          console.log(response)
          await loadSession()
          router.push({ name: 'home' })
        } else {
          toast.error(response.statusText)
        }
      } catch (error) {
        handleError(error)
      } finally {
        loading.value = false
      }
    } else {
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
          router.push({ name: 'home' })
        } else {
          toast.error(response.statusText)
        }
      } catch (error) {
        handleError(error)
      } finally {
        loading.value = false
      }
    }
  } else {
    toast.error(t('toast.error.invalidForm'))
  }
}

const validationRules = {
  email: emailRule(),
  password: signup.value ? signupPasswordRule() : loginPasswordRule(),
}

const v$ = useVuelidate(validationRules, {
  email: email,
  password,
})

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
  <form @submit.prevent="loginPassword" class="flex flex-col gap-y-4 w-full" novalidate>
    <div class="flex-col flex gap-y-4">
      <user-input
        :label="$t('userData.email')"
        v-model="email"
        :validation="v$.email"
        input-type="email"
        :display-invalid-message="false"
        :placeholder="$t('userData.email')"
        autofocus
      />
      <password-input
        :label="$t('authentication.password')"
        v-model="password"
        :validation="v$.password"
        :display-invalid-message="false"
        :placeholder="$t('authentication.password')"
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

      <div class="flex justify-center" v-if="!signup">
        <a class="link link-hover" @click="$emit('resetPassword')">
          {{ $t('password.forgotPassword') }}
        </a>
      </div>
    </div>
  </form>
</template>
