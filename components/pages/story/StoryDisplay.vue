// /components/pages/story/StoryDisplay.vue
<template>
  <div class="bg-card/50 border border-border/30 rounded-xl p-8 backdrop-blur-xl shadow-2xl shadow-black/20 h-full">
    <h2 class="text-4xl font-black text-foreground mb-6">{{ t('story.story_title') }}</h2>
    <div class="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
      <p>{{ storyText }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  storyText: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
</script>

<style>
.prose p { 
  margin-bottom: 1em; 
}
</style>
