// /components/pages/story/QuizPanel.vue
<template>
  <div class="bg-card/50 border border-border/30 rounded-xl p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
    <DebugControls 
      :debug-info="debugInfo"
      @regenerate="emit('regenerate')"
      @force-tier="emit('force-tier', $event)"
    />
    
    <QuizForm
      :story-data="storyData"
      :is-validating="isValidating"
      :is-correct="isCorrect"
      :show-result="showResult"
      @submit-answer="emit('submit-answer', $event)"
      @next-step="emit('next-step')"
    />
  </div>
</template>

<script setup>
import DebugControls from './DebugControls.vue';
import QuizForm from './QuizForm.vue';

defineProps({
  storyData: Object,
  debugInfo: Object,
  isValidating: Boolean,
  isCorrect: Boolean,
  showResult: Boolean,
});

const emit = defineEmits(['submit-answer', 'next-step', 'regenerate', 'force-tier']);
</script>
