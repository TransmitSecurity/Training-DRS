<script setup lang="ts">
/**
 * This component suggests registering webauthn credentials
 * for an authenticated user. We assume that the webauthn compatibility
 * was checked before bringing the user to this page
 */
import BiometricIcon from '@/components/icons/BiometricIcon.vue'
import { onBeforeMount, ref } from 'vue'

import { userSessionStore } from '@/store/userSession'
import { RegistrationApi } from '@transmitsecurity-dev/ts-demo-client-lib'
import { userPreferenceStore } from '@/store/userPreferences'
import { handleError } from '@/helpers/errors'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { Action, reportAction } from '@/helpers/risk'
import FooterSection from '@/components/FooterSection.vue'
const props = withDefaults(
  defineProps<{
    redirectRouteName?: string
  }>(),
  { redirectRouteName: 'home' },
)

const loading = ref(true)

const route = useRoute()
const router = useRouter()
const userSession = userSessionStore()
const preference = userPreferenceStore()
const toast = useToast()
const registerApi = new RegistrationApi(undefined, import.meta.env.VITE_BACKEND_URL)
const redirectRoute = ref((route.query.redirect as string) || props.redirectRouteName)

onBeforeMount(async () => {
  try {
    console.log('Verifying if webauthn is supported')
    window.tsPlatform.webauthn.isPlatformAuthenticatorSupported().then((supported: boolean) => {
      userSession.setWebAuthnSupported(supported)
      console.log(`Webauthn is ${supported ? '' : 'not'} supported`)
      if (!supported) {
        router.push({ name: redirectRoute.value })
      }
    })
  } catch (error) {
    handleError(error)
  }
})

async function registerWebauthn() {
  try {
    const webauthnEncodedResult = await window.tsPlatform.webauthn.register(userSession.email)
    reportAction(Action.REGISTER)
    const response = await registerApi.registerWebauthn({
      webauthnEncodedResult,
    })
    loading.value = false
    console.log(response)
    if (response.status == 200) {
      router.push({
        name: 'webauthnRegistrationSuccess',
        query: { redirect: redirectRoute.value },
      })
    } else {
      toast.error(response.statusText)
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

function skip() {
  router.push({ name: 'home' })
}

function doNotSuggestWebauthn() {
  preference.setSuggestWebauthn(false)
}
</script>

<template>
  <div class="flex flex-grow flex-col px-6 py-12 lg:px-8 bg-base-100 signup-view">
    <div class="container max-w-2xl self-center">
      <!-- Header-->
      <div class="mb-3 flex flex-col items-center justify-center space-x-3">
        <BiometricIcon />
        <p class="text-xl md:text-4xl font-semibold">
          {{ $t('webauthn.registration.tiredOfPasswords') }}
        </p>
      </div>
      <!-- Registration choice -->
      <div class="space-y-8 flex flex-col">
        <div class="text-center">
          {{ $t('webauthn.registration.weDetectedCompatibility') }}<br />
          {{ $t('webauthn.registration.dependingOnYourDevice') }}
        </div>
        <!-- later or enable -->
        <div class="flex justify-center">
          <div class="flex-grow flex flex-col gap-y-4 max-w-sm">
            <button @click="skip" class="btn btn-ghost w-full py-3">
              {{ $t('webauthn.registration.later') }}
            </button>
            <button @click="registerWebauthn" class="btn btn-primary w-full py-3">
              {{ $t('webauthn.registration.enable') }}
            </button>
          </div>
        </div>
        <!-- always skip -->
        <div class="flex justify-center">
          <button @click="doNotSuggestWebauthn" class="btn btn-ghost btn-xs">
            {{ $t('webauthn.registration.dontAskAgain') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <footer-section />
</template>
