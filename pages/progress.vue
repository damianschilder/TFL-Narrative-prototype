<template>
  <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-4xl font-black text-foreground mb-2">{{ pageTitle }}</h1>
      <p v-if="!activeAspect" class="text-muted-foreground">{{ t('progress.selection_subtitle', 'Kies een onderwerp om je voortgang te bekijken.') }}</p>
      <div v-else class="flex items-center">
        <p class="text-muted-foreground">{{ t('progress.subtitle') }}</p>
        <button @click="clearSelection" class="ml-4 text-sm font-semibold text-primary hover:underline">
          {{ t('progress.select_other_topic', 'Kies ander onderwerp') }}
        </button>
      </div>
    </div>

    <!-- Selection View: Shown when no aspect is selected -->
    <div v-if="!activeAspect" class="w-full mt-12">
      <div v-if="!studentState || availableTijdvakken.length === 0" class="text-center py-16 bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-foreground">{{ t('progress.no_progress_title', 'Nog geen voortgang') }}</h2>
        <p class="text-muted-foreground mt-2">{{ t('progress.no_progress_subtitle', 'Start een leersessie om je voortgang hier te zien.') }}</p>
        <NuxtLink :to="localePath('/')" class="mt-6 inline-block bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors">
          {{ t('home.start_learning') }}
        </NuxtLink>
      </div>
      
      <div v-else class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6 sm:p-8">
        <!-- Tijdvak Selection -->
        <h2 class="text-xl sm:text-2xl font-bold text-card-foreground mb-4">{{ t('home.tijdvak_selection_title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="tijdvak in availableTijdvakken"
            :key="tijdvak.id"
            @click="selectTijdvak(tijdvak)"
            class="p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-primary/70 hover:bg-accent/50 flex flex-col justify-between"
            :class="[ selectedTijdvak?.id === tijdvak.id ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border/50' ]"
          >
            <div>
              <h3 class="font-semibold text-foreground">{{ t(`tijdvakken.${tijdvak.id}.title`) }}</h3>
              <p class="text-sm text-muted-foreground">{{ t(`tijdvakken.${tijdvak.id}.period`) }}</p>
            </div>
          </div>
        </div>

        <!-- Aspect Selection -->
        <div v-if="selectedTijdvak" class="mt-8 pt-6 border-t border-border/50">
          <h2 class="text-xl sm:text-2xl font-bold text-card-foreground mb-4">{{ t('home.aspect_selection_title') }}</h2>
          <div class="space-y-3">
            <div
              v-for="aspect in selectedTijdvak.aspecten"
              :key="aspect.id"
              @click="selectAspect(aspect)"
              class="p-4 border rounded-lg transition-all duration-200 flex justify-between items-center cursor-pointer border-border/50 hover:border-success/70 hover:bg-accent/50"
            >
              <p class="text-foreground/90">{{ t(`kenmerkende_aspecten.${aspect.id}.title`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress Dashboard: Shown when an aspect is selected -->
    <div v-else class="space-y-8 mt-12">
      <!-- KPIs Dashboard -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 class="text-sm font-semibold text-muted-foreground uppercase">{{ t('progress.kpi.average_mastery') }}</h3>
          <p class="text-4xl font-bold text-foreground mt-2">{{ kpiData.averageMastery }}%</p>
        </div>
        <div class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 class="text-sm font-semibold text-muted-foreground uppercase">{{ t('progress.kpi.current_level') }}</h3>
          <p class="text-4xl font-bold text-foreground mt-2">{{ kpiData.currentLevel }}</p>
        </div>
        <div class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 class="text-sm font-semibold text-muted-foreground uppercase">{{ t('progress.kpi.total_attempts') }}</h3>
          <p class="text-4xl font-bold text-foreground mt-2">{{ kpiData.totalAttempts }}</p>
        </div>
        <div class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 class="text-sm font-semibold text-muted-foreground uppercase">{{ t('progress.kpi.completed_kcs') }}</h3>
          <p class="text-4xl font-bold text-foreground mt-2">{{ kpiData.masteredKCCount }} / {{ kpiData.totalKCCount }}</p>
        </div>
      </div>

      <!-- NEW: Mastery Over Time Chart -->
      <div class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-foreground mb-4">{{ t('progress.history_chart.title') }}</h3>
        <div v-if="historyChartData.points.length > 1" class="relative w-full h-72">
          <svg :viewBox="`0 0 ${historyChartData.width} ${historyChartData.height}`" class="w-full h-full">
            <!-- Y-axis grid lines and labels -->
            <g v-for="tick in historyChartData.yTicks" :key="tick.y" class="text-xs text-muted-foreground">
              <line :x1="historyChartData.margin.left" :x2="historyChartData.width - historyChartData.margin.right" :y1="tick.y" :y2="tick.y" class="stroke-border/50" stroke-dasharray="2,3" />
              <text :x="historyChartData.margin.left - 10" :y="tick.y" dy="0.32em" text-anchor="end" class="fill-current">{{ tick.label }}%</text>
            </g>
            <!-- X-axis labels -->
            <g v-for="(point, index) in historyChartData.points" :key="index" class="text-xs text-muted-foreground">
                <text :x="point.x" :y="historyChartData.height - historyChartData.margin.bottom + 15" text-anchor="middle" class="fill-current">Q{{ index + 1 }}</text>
            </g>

            <!-- Line Path -->
            <path :d="historyChartData.linePath" fill="none" class="stroke-primary" stroke-width="2" />
            
            <!-- Data Points -->
            <g v-for="(point, index) in historyChartData.points" :key="index">
              <circle :cx="point.x" :cy="point.y" r="4" class="fill-primary" />
            </g>
          </svg>
        </div>
        <div v-else class="text-center py-12">
            <p class="text-muted-foreground">{{ t('progress.history_chart.no_data') }}</p>
        </div>
      </div>

      <!-- Mastery Chart -->
      <div class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-foreground mb-4">{{ t('progress.chart.title') }}</h3>
        <div v-if="chartData.length" class="h-64 flex items-end gap-x-4 pt-4 border-t border-border/50 overflow-x-auto pb-4">
          <div v-for="kc in chartData" :key="kc.title" class="relative flex-1 min-w-[4rem] group">
            <div 
              class="w-full rounded-t-lg transition-all duration-300 bg-opacity-40 group-hover:bg-opacity-60"
              :class="getMasteryColor(kc.masteryPercentage / 100)"
              :style="{ height: `${kc.masteryPercentage}%` }"
            ></div>
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-secondary px-2 py-1 rounded-md text-secondary-foreground text-sm font-bold shadow-lg">
              {{ kc.masteryPercentage }}%
            </div>
            <p class="text-xs text-muted-foreground text-center mt-2 whitespace-pre-line group-hover:text-foreground">
              {{ kc.title }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-12">
            <p class="text-muted-foreground">{{ t('progress.chart.no_data', 'Geen component data om te tonen.') }}</p>
        </div>
      </div>

      <!-- Detailed Grid -->
      <div class="space-y-8">
        <div v-for="category in categories" :key="category">
          <h3 class="text-2xl font-bold text-primary mb-4">{{ t(`kcs.categories.${category}`) }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="kc in kcsByCategory[category]" 
              :key="kc.id"
              class="bg-card/60 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg p-5 flex flex-col justify-between gap-y-4"
            >
              <p class="font-semibold text-foreground/90">{{ t(`kcs.${kc.id}.name`) }}</p>
              
              <div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div 
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="getMasteryColor(studentState[kc.id]?.mastery || 0)"
                  :style="{ width: `${(studentState[kc.id]?.mastery || 0) * 100}%` }"
                ></div>
              </div>

              <div class="flex justify-between items-center text-sm text-muted-foreground font-medium">
                <div>
                  <span class="font-bold text-foreground">{{ Math.round((studentState[kc.id]?.mastery || 0) * 100) }}%</span>
                  {{ t('progress.grid.mastery') }}
                </div>
                <div>
                  <span class="font-bold text-foreground">{{ studentState[kc.id]?.attempts || 0 }}</span>
                  {{ t('progress.grid.attempts') }}
                </div>
              </div>
              
              <div class="text-xs font-semibold self-start px-2 py-1 rounded-full" :class="getMasteryTagClass(studentState[kc.id]?.mastery || 0)">
                {{ getMasteryStatus(studentState[kc.id]?.mastery || 0) }}
              </div>
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
import { tijdvakken } from '~/data';
import { getStudentState } from '~/utils/studentModel';

const { t } = useI18n();
const localePath = useLocalePath();
const studentState = ref(null);
const activeAspect = ref(null);
const selectedTijdvak = ref(null);
const masteryHistory = ref([]);

// --- Computed Properties for Data Handling ---
const pageTitle = computed(() => {
  if (activeAspect.value) {
    return t('progress.title_with_topic', { topic: t(`kenmerkende_aspecten.${activeAspect.value.id}.title`) });
  }
  return t('progress.title');
});

useHead({ title: pageTitle });

// --- Lifecycle ---
onMounted(() => {
  if (typeof window !== 'undefined') {
    studentState.value = getStudentState();
    const activeAspectKey = sessionStorage.getItem('activeProgressAspectKey');
    
    // Load mastery history and add mock data if empty for demonstration
    const storedHistory = sessionStorage.getItem('masteryHistory');
    if (storedHistory) {
      masteryHistory.value = JSON.parse(storedHistory);
    } else {
      // MOCK DATA for demonstration purposes
      masteryHistory.value = [
        { timestamp: Date.now() - 50000, averageMastery: 0.15 },
        { timestamp: Date.now() - 40000, averageMastery: 0.20 },
        { timestamp: Date.now() - 30000, averageMastery: 0.45 },
        { timestamp: Date.now() - 20000, averageMastery: 0.40 },
        { timestamp: Date.now() - 10000, averageMastery: 0.60 },
        { timestamp: Date.now(), averageMastery: 0.75 },
      ];
    }
    
    if (activeAspectKey && studentState.value) {
      for (const tijdvak of tijdvakken) {
        const foundAspect = tijdvak.aspecten.find(a => a.id === activeAspectKey);
        if (foundAspect) {
          activeAspect.value = foundAspect;
          break;
        }
      }
    }
  }
});

const practicedKcIds = computed(() => new Set(Object.keys(studentState.value || {})));

const availableTijdvakken = computed(() => {
  if (!practicedKcIds.value.size) return [];
  return tijdvakken.map(tijdvak => {
    const practicedAspecten = tijdvak.aspecten.filter(aspect =>
      (aspect.knowledgeComponents || []).some(kc => practicedKcIds.value.has(kc.id))
    );
    return practicedAspecten.length > 0 ? { ...tijdvak, aspecten: practicedAspecten } : null;
  }).filter(Boolean);
});


// --- Selection Methods ---
const selectTijdvak = (tijdvak) => {
  selectedTijdvak.value = selectedTijdvak.value?.id === tijdvak.id ? null : tijdvak;
};

const selectAspect = (aspect) => {
  activeAspect.value = aspect;
  if (typeof window !== 'undefined') sessionStorage.setItem('activeProgressAspectKey', aspect.id);
};

const clearSelection = () => {
  activeAspect.value = null;
  selectedTijdvak.value = null;
  if (typeof window !== 'undefined') sessionStorage.removeItem('activeProgressAspectKey');
};

// --- Dashboard Computed Properties ---
const kpiData = computed(() => {
    if (!activeAspect.value || !studentState.value) return {};
    const kcs = activeAspect.value.knowledgeComponents || [];
    if (kcs.length === 0) return { averageMastery: 0, totalAttempts: 0, masteredKCCount: 0, totalKCCount: 0, currentLevel: t('progress.levels.beginner') };

    let totalMastery = 0, totalAttempts = 0, masteredKCCount = 0;
    kcs.forEach(kc => {
        const state = studentState.value[kc.id] || { mastery: 0, attempts: 0 };
        totalMastery += state.mastery;
        totalAttempts += state.attempts;
        if (state.mastery >= 0.85) masteredKCCount++;
    });

    const averageMastery = totalMastery / kcs.length;
    let currentLevel = t('progress.levels.beginner');
    if (averageMastery >= 0.85) currentLevel = t('progress.levels.expert');
    else if (averageMastery >= 0.75) currentLevel = t('progress.levels.advanced');
    else if (averageMastery >= 0.5) currentLevel = t('progress.levels.intermediate');

    return {
        averageMastery: Math.round(averageMastery * 100),
        totalAttempts,
        masteredKCCount,
        totalKCCount: kcs.length,
        currentLevel,
    };
});

const chartData = computed(() => {
  // --- LOGGING ADDED FOR DEBUGGING ---
  console.log('--- Recalculating chartData ---');
  if (!activeAspect.value) {
    console.log('chartData is empty because activeAspect is not set.');
    return [];
  }
  if (!studentState.value) {
    console.log('chartData is empty because studentState is not available.');
    return [];
  }
  
  const kcs = activeAspect.value.knowledgeComponents || [];
  console.log(`Found ${kcs.length} knowledge components for aspect "${activeAspect.value.id}".`);

  if (kcs.length === 0) {
    return [];
  }

  const data = kcs.map(kc => {
    const state = studentState.value[kc.id] || { mastery: 0 };
    return {
      title: t(`kcs.${kc.id}.name`),
      masteryPercentage: Math.round(state.mastery * 100),
    };
  });

  console.log('Generated chartData:', JSON.parse(JSON.stringify(data)));
  return data;
});


// --- NEW: History Chart Logic ---
const historyChartData = computed(() => {
    const data = masteryHistory.value.map(item => item.averageMastery);
    const width = 500;
    const height = 288; // 18rem
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = (index) => margin.left + (index / (data.length - 1)) * xMax;
    const yScale = (value) => height - margin.bottom - (value * yMax);
    
    const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d) }));
    const linePath = "M" + points.map(p => `${p.x},${p.y}`).join(" L");

    const yTicks = [0, 25, 50, 75, 100].map(val => ({
        y: yScale(val / 100),
        label: val
    }));

    return { width, height, margin, points, linePath, yTicks };
});


const categories = computed(() => Array.from(new Set((activeAspect.value?.knowledgeComponents || []).map(kc => kc.category))));
const kcsByCategory = computed(() => {
  return (activeAspect.value?.knowledgeComponents || []).reduce((acc, kc) => {
    (acc[kc.category] = acc[kc.category] || []).push(kc);
    return acc;
  }, {});
});


// --- Helper Functions for Styling ---
const getMasteryColor = (m) => m >= 0.85 ? 'bg-success' : m >= 0.5 ? 'bg-warning' : 'bg-destructive';
const getMasteryTagClass = (m) => m >= 0.85 ? 'bg-success/20 text-success-foreground' : m >= 0.5 ? 'bg-warning/20 text-warning-foreground' : 'bg-destructive/20 text-destructive-foreground';
const getMasteryStatus = (m) => m >= 0.85 ? t('progress.levels.mastered') : m >= 0.5 ? t('progress.levels.practicing') : t('progress.levels.needs_review');
</script>

