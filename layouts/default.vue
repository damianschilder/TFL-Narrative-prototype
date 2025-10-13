// /layouts/default.vue
<template>
  <div>
    <div v-if="!isInitialized" class="flex min-h-screen w-full items-center justify-center bg-background">
      <p class="text-muted-foreground">{{ t('status.loadingApp') }}</p>
    </div>
    
    <div v-else class="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display text-foreground">
      <div aria-hidden="true" class="absolute left-0 top-0 h-[50rem] w-[50rem] -translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-start/30 blur-[15rem]"></div>
      <div aria-hidden="true" class="absolute bottom-0 right-0 h-[50rem] w-[50rem] translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-end/30 blur-[15rem]"></div>

      <SharedNavbar />
      
      <main class="relative z-10 flex-grow pt-16">
        <slot />
      </main>

      <SharedDebugInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import { useColorMode } from '@vueuse/core'
import { watch } from 'vue'
import { useAuthInitialized } from '~/composables/useAuthInitialized'

const { t } = useI18n()
const isInitialized = useAuthInitialized()
const uiStore = useUIStore()

const mode = useColorMode({
  selector: 'html',
  attribute: 'class',
  modes: {
    light: 'light',
    dark: 'dark',
  },
})

watch(() => uiStore.theme, (newTheme) => {
  mode.value = newTheme
}, { immediate: true })
</script>