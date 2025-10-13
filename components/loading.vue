<template>
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    aria-hidden="true"
  >
    <div 
      class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
/* We voegen de keyframes direct hier toe om het component op zichzelf staand te houden */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>