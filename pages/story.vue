// /pages/story.vue
<template>
  <main class="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="isLoading" class="text-center">
      <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-lg text-muted-foreground">{{ t('story.loading_text') }}</p>
    </div>

    <div v-else-if="allLearned" class="text-center bg-card/50 border border-border/30 rounded-xl p-12 backdrop-blur-xl">
      <h2 class="text-4xl font-black text-success mb-4">{{ t('story.completion.title') }}</h2>
      <p class="text-xl text-foreground/80 mb-8">{{ t('story.completion.subtitle') }}</p>
      <NuxtLinkLocale to="/progress" class="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
        {{ t('story.completion.button') }}
      </NuxtLinkLocale>
    </div>
    
    <div v-else-if="storyData" class="grid grid-cols-1 lg:grid-cols-10 gap-8 w-full">
      <div class="col-span-10 lg:col-span-7">
        <StoryDisplay :story-text="storyData.story" />
      </div>
      
      <div class="col-span-10 lg:col-span-3">
        <QuizPanel
          :story-data="storyData"
          :debug-info="debugInfo"
          :is-validating="isValidating"
          :is-correct="isCorrect"
          :show-result="showResult"
          @submit-answer="checkAnswer"
          @next-step="handleNextStep"
          @regenerate="regenerateQuestion"
          @force-tier="forceTier"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getStudentState, selectNextKC, updateKCMastery } from '~/utils/studentModel';
import StoryDisplay from '~/components/pages/story/StoryDisplay.vue';
import QuizPanel from '~/components/pages/story/QuizPanel.vue';

const { t } = useI18n();
const router = useRouter();
const storyData = ref(null);
const isLoading = ref(true);
const allLearned = ref(false);
const showResult = ref(false);
const currentKC = ref(null);
const currentMastery = ref(0);
const currentAttempts = ref(0);
const forcedMastery = ref(null);
const isValidating = ref(false);
const isAIEvaluatedCorrect = ref(null);
const generationApiStatus = ref(null);
const validationApiStatus = ref(null);

useHead({
  title: t('story.title'),
});

const isMCQ = computed(() => storyData.value && Array.isArray(storyData.value.options));

const fetchStoryData = async () => {
  isLoading.value = true;
  showResult.value = false;
  isAIEvaluatedCorrect.value = null;
  validationApiStatus.value = null;

  const masteryScoreToSend = forcedMastery.value ?? currentMastery.value;

  try {
    const response = await $fetch('/api/stories', {
      method: 'POST',
      body: { kcId: currentKC.value.id, masteryScore: masteryScoreToSend }
    });
    generationApiStatus.value = '200 OK';
    storyData.value = response;
  } catch (error) {
    generationApiStatus.value = 'Error';
    console.error("[StoryPage] Could not load story for KC:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const studentState = getStudentState();
  const nextKC = selectNextKC();
  
  if (nextKC) {
    currentKC.value = nextKC;
    const kcState = studentState[nextKC.id];
    currentMastery.value = kcState?.mastery || 0;
    currentAttempts.value = kcState?.attempts || 0;
    fetchStoryData();
  } else {
    allLearned.value = true;
    isLoading.value = false;
  }
});

const isCorrect = computed(() => {
  if (showResult.value === false) return false;
  
  if (isAIEvaluatedCorrect.value !== null) {
    return isAIEvaluatedCorrect.value;
  }
  
  // This will be calculated based on the result from the QuizPanel's submission event
  return false; 
});

const masteryTier = computed(() => {
  const masteryToCheck = forcedMastery.value ?? currentMastery.value;
  if (masteryToCheck < 0.40) return 'Tier 1 (Low)';
  if (masteryToCheck < 0.85) return 'Tier 2 (Medium)';
  return 'Tier 3 (High)';
});

const debugInfo = computed(() => ({
  kcId: currentKC.value?.id,
  attempts: currentAttempts.value,
  mastery: currentMastery.value,
  masteryTier: masteryTier.value,
  generationApiStatus: generationApiStatus.value,
  validationApiStatus: validationApiStatus.value,
  isForced: forcedMastery.value !== null,
}));


const handleNextStep = () => {
  if (storyData.value?.kcId && forcedMastery.value === null) {
    updateKCMastery(storyData.value.kcId, isCorrect.value);
  }
  forcedMastery.value = null; 
  router.go(0); 
};

const checkAnswer = async ({ answer, values }) => {
  if (answer === null || (typeof answer === 'string' && !answer.trim())) return;

  let isAnswerCorrect;

  if (isMCQ.value) {
    isAnswerCorrect = answer === storyData.value.correctAnswerIndex;
    isAIEvaluatedCorrect.value = isAnswerCorrect;
  } else {
    const isTier3 = masteryTier.value.startsWith('Tier 3');
    if (isTier3) {
      isValidating.value = true;
      validationApiStatus.value = 'Pending...';
      try {
        const response = await $fetch('/api/stories/validate-answer', {
          method: 'POST',
          body: {
            userAnswer: values.userAnswer,
            question: storyData.value.question,
            modelAnswer: storyData.value.correctAnswer
          }
        });
        validationApiStatus.value = '200 OK';
        isAnswerCorrect = response.isCorrect;
        isAIEvaluatedCorrect.value = isAnswerCorrect;
      } catch (error) {
        validationApiStatus.value = 'Error';
        console.error('Error validating answer with AI:', error);
        isAnswerCorrect = false;
        isAIEvaluatedCorrect.value = false;
      } finally {
        isValidating.value = false;
      }
    } else {
      const formattedUserAnswer = String(values.userAnswer).trim().toLowerCase();
      const formattedCorrectAnswer = String(storyData.value.correctAnswer).trim().toLowerCase();
      isAnswerCorrect = formattedUserAnswer === formattedCorrectAnswer;
      isAIEvaluatedCorrect.value = isAnswerCorrect;
    }
  }
  
  showResult.value = true;
};

const regenerateQuestion = () => {
    fetchStoryData();
}

const forceTier = (tier) => {
    if (tier === 1) forcedMastery.value = 0.1;
    if (tier === 2) forcedMastery.value = 0.6;
    if (tier === 3) forcedMastery.value = 0.9;
    fetchStoryData();
}
</script>

