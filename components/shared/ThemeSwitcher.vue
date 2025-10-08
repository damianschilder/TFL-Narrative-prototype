// /components/ThemeSwitcher.vue
<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    aria-label="Toggle theme"
  >
    <transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="opacity-0 rotate-90 scale-50"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-50"
    >
      <span
        v-if="mode === 'light'"
        key="sun"
        class="material-symbols-outlined absolute text-secondary-foreground"
      >
        light_mode
      </span>
      <span
        v-else
        key="moon"
        class="material-symbols-outlined absolute text-secondary-foreground"
      >
        dark_mode
      </span>
    </transition>
  </button>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

const { mode, toggleTheme } = useTheme()
</script>
