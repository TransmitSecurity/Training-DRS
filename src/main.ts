import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createThemeManager } from './plugins/themeManager'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import axios from 'axios'
import CountryFlag from 'vue-country-flag-next'
import i18n from '@/helpers/i18n'

import 'vue-toastification/dist/index.css'
import './assets/style.css'
import '/node_modules/flag-icons/css/flag-icons.min.css'

axios.defaults.withCredentials = true

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(createThemeManager({ light: 'breeze', dark: 'storm', watchSystemTheme: true }))
  .use(i18n)
  .use(Toast)
  .component('country-flag', CountryFlag)

app.mount('#app')
