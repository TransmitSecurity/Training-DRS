<script setup lang="ts">
import UserInput from '../inputs/UserInput.vue'
import VerifiableInformation from './VerifiableInformation.vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import {
  firstNameRule,
  lastNameRule,
  cityRule,
  streetRule,
  countryRule,
  zipCodeRule,
} from '@/helpers/validationRules'
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'

const toast = useToast()

const sessionStore = userSessionStore()

// Loading indicators
const updatePersonalInformationLoading = ref(false)
const updateAddressLoading = ref(false)

// Personal information
const firstName = ref(sessionStore.firstName)
const lastName = ref(sessionStore.lastName)
const birthday = ref(sessionStore.birthday)

// Contact information
const email = ref(sessionStore.email)
const phone = ref(sessionStore.phone)
const emailVerified = ref(sessionStore.emailVerified)
const phoneVerified = ref(sessionStore.phoneVerified)

// Postal address
const address = sessionStore.address
const street = ref(address.street_address || '')
const city = ref(address.city || '')
const postalCode = ref(address.postal_code || '')
const country = ref(address.country || '')

const personalInfoValidationRules = {
  firstName: firstNameRule(),
  lastName: lastNameRule(),
}

const postalAddressValidationRules = {
  street: streetRule(),
  city: cityRule(),
  postalCode: zipCodeRule(),
  country: countryRule(),
}

const vPersonalInfo$ = useVuelidate(personalInfoValidationRules, {
  firstName,
  lastName,
})

const vPostalAddress$ = useVuelidate(postalAddressValidationRules, {
  street,
  city,
  postalCode,
  country,
})

/**
 * Update the user first name, last name and birthday
 */
async function updatePersonalInformation() {
  const formattedDate = birthday.value ? birthday.value.toJSON() : null
  const isFormCorrect = await vPersonalInfo$.value.$validate()
  if (isFormCorrect) {
    updatePersonalInformationLoading.value = true
    try {
      const success = await sessionStore.setPersonalInfo(
        firstName.value,
        lastName.value,
        formattedDate,
      )
      if (success) toast.success('Information updated')
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      updatePersonalInformationLoading.value = false
    }
  } else {
    toast.error('Form is invalid')
  }
}

/**
 * Update the user's postal address
 */
async function updatePostalAddress() {
  const isFormCorrect = await vPostalAddress$.value.$validate()
  if (isFormCorrect) {
    try {
      updateAddressLoading.value = true
      const success = await sessionStore.setAddress(
        street.value,
        city.value,
        postalCode.value,
        country.value,
      )
      if (success) toast.success('Information updated')
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      updateAddressLoading.value = false
    }
  } else {
    toast.error('Form is invalid')
  }
}
</script>
<template>
  <div class="divide-y divide-base-200/50">
    <div class="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 class="text-lg leading-6 font-medium text-base-content">
          {{ $t('menu.profile') }}
        </h2>
        <p class="mt-1 text-sm text-base-content/60">
          {{ $t('account.profile.manageYourInformation') }}
        </p>
      </div>

      <form class="mt-6 grid grid-cols-12 gap-6" @submit.prevent="updatePersonalInformation">
        <div class="col-span-12 sm:col-span-6">
          <user-input
            :label="$t('userData.firstName')"
            v-model="firstName"
            :validation="vPersonalInfo$.firstName"
            input-type="text"
            :placeholder="$t('userData.firstName')"
          />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <user-input
            :label="$t('userData.lastName')"
            v-model="lastName"
            :validation="vPersonalInfo$.lastName"
            input-type="text"
            :placeholder="$t('userData.lastName')"
          />
        </div>

        <div class="col-span-12 md:col-span-6">
          <label for="birthday" class="label label-text">{{ $t('userData.birthday') }}</label>
          <Datepicker
            :enable-time-picker="false"
            format="dd/MM/yyyy"
            v-model="birthday"
            input-class-name="input input-bordered w-full"
          />
        </div>

        <div class="col-span-12 flex justify-end">
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            :class="updatePersonalInformationLoading ? 'loading loading-spinner btn-disabled' : ''"
          >
            {{ $t('account.profile.updatePersonalInformation') }}
          </button>
        </div>
      </form>
    </div>

    <div class="py-6 divide-y divide-base-200/50 gap-y-8">
      <div class="px-4 sm:px-6">
        <div>
          <h2 class="text-lg leading-6 font-medium text-base-content">
            {{ $t('account.profile.contact') }}
          </h2>
          <p class="mt-1 text-sm text-base-content/60">
            {{ $t('account.profile.yourContactInformation') }}
          </p>
        </div>

        <div class="my-6 grid grid-cols-12 gap-6">
          <div class="col-span-12">
            <verifiable-information
              :label="$t('userData.email')"
              :data="email"
              :verified="emailVerified"
              verify-route-name="accountProfile"
            />
          </div>

          <div class="col-span-12">
            <verifiable-information
              :label="$t('userData.phone')"
              :data="phone"
              :verified="phoneVerified"
              verify-route-name="accountProfile"
            />
          </div>
        </div>

        <router-link :to="{ name: 'accountProfile' }" class="link link-hover link-primary">{{
          $t('account.profile.editYourContactInformation')
        }}</router-link>
      </div>
    </div>

    <div class="py-6 divide-y divide-base-200/50">
      <form class="px-4 sm:px-6" @submit.prevent="updatePostalAddress">
        <div>
          <h2 class="text-lg leading-6 font-medium text-base-content">
            {{ $t('userData.deliveryAddress') }}
          </h2>
          <p class="mt-1 text-sm text-base-content/60">
            {{ $t('account.profile.yourPostalAddress') }}
          </p>
        </div>

        <div class="mt-6 grid grid-cols-12 gap-6">
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
        </div>

        <div class="flex justify-end">
          <button
            class="btn btn-primary btn-sm"
            type="submit"
            :class="updateAddressLoading ? 'loading loading-spinner btn-disabled' : ''"
          >
            {{ $t('account.profile.updateHomeAddress') }}
          </button>
        </div>
      </form>
    </div>

    <div class="pt-6 divide-y divide-base-200/50">
      <div class="px-4 sm:px-6">
        <div>
          <h2 class="text-lg leading-6 font-medium text-base-content">
            {{ $t('account.profile.privacy') }}
          </h2>
          <p class="mt-1 text-sm text-base-content/60">
            {{ $t('account.profile.managePrivacySettings') }}
          </p>
        </div>
        <ul role="list" class="mt-2 divide-y divide-base-200/40">
          <li class="py-4 flex items-center justify-between">
            <div class="flex flex-col">
              <p class="text-sm font-medium text-base-content" id="privacy-option-1-label">
                Available to hire
              </p>
              <p class="text-sm text-base-content/60" id="privacy-option-1-description">
                Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
              </p>
            </div>

            <input type="checkbox" class="toggle toggle-primary" />
          </li>
          <li class="py-4 flex items-center justify-between">
            <div class="flex flex-col">
              <p class="text-sm font-medium text-base-content" id="privacy-option-2-label">
                Make account private
              </p>
              <p class="text-sm text-base-content/60" id="privacy-option-2-description">
                Pharetra morbi dui mi mattis tellus sollicitudin cursus pharetra.
              </p>
            </div>

            <input type="checkbox" class="toggle toggle-primary" />
          </li>
          <li class="py-4 flex items-center justify-between">
            <div class="flex flex-col">
              <p class="text-sm font-medium text-base-content" id="privacy-option-3-label">
                Allow commenting
              </p>
              <p class="text-sm text-base-content/60" id="privacy-option-3-description">
                Integer amet, nunc hendrerit adipiscing nam. Elementum ame
              </p>
            </div>

            <input type="checkbox" class="toggle toggle-primary" checked />
          </li>
          <li class="py-4 flex items-center justify-between">
            <div class="flex flex-col">
              <p class="text-sm font-medium text-base-content" id="privacy-option-4-label">
                Allow mentions
              </p>
              <p class="text-sm text-base-content/60" id="privacy-option-4-description">
                Adipiscing est venenatis enim molestie commodo eu gravid
              </p>
            </div>

            <input type="checkbox" class="toggle toggle-primary" checked />
          </li>
        </ul>
      </div>
      <div class="mt-4 py-4 px-4 flex justify-end sm:px-6">
        <button type="button" class="btn btn-outline btn-sm">{{ $t('global.cancel') }}</button>
        <button type="submit" class="btn btn-primary ml-5 btn-sm">{{ $t('global.save') }}</button>
      </div>
    </div>
  </div>
</template>
