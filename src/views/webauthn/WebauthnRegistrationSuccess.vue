<script setup lang="ts">
/**
 * This component informs the user that the
 * webauthn registration was successful
 */
import BiometricIcon from '@/components/icons/BiometricIcon.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import FooterSection from '@/components/FooterSection.vue'

const props = withDefaults(
  defineProps<{
    /**
     * Name of the route where the user
     * is taken when clicking "Continue"
     */
    redirectRouteName?: string
  }>(),
  // Default values
  { redirectRouteName: 'home' },
)

const route = useRoute()
const redirectRoute = ref((route.query.redirect as string) || props.redirectRouteName)
</script>

<template>
  <div class="flex flex-col flex-grow px-6 py-12 lg:px-8 bg-base-100 signup-view">
    <!-- Header-->
    <div class="mb-3 flex flex-col items-center justify-center space-x-3">
      <BiometricIcon />
      <p class="text-xl md:text-4xl font-semibold">
        {{ $t('webauthn.registration.successful') }}
      </p>
    </div>
    <!-- Registration choice -->
    <div class="space-y-8 flex flex-col">
      <div class="text-center">
        {{ $t('webauthn.registration.youCanNowLoginWithYourDevice') }}<br />
        {{ $t('webauthn.registration.thisMethodIsSimplerAndMoreSecure') }}
      </div>
      <!-- continue -->
      <div class="flex justify-center">
        <div class="flex-grow flex flex-col gap-y-4 max-w-sm">
          <router-link :to="{ name: redirectRoute }" class="btn btn-primary w-full py-3">
            {{ $t('global.continue') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <footer-section />
</template>
