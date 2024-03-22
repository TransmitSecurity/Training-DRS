<script setup lang="ts">
import { userPreferenceStore } from '@/store/userPreferences'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const preferenceStore = userPreferenceStore()

function getLanguageName(lang: string) {
  const languageCode = lang.split('-')[0]
  const languageName = new Intl.DisplayNames([languageCode], { type: 'language' })
  return languageName.of(languageCode)
}

function selectLocale(lang: string) {
  console.log(`Changing locale from ${i18n.locale.value} to ${lang}`)
  i18n.locale.value = lang
  preferenceStore.setLanguage(lang)
}
</script>
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle">
      <span class="fi" :class="`fi-${$i18n.locale.split('-')[1].toLowerCase()}`"></span>
    </label>
    <ul
      tabindex="0"
      class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4 text-base-content"
    >
      <li
        v-for="(lang, i) in i18n.availableLocales"
        :key="`lang${i}`"
        :value="lang"
        @click="selectLocale(lang)"
      >
        <a
          ><span class="fi" :class="`fi-${lang.split('-')[1].toLowerCase()}`"></span>
          <span class="capitalize">{{ getLanguageName(lang) }}</span></a
        >
      </li>
    </ul>
  </div>
</template>
