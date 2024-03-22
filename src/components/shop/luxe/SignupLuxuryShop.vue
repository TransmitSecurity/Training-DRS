<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a password input providing a way for a user
 * to either login or signup with a password.
 */
import { type Ref, ref, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import { useToast } from 'vue-toastification'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import { useI18n } from 'vue-i18n'
import {
  cityRule,
  countryRule,
  emailRule,
  firstNameRule,
  lastNameRule,
  phoneRule,
  signupPasswordRule,
  streetRule,
  zipCodeRule,
} from '@/helpers/validationRules'
import { useRoute, useRouter } from 'vue-router'
import { RegistrationApi, AuthenticationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { loadSession } from '@/helpers/session'
import { userSessionStore } from '@/store/userSession'
import { handleError } from '@/helpers/errors'
import { Action, reportAction } from '@/helpers/risk'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = withDefaults(
  defineProps<{
    redirectRouteName?: string
    createButtonText?: string
  }>(),
  { redirectRouteName: 'home' },
)

const { t } = useI18n()

const toast = useToast()
const loading = ref(false)

const router = useRouter()
const route = useRoute()
defineEmits(['resetPassword', 'onLoginSuccess', 'onLoginError'])
const userSession = userSessionStore()

/**
 * Server APIs
 */
const authApi = new AuthenticationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)

// Login information
const email = ref(route.query.email as string)
const password = ref('')
const passwordConfirmation = ref('')

// Personal information
const firstName: Ref<string> = ref('')
const lastName = ref('')
const phone = ref('')
const birthday: Ref<Date> = ref(new Date())

// Postal address
const street = ref('')
const city = ref('')
const postalCode = ref('')
const country = ref('')

// Validations

// Login information validation
const loginInfoValidationRules = {
  email: emailRule(),
  password: signupPasswordRule(),
}
const vLoginInfo$ = useVuelidate(loginInfoValidationRules, {
  email,
  password,
})

// Personal information validation
const personalInfoValidationRules = {
  firstName: firstNameRule(),
  lastName: lastNameRule(),
  phone: phoneRule(),
}
const vPersonalInfo$ = useVuelidate(personalInfoValidationRules, {
  firstName,
  lastName,
  phone,
})

// Billing information validation
const postalAddressValidationRules = {
  street: streetRule(),
  city: cityRule(),
  postalCode: zipCodeRule(),
  country: countryRule(),
}
const vPostalAddress$ = useVuelidate(postalAddressValidationRules, {
  street,
  city,
  postalCode,
  country,
})

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
function fillInDemo() {
  phone.value = import.meta.env.VITE_DEMO_PHONE || '+33786984001'
  firstName.value = import.meta.env.VITE_DEMO_FIRST_NAME || 'Erwan'
  lastName.value = import.meta.env.VITE_DEMO_LAST_NAME || 'Dano'
  street.value = import.meta.env.VITE_DEMO_STREET || '9 place de Bologne'
  city.value = import.meta.env.VITE_DEMO_CITY || 'Toulouse'
  country.value = import.meta.env.VITE_DEMO_COUNTRY || 'France'
  postalCode.value = import.meta.env.VITE_DEMO_POSTAL_CODE || '31000'
  password.value = import.meta.env.VITE_DEMO_PASSWORD || 'mlkjmlkj'
}

async function signupPassword() {
  const isFormCorrect = await vLoginInfo$.value.$validate()
  console.log(`formCorrect ${isFormCorrect}`)
  if (isFormCorrect) {
    // Register a new account with a password
    loading.value = true
    try {
      reportAction(Action.LOGIN)
      const response = await registerApi.registerWithPassword({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        address: {
          street_address: street.value,
          city: city.value,
          postal_code: postalCode.value,
          country: country.value,
        },
      })
      loading.value = false
      if (response.status == 201) {
        // Retrieve user information and
        // indicate that the user is now authenticated
        console.log(response)
        await loadSession()
        // Suggest registering webauthn, if it is supported
        if (userSession.webauthnSupported) {
          router.push({ name: 'registerWebauthn', query: { redirect: props.redirectRouteName } })
        } else {
          router.push({ name: props.redirectRouteName })
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
</script>
<template>
  <div class="flex flex-grow flex-col bg-base-200 signup">
    <h1 class="text-2xl">
      {{ $t('registration.createYourAccount') }}
    </h1>
    <p class="text-sm">
      {{ $t('luxeShop.privacyPolicyTerms') }}
    </p>

    <slot name="aboveForm"></slot>

    <form @submit.prevent="signupPassword" class="bg-base-100 signup-form px-6 py-4 mt-4">
      <!-- Forms -->
      <div class="grid grid-cols-2 gap-x-4">
        <div class="flex flex-col col-span-2 sm:col-span-1">
          <div class="flex flex-col">
            <h2 class="text-lg font-bold">Login information</h2>
            <user-input
              :label="$t('userData.email')"
              v-model="email"
              :validation="vLoginInfo$.email"
              input-type="email"
              :placeholder="$t('userData.email')"
            />
            <password-input
              :label="$t('authentication.password')"
              v-model="password"
              :validation="vLoginInfo$.password"
              :display-invalid-message="true"
              :placeholder="$t('authentication.password')"
              autofocus
            />
            <div class="text-xs">
              <span
                >For your security, we invite you to fill your password according to the following
                criteria:</span
              >
              <div class="flex flex-col bg-base-200 signup-view py-2 px-2">
                <span>At least 10 characters </span>
                <span>At least 1 uppercase letter </span>
                <span>At least 1 lowercase letter </span>
                <span>At least 1 number </span>
                <span>At least 1 special character</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-8">
            <h2 class="text-lg font-bold">Personal information</h2>
            <user-input
              :label="$t('userData.firstName')"
              v-model="firstName"
              :validation="vPersonalInfo$.firstName"
              input-type="text"
              :placeholder="$t('userData.firstName')"
              autofocus
            />
            <user-input
              :label="$t('userData.lastName')"
              v-model="lastName"
              :validation="vPersonalInfo$.lastName"
              input-type="text"
              :placeholder="$t('userData.lastName')"
            />
            <user-input
              :label="$t('userData.phone')"
              v-model="phone"
              :validation="vPersonalInfo$.phone"
              input-type="tel"
              :placeholder="$t('userData.phone')"
            />
            <div class="col-span-12 md:col-span-6">
              <label for="birthday" class="label label-text">{{ $t('userData.birthday') }}</label>
              <Datepicker
                :enable-time-picker="false"
                format="dd/MM/yyyy"
                v-model="birthday"
                input-class-name="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col col-span-2 mt-8 sm:col-span-1 sm:mt-0">
          <h2 class="text-lg font-semibold">{{ $t('registration.billingInformation') }}</h2>
          <user-input
            class="col-span-12 sm:col-span-6"
            :label="$t('userData.street')"
            v-model="street"
            :validation="vPostalAddress$.street"
            input-type="text"
            :placeholder="$t('userData.street')"
          />

          <user-input
            class="col-span-12 sm:col-span-6"
            :label="$t('userData.city')"
            v-model="city"
            :validation="vPostalAddress$.city"
            input-type="text"
            :placeholder="$t('userData.city')"
          />

          <user-input
            class="col-span-12 sm:col-span-6"
            :label="$t('userData.zipCode')"
            v-model="postalCode"
            :validation="vPostalAddress$.postalCode"
            input-type="text"
            :placeholder="$t('userData.zipCode')"
          />

          <user-input
            class="col-span-12 sm:col-span-6"
            :label="$t('userData.country')"
            v-model="country"
            :validation="vPostalAddress$.country"
            input-type="text"
            :placeholder="$t('userData.country')"
          />
          <div class="flex justify-end">
            <a class="link text-xs" @click="fillInDemo">Demo</a>
          </div>
        </div>
      </div>

      <hr class="mt-16" />
      <!-- Button -->
      <div class="grid grid-cols-2 mt-4">
        <div class="col-span-2 sm:col-span-1 grid grid-cols-12">
          <input type="checkbox" class="checkbox bg-base-100 rounded-none" />
          <div class="col-span-11 text-sm">
            {{ $t('luxeShop.marketingEmailsCheckbox') }}
          </div>
        </div>
        <div class="flex justify-center sm:justify-end col-span-2 sm:col-span-1">
          <button
            class="btn btn-primary capitalize"
            type="submit"
            :class="loading ? 'loading loading-spinner btn-disabled' : ''"
          >
            {{ props.createButtonText || $t('registration.createAccount') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
