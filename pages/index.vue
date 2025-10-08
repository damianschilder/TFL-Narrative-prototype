<template>
  <main class="flex-grow flex flex-col items-center justify-center text-center w-full px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-gradient-end mb-4">
      {{ $t('home.title') }}
    </h1>
    <p class="text-lg text-muted-foreground mb-12 max-w-xl">
      {{ $t('home.subtitle') }}
    </p>

    <div class="card-glass p-8 w-full max-w-5xl">
      <div class="border-b border-border/50">
        <div class="flex gap-2">
          <button
            @click="activeTab = 'start'"
            :class="[
              'relative px-4 py-3 text-sm font-bold transition-colors',
              activeTab === 'start' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span>{{ $t('home.tabs.story') }}</span>
          </button>
          <button
            @click="activeTab = 'upload'"
            :class="[
              'relative px-4 py-3 text-sm font-bold transition-colors',
              activeTab === 'upload' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            <span>{{ $t('home.tabs.upload') }}</span>
          </button>
        </div>
      </div>

      <div class="py-8">
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'start'" class="space-y-4 text-left">
            <h3 class="text-lg font-bold text-foreground px-4">{{ $t('home.topics.title') }}</h3>
            <div class="flex flex-wrap gap-3 px-4">
              <button
                v-for="topic in predefinedTopics"
                :key="topic.title"
                @click="startTopic(topic)"
                :disabled="!topic.active"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  topic.active
                    ? 'bg-secondary text-secondary-foreground/70 hover:bg-secondary/80 hover:text-secondary-foreground'
                    : 'bg-secondary/20 text-muted-foreground/50 cursor-not-allowed opacity-50'
                ]"
              >
                {{ topic.title }}
              </button>
            </div>
          </div>

          <div v-else class="flex flex-col items-center space-y-6">
            <div @dragover.prevent @drop.prevent="handleFileDrop" @click="triggerFileInput" class="w-full p-10 border-2 border-dashed border-border/50 rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors">
              <input type="file" ref="fileInput" @change="handleFileSelect" class="hidden" accept=".txt,.pdf,.docx">
              
              <div v-if="loading" class="flex flex-col items-center justify-center space-y-4">
                <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-lg font-medium text-foreground">{{ $t('home.upload.loading') }}</p>
              </div>
              
              <div v-else class="flex flex-col items-center gap-4">
                  <div class="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                   <span class="material-symbols-outlined text-primary text-4xl">upload_file</span>
                  </div>
                  <div class="text-center">
                    <h2 class="text-xl font-bold text-foreground">{{ $t(selectedFile ? 'home.upload.title_selected' : 'home.upload.title_upload') }}</h2>
                    <p class="text-muted-foreground mt-1">{{ selectedFile ? selectedFile.name : $t('home.upload.prompt') }}</p>
                  </div>
              </div>
            </div>
            <p class="text-sm text-muted-foreground">{{ $t('home.upload.supported_files') }}</p>
          </div>
        </transition>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { topics as predefinedTopics } from '../data/predefinedTopics.ts';

const { t } = useI18n();

useHead({
  title: t('home.title'),
});

const activeTab = ref('start');
const fileInput = ref(null);
const selectedFile = ref(null);
const loading = ref(false);
const router = useRouter();

const startTopic = (topic) => {
  if (!topic.active) return;
  sessionStorage.removeItem('studentState');
  // For simplicity, assuming a default story generation for predefined topics
  sessionStorage.setItem('storyData', JSON.stringify({ isPredefined: true, topic: topic.title }));
  router.push('/story');
};

const triggerFileInput = () => {
  if (loading.value) return;
  fileInput.value.click();
};

const handleFileChange = (file) => {
  if (!file || loading.value) return;
  selectedFile.value = file;
  generateStoryFromFile();
};

const handleFileSelect = (event) => {
  handleFileChange(event.target.files[0]);
};

const handleFileDrop = (event) => {
  handleFileChange(event.dataTransfer.files[0]);
};

async function generateStoryFromFile() {
  if (!selectedFile.value) {
    // Replace alert with a more user-friendly notification if possible
    console.warn('Please select a file.');
    return;
  }
  loading.value = true;
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const responseData = await $fetch('/api/generateFromFile', {
      method: 'POST',
      body: formData
    });
    sessionStorage.setItem('storyData', JSON.stringify(responseData));
    router.push({ path: '/story' });
  } catch (error) {
    console.error("Error during generation:", error);
    // Replace alert with a more user-friendly notification
    console.error('Sorry, something went wrong while generating the story. Please try again.');
  } finally {
    loading.value = false;
    selectedFile.value = null;
  }
}
</script>