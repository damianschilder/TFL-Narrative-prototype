// /pages/progress.vue
<template>
  <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <ProgressHeader :page-title="pageTitle" :has-active-topic="!!activeTopic" />
    
    <NoTopicMessage v-if="!activeTopic" />

    <ProgressGrid 
      v-else 
      :categories="categories"
      :kcs-by-category="kcsByCategory"
      :student-state="studentState"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { topics } from '~/data/topics';
import { getStudentState } from '~/utils/studentModel';
import ProgressHeader from '~/components/pages/progress/ProgressHeader.vue';
import NoTopicMessage from '~/components/pages/progress/NoTopicMessage.vue';
import ProgressGrid from '~/components/pages/progress/ProgressGrid.vue';

const { t } = useI18n();
const studentState = ref(null);
const activeTopic = ref(null);

const pageTitle = computed(() => {
  return activeTopic.value 
    ? t('progress.title_with_topic', { topic: t(activeTopic.value.titleKey) }) 
    : t('progress.title');
});

useHead({
  title: pageTitle,
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    const activeTopicKey = sessionStorage.getItem('activeTopicKey');
    if (activeTopicKey) {
      activeTopic.value = topics.find(t => t.key === activeTopicKey) || null;
    }
    studentState.value = getStudentState();
  }
});

const categories = computed(() => {
  if (!activeTopic.value) return [];
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
</script>

