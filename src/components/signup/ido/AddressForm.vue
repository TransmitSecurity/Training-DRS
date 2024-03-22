<script setup lang="ts">
/**
 * Display a form gathering the user's address
 * The information is automatically stored in
 * pinia's userSession store, in signupData
 */
import { computed, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { cityRule, countryRule, streetRule, zipCodeRule } from '@/helpers/validationRules'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { continueIdoJourney } from '@/helpers/ido'

const loading = ref(false)
const userSession = userSessionStore()
const { t } = useI18n()
const toast = useToast()
const emits = defineEmits(['onComplete'])
const props = defineProps<{ submitText?: string }>()

// Postal address
const signupData = userSession.signupData

// If we want vuelidate to validate nested Pinia props
// we need to wrap them in a computed property
const street = computed(() => {
  return signupData.street
})
const city = computed(() => {
  return signupData.city
})

const postalCode = computed(() => {
  return signupData.postalCode
})

const country = computed(() => {
  return signupData.country
})

const v$ = useVuelidate(
  {
    street: streetRule(),
    city: cityRule(),
    postalCode: zipCodeRule(),
    country: countryRule(),
  },
  {
    street,
    city,
    postalCode,
    country,
  },
)

async function idoContinue() {
  const formValid = await v$.value.$validate()
  if (formValid) {
    try {
      loading.value = true
      // Submit the response to the IDO service
      const idoResponse = await window.tsPlatform.ido.submitClientResponse('client_input', {
        street: signupData.street,
        city: signupData.city,
        postalCode: signupData.postalCode,
        country: signupData.country,
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
        <h3 class="text-sm ml-1 font-bold mt-8">{{ $t('userData.address') }}</h3>
        <user-input
          :label="$t('userData.street')"
          v-model="signupData.street"
          :validation="v$.street"
          input-type="text"
          display-invalid-message
          :placeholder="$t('userData.street')"
          autofocus
        />
        <user-input
          :label="$t('userData.zipCode')"
          v-model="signupData.postalCode"
          :validation="v$.postalCode"
          input-type="text"
          display-invalid-message
          :placeholder="$t('userData.zipCode')"
          autofocus
        />
        <user-input
          :label="$t('userData.city')"
          v-model="signupData.city"
          :validation="v$.city"
          input-type="text"
          display-invalid-message
          :placeholder="$t('userData.city')"
          autofocus
        />
        <user-input
          :label="$t('userData.country')"
          v-model="signupData.country"
          :validation="v$.country"
          input-type="text"
          display-invalid-message
          :placeholder="$t('userData.country')"
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
