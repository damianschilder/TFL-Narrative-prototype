// /components/pages/index/TopicSelection.vue
<template>
  <div class="w-full flex flex-col items-center">
    <div class="card-glass p-8 w-full max-w-2xl">
      <h3 class="text-xl font-bold text-foreground mb-6 text-left">{{ t('home.topic_selection_title') }}</h3>
      <div class="space-y-4">
        <div 
          v-for="topic in topics" 
          :key="topic.key"
          @click="emit('topic-selected', topic.key)"
          class="bg-secondary/30 border border-border/50 rounded-lg p-6 text-left cursor-pointer hover:border-primary/70 hover:bg-secondary/50 transition-all"
        >
          <h4 class="font-bold text-lg text-foreground">{{ t(topic.titleKey) }}</h4>
          <p class="text-muted-foreground mt-1">{{ t(topic.descriptionKey) }}</p>
        </div>
      </div>
    </div>

    <div class="h-12 mt-8 flex items-center justify-center">
      <transition name="fade">
        <p v-if="resetMessageVisible" class="text-success font-semibold">
          {{ t('home.reset_success') }}
        </p>
      </transition>
      <button v-if="!resetMessageVisible" @click="handleReset" class="text-sm text-destructive hover:underline opacity-70 hover:opacity-100 transition-opacity">
        {{ t('home.reset_progress') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  topics: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['topic-selected', 'reset-progress']);
const { t } = useI18n();
const resetMessageVisible = ref(false);

const handleReset = () => {
  emit('reset-progress');
  resetMessageVisible.value = true;
  setTimeout(() => {
    resetMessageVisible.value = false;
  }, 3000);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
