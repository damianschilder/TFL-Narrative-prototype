// /components/pages/progress/NoTopicMessage.vue
<template>
  <div class="text-center card-glass p-8">
    <p class="text-xl text-muted-foreground">{{ t('progress.no_topic') }}</p>
    <NuxtLinkLocale to="/" class="mt-6 inline-block bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg">
      {{ t('progress.button_start') }}
    </NuxtLinkLocale>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

