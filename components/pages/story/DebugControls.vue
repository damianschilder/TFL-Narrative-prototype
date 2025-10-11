// /components/pages/story/DebugControls.vue
<template>
  <div>
    <div class="border-b border-border/50 mb-4 pb-4 text-xs text-muted-foreground space-y-1 font-mono">
      <p><strong>{{ t('story.debug.kc_id') }}</strong> {{ debugInfo.kcId || 'N/A' }}</p>
      <p><strong>{{ t('story.debug.attempts') }}</strong> {{ debugInfo.attempts }}</p>
      <p><strong>{{ t('story.debug.mastery') }}</strong> {{ (debugInfo.mastery * 100).toFixed(1) }}%</p>
      <p><strong>{{ t('story.debug.tier') }}</strong> {{ debugInfo.masteryTier }}</p>
      <p><strong>{{ t('story.debug.gen_api') }}</strong> <span :class="debugInfo.generationApiStatus === '200 OK' ? 'text-success' : 'text-destructive'">{{ debugInfo.generationApiStatus || 'N/A' }}</span></p>
      <p><strong>{{ t('story.debug.val_api') }}</strong> <span :class="debugInfo.validationApiStatus === '200 OK' ? 'text-success' : 'text-destructive'">{{ debugInfo.validationApiStatus || 'N/A' }}</span></p>
    </div>
    <div class="border-b border-border/50 mb-4 pb-4">
      <p class="font-mono text-xs text-muted-foreground mb-2">{{ t('story.debug.testing_controls') }}</p>
      <div class="flex items-center gap-2">
        <button @click="emit('regenerate')" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">{{ t('story.debug.regenerate') }}</button>
        <button @click="emit('force-tier', 1)" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">{{ t('story.debug.force_tier', { tier: 1 }) }}</button>
        <button @click="emit('force-tier', 2)" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">{{ t('story.debug.force_tier', { tier: 2 }) }}</button>
        <button @click="emit('force-tier', 3)" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">{{ t('story.debug.force_tier', { tier: 3 }) }}</button>
      </div>
      <p v-if="debugInfo.isForced" class="font-mono text-xs text-warning mt-2">{{ t('story.debug.forced_tier_active') }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  debugInfo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['regenerate', 'force-tier']);
const { t } = useI18n();
</script>
