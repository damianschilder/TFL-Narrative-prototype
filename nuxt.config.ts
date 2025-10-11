// /nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare-pages'
  },

  runtimeConfig: {
    // This password is only available on the server
    appPassword: process.env.APP_PASSWORD,
    // Session configuration for nuxt-security
    session: {
      name: '__session',
      password: process.env.SESSION_SECRET,
      // Use JSON Web Tokens for sessions
      jwt: true
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      modelName: process.env.GEMINI_MODEL
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-security'
  ],

  security: {
    // The `sessions` block has been removed from here and merged into runtimeConfig
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'upgrade-insecure-requests': true
      }
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
    },
    rateLimiter: {
      tokensPerInterval: 30,
      interval: 'minute',
      driver: { name: 'memory' }
    },
    xssValidator: {},
    corsHandler: {
      origin: process.env.NUXT_PUBLIC_SITE_URL,
      methods: ['GET', 'POST'],
      allowHeaders: ['Authorization', 'Content-Type']
    },
  },

  i18n: {
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      { code: 'nl', name: 'Nederlands', file: 'nl.json' },
      { code: 'en', name: 'English', file: 'en.json' }
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