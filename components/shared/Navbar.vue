// /components/shared/Navbar.vue
<template>
  <header class="sticky top-0 z-40 w-full border-b border-border bg-background/60 backdrop-blur-lg">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-6">
        <NuxtLinkLocale to="/" class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
          <span class="material-symbols-outlined">home</span>
          {{ t('nav.start') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/progress" class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
          <span class="material-symbols-outlined">map</span>
          {{ t('nav.progress') }}
        </NuxtLinkLocale>
      </div>

      <div class="flex items-center gap-4">
        <ClientOnly>
          <SharedThemeSwitcher />
        </ClientOnly>
        <ClientOnly>
          <SharedLanguageSwitcher />
        </ClientOnly>

        <button
          v-if="loggedIn"
          :aria-label="t('nav.logout')"
          @click="handleLogout"
          class="inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        >
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { logger } from '~/utils/logger'

const { t } = useI18n()
const { loggedIn, clear: clearSession } = useUserSession()

async function handleLogout() {
  const source = 'Component: SharedNavbar'
  logger.info(source, 'Logout button clicked.')
  await clearSession()
  logger.info(source, 'Session cleared.')
  await navigateTo('/login')
}
</script>