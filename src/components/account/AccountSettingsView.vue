<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import { ref } from 'vue'
import { userSessionStore } from '@/store/userSession'
import { UserApi } from '@transmitsecurity-dev/ts-demo-client-lib'

import { storeToRefs } from 'pinia'
import ConfirmationDialog from './ConfirmationDialog.vue'
import router from '@/router'
import { clearSession } from '@/helpers/session'
import { handleError } from '@/helpers/errors'

const userApi = new UserApi(undefined, import.meta.env.VITE_BACKEND_URL)

const sessionStore = userSessionStore()
const sessionStoreRefs = storeToRefs(sessionStore)

// Personal information
const { creationDate, firstName } = sessionStoreRefs
const showConfirmationDialog = ref(false)
const loading = ref(false)
async function deleteAccount() {
  try {
    console.log('Deleting account')
    loading.value = true
    const result = await userApi.remove()
    loading.value = false
    console.log(result)
    showConfirmationDialog.value = false
    if (result.status == 204) {
      clearSession()
      const event = new CustomEvent('userLoggedOut')
      document.dispatchEvent(event)
      router.push({ name: 'home' })
    }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="divide-y divide-base-200/50">
    <ConfirmationDialog
      :is-open="showConfirmationDialog"
      @cancel="showConfirmationDialog = false"
      @confirm="deleteAccount"
    >
      {{ $t('account.deletionConfirmationMessage') }}
    </ConfirmationDialog>
    <div class="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 class="text-lg leading-6 font-medium text-base-content">
          {{ $t('account.yourAccount') }}
        </h2>
        <p class="mt-1 text-sm text-base-content/60">{{ $t('account.reviewYourSettings') }}</p>
      </div>

      <div class="mt-8">
        Hi {{ firstName }}, you have been with us since {{ creationDate.toDateString() }}!
      </div>
    </div>

    <div class="py-6 divide-y divide-base-200/50 gap-y-8">
      <div class="px-4 sm:px-6">
        <div>
          <h2 class="text-lg leading-6 font-medium text-base-content">
            {{ $t('account.deleteYourAccount') }}
          </h2>
          <p class="mt-1 text-sm text-base-content/60">
            {{ $t('account.permanentlyDeleteYourAccount') }}
          </p>
        </div>

        <div class="flex justify-end mt-12">
          <button class="btn btn-error btn-sm" @click="showConfirmationDialog = true">
            {{ $t('account.deleteYourAccount') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
