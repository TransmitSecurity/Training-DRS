<script setup lang="ts">
import CartSideBar from '@/components/shop/CartSideBar.vue'
import { MagnifyingGlassIcon, UserIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { userSessionStore } from '@/store/userSession'
import { logout } from '@/helpers/session'
import LogoOnBase from '@/components/logo/LogoOnBase.vue'
import LogoOnPrimary from '@/components/logo/LogoOnPrimary.vue'
import { storeToRefs } from 'pinia'
import { cartStore } from '@/store/cart'

const userSession = userSessionStore()
const userSessionRefs = storeToRefs(userSession)
const cartSession = cartStore()
const cartRefs = storeToRefs(cartSession)
const { cart } = cartRefs
const toggleShowCart = cartSession.toggleShowCart
const { fullName } = userSessionRefs
</script>
<template>
  <div class="bg-base-100 shadow-sm z-10 text-base-content navbar px-4 sm:px-8 md:px-16">
    <div class="navbar-start">
      <div class="flex flex-row gap-8 items-center">
        <!-- Menu button -->
        <div class="flex flex-row gap-2 hover:cursor-pointer">
          <div class="col-span-1">
            <!-- Menu icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4h16M4 10h16M4 16h16"
              ></path>
            </svg>
          </div>
          <!-- Menu text -->
          <div class="lowercase first-letter:uppercase font-normal col-span-1">Menu</div>
        </div>
        <!-- Search input -->
        <div class="form-control">
          <div>
            <div class="relative w-full hidden lg:block">
              <div class="absolute inset-y-0 right-0 flex items-center px-2">
                <magnifying-glass-icon class="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search"
                class="input input-bordered border-primary-content input-md md:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Logo -->
    <div class="navbar-center">
      <router-link :to="{ name: 'home' }" class="normal-case text-xl">
        <logo-on-base />
      </router-link>
    </div>

    <!-- Fake buttons -->
    <div class="navbar-end">
      <div class="flex flex-row items-center gap-8">
        <!-- Login button or profile dropdown -->
        <div v-if="!userSession.isAuthenticated" class="pr-4">
          <router-link :to="{ name: 'login' }" class="flex flex-row gap-2 items-center text-sm"
            ><user-icon class="w-5 h-5" /><span class="hidden md:block">{{
              $t('menu.account')
            }}</span></router-link
          >
        </div>
        <div class="dropdown dropdown-end min-w-max" v-else>
          <label tabindex="0" class="flex text-sm gap-1 hover:cursor-pointer">
            <user-icon class="w-5 h-5" /><span class="hidden md:block">{{
              $t('menu.account')
            }}</span>
          </label>
          <ul
            tabindex="0"
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box"
          >
            <li class="py-2 px-4 text-ellipsis text-primary-focus">
              {{ fullName }}
            </li>
            <hr class="mb-4" />
            <li>
              <router-link :to="{ name: 'accountProfile' }" class="justify-between pr-24">
                {{ $t('menu.profile') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'orders' }">{{ $t('shop.orders') }}</router-link>
            </li>
            <li>
              <a @click="logout">{{ $t('authentication.logout') }}</a>
            </li>
          </ul>
        </div>
        <button class="flex flex-row items-center gap-1" @click="toggleShowCart">
          <div class="indicator">
            <shopping-bag-icon class="h-5 w-5" />
            <span
              v-if="cart.quantity > 0"
              class="badge badge-xs badge-accent indicator-item indicator-start"
            ></span>
          </div>
          <span class="text-sm hidden md:block">{{ $t('shop.cart') }}</span>
        </button>
      </div>
    </div>
  </div>
  <CartSideBar :show="cartSession.showCart" @toggleShow="toggleShowCart" />
</template>
