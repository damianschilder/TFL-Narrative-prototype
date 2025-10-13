// /components/pages/story/QuizPanel.vue
<template>
  <div class="card-glass p-6 flex flex-col h-full">
    <DebugControls 
      v-if="debugInfo"
      :debug-info="debugInfo"
      @regenerate="emit('regenerate')"
      @force-tier="emit('force-tier', $event)"
      @fill-correct="emit('fill-correct')"
    />
    
    <QuizForm
      :story-data="storyData"
      :is-validating="isValidating"
      :is-correct="isCorrect"
      :show-result="showResult"
      :awaiting-retry="awaitingRetry"
      :hint="hint"
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
  awaitingRetry: Boolean, // Added to pass down to QuizForm
  hint: String,            // Added to pass down to QuizForm
});

const emit = defineEmits(['submit-answer', 'next-step', 'regenerate', 'force-tier', 'fill-correct']);
</script>