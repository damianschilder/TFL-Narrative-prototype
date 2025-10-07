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

    <NuxtPage v-else />
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core'

// Define breakpoints
const breakpoints = useBreakpoints({
  // We consider anything under 1024px as a tablet or mobile device
  desktop: 1024,
})

// Create a reactive boolean that is true if the screen is smaller than the 'desktop' breakpoint
const isMobileOrTablet = breakpoints.smaller('desktop')
</script>

<style>
/* This ensures the global styles from previous steps are applied */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
:root {
  --background: 222 84% 4.9%; --foreground: 210 40% 98%; --card: 222 84% 4.9%;
  --card-foreground: 210 40% 98%; --popover: 222 84% 4.9%; --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%; --primary-foreground: 222.2 47.4% 11.2%; --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%; --muted: 217.2 32.6% 17.5%; --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%; --accent-foreground: 210 40% 98%; --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%; --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Inter', sans-serif;
}
</style>