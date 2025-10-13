<template>
  <div>
    <!-- Toegevoegd: Laadbalk voor paginanavigatie. De kleur wordt dynamisch aangepast aan je thema. -->
    <NuxtLoadingIndicator :color="'hsl(var(--primary))'" />

    <ClientOnly>
      <div v-if="isMobileOrTablet" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8 text-center">
        <span class="material-symbols-outlined text-primary text-6xl mb-4">
          laptop_chromebook
        </span>
        <h1 class="text-3xl font-bold text-foreground mb-2">{{ t('app.desktop_only_title') }}</h1>
        <p class="text-lg text-muted-foreground max-w-sm">
          {{ t('app.desktop_only_message') }}
        </p>
      </div>

      <NuxtLayout v-else>
        <NuxtPage />
      </NuxtLayout>

      <template #fallback>
        <div class="fixed inset-0 bg-background" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'

const { t } = useI18n()

const breakpoints = useBreakpoints({
  desktop: 1024,
})

const isMobileOrTablet = breakpoints.smaller('desktop')
</script>
