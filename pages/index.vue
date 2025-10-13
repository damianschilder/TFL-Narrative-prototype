<template>
  <main class="flex-grow flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-12">
    <HeroSection />

    <div class="w-full max-w-4xl mt-12 bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6 sm:p-8">
      
      <h2 class="text-xl sm:text-2xl font-bold text-card-foreground mb-4">{{ t('home.tijdvak_selection_title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tijdvak in tijdvakkenWithStats"
          :key="tijdvak.id"
          @click="selectTijdvak(tijdvak)"
          class="p-4 border rounded-lg transition-all duration-200 flex flex-col justify-between"
          :class="[
            selectedTijdvak?.id === tijdvak.id 
              ? 'border-primary bg-primary/10 ring-2 ring-primary' 
              : 'border-border/50',
            
            // Conditional styling based on availability
            tijdvak.availableAspecten > 0
              ? 'cursor-pointer hover:border-primary/70 hover:bg-accent/50'
              : 'opacity-50 bg-secondary/30 cursor-not-allowed',
            
            // Slightly dim partially available tijdvakken when not selected
            tijdvak.availableAspecten > 0 && tijdvak.availableAspecten < tijdvak.totalAspecten && selectedTijdvak?.id !== tijdvak.id
              ? 'opacity-80'
              : ''
          ]"
        >
          <div>
            <h3 class="font-semibold text-foreground">{{ tijdvak.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ tijdvak.period }}</p>
          </div>
          <div class="mt-3 text-xs font-medium flex items-center">
            <span 
              class="px-2 py-1 rounded-full"
              :class="{
                'bg-success/20 text-success-foreground': tijdvak.availableAspecten === tijdvak.totalAspecten && tijdvak.totalAspecten > 0,
                'bg-warning/20 text-warning-foreground': tijdvak.availableAspecten > 0 && tijdvak.availableAspecten < tijdvak.totalAspecten,
                'bg-muted text-muted-foreground': tijdvak.availableAspecten === 0
              }"
            >
              {{ t('home.aspects_available', { available: tijdvak.availableAspecten, total: tijdvak.totalAspecten }) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="selectedTijdvak" class="mt-8 pt-6 border-t border-border/50">
        <h2 class="text-xl sm:text-2xl font-bold text-card-foreground mb-4">{{ t('home.aspect_selection_title') }}</h2>
        <div class="space-y-3">
          <div
            v-for="aspect in selectedTijdvak.aspecten"
            :key="aspect.id"
            @click="selectAspect(aspect)"
            class="p-4 border rounded-lg transition-all duration-200 flex justify-between items-center"
            :class="[
              !aspect.isAvailable 
                ? 'opacity-50 bg-secondary/30 cursor-not-allowed'
                : selectedAspect?.id === aspect.id
                  ? 'border-success bg-success/10 ring-2 ring-success'
                  : 'border-border/50 hover:border-success/70 hover:bg-accent/50 cursor-pointer'
            ]"
          >
            <p class="text-foreground/90">{{ aspect.title }}</p>
            <span v-if="!aspect.isAvailable" class="text-xs font-semibold text-muted-foreground px-2 py-1 bg-secondary rounded-full">
              {{ t('home.coming_soon') }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            v-if="selectedAspect"
            @click="startLearning"
            :disabled="!selectedAspect.isAvailable"
            class="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:transform-none bg-primary hover:bg-primary/90 active:scale-95"
          >
            {{ t('home.start_learning') }}
          </button>
          <button @click="resetProgress" class="w-full sm:w-auto px-6 py-3 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/80 font-semibold rounded-lg hover:bg-destructive/20 dark:hover:bg-destructive/30 transition-colors duration-200">
            {{ t('home.reset_progress') }}
          </button>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'; // Import 'computed'
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { tijdvakken } from '~/data';
import { initializeStudentState } from '~/utils/studentModel';
import HeroSection from '~/components/pages/index/HeroSection.vue';

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

useHead({
  title: t('home.title'),
});

// Originele data
const alleTijdvakken = ref(tijdvakken);

// Berekent statistieken voor elk tijdvak.
const tijdvakkenWithStats = computed(() => {
  return alleTijdvakken.value.map(tijdvak => {
    const totalAspecten = tijdvak.aspecten.length;
    const availableAspecten = tijdvak.aspecten.filter(aspect => aspect.isAvailable).length;
    return {
      ...tijdvak,
      totalAspecten,
      availableAspecten,
    };
  });
});

// State voor de selecties van de gebruiker
const selectedTijdvak = ref(null);
const selectedAspect = ref(null);

/**
 * Wordt aangeroepen wanneer een gebruiker op een Tijdvak klikt.
 * Stelt het geselecteerde tijdvak in en reset de keuze voor het aspect,
 * maar alleen als er ten minste één aspect beschikbaar is.
 */
const selectTijdvak = (tijdvak) => {
  if (tijdvak.availableAspecten > 0) {
    // Als hetzelfde tijdvak opnieuw wordt geklikt, deselecteer het
    if (selectedTijdvak.value?.id === tijdvak.id) {
        selectedTijdvak.value = null;
        selectedAspect.value = null;
    } else {
        selectedTijdvak.value = tijdvak;
        selectedAspect.value = null;
    }
  }
};

/**
 * Wordt aangeroepen wanneer een gebruiker op een Kenmerkend Aspect klikt.
 * Stelt het geselecteerde aspect in, mits het beschikbaar is.
 */
const selectAspect = (aspect) => {
  if (aspect.isAvailable) {
    selectedAspect.value = aspect;
  }
};

/**
 * Start de onboarding flow door te navigeren naar de lees-pagina.
 */
const startLearning = () => {
  if (selectedAspect.value && selectedAspect.value.isAvailable) {
    const aspectId = selectedAspect.value.id;
    router.push(localePath(`/start/${aspectId}`));
  }
};

/**
 * Wist alle voortgang uit de sessionStorage en reset de selecties.
 */
const resetProgress = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('studentState');
    sessionStorage.removeItem('activeAspectKey');
    sessionStorage.removeItem('questionCountInLoop');
    sessionStorage.removeItem('preTestAnswers');
    
    // Reset de selecties op de pagina
    selectedTijdvak.value = null;
    selectedAspect.value = null;

    alert(t('home.reset_success'));
  }
};
</script>