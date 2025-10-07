<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-background font-display text-foreground">
    <div class="absolute inset-0 bg-black/50 z-10"></div>
    <div class="absolute top-0 left-0 w-[50rem] h-[50rem] bg-blue-500/30 rounded-full blur-[10rem] -translate-x-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-purple-500/30 rounded-full blur-[10rem] translate-x-1/2"></div>

    <div class="relative z-20 flex flex-col min-h-screen">
      <header class="w-full">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
            <span class="material-symbols-outlined">home</span>
            Start
          </NuxtLink>
          <NuxtLink to="/voortgang" class="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
            <span class="material-symbols-outlined">map</span>
            Mijn Voortgang
          </NuxtLink>
        </div>
      </header>
      
      <main class="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="isLoading" class="text-center">
          <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-lg text-muted-foreground">Volgende uitdaging wordt voorbereid...</p>
        </div>

        <div v-else-if="allLearned" class="text-center bg-card/50 border border-border/30 rounded-xl p-12 backdrop-blur-xl">
          <h2 class="text-4xl font-black text-green-400 mb-4">Fantastisch!</h2>
          <p class="text-xl text-foreground/80 mb-8">Je hebt alle kenniscomponenten voor dit onderwerp onder de knie.</p>
          <NuxtLink to="/voortgang" class="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
            Bekijk je Kenniskaart
          </NuxtLink>
        </div>
        
        <div v-else-if="storyData" class="grid grid-cols-1 lg:grid-cols-10 gap-8 w-full">
          <div class="col-span-10 lg:col-span-7">
            <div class="bg-card/50 border border-border/30 rounded-xl p-8 backdrop-blur-xl shadow-2xl shadow-black/20 h-full">
              <h2 class="text-4xl font-black text-foreground mb-6">Het Verhaal</h2>
              <div class="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
                <p>{{ storyData.story }}</p>
              </div>
            </div>
          </div>
          
          <div class="col-span-10 lg:col-span-3">
            <div class="bg-card/50 border border-border/30 rounded-xl p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
              <h3 class="text-2xl font-bold text-foreground mb-2">Test je Kennis</h3>
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
                    Controleer Antwoord
                  </button>
                  
                  <div v-if="showResult" class="w-full text-center p-3 rounded-lg font-semibold" :class="isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
                    {{ isCorrect ? 'Correct!' : 'Helaas, niet correct.' }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { selectNextKC, updateKCMastery } from '~/utils/studentModel';

const router = useRouter();
const storyData = ref(null);
const isLoading = ref(true);
const allLearned = ref(false);
const selectedAnswerIndex = ref(null);
const showResult = ref(false);

onMounted(async () => {
  // 1. Vraag het student model welke KC de volgende is
  const nextKC = selectNextKC();
  
  if (nextKC) {
    // 2. Roep de API aan om content voor deze KC te genereren
    try {
      const response = await $fetch('/api/generateForKC', {
        method: 'POST',
        body: { kcId: nextKC.id }
      });
      storyData.value = response;
    } catch (error) {
      console.error("Kon verhaal voor KC niet laden:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    // 3. Geen KCs meer over? Toon de "voltooid" melding.
    allLearned.value = true;
    isLoading.value = false;
  }
});

const isCorrect = computed(() => {
  if (!storyData.value || selectedAnswerIndex.value === null) return false;
  return selectedAnswerIndex.value === storyData.value.correctAnswerIndex;
});

const handleNextStep = () => {
  // Update de kennis van de student op basis van het antwoord
  updateKCMastery(storyData.value.kcId, isCorrect.value);
  
  // Herlaad de pagina om de cyclus opnieuw te starten (volgende KC wordt geladen)
  router.go(0); 
};

const checkAnswer = () => {
  if (selectedAnswerIndex.value === null) return;

  showResult.value = true;
  
  // Wacht 2 seconden zodat de gebruiker de feedback kan zien, ga dan door.
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