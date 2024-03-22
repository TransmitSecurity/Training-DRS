import { createI18n } from 'vue-i18n'

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages'

/**
 * Internationalization capabilities
 * Go to /src/locales to edit or add your language
 */
const i18n = createI18n({
  locale: (navigator.languages && navigator.languages[0]) || navigator.language,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE || 'en-US',
  globalInjection: true,
  allowComposition: true,
  legacy: false,
  missingWarn: false,
  fallbackWarn: false,
  messages,
  // Currency options with https://tc39.es/ecma402/#numberformat-objects
  // See also https://vue-i18n.intlify.dev/guide/essentials/number.html
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
    'pt-PT': {
      currency: {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol',
      },
      decimal: {
        style: 'decimal',
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 5,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
    'ja-JP': {
      currency: {
        style: 'currency',
        currency: 'JPY',
        useGrouping: true,
        currencyDisplay: 'symbol',
      },
      decimal: {
        style: 'decimal',
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 5,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
  },
})

export default i18n
