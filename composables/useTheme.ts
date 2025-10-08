// /composables/useTheme.ts
import { useColorMode } from '@vueuse/core'

export const useTheme = () => {
  const mode = useColorMode({
    selector: 'html',
    attribute: 'class',
    modes: {
      light: 'light',
      dark: 'dark',
    },
  })

  const toggleTheme = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    mode,
    toggleTheme,
  }
}
