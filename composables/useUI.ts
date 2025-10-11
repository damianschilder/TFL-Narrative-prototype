// /composables/useUI.ts
import { computed } from 'vue'
import { useUIStore } from '~/stores/ui'

export const useUI = () => {
  const store = useUIStore()

  const theme = computed(() => store.theme)

  const toggleTheme = () => {
    store.toggleTheme()
  }

  return {
    theme,
    toggleTheme,
  }
}