<script setup lang="ts">
/**
 * Defines the user experience to verify a user's phone number
 */
import UserInput from '../inputs/UserInput.vue'

import { useI18n } from 'vue-i18n'
import { phoneRule } from '@/helpers/validationRules'
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { storeToRefs } from 'pinia'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'
import { VerificationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import OtpVerificationDialog from '@/components/login/otp/OtpVerificationDialog.vue'

const verificationApi = new VerificationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const toast = useToast()
const { t } = useI18n()

const sessionStore = userSessionStore()
const sessionStoreRefs = storeToRefs(sessionStore)

const phone = ref(sessionStore.phone)
const { phoneVerified } = sessionStoreRefs
const showOtpDialog = ref(false)
const showError = ref(false)
const sendSmsLoading = ref(false)
const validateOtpLoading = ref(false)

const emits = defineEmits(['updated'])

// We used the pre-defined validation rules available in /src/helpers/validationRules
const vPhone = useVuelidate({ phone: phoneRule() }, { phone })

async function verify() {
  const isFormCorrect = await vPhone.value.$validate()
  if (isFormCorrect && (phone.value !== sessionStore.phone || !phoneVerified.value)) {
    sendSmsLoading.value = true
    try {
      const response = await verificationApi.sendVerificationSmsOtp({ phone: phone.value })
      if (response.status == 200) showOtpDialog.value = true
    } catch (e) {
      toast.error(t('error.anErrorOccurred'))
    } finally {
      sendSmsLoading.value = false
    }
  }
}

async function validateChallenge(contact: string, otp: string) {
  validateOtpLoading.value = true
  try {
    const validation = await verificationApi.verifySmsOtp({ phone: contact, otp })
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
    :contact="phone"
    :show-error="showError"
    :loading="validateOtpLoading"
    @resend-otp="verify"
    @validate-otp="validateChallenge"
    @back="cancel"
    @change="change"
  />
  <user-input
    :label="$t('userData.phone')"
    v-model="phone"
    :validation="vPhone.phone"
    input-type="text"
    :loading="sendSmsLoading"
    :placeholder="$t('userData.phone')"
    :verified="phoneVerified"
    display-update-option
    display-verified-badge
    @update-data="verify"
  />
</template>
