// /pages/progress.vue
<template>
  <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-4xl font-black text-foreground mb-4">{{ $t('progress.title') }}</h1>
    <p class="text-muted-foreground mb-12">{{ $t('progress.subtitle') }}</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="category in ['What', 'How', 'So what?']" :key="category">
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
              <div class="bg-green-400 h-2.5 rounded-full transition-all duration-500" :style="{ width: getMastery(kc.id) + '%' }"></div>
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
import { domainKnowledge } from '~/data/domainModel';
import { getStudentState } from '~/utils/studentModel';

const { t } = useI18n();
const studentState = ref([]);

useHead({
  title: t('progress.title'),
});

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
    return 'border border-green-500/60 bg-green-500/10';
  }
  if (mastery > 25) {
    return 'border border-yellow-500/60 bg-yellow-500/10';
  }
  return 'border border-border/30 bg-card/40';
};
</script>