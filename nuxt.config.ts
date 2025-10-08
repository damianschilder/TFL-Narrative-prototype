// /nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare-pages'
  },

  runtimeConfig: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      modelName: process.env.GEMINI_MODEL
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  i18n: {
    strategy: 'prefix_except_default',
    langDir: 'locales', // This now works because the folder is inside /i18n/
    locales: [
      {
        code: 'nl',
        name: 'Nederlands',
        file: 'nl.json' // Use simple filename
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json' // Use simple filename
      }
    ],
    defaultLocale: 'en',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' 
        }
      ]
    }
  }
})