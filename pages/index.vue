// /pages/index.vue
<template>
  <main class="flex-grow flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12">
    <HeroSection />
    <TopicSelection 
      :topics="availableTopics"
      @topic-selected="startTopic"
      @reset-progress="resetProgress"
    />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { topics } from '~/data/topics';
import { initializeStudentState } from '~/utils/studentModel';
import HeroSection from '~/components/pages/index/HeroSection.vue';
import TopicSelection from '~/components/pages/index/TopicSelection.vue';

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const availableTopics = topics;

useHead({
  title: t('home.title'),
});

const startTopic = (topicKey) => {
  initializeStudentState(topicKey);
  router.push(localePath('/story'));
};

const resetProgress = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('studentState');
    sessionStorage.removeItem('activeTopicKey');
  }
};
</script>

