// /components/shared/LanguageSwitcher.vue
<template>
  <div class="flex items-center">
    <NuxtLink
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)"
      class="px-2 py-1 text-sm font-bold uppercase"
      :class="[
        locale.code === currentLocale ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      ]"
    >
      {{ locale.code }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { useI18n, useSwitchLocalePath } from '#imports'

const { locale: currentLocale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = locales.value.filter(i => i.code !== currentLocale.value)
</script>