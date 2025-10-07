<template>
  <div class="relative min-h-screen w-full bg-background font-display text-foreground">
    <div class="relative z-20 flex flex-col min-h-screen">
      <header class="w-full">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <NuxtLink to="/story" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold">
            <span class="material-symbols-outlined">arrow_back</span>
            Terug naar Leren
          </NuxtLink>
        </div>
      </header>
      
      <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl font-black text-foreground mb-8">Jouw Kenniskaart</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="category in ['What', 'How', 'So what?']" :key="category">
            <h2 class="text-2xl font-bold text-primary mb-4">{{ category }}</h2>
            <div class="space-y-3">
              <div 
                v-for="kc in kcsByCategory[category]" 
                :key="kc.id"
                class="border rounded-lg p-4 transition-colors"
                :class="getKCClass(kc.id)"
              >
                <p class="font-bold">{{ kc.name }}</p>
                <div class="w-full bg-border/50 rounded-full h-2.5 mt-2">
                  <div class="bg-green-500 h-2.5 rounded-full" :style="{ width: getMastery(kc.id) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { domainKnowledge } from '~/data/domainModel';
import { getStudentState } from '~/utils/studentModel';

const studentState = ref([]);

onMounted(() => {
  studentState.value = getStudentState();
});

const kcsByCategory = computed(() => {
  return domainKnowledge.reduce((acc, kc) => {
    if (!acc[kc.category]) {
      acc[kc.category] = [];
    }
    acc[kc.category].push(kc);
    return acc;
  }, {});
});

const getMastery = (kcId) => {
  const kc = studentState.value.find(s => s.kcId === kcId);
  return kc ? (kc.mastery * 100).toFixed(0) : 0;
};

const getKCClass = (kcId) => {
  const mastery = getMastery(kcId);
  if (mastery >= 95) {
    return 'border-green-500/50 bg-green-500/10';
  }
  if (mastery > 25) {
    return 'border-yellow-500/50 bg-yellow-500/10';
  }
  return 'border-border/50 bg-secondary/30';
};
</script>