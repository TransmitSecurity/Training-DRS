<script setup lang="ts">
/**
 * Display a message to the user
 */
import { onBeforeMount, ref } from 'vue'
import { userSessionStore } from '@/store/userSession'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { continueIdoJourney } from '@/helpers/ido'

const loading = ref(false)
const { t } = useI18n()
const toast = useToast()
const props = defineProps<{ submitText?: string }>()
const userSession = userSessionStore()
const message = ref('')

onBeforeMount(() => {
  try {
    const json = JSON.parse(userSession.idoResponse.data.text)
    message.value = json
  } catch (error) {
    message.value = userSession.idoResponse.data.text
  }
})

async function idoContinue() {
  try {
    loading.value = true
    const idoResponse = await window.tsPlatform.ido.submitClientResponse('client_input', {})
    console.log(idoResponse)
    // Continue the journey to the next form
    continueIdoJourney(idoResponse)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="idoContinue" class="flex flex-col gap-y-4 w-full" novalidate>
    <h2>{{ userSession.idoResponse.data.title }}</h2>
    <pre
      >{{ message }}
    </pre>
    <button
      type="submit"
      class="btn btn-block btn-primary"
      :class="loading ? 'loading loading-spinner btn-disabled' : ''"
    >
      {{ $t('global.continue') }}
    </button>
  </form>
</template>
