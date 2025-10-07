<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-background font-display text-foreground">
    <div class="absolute inset-0 bg-black/50 z-10"></div>
    <div class="absolute top-0 left-0 w-[50rem] h-[50rem] bg-blue-500/30 rounded-full blur-[10rem] -translate-x-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-purple-500/30 rounded-full blur-[10rem] translate-x-1/2"></div>

    <div class="relative z-20 flex flex-col min-h-screen">
      <main class="flex-grow flex flex-col items-center justify-center text-center w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          Maak je verhaal
        </h1>
        <p class="text-lg text-muted-foreground mb-12 max-w-xl">
          Kies een onderwerp of upload een bestand en wij maken er een interactieve leerervaring van.
        </p>

        <div class="w-full max-w-5xl">
          <div class="border-b border-border/50">
            <div class="flex gap-2">
              <button
                @click="activeTab = 'start'"
                :class="[
                  'relative px-4 py-3 text-sm font-bold transition-colors',
                  activeTab === 'start' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                <span>Start een Verhaal</span>
              </button>
              <button
                @click="activeTab = 'upload'"
                :class="[
                  'relative px-4 py-3 text-sm font-bold transition-colors',
                  activeTab === 'upload' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                ]"
              >
                <span>Bestand Uploaden</span>
              </button>
            </div>
          </div>

          <div class="py-8">
            <transition name="fade" mode="out-in">
              <div v-if="activeTab === 'start'" class="space-y-4 text-left">
                <h3 class="text-lg font-bold text-foreground px-4">Kies een beschikbaar onderwerp</h3>
                <div class="flex flex-wrap gap-3 px-4">
                  <button
                    v-for="topic in predefinedTopics"
                    :key="topic.title"
                    @click="startTopic(topic)"
                    :disabled="!topic.active"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      topic.active
                        ? 'bg-[#1b212d] text-secondary-foreground/70 hover:bg-secondary hover:text-secondary-foreground'
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
                    <p class="text-lg font-medium text-foreground">Verhaal wordt gegenereerd...</p>
                  </div>
                  <div v-else class="flex flex-col items-center gap-4">
                     <div class="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                      <span class="material-symbols-outlined text-primary text-4xl">upload_file</span>
                    </div>
                    <div class="text-center">
                      <h2 class="text-xl font-bold text-foreground">{{ selectedFile ? 'Bestand geselecteerd' : 'Bestand Uploaden' }}</h2>
                      <p class="text-muted-foreground mt-1">{{ selectedFile ? selectedFile.name : 'Sleep je bestand hier of klik om te bladeren' }}</p>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">Ondersteunde bestandstypen: .txt, .pdf, .docx</p>
              </div>
            </transition>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { topics as predefinedTopics } from '../data/predefinedTopics.ts';

useHead({
  title: 'Maak je verhaal',
});

const activeTab = ref('start');
const fileInput = ref(null);
const selectedFile = ref(null);
const loading = ref(false);
const router = useRouter();

const startTopic = (topic) => {
  if (!topic.active) return;
  sessionStorage.removeItem('studentState');
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
    return alert('Selecteer alsjeblieft een bestand.');
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
    console.error("Fout bij genereren:", error);
    alert('Sorry, er ging iets mis bij het genereren van het verhaal. Probeer het opnieuw.');
  } finally {
    loading.value = false;
    selectedFile.value = null;
  }
}
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
:root {
  --background: 222 84% 4.9%; --foreground: 210 40% 98%; --card: 222 84% 4.9%;
  --card-foreground: 210 40% 98%; --popover: 222 84% 4.9%; --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%; --primary-foreground: 222.2 47.4% 11.2%; --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%; --muted: 217.2 32.6% 17.5%; --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%; --accent-foreground: 210 40% 98%; --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%; --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Inter', sans-serif;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
textarea {
  background-color: #1b212d;
}
</style>