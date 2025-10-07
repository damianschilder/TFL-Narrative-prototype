// https://nuxt.com/docs/api/configuration/nuxt-config
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

  modules: ['@nuxtjs/tailwindcss'],

  // Dit blok is toegevoegd
  app: {
    head: {
      link: [
        // De link voor de Google Material Symbols
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' 
        }
      ]
    }
  }
})