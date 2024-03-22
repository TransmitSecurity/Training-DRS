<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a password input providing a way for a user
 * to either login or signup with a password.
 */
import { type Ref, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useToast } from 'vue-toastification'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import { useI18n } from 'vue-i18n'
import { emailRule, signupPasswordRule } from '@/helpers/validationRules'
import { userSessionStore } from '@/store/userSession'
import { helpers, required, sameAs } from '@vuelidate/validators'
import { continueIdoJourney } from '@/helpers/ido'

const { t } = useI18n()
const password: Ref<string> = ref('')
const passwordConfirmation: Ref<string> = ref('')
const toast = useToast()
const loading = ref(false)
const userSession = userSessionStore()

const validationRules = {
  password: signupPasswordRule(),
  passwordConfirmation: {
    required: helpers.withMessage(t('password.confirmNewPassword'), required),
    sameAsPassword: helpers.withMessage(t('password.passwordsDontMatch'), sameAs(password)),
    $autoDirty: true,
  },
}

const v$ = useVuelidate(validationRules, {
  password,
  passwordConfirmation,
})

async function idoContinue() {
  const isFormCorrect = await v$.value.$validate()
  if (isFormCorrect) {
    try {
      loading.value = true
      // Submit the response to the IDO service
      const idoResponse = await window.tsPlatform.ido.submitClientResponse('client_input', {
        password: password.value,
      })
      userSession.signupData.password = password.value
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
  } else {
    console.log(v$.value.$errors)
    toast.error(t('toast.error.invalidForm'))
  }
}
</script>

<template>
  <form @submit.prevent="idoContinue" class="flex flex-col gap-y-4 w-full" novalidate>
    <div class="flex-col flex gap-y-4">
      <password-input
        :label="$t('authentication.password')"
        v-model="password"
        :validation="v$.password"
        :display-invalid-message="true"
        :placeholder="$t('authentication.password')"
      />
      <password-input
        :label="$t('password.confirmation')"
        v-model="passwordConfirmation"
        :validation="v$.passwordConfirmation"
        :display-valid-message="true"
        :valid-message="$t('password.passwordsMatch')"
        :placeholder="$t('password.repeatYourPassword')"
        class="col-span-12"
      />
    </div>

    <div class="flex flex-col gap-y-1">
      <button
        type="submit"
        class="btn btn-block btn-primary"
        :class="loading ? 'loading loading-spinner btn-disabled' : ''"
      >
        {{ $t('global.continue') }}
      </button>
    </div>
  </form>
</template>
