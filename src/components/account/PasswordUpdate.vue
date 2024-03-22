<script setup lang="ts">
/**
 * This component allows a user to update
 * their existing password by providing:
 *  - their existing password
 *  - their new password
 *  - a confirmation of their new password
 */
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength, maxLength, sameAs } from '@vuelidate/validators'
import PasswordInput from '../inputs/PasswordInput.vue'
// import { updatePassword } from '@/lib/userManagement'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { UserApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { handleError } from '@/helpers/errors'

const { t } = useI18n()

const userApi = new UserApi(undefined, import.meta.env.VITE_BACKEND_URL)

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirmation = ref('')
const passwordValid = ref(true)
const loading = ref(false)

const validationRules = {
  oldPassword: {
    required: helpers.withMessage(t('password.currentPasswordRequired'), required),
    isValid: helpers.withMessage(t('password.invalidPassword'), passwordIsValid),
    $autoDirty: true,
  },
  newPassword: {
    required: helpers.withMessage(t('password.newPasswordRequired'), required),
    minLength: helpers.withMessage(t('password.passwordTooSmall'), minLength(8)),
    maxLength: helpers.withMessage(t('password.passwordTooLong'), maxLength(14)),
    $autoDirty: true,
  },
  newPasswordConfirmation: {
    required: helpers.withMessage(t('password.confirmNewPassword'), required),
    sameAsPassword: helpers.withMessage(t('password.passwordsDontMatch'), sameAs(newPassword)),
    $autoDirty: true,
  },
}

const vPassword$ = useVuelidate(validationRules, {
  oldPassword,
  newPassword,
  newPasswordConfirmation,
})
const toast = useToast()

function passwordIsValid() {
  return passwordValid.value
}

function resetPasswordValidity() {
  passwordValid.value = true
}

async function changePassword() {
  const isFormCorrect = await vPassword$.value.$validate()
  if (isFormCorrect) {
    try {
      loading.value = true
      const result = await userApi.updatePassword({
        password: oldPassword.value,
        newPassword: newPassword.value,
      })
      console.log(result)
      if (result.status == 200) {
        toast.success(t('password.passwordUpdated'))
        oldPassword.value = ''
        newPassword.value = ''
        newPasswordConfirmation.value = ''
        vPassword$.value.$reset()
      } else {
        toast.error('Error')
      }
    } catch (error) {
      handleError(error)
      passwordValid.value = false
    } finally {
      loading.value = false
    }
  } else {
    toast.error(t('toast.error.invalidForm'))
  }
}
</script>

<template>
  <form class="mt-6 grid grid-cols-12 gap-4" @submit.prevent="changePassword">
    <div class="grid grid-cols-12 col-span-12 sm:col-span-8">
      <PasswordInput
        :label="$t('password.oldPassword')"
        v-model="oldPassword"
        :validation="vPassword$.oldPassword"
        v-on:update:modelValue="resetPasswordValidity"
        class="col-span-12"
      />
      <PasswordInput
        :label="$t('password.newPassword')"
        v-model="newPassword"
        :validation="vPassword$.newPassword"
        class="col-span-12"
      />
      <PasswordInput
        :label="$t('password.confirmation')"
        v-model="newPasswordConfirmation"
        :validation="vPassword$.newPasswordConfirmation"
        :display-valid-message="true"
        :valid-message="$t('password.passwordsMatch')"
        class="col-span-12"
      />
    </div>
    <div class="col-span-12 sm:col-span-8 flex justify-end">
      <button
        class="btn btn-primary"
        type="submit"
        :class="loading ? 'btn-disabled loading loading-spinner' : ''"
      >
        {{ $t('password.updatePassword') }}
      </button>
    </div>
  </form>
</template>
