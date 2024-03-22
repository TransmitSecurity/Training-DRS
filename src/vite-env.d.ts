/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
interface ImportMetaEnv {
  readonly VITE_HOST: string
  readonly VITE_PORT: string
  readonly VITE_PLATFORM_SDK_URL: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_TS_SERVER_PATH: string
  readonly VITE_TS_REDIRECT_URL: string
  readonly VITE_TS_IDO_SERVER_PATH: string
  readonly VITE_TS_IDO_APP_ID: string
  readonly VITE_FALLBACK_LOCALE: string
  readonly VITE_THEME: string
  readonly VITE_DEMO_PHONE: string
  readonly VITE_DEMO_FIRST_NAME: string
  readonly VITE_DEMO_LAST_NAME: string
  readonly VITE_DEMO_STREET: string
  readonly VITE_DEMO_CITY: string
  readonly VITE_DEMO_COUNTRY: string
  readonly VITE_DEMO_POSTAL_CODE: string
  readonly VITE_DEMO_PASSWORD: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
