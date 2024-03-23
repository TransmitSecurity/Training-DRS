<script setup lang="ts">
/**
 * Menu displayed when the user accesses
 * their account profile and security settings
 *
 * Lists the different sub menus the user can access
 */
import { UserCircleIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline'

import AccountMenuButton from '@/components/account/AccountMenuButton.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const route = useRoute()
const menuRoutes = ref([
  { title: t('menu.profile'), icon: UserCircleIcon, routeName: 'accountProfile' },
  { title: t('menu.account'), icon: Cog8ToothIcon, routeName: 'accountSettings' },
])

function accountRouteSelected(routeName: string) {
  return route.name === routeName
}
</script>
<template>
  <div class="pb-6 lg:col-span-3 flex flex-col bg-base-100 account-menu">
    <template v-for="accountRoute in menuRoutes" :key="accountRoute.routeName">
      <AccountMenuButton
        :selected="accountRouteSelected(accountRoute.routeName)"
        :title="accountRoute.title"
        :icon="accountRoute.icon"
        :routeName="accountRoute.routeName"
      />
    </template>
  </div>
</template>
