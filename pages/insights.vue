<template>
  <main class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center flex flex-col items-center gap-4">
      <div 
        class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
      >
        <span class="sr-only">Bezig met laden...</span>
      </div>
      <p class="text-muted-foreground">Je antwoorden worden geanalyseerd...</p>
    </div>
    
    <!-- Results View -->
    <div v-else-if="results" class="card-glass p-8 text-center w-full">
      <h1 class="text-3xl font-bold text-foreground">Resultaten Voortoets</h1>
      
      <div class="my-8">
        <p class="text-lg text-muted-foreground">Je had</p>
        <p class="text-6xl font-black text-primary my-2">
          {{ results.correctCount }} / {{ results.totalQuestions }}
        </p>
        <p class="text-lg text-muted-foreground">vragen goed.</p>
      </div>

      <div class="bg-accent/50 rounded-lg p-6">
        <h2 class="text-muted-foreground font-semibold">JOUW STARTNIVEAU</h2>
        <p class="text-4xl font-bold text-foreground mt-2">{{ results.tier }}</p>
        <p class="mt-4 text-muted-foreground max-w-md mx-auto">{{ getTierDescription(results.tier) }}</p>
      </div>

      <div class="mt-8">
        <button @click="startLearning" class="w-full max-w-xs mx-auto px-6 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg shadow-md transition-transform duration-200 hover:scale-105 active:scale-95">
          Start met Leren
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
        <p class="text-lg font-semibold text-destructive">Kon je resultaten niet laden.</p>
        <p class="text-muted-foreground mt-2">Er was een probleem bij het analyseren van je antwoorden. Probeer het later opnieuw.</p>
        <NuxtLink to="/" class="mt-4 inline-block text-primary font-bold">Terug naar de selectie</NuxtLink>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const results = ref(null);
const router = useRouter();
const localePath = useLocalePath();

onMounted(async () => {
  const preTestAnswersRaw = sessionStorage.getItem('preTestAnswers');
  const aspectId = sessionStorage.getItem('activeAspectKey');

  if (!preTestAnswersRaw || !aspectId) {
    router.push(localePath('/'));
    return;
  }

  try {
    const preTestData = JSON.parse(preTestAnswersRaw);
    
    // Use the global $fetch directly, this was the fix.
    const assessment = await $fetch('/api/pre-test/assess', {
      method: 'POST',
      body: { 
        questions: preTestData.questions, 
        answers: preTestData.answers,
        aspectId: aspectId
      }
    });

    results.value = assessment;

    // CRUCIAL: Save the calculated student state to sessionStorage
    sessionStorage.setItem('studentState', JSON.stringify(assessment.updatedStudentState));

  } catch (error) {
    console.error("Failed to assess pre-test:", error);
    results.value = null; // Ensure the error message is shown
  } finally {
    isLoading.value = false;
    sessionStorage.removeItem('preTestAnswers'); // Clean up
  }
});

const getTierDescription = (tier) => {
  if (tier === 'Advanced') return "Je hebt een solide basis. We beginnen met uitdagendere concepten om je begrip te verdiepen.";
  if (tier === 'Intermediate') return "Je kent de basis. We focussen ons op het versterken van je kennis en het leggen van verbanden.";
  return "Geen probleem! We beginnen bij het begin met verhalende content om je kennis stap voor stap op te bouwen.";
};

const startLearning = () => {
  router.push(localePath('/story'));
};

useHead({
  title: 'Resultaten Voortoets'
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

