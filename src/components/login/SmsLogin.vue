<script setup lang="ts">
/**
 * This component displays a form with an phone number input
 * to either login or signup with an SMS OTP.
 */
import { type Ref, ref, toRefs, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { phoneRule } from '@/helpers/validationRules'
import { useRouter } from 'vue-router'
import { RegistrationApi, AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import OtpSent from './otp/OtpSent.vue'
import { Action, reportAction } from '@/helpers/risk'
import { onBeforeMount } from 'vue'

const { t } = useI18n()
const phone: Ref<string> = ref('')
const toast = useToast()
const loading = ref(false)
const showOtpErrorMessage = ref(false)
const showOtpForm = ref(false)

const props = withDefaults(
  defineProps<{
    signup?: boolean
    phoneNumber?: string
    autoSend?: boolean
  }>(),
  { signup: false, autoSend: false },
)
const { signup } = toRefs(props)
const router = useRouter()
defineEmits(['onLoginSuccess', 'onLoginError'])
const userSession = userSessionStore()

/**
 * Server APIs
 */
const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

onBeforeMount(async () => {
  if (props.phoneNumber) {
    phone.value = props.phoneNumber
    if (props.autoSend) sendOtp()
  }
})

async function sendOtp() {
  const isFormCorrect = await v$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    if (signup.value) {
      // Register a new account
      loading.value = true
      try {
        reportAction(Action.REGISTER)
        const response = await registerApi.registerWithPhone({
          phone: phone.value,
        })
        loading.value = false
        if (response.status == 200) {
          console.log(response)
          showOtpForm.value = true
        } else {
          toast.error(response.statusText)
        }
      } catch (error) {
        handleError(error)
      } finally {
        loading.value = false
      }
    } else {
      // Authenticate with an SMS OTP
      loading.value = true
      try {
        const response = await authApi.authenticateSMSOtpSend({
          phone: phone.value,
        })
        if (response.status == 200) {
          console.log(response.data)
          showOtpForm.value = true
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

async function resendOtp() {
  loading.value = true
  try {
    const response = await authApi.authenticateSMSOtpSend({
      phone: phone.value,
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

async function validateOtp(phone: string, otp: string) {
  loading.value = true
  try {
    reportAction(Action.LOGIN)
    const response = await authApi.authenticateSmsOtpValidate({ phone, passcode: otp })
    if (response.status == 200) {
      console.log(response.data)
      await loadSession()
      router.push({ name: 'home' })
    }
  } catch (error) {
    showOtpErrorMessage.value = true
  } finally {
    loading.value = false
  }
}

function resetOtpErrorMessage() {
  showOtpErrorMessage.value = false
}

function cancelOtpValidation() {
  showOtpForm.value = false
}

const v$ = useVuelidate({ phone: phoneRule() }, { phone: phone })

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
    v-if="showOtpForm"
    :contact="phone"
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

  <!-- Phone number form -->
  <form v-else @submit.prevent="sendOtp" class="flex flex-col gap-y-4 w-full" novalidate>
    <div class="flex-col flex gap-y-4">
      <user-input
        :label="$t('userData.phone')"
        v-model="phone"
        :validation="v$.phone"
        input-type="tel"
        :display-invalid-message="false"
        :placeholder="$t('userData.phone')"
        autofocus
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
