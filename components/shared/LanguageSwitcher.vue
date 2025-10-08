// /components/LanguageSwitcher.vue
<template>
  <div class="flex items-center gap-2">
    <span class="material-symbols-outlined text-muted-foreground">
      language
    </span>
    <NuxtLink
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)"
      class="font-semibold text-muted-foreground hover:text-primary transition-colors"
    >
      {{ locale.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>