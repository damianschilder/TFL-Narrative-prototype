<template>
  <main class="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="isLoading" class="text-center">
      <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-lg text-muted-foreground">{{ $t('story.loading_text') }}</p>
    </div>

    <div v-else-if="allLearned" class="text-center bg-card/50 border border-border/30 rounded-xl p-12 backdrop-blur-xl">
      <h2 class="text-4xl font-black text-green-400 mb-4">{{ $t('story.completion.title') }}</h2>
      <p class="text-xl text-foreground/80 mb-8">{{ $t('story.completion.subtitle') }}</p>
      <NuxtLinkLocale to="/progress" class="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
        {{ $t('story.completion.button') }}
      </NuxtLinkLocale>
    </div>
    
    <div v-else-if="storyData" class="grid grid-cols-1 lg:grid-cols-10 gap-8 w-full">
      <div class="col-span-10 lg:col-span-7">
        <div class="bg-card/50 border border-border/30 rounded-xl p-8 backdrop-blur-xl shadow-2xl shadow-black/20 h-full">
          <h2 class="text-4xl font-black text-foreground mb-6">{{ $t('story.story_title') }}</h2>
          <div class="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
            <p>{{ storyData.story }}</p>
          </div>
        </div>
      </div>
      
      <div class="col-span-10 lg:col-span-3">
        <div class="bg-card/50 border border-border/30 rounded-xl p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
          <div class="border-b border-border/50 mb-4 pb-4 text-xs text-muted-foreground space-y-1 font-mono">
            <p><strong>KC ID:</strong> {{ currentKC?.id || 'N/A' }}</p>
            <p><strong>Attempts:</strong> {{ currentAttempts }}</p>
            <p><strong>Mastery:</strong> {{ (currentMastery * 100).toFixed(1) }}%</p>
            <p><strong>Tier:</strong> {{ masteryTier }}</p>
            <p><strong>Gen API:</strong> <span :class="generationApiStatus === '200 OK' ? 'text-green-400' : 'text-red-400'">{{ generationApiStatus || 'N/A' }}</span></p>
            <p><strong>Val API:</strong> <span :class="validationApiStatus === '200 OK' ? 'text-green-400' : 'text-red-400'">{{ validationApiStatus || 'N/A' }}</span></p>
          </div>
          <div class="border-b border-border/50 mb-4 pb-4">
            <p class="font-mono text-xs text-muted-foreground mb-2">Testing Controls</p>
            <div class="flex items-center gap-2">
                <button @click="regenerateQuestion" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">Regenerate</button>
                <button @click="forceTier(1)" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">Force T1</button>
                <button @click="forceTier(2)" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">Force T2</button>
                <button @click="forceTier(3)" class="px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded-md">Force T3</button>
            </div>
             <p v-if="forcedMastery" class="font-mono text-xs text-yellow-400 mt-2">Forced Tier Active</p>
          </div>
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-2xl font-bold text-foreground">{{ $t('story.quiz.title') }}</h3>
            <div class="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground cursor-help flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <div class="absolute bottom-full mb-2 right-0 w-max max-w-xs bg-popover text-popover-foreground text-sm rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {{ hintText }}
              </div>
            </div>
          </div>
          <p class="text-muted-foreground mb-6">{{ storyData.question }}</p>

          <div v-if="isMCQ" class="space-y-3">
            <label 
              v-for="(option, index) in storyData.options"
              :key="index"
              :class="getOptionClass(index)"
              class="flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all duration-200"
            >
              <input type="radio" name="quiz-option" :value="index" v-model="userAnswer" :disabled="showResult" class="h-5 w-5 flex-shrink-0 accent-primary text-primary bg-transparent border-border focus:ring-primary focus:ring-offset-card"/>
              <span class="text-sm font-medium text-foreground/90">{{ option }}</span>
            </label>
          </div>

          <div v-else>
            <input 
              type="text" 
              v-model="userAnswer" 
              :placeholder="$t('story.quiz.placeholder')"
              :disabled="showResult"
              @keyup.enter="checkAnswer"
              class="w-full rounded-lg border bg-secondary/30 px-4 py-3 text-base text-foreground transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-card"
              :class="openEndedInputClass"
            />
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="userAnswer !== null && userAnswer !== ''" class="mt-6 flex flex-col items-center gap-4">
              <button v-if="!showResult" @click="checkAnswer" :disabled="isValidating" class="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                <svg v-if="isValidating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isValidating ? 'Evaluating...' : $t('story.quiz.button') }}</span>
              </button>
              
              <div v-if="showResult" class="w-full flex flex-col items-center gap-4">
                <div class="w-full text-center p-3 rounded-lg font-semibold" :class="isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
                  <p>{{ $t(isCorrect ? 'story.quiz.correct' : 'story.quiz.incorrect') }}</p>
                  <p v-if="!isCorrect && !isMCQ" class="text-sm mt-1 opacity-80">
                    {{ $t('story.quiz.correct_answer_was') }} "{{ storyData.correctAnswer }}"
                  </p>
                </div>
                <button @click="handleNextStep" class="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  {{ $t('story.quiz.next_button') }}
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getStudentState, selectNextKC, updateKCMastery } from '~/utils/studentModel';

const { t } = useI18n();
const router = useRouter();
const storyData = ref(null);
const isLoading = ref(true);
const allLearned = ref(false);
const userAnswer = ref(null);
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

const fetchStoryData = async () => {
  isLoading.value = true;
  userAnswer.value = null;
  showResult.value = false;
  isAIEvaluatedCorrect.value = null;
  validationApiStatus.value = null;

  const masteryScoreToSend = forcedMastery.value ?? currentMastery.value;
  console.log(`[StoryPage] Fetching content for KC: ${currentKC.value?.id} with mastery: ${masteryScoreToSend}`);

  try {
    const response = await $fetch('/api/generateForKC', {
      method: 'POST',
      body: { kcId: currentKC.value.id, masteryScore: masteryScoreToSend }
    });
    generationApiStatus.value = '200 OK';
    console.log('[StoryPage] Fetched story data from API:', response);
    storyData.value = response;
  } catch (error) {
    generationApiStatus.value = 'Error';
    console.error("[StoryPage] Could not load story for KC:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  console.log('[StoryPage] Component mounted. Selecting next KC...');
  const studentState = getStudentState();
  const nextKC = selectNextKC();
  
  if (nextKC) {
    currentKC.value = nextKC;
    const kcState = studentState[nextKC.id];
    currentMastery.value = kcState?.mastery || 0;
    currentAttempts.value = kcState?.attempts || 0;
    fetchStoryData();
  } else {
    console.log('[StoryPage] No more KCs to learn. All learned!');
    allLearned.value = true;
    isLoading.value = false;
  }
});

const isMCQ = computed(() => storyData.value && Array.isArray(storyData.value.options));

const isCorrect = computed(() => {
  if (showResult.value === false) return false;

  if (isMCQ.value) {
    return userAnswer.value === storyData.value.correctAnswerIndex;
  }
  
  if (isAIEvaluatedCorrect.value !== null) {
    return isAIEvaluatedCorrect.value;
  }
  
  const formattedUserAnswer = String(userAnswer.value).trim().toLowerCase();
  const formattedCorrectAnswer = String(storyData.value.correctAnswer).trim().toLowerCase();
  return formattedUserAnswer === formattedCorrectAnswer;
});

const hintText = computed(() => {
    if (!storyData.value) return 'Loading hint...';
    if (isMCQ.value) {
        return `Correct Answer: "${storyData.value.options[storyData.value.correctAnswerIndex]}"`;
    }
    return `Correct Answer: "${storyData.value.correctAnswer}"`;
});

const masteryTier = computed(() => {
  const masteryToCheck = forcedMastery.value ?? currentMastery.value;
  if (masteryToCheck < 0.40) return 'Tier 1 (Low)';
  if (masteryToCheck < 0.85) return 'Tier 2 (Medium)';
  return 'Tier 3 (High)';
});

const handleNextStep = () => {
  console.log('[StoryPage] Handling next step...');
  if (storyData.value?.kcId && forcedMastery.value === null) {
    updateKCMastery(storyData.value.kcId, isCorrect.value);
  } else {
    console.log('[StoryPage] Mastery update skipped due to forced tier.');
  }
  
  forcedMastery.value = null; 
  console.log('[StoryPage] Reloading the page to fetch the next KC.');
  router.go(0); 
};

const checkAnswer = async () => {
  if (userAnswer.value === null || (typeof userAnswer.value === 'string' && !userAnswer.value.trim())) return;
  
  const isTier3 = !isMCQ.value && masteryTier.value.startsWith('Tier 3');

  if (isTier3) {
    isValidating.value = true;
    validationApiStatus.value = 'Pending...';
    try {
      const response = await $fetch('/api/validateAnswer', {
        method: 'POST',
        body: {
          userAnswer: userAnswer.value,
          question: storyData.value.question,
          modelAnswer: storyData.value.correctAnswer
        }
      });
      validationApiStatus.value = '200 OK';
      isAIEvaluatedCorrect.value = response.isCorrect;
      console.log(`[StoryPage] AI validation result: ${response.isCorrect}`);
    } catch (error) {
      validationApiStatus.value = 'Error';
      console.error('Error validating answer with AI:', error);
      isAIEvaluatedCorrect.value = false;
    } finally {
      isValidating.value = false;
    }
  }

  showResult.value = true;
  console.log(`[StoryPage] Answer checked. Final correctness: ${isCorrect.value}. User answer: ${userAnswer.value}`);
};


const regenerateQuestion = () => {
    console.log('[StoryPage] Regenerating question...');
    fetchStoryData();
}

const forceTier = (tier) => {
    if (tier === 1) forcedMastery.value = 0.1;
    if (tier === 2) forcedMastery.value = 0.6;
    if (tier === 3) forcedMastery.value = 0.9;
    console.log(`[StoryPage] Forcing tier ${tier} with mastery ${forcedMastery.value}`);
    fetchStoryData();
}

const getOptionClass = (index) => {
  if (!storyData.value) return '';

  const isSelected = userAnswer.value === index;
  const isCorrectAnswer = index === storyData.value.correctAnswerIndex;

  if (showResult.value) {
    if (isCorrectAnswer) return 'border-green-500 bg-green-500/20 scale-105';
    if (isSelected && !isCorrectAnswer) return 'border-red-500 bg-red-500/20';
    return 'border-border/30 opacity-60 cursor-not-allowed';
  }

  return isSelected 
    ? 'border-primary bg-primary/20' 
    : 'border-border/50 bg-secondary/30 hover:border-primary/70';
};

const openEndedInputClass = computed(() => {
  if (!showResult.value) {
    return 'border-border/50 focus:border-primary';
  }
  return isCorrect.value
    ? 'border-green-500 bg-green-500/20 text-green-300 cursor-not-allowed'
    : 'border-red-500 bg-red-500/20 text-red-300 cursor-not-allowed';
});
</script>

<style>
.prose p { margin-bottom: 1em; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>

