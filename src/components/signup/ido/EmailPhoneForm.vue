<script setup lang="ts">
/**
 * Display a form gathering the user's email and phone number
 * The information is automatically stored in
 * pinia's userSession store, in signupData
 */
import { computed, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { emailRule, phoneRule } from '@/helpers/validationRules'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { continueIdoJourney } from '@/helpers/ido'

const loading = ref(false)
const { t } = useI18n()
const userSession = userSessionStore()
const emits = defineEmits(['onComplete'])
const props = defineProps<{ submitText?: string }>()
const toast = useToast()

const signupData = userSession.signupData

// If we want vuelidate to validate nested Pinia props
// we need to wrap them in a computed property
const email = computed(() => {
  return signupData.email
})
const phone = computed(() => {
  return signupData.phone
})

const v$ = useVuelidate(
  {
    email: emailRule(),
    phone: phoneRule(),
  },
  {
    email,
    phone,
  },
)

async function idoContinue() {
  const formValid = await v$.value.$validate()
  if (formValid) {
    try {
      loading.value = true
      // Submit the response to the IDO service
      const idoResponse = await window.tsPlatform.ido.submitClientResponse('client_input', {
        email: signupData.email,
        phone: signupData.phone,
      })
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
    toast.error(t('toast.error.invalidForm'))
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="idoContinue" class="flex flex-col gap-y-4 w-full" novalidate>
      <div class="flex-col flex gap-y-4">
        <user-input
          :label="$t('userData.email')"
          v-model="signupData.email"
          :validation="v$.email"
          input-type="email"
          display-invalid-message
          :placeholder="$t('userData.email')"
          autofocus
        />
        <user-input
          :label="$t('userData.phone')"
          v-model="signupData.phone"
          :validation="v$.phone"
          input-type="tel"
          display-invalid-message
          :placeholder="$t('userData.phone')"
          autofocus
        />
      </div>

      <div class="flex flex-col gap-y-1">
        <button
          type="submit"
          class="btn btn-block btn-primary"
          :class="loading ? 'loading loading-spinner btn-disabled' : ''"
        >
          <span v-if="!props.submitText">
            {{ $t('global.continue') }}
          </span>
          <span v-else>
            {{ props.submitText }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
