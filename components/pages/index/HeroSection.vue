// /components/pages/index/HeroSection.vue
<template>
  <div class="text-center">
    <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-gradient-end mb-4">
      {{ t('home.title') }}
    </h1>
    <p class="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
      {{ t('home.subtitle') }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
