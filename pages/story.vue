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
      <NuxtLink to="/progress" class="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
        {{ $t('story.completion.button') }}
      </NuxtLink>
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
          <h3 class="text-2xl font-bold text-foreground mb-2">{{ $t('story.quiz.title') }}</h3>
          <p class="text-muted-foreground mb-6">{{ storyData.question }}</p>
          
          <div class="space-y-3">
            <label 
              v-for="(option, index) in storyData.options"
              :key="index"
              :class="getOptionClass(index)"
              class="flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all duration-200"
            >
              <input 
                type="radio" 
                name="quiz-option"
                :value="index"
                v-model="selectedAnswerIndex"
                :disabled="showResult"
                class="h-5 w-5 flex-shrink-0 accent-primary text-primary bg-transparent border-border focus:ring-primary focus:ring-offset-card"
              />
              <span class="text-sm font-medium text-foreground/90">{{ option }}</span>
            </label>
          </div>

          <transition name="fade">
            <div v-if="selectedAnswerIndex !== null" class="mt-6 flex flex-col items-center gap-4">
              <button 
                v-if="!showResult"
                @click="checkAnswer" 
                class="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                {{ $t('story.quiz.button') }}
              </button>
              
              <div v-if="showResult" class="w-full text-center p-3 rounded-lg font-semibold" :class="isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
                {{ $t(isCorrect ? 'story.quiz.correct' : 'story.quiz.incorrect') }}
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
import { selectNextKC, updateKCMastery } from '~/utils/studentModel';

const { t } = useI18n();
const router = useRouter();
const storyData = ref(null);
const isLoading = ref(true);
const allLearned = ref(false);
const selectedAnswerIndex = ref(null);
const showResult = ref(false);

useHead({
  title: t('story.title'),
});

onMounted(async () => {
  const nextKC = selectNextKC();
  
  if (nextKC) {
    try {
      const response = await $fetch('/api/generateForKC', {
        method: 'POST',
        body: { kcId: nextKC.id }
      });
      storyData.value = response;
    } catch (error) {
      console.error("Could not load story for KC:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    allLearned.value = true;
    isLoading.value = false;
  }
});

const isCorrect = computed(() => {
  if (!storyData.value || selectedAnswerIndex.value === null) return false;
  return selectedAnswerIndex.value === storyData.value.correctAnswerIndex;
});

const handleNextStep = () => {
  updateKCMastery(storyData.value.kcId, isCorrect.value);
  router.go(0); 
};

const checkAnswer = () => {
  if (selectedAnswerIndex.value === null) return;
  showResult.value = true;
  setTimeout(handleNextStep, 2000); 
};

const getOptionClass = (index) => {
  if (!storyData.value) return '';

  const isSelected = selectedAnswerIndex.value === index;
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
</script>

<style>
.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.prose p { margin-bottom: 1em; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>