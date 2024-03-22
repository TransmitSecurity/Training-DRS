<script setup lang="ts">
/**
 * Defines the user experience to verify a user email
 */
import UserInput from '../inputs/UserInput.vue'

import { useI18n } from 'vue-i18n'
import { emailRule } from '@/helpers/validationRules'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'
import { VerificationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import OtpVerificationDialog from '@/components/login/otp/OtpVerificationDialog.vue'

const verificationApi = new VerificationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const toast = useToast()
const { t } = useI18n()

const sessionStore = userSessionStore()
const sessionStoreRefs = storeToRefs(sessionStore)

const email = ref(sessionStore.email)
const { emailVerified } = sessionStoreRefs
const showOtpDialog = ref(false)
const showError = ref(false)
const sendEmailLoading = ref(false)
const validateOtpLoading = ref(false)

const emits = defineEmits(['updated'])

// We used the pre-defined validation rules available in /src/helpers/validationRules
const vEmail$ = useVuelidate({ email: emailRule() }, { email })

async function verify() {
  const isFormCorrect = await vEmail$.value.$validate()
  // The user can only trigger a verification if
  // the email is not verified
  // or this is a new email that should be verified
  if (isFormCorrect && (email.value !== sessionStore.email || !emailVerified.value)) {
    try {
      sendEmailLoading.value = true
      const response = await verificationApi.sendVerificationEmailOtp({ email: email.value })
      if (response.status == 200) showOtpDialog.value = true
    } catch (e) {
      toast.error(t('error.anErrorOccurred'))
    } finally {
      sendEmailLoading.value = false
    }
  }
}

async function validateChallenge(contact: string, otp: string) {
  validateOtpLoading.value = true
  try {
    const validation = await verificationApi.verifyEmailOtp({ email: contact, otp })
    console.log(validation.status)
    if (validation.status == 200 && validation.data.success) {
      await sessionStore.refreshUserData()
      showOtpDialog.value = false
      emits('updated')
      toast.success(t('otp.codeSuccessfullyValidated'))
    } else {
      showError.value = true
    }
  } catch (e) {
    console.log(e)
    showError.value = true
  } finally {
    validateOtpLoading.value = false
  }
}

function change() {
  showError.value = false
}

function cancel() {
  showOtpDialog.value = false
}
</script>
<template>
  <otp-verification-dialog
    :is-open="showOtpDialog"
    :contact="email"
    :show-error="showError"
    :loading="validateOtpLoading"
    @resend-otp="verify"
    @validate-otp="validateChallenge"
    @back="cancel"
    @change="change"
  />
  <user-input
    :label="$t('userData.email')"
    v-model="email"
    :validation="vEmail$.email"
    input-type="text"
    :placeholder="$t('userData.email')"
    :verified="emailVerified"
    :loading="sendEmailLoading"
    display-update-option
    display-verified-badge
    @update-data="verify"
  />
</template>
