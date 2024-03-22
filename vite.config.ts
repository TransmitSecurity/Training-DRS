import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'
import { visualizer } from 'rollup-plugin-visualizer'
import * as path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  console.log(`Using backend: ${process.env.VITE_BACKEND_URL}`)
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      Inspect({
        build: true,
        outputDir: '.vite-inspect',
      }),
      visualizer({
        gzipSize: true,
        brotliSize: true,
        open: false,
        template: 'sunburst',
        filename: '.rollup-inspect/index.html',
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-dark.svg'],
        manifest: {
          name: 'vite-template',
          short_name: 'vite-template',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          navigateFallback: '/',
          cleanupOutdatedCaches: true,
        },
        // client: {
        //   installPrompt: true,
        //   periodicSyncForUpdates: 20
        // },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      VueI18nPlugin({
        include: [path.resolve(__dirname, './src/locales/**')],
      }),
    ],
    server: {
      host: process.env.VITE_HOST ?? '0.0.0.0',
      port: parseInt(process.env.VITE_PORT ?? '4000'),
      proxy: {
        '/generic': {
          target: 'https://webinar.poc.transmit-field.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      extensions: [
        '.spec.ts',
        '.test.ts',
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.vue',
        '.scss',
      ],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
