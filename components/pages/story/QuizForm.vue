// /components/pages/story/QuizForm.vue
<template>
  <div>
    <div class="flex items-start justify-between mb-2">
      <h3 class="text-2xl font-bold text-foreground">{{ t('story.quiz.title') }}</h3>
      <div class="relative group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground cursor-help flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <div class="absolute bottom-full mb-2 right-0 w-max max-w-xs bg-popover text-popover-foreground text-sm rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {{ hintText }}
        </div>
      </div>
    </div>
    <p class="text-muted-foreground mb-6">{{ storyData.question }}</p>

    <form @submit.prevent="submit">
      <div v-if="isMCQ" class="space-y-3">
        <label 
          v-for="(option, index) in storyData.options"
          :key="index"
          :class="getOptionClass(index)"
          class="flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all duration-200"
        >
          <input type="radio" name="quiz-option" :value="index" v-model="mcqAnswer" :disabled="showResult" class="h-5 w-5 flex-shrink-0 accent-primary text-primary bg-transparent border-border focus:ring-primary focus:ring-offset-card"/>
          <span class="text-sm font-medium text-foreground/90">{{ option }}</span>
        </label>
      </div>

      <div v-else>
        <textarea 
          v-model="userAnswer"
          :placeholder="t('story.quiz.placeholder')"
          :disabled="showResult"
          class="w-full rounded-lg border bg-secondary/30 px-4 py-3 text-base text-foreground transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-card"
          :class="openEndedInputClass"
        ></textarea>
          <p v-if="errors.userAnswer" class="mt-2 text-sm text-destructive">
          {{ errors.userAnswer }}
        </p>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="!isMCQ || (isMCQ && mcqAnswer !== null)" class="mt-6 flex flex-col items-center gap-4">
          <button v-if="!showResult" type="submit" :disabled="isValidating || !meta.valid" class="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            <svg v-if="isValidating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isValidating ? t('story.quiz.evaluating') : t('story.quiz.button') }}</span>
          </button>
          
          <div v-if="showResult" class="w-full flex flex-col items-center gap-4">
            <div class="w-full text-center p-3 rounded-lg font-semibold" :class="isCorrect ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'">
              <p>{{ t(isCorrect ? 'story.quiz.correct' : 'story.quiz.incorrect') }}</p>
              <p v-if="!isCorrect && !isMCQ" class="text-sm mt-1 opacity-80">
                {{ t('story.quiz.correct_answer_was') }} "{{ storyData.correctAnswer }}"
              </p>
            </div>
            <button @click="emit('next-step')" type="button" class="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              {{ t('story.quiz.next_button') }}
            </button>
          </div>
        </div>
      </transition>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { openEndedAnswerSchema } from '~/validation/story';

const props = defineProps({
  storyData: Object,
  isValidating: Boolean,
  isCorrect: Boolean,
  showResult: Boolean,
});

const emit = defineEmits(['submit-answer', 'next-step']);
const { t } = useI18n();
const mcqAnswer = ref(null);

const isMCQ = computed(() => props.storyData && Array.isArray(props.storyData.options));

const { errors, defineField, handleSubmit, meta, resetForm } = useForm({
  validationSchema: computed(() => isMCQ.value ? undefined : openEndedAnswerSchema),
});
const [userAnswer] = defineField('userAnswer');

const submit = handleSubmit((values) => {
  const answer = isMCQ.value ? mcqAnswer.value : values.userAnswer;
  emit('submit-answer', { answer, values });
});

const hintText = computed(() => {
  if (!props.storyData) return '';
  if (isMCQ.value) {
    return `Correct: "${props.storyData.options[props.storyData.correctAnswerIndex]}"`;
  }
  return `Correct: "${props.storyData.correctAnswer}"`;
});

const getOptionClass = (index) => {
  if (!props.storyData) return '';
  const isSelected = mcqAnswer.value === index;
  const isCorrectAnswer = index === props.storyData.correctAnswerIndex;

  if (props.showResult) {
    if (isCorrectAnswer) return 'border-success bg-success/20 scale-105';
    if (isSelected && !isCorrectAnswer) return 'border-destructive bg-destructive/20';
    return 'border-border/30 opacity-60 cursor-not-allowed';
  }
  return isSelected ? 'border-primary bg-primary/20' : 'border-border/50 bg-secondary/30 hover:border-primary/70';
};

const openEndedInputClass = computed(() => {
  if (errors.value.userAnswer) return 'border-destructive';
  if (!props.showResult) return 'border-border/50 focus:border-primary';
  return props.isCorrect ? 'border-success bg-success/20 text-success cursor-not-allowed' : 'border-destructive bg-destructive/20 text-destructive cursor-not-allowed';
});

watch(() => props.storyData, () => {
  resetForm();
  userAnswer.value = '';
  mcqAnswer.value = null;
}, { deep: true });
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
