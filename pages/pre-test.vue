<template>
  <main 
    class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
    :class="{
      'py-12': !isLoading,
      'flex items-center justify-center min-h-[calc(100vh-8rem)]': isLoading
    }"
  >
    <!-- Improved Loading State -->
    <div v-if="isLoading" class="text-center flex flex-col items-center gap-4">
      <div 
        class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
      >
        <span class="sr-only">Bezig met laden...</span>
      </div>
      <p class="text-muted-foreground">Je voortoets wordt klaargezet...</p>
    </div>

    <!-- Question View -->
    <div v-else-if="questions.length > 0 && currentQuestion" class="w-full">
      <div class="card-glass p-6 sm:p-8 w-full">
        <div class="mb-6">
          <p class="text-sm font-medium text-muted-foreground mb-2">Vraag {{ currentQuestionIndex + 1 }} van {{ questions.length }}</p>
          <div class="w-full bg-secondary rounded-full h-2.5">
            <div class="bg-primary h-2.5 rounded-full" :style="{ width: progressPercentage }"></div>
          </div>
        </div>

        <h2 class="text-2xl font-semibold mb-6">{{ currentQuestion.question }}</h2>

        <div class="space-y-4">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            @click="selectAnswer(index)"
            class="p-4 border rounded-lg cursor-pointer transition-colors"
            :class="userAnswers[currentQuestionIndex] === index ? 'bg-primary/20 border-primary ring-2 ring-primary' : 'border-border/50 hover:bg-accent/50 hover:border-primary/70'"
          >
            {{ option }}
          </div>
        </div>

        <div class="mt-8 text-right">
          <button 
            @click="nextQuestion"
            :disabled="userAnswers[currentQuestionIndex] === null"
            class="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:transform-none hover:bg-primary/90 active:scale-95"
          >
            {{ isLastQuestion ? 'Verstuur antwoorden' : 'Volgende vraag' }}
          </button>
        </div>
      </div>
      
      <!-- Debug Section -->
      <div v-if="isDev" class="mt-8 border-2 border-dashed border-warning/60 rounded-lg p-4">
        <h3 class="font-semibold text-warning mb-3">Debug Controls</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Automatically fill answers to test different tiers. Assumes option 2 is 'correct'.
        </p>
        <div class="flex gap-4">
          <button @click="debugFillAnswers('advanced')" class="px-4 py-2 text-sm bg-success/20 text-success rounded-md hover:bg-success/30">
            Set Advanced (9/10)
          </button>
          <button @click="debugFillAnswers('intermediate')" class="px-4 py-2 text-sm bg-warning/20 text-warning rounded-md hover:bg-warning/30">
            Set Intermediate (5/10)
          </button>
           <button @click="debugFillAnswers('beginner')" class="px-4 py-2 text-sm bg-destructive/20 text-destructive rounded-md hover:bg-destructive/30">
            Set Beginner (2/10)
          </button>
        </div>
      </div>

    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
      <p class="text-lg font-semibold text-destructive">Kon de voortoets niet laden.</p>
      <p class="text-muted-foreground mt-2">Er was een probleem bij het genereren van de vragen. Probeer het later opnieuw.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-primary font-bold">Terug naar de selectie</NuxtLink>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const questions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref([]);
const isLoading = ref(true);
const router = useRouter();
const localePath = useLocalePath();
// The debug panel is now always enabled.
const isDev = true;

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const progressPercentage = computed(() => `${((currentQuestionIndex.value + 1) / (questions.value.length || 1)) * 100}%`);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

onMounted(async () => {
  const aspectId = sessionStorage.getItem('activeAspectKey');
  if (!aspectId) {
    router.push('/');
    return;
  }
  try {
    const data = await $fetch('/api/pre-test/generate', {
      method: 'POST',
      body: { aspectId }
    });
    // Ensure we received a valid array
    if (Array.isArray(data) && data.length > 0) {
        questions.value = data;
        userAnswers.value = new Array(data.length).fill(null);
    } else {
        console.error("API did not return a valid question array:", data);
        questions.value = []; // Set to empty to show error message
    }
  } catch (error) {
    console.error("Could not load pre-test:", error);
    questions.value = [];
  } finally {
    isLoading.value = false;
  }
});

const selectAnswer = (index) => {
  userAnswers.value[currentQuestionIndex.value] = index;
};

const nextQuestion = () => {
  if (userAnswers.value[currentQuestionIndex.value] === null) return; // Prevent proceeding without an answer

  if (isLastQuestion.value) {
    // Save the answers and navigate to the insights page for assessment
    sessionStorage.setItem('preTestAnswers', JSON.stringify({
        questions: questions.value,
        answers: userAnswers.value,
    }));
    router.push(localePath('/insights'));
  } else {
    currentQuestionIndex.value++;
  }
};

/**
 * DEBUG FUNCTION: Fills answers to simulate a user's performance.
 * Assumes option index 1 is 'correct' and 0 is 'incorrect' for simplicity.
 */
const debugFillAnswers = (tier) => {
  if (!questions.value.length) return;

  const total = questions.value.length;
  let correctCount;

  switch(tier) {
    case 'advanced':
      correctCount = 9;
      break;
    case 'intermediate':
      correctCount = 5;
      break;
    default: // beginner
      correctCount = 2;
      break;
  }
  
  const newAnswers = questions.value.map((_, index) => {
    // Make the first `correctCount` answers 'correct' (index 1), the rest 'incorrect' (index 0)
    return index < correctCount ? 1 : 0;
  });

  userAnswers.value = newAnswers;
  // Go to the last question so the user can immediately finish the test
  currentQuestionIndex.value = total - 1;
};


useHead({
  title: 'Voortoets'
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

