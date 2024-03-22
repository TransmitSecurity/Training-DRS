<script setup lang="ts">
import GenericLayout from '@/views/generic/GenericLayout.vue'
import FooterSection from '@/components/FooterSection.vue'
import { userSessionStore } from '@/store/userSession'
import { onMounted } from 'vue'
import { continueIdoJourney } from '@/helpers/ido'

const userSession = userSessionStore()

onMounted(async () => {
  if (userSession.tsPlatformLoaded) {
    startSignup()
  } else {
    // The ts platform SDK is not loaded yet, we need to wait
    // for it to be loaded and then initialize the IDO journey
    document.addEventListener('tsPlatformLoaded', function (e) {
      startSignup()
    })
  }
})

async function startSignup() {
  console.log('Starting IDO journey')
  // eslint-disable-next-line no-undef
  const idoResponse: IdoServiceResponse = await window.tsPlatform.ido.startJourney(
    'country_signup',
    {
      flowId: 'random',
    },
  )
  userSession.idoResponse = idoResponse
  console.log(idoResponse)
  // Redirect the user to the right form
  continueIdoJourney(idoResponse)
}
</script>
<template>
  <generic-layout
    :title="$t('registration.createYourAccount')"
    show-alternative-option
    :option-description="$t('authentication.alreadyHaveAccount')"
    :option-link="$t('authentication.login')"
    option-route="login"
  >
    <!-- Nothing displayed while we identify which form should be displayed with IDO -->
  </generic-layout>
  <footer-section />
</template>
