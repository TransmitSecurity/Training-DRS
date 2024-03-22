<script setup lang="ts">
import { MagnifyingGlassIcon, BellIcon, ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/outline'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { userSessionStore } from '@/store/userSession'
import { logout } from '@/helpers/session'
import LocaleSwitcher from '@/components/language/LocaleSwitcher.vue'
import LogoOnPrimary from '@/components/logo/LogoOnPrimary.vue'
import { storeToRefs } from 'pinia'

const userSession = userSessionStore()
const userSessionRefs = storeToRefs(userSession)
const { fullName } = userSessionRefs
</script>
<template>
  <div class="navbar bg-primary-focus text-primary-content">
    <!-- Logo -->
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost normal-case text-xl">
        <logo-on-primary />
      </router-link>
    </div>

    <!-- Fake buttons -->
    <div class="flex-none gap-2">
      <div class="flex">
        <button class="btn btn-ghost btn-circle">
          <magnifying-glass-icon class="h-5 w-5" />
        </button>

        <button class="btn btn-ghost btn-circle">
          <div class="indicator">
            <bell-icon class="h-5 w-5 text-primary-content" />
            <span class="badge badge-xs badge-accent indicator-item"></span>
          </div>
        </button>
      </div>

      <!-- Language selection -->
      <locale-switcher />

      <!-- Login button or profile dropdown -->
      <div v-if="!userSession.isAuthenticated" class="pr-4">
        <router-link :to="{ name: 'login' }">{{ $t('authentication.login') }}</router-link>
      </div>
      <div class="dropdown dropdown-end min-w-max" v-else>
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <user-circle-icon class="w-8 h-8" />
        </label>
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box"
        >
          <li class="py-2 px-4 text-ellipsis text-primary-focus">
            {{ fullName }}
          </li>
          <li>
            <router-link :to="{ name: 'accountProfile' }" class="justify-between pr-24">
              {{ $t('menu.profile') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'accountSecurity' }">{{ $t('menu.security') }}</router-link>
          </li>
          <li>
            <a @click="logout"
              ><arrow-left-on-rectangle-icon class="w-4 h-4" />
              <span>{{ $t('authentication.logout') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
