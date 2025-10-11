// /stores/ui.ts
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

export const useUIStore = defineStore('ui', {
  state: () => ({
    theme: 'dark' as Theme,
  }),
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
    },
  },
})