<template>
  <main class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div v-if="content" class="card-glass p-6 sm:p-8 space-y-6">
      <!-- Gebruik nu de themakleuren voor de titel -->
      <h1 class="text-3xl font-bold text-foreground">{{ content.title }}</h1>
      
      <!-- Gebruik nu de themakleuren voor de introductietekst -->
      <p class="text-lg text-muted-foreground leading-relaxed">
        {{ content.introduction }}
      </p>
      
      <!-- De 'prose' class is vervangen door handmatige styling die het thema respecteert -->
      <div class="space-y-4 text-foreground/90">
        <p>{{ content.narrative }}</p>
        <ul class="space-y-2 list-disc pl-5">
          <!-- Aangepast: v-html in een aparte span voor correcte rendering -->
          <li v-for="(point, index) in content.bulletPoints" :key="index" class="marker:text-primary">
            <span v-html="point"></span>
          </li>
        </ul>
      </div>

      <div class="pt-6">
        <button 
          @click="startPreTest"
          class="w-full px-6 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary/90 active:scale-95"
        >
          Ik ben er klaar voor, start de test
        </button>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">Content wordt geladen of is niet gevonden...</p>
    </div>
  </main>
</template>

<script setup>
import { propagandaContent } from '~/data/content/ka-propaganda';
import { initializeStudentState } from '~/utils/studentModel';

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const aspectId = route.params.id;

// Voor nu laden we statische content. Dit kun je later dynamisch maken.
const content = aspectId === 'ka-propaganda' ? propagandaContent : null;

const startPreTest = () => {
  // Initialiseer de student state met de KCs van dit aspect
  initializeStudentState(aspectId);
  // Navigeer naar de pre-test pagina
  router.push(localePath('/pre-test'));
};

// SEO en paginatitel
useHead({
  title: content ? content.title : 'Leesstof'
});
</script>

