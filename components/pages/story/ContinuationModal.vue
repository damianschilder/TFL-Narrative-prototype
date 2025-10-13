<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div @click.stop class="relative w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 text-center shadow-xl transition-all">
        
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <div class="mt-3 sm:mt-5">
          <h3 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
            {{ t('story.continuation.title') }}
          </h3>
          <div class="mt-2">
            <p class="text-base text-gray-600 dark:text-gray-300">
              {{ t('story.continuation.message') }}
            </p>
          </div>
        </div>

        <div class="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button 
            @click="emit('switch')"
            type="button" 
            class="inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2.5 text-base font-medium text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {{ t('story.continuation.switch_button') }}
          </button>
          <button 
            @click="emit('continue')"
            type="button" 
            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {{ t('story.continuation.continue_button') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Dit definieert de 'props' die de component accepteert van zijn parent (story.vue).
// 'show' is een boolean die bepaalt of de modal zichtbaar is.
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

// Dit definieert de custom events die de component kan uitsturen ('emitten') naar zijn parent.
// De parent (story.vue) luistert naar deze events om te weten welke knop is ingedrukt.
const emit = defineEmits(['continue', 'switch']);
</script>