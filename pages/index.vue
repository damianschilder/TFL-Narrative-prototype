<template>
  <main class="flex-grow flex flex-col items-center justify-center text-center w-full px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-gradient-end mb-4">
      {{ $t('home.title') }}
    </h1>
    <p class="text-lg text-muted-foreground mb-12 max-w-xl">
      {{ $t('home.subtitle') }}
    </p>

    <div class="card-glass p-8 w-full max-w-2xl">
      <h3 class="text-xl font-bold text-foreground mb-6 text-left">{{ $t('home.topic_selection_title') }}</h3>
      <div class="space-y-4">
        <div 
          v-for="topic in availableTopics" 
          :key="topic.key"
          @click="startTopic(topic.key)"
          class="bg-secondary/30 border border-border/50 rounded-lg p-6 text-left cursor-pointer hover:border-primary/70 hover:bg-secondary/50 transition-all"
        >
          <h4 class="font-bold text-lg text-foreground">{{ topic.title }}</h4>
          <p class="text-muted-foreground mt-1">{{ topic.description }}</p>
        </div>
      </div>
    </div>

    <div class="h-12 mt-8 flex items-center justify-center">
      <transition name="fade">
        <p v-if="resetMessageVisible" class="text-green-400 font-semibold">
          {{ $t('home.reset_success') }}
        </p>
      </transition>
      <button v-if="!resetMessageVisible" @click="resetProgress" class="text-sm text-destructive hover:underline opacity-70 hover:opacity-100 transition-opacity">
        {{ $t('home.reset_progress') }}
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { topics } from '~/data/topics';
import { initializeStudentState } from '~/utils/studentModel';

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const resetMessageVisible = ref(false);

const availableTopics = topics;

console.log('[IndexPage] Component setup complete. Ready for topic selection.');

useHead({
  title: t('home.title'),
});

const startTopic = (topicKey) => {
  console.log(`[IndexPage] Topic selected: '${topicKey}'. Initializing student state and navigating to /story.`);
  initializeStudentState(topicKey);
  router.push(localePath('/story'));
};

const resetProgress = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('studentState');
    sessionStorage.removeItem('activeTopicKey');
    console.log('[IndexPage] All progress has been reset.');
    
    resetMessageVisible.value = true;
    setTimeout(() => {
      resetMessageVisible.value = false;
    }, 3000);
  }
};
</script>
