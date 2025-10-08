// /components/shared/Navbar.vue
<template>
  <header class="sticky top-0 z-40 w-full border-b border-border bg-background/60 backdrop-blur-lg">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-6">
        <NuxtLink :to="localePath('index')" class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
          <span class="material-symbols-outlined">home</span>
          {{ t('nav.start') }}
        </NuxtLink>
        <NuxtLink :to="localePath('progress')" class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
          <span class="material-symbols-outlined">map</span>
          {{ t('nav.progress') }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <ClientOnly>
          <SharedThemeSwitcher />
        </ClientOnly>
        <ClientOnly>
          <SharedLanguageSwitcher />
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup>
const { t } = useI18n();
const localePath = useLocalePath();
</script>