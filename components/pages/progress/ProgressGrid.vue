// /components/pages/progress/ProgressGrid.vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="category in categories" :key="category">
      <h2 class="text-2xl font-bold text-primary mb-4">{{ t(`progress.categories.${category}`, category) }}</h2>
      <div class="space-y-4">
        <div
          v-for="kc in kcsByCategory[category]"
          :key="kc.id"
          class="rounded-xl p-4 transition-all backdrop-blur-xl shadow-lg shadow-black/20"
          :class="getKCClass(kc.id)"
        >
          <p class="font-semibold text-foreground/90">{{ t(kc.nameKey) }}</p>
          <div class="w-full bg-black/20 rounded-full h-2.5 mt-3 overflow-hidden">
            <div class="bg-success h-2.5 rounded-full transition-all duration-500" :style="{ width: getMasteryPercent(kc.id) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  categories: Array,
  kcsByCategory: Object,
  studentState: Object,
});

const { t } = useI18n();

const getMastery = (kcId) => {
  return props.studentState && props.studentState[kcId] ? props.studentState[kcId].mastery : 0;
};

const getMasteryPercent = (kcId) => {
  return (getMastery(kcId) * 100).toFixed(0);
};

const getKCClass = (kcId) => {
  const mastery = getMastery(kcId);
  if (mastery >= 0.95) {
    return 'border border-success/60 bg-success/10';
  }
  if (mastery > 0.25) {
    return 'border border-warning/60 bg-warning/10';
  }
  return 'border border-border/30 bg-card/40';
};
</script>
