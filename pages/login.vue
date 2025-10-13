// /pages/login.vue
<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="w-full max-w-sm">
      <form @submit.prevent="handleLogin" class="card-glass p-8 space-y-6">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-foreground">{{ t('pages.login.title') }}</h1>
          <p class="text-muted-foreground text-sm mt-2">{{ t('pages.login.subtitle') }}</p>
        </div>
        
        <div>
          <label for="password" class="sr-only">{{ t('pages.login.form.passwordLabel') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            required
            class="w-full rounded-lg border bg-secondary/30 px-4 py-3 text-base text-foreground transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:border-primary"
            :class="{ 'border-destructive': error }"
            :placeholder="t('pages.login.form.passwordPlaceholder')"
          />
          <p v-if="error" class="mt-2 text-sm text-destructive">
            {{ error }}
          </p>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? t('pages.login.form.submitButtonLoading') : t('pages.login.form.submitButton') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logger } from '~/utils/logger'

definePageMeta({
  layout: 'auth',
})

const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)
const { fetch: refreshSession } = useUserSession()
const { t } = useI18n()

async function handleLogin() {
  const source = 'Page: /login'
  logger.info(source, 'handleLogin triggered.')
  isLoading.value = true
  error.value = null
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value },
    })
    logger.info(source, 'Login API call successful.')

    await refreshSession()
    logger.info(source, 'Client session refreshed.')

    await navigateTo('/')
  }
  catch (err) {
    logger.error(source, 'Caught error during login process:', err)
    error.value = t('errors.incorrectPassword')
  }
  finally {
    isLoading.value = false
    logger.info(source, 'handleLogin finished.')
  }
}
</script>