// /pages/progress.vue
<template>
  <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-4xl font-black text-foreground mb-4">{{ pageTitle }}</h1>
    <p v-if="activeTopic" class="text-muted-foreground mb-12">{{ $t('progress.subtitle') }}</p>
    
    <div v-if="!activeTopic" class="text-center card-glass p-8">
      <p class="text-xl text-muted-foreground">{{ $t('progress.no_topic') }}</p>
      <NuxtLinkLocale to="/" class="mt-6 inline-block bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg">
        {{ $t('progress.button_start') }}
      </NuxtLinkLocale>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="category">
        <h2 class="text-2xl font-bold text-primary mb-4">{{ category }}</h2>
        <div class="space-y-4">
          <div
            v-for="kc in kcsByCategory[category]"
            :key="kc.id"
            class="rounded-xl p-4 transition-all backdrop-blur-xl shadow-lg shadow-black/20"
            :class="getKCClass(kc.id)"
          >
            <p class="font-semibold text-foreground/90">{{ kc.name }}</p>
            <div class="w-full bg-black/20 rounded-full h-2.5 mt-3 overflow-hidden">
              <div class="bg-green-400 h-2.5 rounded-full transition-all duration-500" :style="{ width: getMasteryPercent(kc.id) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { topics } from '~/data/topics';
import { getStudentState } from '~/utils/studentModel';

const { t } = useI18n();
const studentState = ref(null);
const activeTopic = ref(null);

const pageTitle = computed(() => {
  return activeTopic.value 
    ? t('progress.title_with_topic', { topic: activeTopic.value.title }) 
    : t('progress.title');
});

useHead({
  title: pageTitle,
});

onMounted(() => {
  // --- ADDED LOG ---
  console.log('[ProgressPage] Component mounted. Fetching progress data from sessionStorage.');

  if (typeof window !== 'undefined') {
    const activeTopicKey = sessionStorage.getItem('activeTopicKey');
    // --- ADDED LOG ---
    console.log('[ProgressPage] Found activeTopicKey:', activeTopicKey);

    if (activeTopicKey) {
      activeTopic.value = topics.find(t => t.key === activeTopicKey) || null;
      // --- ADDED LOG ---
      console.log('[ProgressPage] Resolved activeTopic:', activeTopic.value);
    }
    
    studentState.value = getStudentState();
    // --- ADDED LOG ---
    console.log('[ProgressPage] Fetched studentState:', studentState.value);

    // --- ADDED LOGS ---
    if (activeTopic.value && studentState.value) {
        console.log('[ProgressPage] Processed categories for display:', categories.value);
        console.log('[ProgressPage] Processed KCs grouped by category:', kcsByCategory.value);
    } else {
        console.warn('[ProgressPage] Could not log computed properties because activeTopic or studentState is missing.');
    }
  }
});

const categories = computed(() => {
  if (!activeTopic.value) return [];
  // Creates a unique list of categories present in the current topic
  const categorySet = new Set(activeTopic.value.domainKnowledge.map(kc => kc.category));
  return Array.from(categorySet);
});

const kcsByCategory = computed(() => {
  if (!activeTopic.value) return {};
  return activeTopic.value.domainKnowledge.reduce((acc, kc) => {
    if (!acc[kc.category]) {
      acc[kc.category] = [];
    }
    acc[kc.category].push(kc);
    return acc;
  }, {});
});

const getMastery = (kcId) => {
  return studentState.value && studentState.value[kcId] ? studentState.value[kcId].mastery : 0;
};

const getMasteryPercent = (kcId) => {
  return (getMastery(kcId) * 100).toFixed(0);
};

const getKCClass = (kcId) => {
  const mastery = getMastery(kcId);
  if (mastery >= 0.95) {
    return 'border border-green-500/60 bg-green-500/10';
  }
  if (mastery > 0.25) {
    return 'border border-yellow-500/60 bg-yellow-500/10';
  }
  return 'border border-border/30 bg-card/40';
};
</script>