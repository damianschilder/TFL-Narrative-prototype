// /components/shared/ThemeSwitcher.vue
<template>
  <button @click="toggleTheme" class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary">
    <span v-if="theme === 'dark'" class="material-symbols-outlined">dark_mode</span>
    <span v-else class="material-symbols-outlined">light_mode</span>
  </button>
</template>

<script setup>
import { useUI } from '~/composables/useUI'

const { theme, toggleTheme } = useUI()
</script>