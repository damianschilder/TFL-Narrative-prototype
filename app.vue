// /app.vue
<template>
  <div>
    <div v-if="isMobileOrTablet" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8 text-center">
      <span class="material-symbols-outlined text-primary text-6xl mb-4">
        laptop_chromebook
      </span>
      <h1 class="text-3xl font-bold text-foreground mb-2">Desktop Ervaring</h1>
      <p class="text-lg text-muted-foreground max-w-sm">
        Deze applicatie is momenteel geoptimaliseerd voor een desktop-ervaring. Open deze pagina op een groter scherm.
      </p>
    </div>

    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
    
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  desktop: 1024,
})

const isMobileOrTablet = breakpoints.smaller('desktop')
</script>