<script setup lang="ts">
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import UserInput from '@/components/inputs/UserInput.vue'
import {
  cityRule,
  countryRule,
  emailRule,
  firstNameRule,
  lastNameRule,
  phoneRule,
  streetRule,
  zipCodeRule,
} from '@/helpers/validationRules'
import { useRoute, useRouter } from 'vue-router'
import { userSessionStore } from '@/store/userSession'
import '@vuepic/vue-datepicker/dist/main.css'
import CheckoutSteps from '@/components/shop/checkout/CheckoutSteps.vue'
import CheckoutInput from '@/components/shop/checkout/CheckoutInput.vue'
import CartSummary from '@/components/shop/checkout/CartSummary.vue'
import { cartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userSession = userSessionStore()
const cartSession = cartStore()
const cartRefs = storeToRefs(cartSession)
const { cart } = cartRefs

async function checkout() {
  router.push({ name: 'checkoutConfirmation' })
}

// Personal information
const email = ref(userSession.email)
const firstName = ref(userSession.firstName)
const lastName = ref(userSession.lastName)
const phone = ref(userSession.phone)

// Postal address
const street = ref(userSession.address.street_address || '')
const city = ref(userSession.address.city || '')
const postalCode = ref(userSession.address.postal_code || '')
const country = ref(userSession.address.country || '')

// Validations

// Personal information validation
const personalInfoValidationRules = {
  email: emailRule(),
  firstName: firstNameRule(),
  lastName: lastNameRule(),
  phone: phoneRule(),
}
const vPersonalInfo$ = useVuelidate(personalInfoValidationRules, {
  email,
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
</script>
<template>
  <div class="flex flex-col bg-base-200 checkout-view min-h-screen">
    <!-- <generic-login-view /> -->

    <div class="lg:max-w-6xl self-center w-full mb-12">
      <!-- Steps -->
      <checkout-steps
        class="mt-8 mb-8"
        :current-step="2"
        :steps="[$t('shop.cart'), $t('shop.deliveryAndPayment'), $t('global.confirmation')]"
      />
      <div class="collapse collapse-arrow mt-4 bg-base-100 shop-card rounded-box">
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium flex">
          {{ $t('shop.orderSummary') }}
          <div class="ml-6">{{ $n(cart.price, 'currency') }}</div>
        </div>
        <CartSummary :cart="cart" class="collapse-content" />
      </div>

      <div class="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-0 mt-4">
        <div class="flex flex-col bg-base-100 shop-card rounded-box p-6">
          <h2 class="text-lg font-semibold">{{ $t('registration.billingInformation') }}</h2>
          <div class="flex flex-col gap-y-6">
            <checkout-input
              :label="$t('userData.firstName')"
              v-model="firstName"
              :validation="vPersonalInfo$.firstName"
              input-type="text"
              :placeholder="$t('userData.firstName')"
              :display-input="false"
            />
            <checkout-input
              :label="$t('userData.lastName')"
              v-model="lastName"
              :validation="vPersonalInfo$.lastName"
              input-type="text"
              :placeholder="$t('userData.lastName')"
              :display-input="false"
            />
            <checkout-input
              :label="$t('userData.email')"
              v-model="email"
              :validation="vPersonalInfo$.email"
              input-type="text"
              :placeholder="$t('userData.email')"
              :display-input="false"
            />
            <checkout-input
              :label="$t('userData.phone')"
              v-model="phone"
              :validation="vPersonalInfo$.phone"
              input-type="text"
              :placeholder="$t('userData.phone')"
              :display-input="false"
            />
          </div>
        </div>

        <div class="flex flex-col bg-base-100 shop-card rounded-box p-6">
          <h2 class="text-lg font-semibold">{{ $t('userData.deliveryAddress') }}</h2>
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
      </div>

      <div class="bg-base-100 flex justify-center px-4 py-4 shop-card rounded-box mt-4">
        <button class="btn btn-primary px-20" @click="checkout">
          {{ $t('shop.confirmAndPay') }}
        </button>
      </div>
    </div>
  </div>
</template>
