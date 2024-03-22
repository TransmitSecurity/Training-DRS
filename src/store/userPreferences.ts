import { defineStore } from 'pinia'

export const userPreferenceStore = defineStore('preferences', {
  state: () => ({
    language: '',
    theme: '',
    suggestWebauthn: true,
  }),
  actions: {
    async setLanguage(locale: string) {
      this.language = locale
    },
    async setTheme(theme: string) {
      this.theme = theme
    },
    async setSuggestWebauthn(value: boolean) {
      this.suggestWebauthn = value
    },
  },
  // Preferences are persisted in the local storage
  persist: true,
})
