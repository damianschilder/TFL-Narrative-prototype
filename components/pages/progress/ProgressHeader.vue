// /components/pages/progress/ProgressHeader.vue
<template>
  <div>
    <h1 class="text-4xl font-black text-foreground mb-4">{{ pageTitle }}</h1>
    <p v-if="hasActiveTopic" class="text-muted-foreground mb-12">{{ t('progress.subtitle') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  hasActiveTopic: {
    type: Boolean,
    required: true,
  }
});

const { t } = useI18n();
</script>
