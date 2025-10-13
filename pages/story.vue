<template>
  <main class="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center flex flex-col items-center gap-4">
      <div 
        class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
      >
        <span class="sr-only">{{ t('status.loading') }}</span>
      </div>
      <p class="text-lg text-muted-foreground">{{ t('story.loading_text') }}</p>
    </div>

    <!-- All Learned State -->
    <div v-else-if="allLearned" class="text-center card-glass p-12">
      <h2 class="text-3xl font-bold text-foreground">{{ t('story.all_learned_title') }}</h2>
      <p class="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">{{ t('story.all_learned_message') }}</p>
      <div class="mt-8 flex justify-center gap-4">
        <NuxtLink :to="localePath('/')" class="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-md hover:bg-primary/90 transition-colors">
          {{ t('story.back_to_selection') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/progress')" class="px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/80 transition-colors">
          {{ t('story.view_progress') }}
        </NuxtLink>
      </div>
    </div>
    
    <!-- Main Content -->
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
          :awaiting-retry="awaitingRetry"
          :hint="hintText"
          @submit-answer="checkAnswer"
          @next-step="handleNextStep"
          @regenerate="regenerateQuestion"
          @force-tier="forceTier"
          @fill-correct="debugFillCorrectAnswer"
        />
      </div>
    </div>

    <!-- Continuation Modal -->
    <ContinuationModal 
      :show="showContinuationModal"
      @continue="continueOnSameTopic"
      @switch="switchToNewTopic"
    />
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getStudentState, selectNextKC, updateKCMastery } from '~/utils/studentModel';
import { tijdvakken } from '~/data';
import { logger } from '~/utils/logger';
import StoryDisplay from '~/components/pages/story/StoryDisplay.vue';
import QuizPanel from '~/components/pages/story/QuizPanel.vue';
import ContinuationModal from '~/components/pages/story/ContinuationModal.vue';

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

// --- Component State ---
const storyData = ref(null);
const isLoading = ref(true);
const allLearned = ref(false);
const showResult = ref(false);
const currentKC = ref(null);
const currentMastery = ref(0);
const currentAttempts = ref(0);
const isAIEvaluatedCorrect = ref(null);
const awaitingRetry = ref(false);
const hintText = ref(null);

// --- Loop State ---
const questionCountInLoop = ref(0);
const showContinuationModal = ref(false);

// --- Debug & API State ---
const forcedMastery = ref(null);
const isValidating = ref(false);
const generationApiStatus = ref(null);
const validationApiStatus = ref(null);

useHead({
  title: t('story.title'),
});

// --- Helper Functions ---
const getActiveKenmerkendAspect = () => {
  if (typeof window === 'undefined') return null;
  const activeAspectKey = sessionStorage.getItem('activeAspectKey');
  if (!activeAspectKey) return null;
  for (const tijdvak of tijdvakken) {
    const aspect = tijdvak.aspecten.find(a => a.id === activeAspectKey);
    if (aspect) return aspect;
  }
  return null;
};

const calculateAverageMastery = () => {
  const studentState = getStudentState();
  const currentAspect = getActiveKenmerkendAspect();
  if (!studentState || !currentAspect || !currentAspect.knowledgeComponents) return 0;

  const kcsForTopic = currentAspect.knowledgeComponents;
  const totalMastery = kcsForTopic.reduce((sum, kc) => {
    return sum + (studentState[kc.id]?.mastery || 0);
  }, 0);

  return kcsForTopic.length > 0 ? totalMastery / kcsForTopic.length : 0;
};

// --- Core Logic ---
const fetchStoryData = async () => {
  isLoading.value = true;
  storyData.value = null;
  showResult.value = false;
  isAIEvaluatedCorrect.value = null;
  awaitingRetry.value = false;
  hintText.value = null;
  
  const masteryScoreToSend = forcedMastery.value ?? currentMastery.value;
  logger.info('StoryPage', 'Fetching story for KC:', { id: currentKC.value.id, mastery: masteryScoreToSend });

  try {
    const response = await $fetch('/api/stories', {
      method: 'POST',
      body: { kcId: currentKC.value.id, masteryScore: masteryScoreToSend }
    });
    generationApiStatus.value = '200 OK';
    storyData.value = response;
  } catch (error) {
    generationApiStatus.value = 'Error';
    logger.error('StoryPage', 'Could not load story for KC.', error);
  } finally {
    isLoading.value = false;
  }
};

const loadNextQuestion = () => {
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
};

const checkAnswer = async ({ answer, values }) => {
  if (answer === null || (typeof answer === 'string' && !answer.trim())) return;

  let isAnswerCorrect;
  const isMCQ = Array.isArray(storyData.value.options);

  if (isMCQ) {
    isAnswerCorrect = answer === storyData.value.correctAnswerIndex;
  } else {
    const isAdvanced = masteryTier.value.startsWith('Advanced');
    if (isAdvanced) {
      isValidating.value = true;
      try {
        const response = await $fetch('/api/stories/validate-answer', { /* ... */ });
        isAnswerCorrect = response.isCorrect;
      } catch (error) { isAnswerCorrect = false; }
      finally { isValidating.value = false; }
    } else {
      const formattedUserAnswer = String(values.userAnswer).trim().toLowerCase();
      const formattedCorrectAnswer = String(storyData.value.correctAnswer).trim().toLowerCase();
      isAnswerCorrect = formattedUserAnswer === formattedCorrectAnswer;
    }
  }
  
  const canReceiveHint = !isMCQ && masteryTier.value.startsWith('Advanced') && storyData.value.hint;
  if (!isAnswerCorrect && canReceiveHint && !awaitingRetry.value) {
    awaitingRetry.value = true;
    hintText.value = storyData.value.hint;
    return;
  }
  
  isAIEvaluatedCorrect.value = isAnswerCorrect;
  showResult.value = true;
};

const handleNextStep = () => {
  if (storyData.value?.kcId && forcedMastery.value === null) {
    updateKCMastery(storyData.value.kcId, isAIEvaluatedCorrect.value);
  }
  forcedMastery.value = null;

  const newCount = questionCountInLoop.value + 1;
  questionCountInLoop.value = newCount;
  sessionStorage.setItem('questionCountInLoop', newCount.toString());

  if (newCount >= 5) {
    questionCountInLoop.value = 0;
    sessionStorage.setItem('questionCountInLoop', '0');
    
    const avgMastery = calculateAverageMastery();
    if (avgMastery >= 0.85) {
      showContinuationModal.value = true;
    } else {
      loadNextQuestion();
    }
  } else {
    loadNextQuestion();
  }
};

onMounted(() => {
  questionCountInLoop.value = parseInt(sessionStorage.getItem('questionCountInLoop') || '0');
  loadNextQuestion();
});

// --- Computed Properties ---
const isCorrect = computed(() => showResult.value && isAIEvaluatedCorrect.value);

const masteryTier = computed(() => {
  const mastery = forcedMastery.value ?? currentMastery.value;
  if (mastery < 0.5) return 'Beginner (Score 0-0.5)';
  if (mastery < 0.75) return 'Intermediate (Score 0.5-0.75)';
  return 'Advanced (Score >0.75)';
});

const debugInfo = computed(() => ({
  kcId: currentKC.value?.id,
  attempts: currentAttempts.value,
  mastery: currentMastery.value.toFixed(2),
  masteryTier: masteryTier.value,
  generationApiStatus: generationApiStatus.value,
  validationApiStatus: validationApiStatus.value,
  isForced: forcedMastery.value !== null,
}));

// --- Modal Handlers ---
const continueOnSameTopic = () => {
  showContinuationModal.value = false;
  loadNextQuestion();
};

const switchToNewTopic = () => {
  showContinuationModal.value = false;
  router.push(localePath('/'));
};

// --- Debug Functions ---
const regenerateQuestion = () => fetchStoryData();

const forceTier = (tier) => {
  if (tier === 1) forcedMastery.value = 0.2;
  else if (tier === 2) forcedMastery.value = 0.6;
  else if (tier === 3) forcedMastery.value = 0.9;
  fetchStoryData();
};

const debugFillCorrectAnswer = () => {
  if (!storyData.value) return;
  const isMCQ = Array.isArray(storyData.value.options);
  const answer = isMCQ ? storyData.value.correctAnswerIndex : storyData.value.correctAnswer;
  const values = isMCQ ? {} : { userAnswer: storyData.value.correctAnswer };
  checkAnswer({ answer, values });
};
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

