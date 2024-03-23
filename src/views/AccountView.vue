<script setup lang="ts">
import AccountMenu from '@/components/account/AccountMenu.vue'
import ProfileView from '@/components/account/ProfileView.vue'
import AccountSettingsView from '@/components/account/AccountSettingsView.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FooterSection from '@/components/FooterSection.vue'

const route = useRoute()

const routeViews = [
  { routeName: 'accountProfile', accountComponent: ProfileView },
  { routeName: 'accountSettings', accountComponent: AccountSettingsView },
]

/**
 * Looks the path name as defined in /src/routes/index.ts
 * to determine which view and forms to load
 */
const componentToLoad = computed(() => {
  let result = ProfileView
  for (const routeView of routeViews) {
    if (route.name === routeView.routeName) {
      result = routeView.accountComponent
    }
  }
  return result
})
</script>
<template>
  <div class="bg-base-100 account flex flex-grow flex-col items-center">
    <div
      class="divide-y divide-base-200/50 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x max-w-screen-xl w-full flex-grow"
    >
      <AccountMenu />
      <div class="lg:col-span-9 pb-14 account-view">
        <component :is="componentToLoad" />
      </div>
    </div>
  </div>
  <footer-section />
</template>
