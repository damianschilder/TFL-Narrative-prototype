// /components/shared/DebugInfo.vue
<template>
  <div v-if="isDev" class="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-lg border border-border rounded-lg p-4 shadow-2xl max-w-sm text-xs font-mono">
    <h3 class="font-bold text-base mb-2 text-foreground flex items-center gap-2">
      <span class="material-symbols-outlined text-accent">bug_report</span>
      Debug Info (nuxt-auth-utils)
    </h3>
    
    <div class="space-y-3">
      <div>
        <p class="font-semibold text-muted-foreground">Client Session (`useUserSession`):</p>
        <pre class="bg-black/20 p-2 rounded-md overflow-x-auto"><code>{{ { loggedIn: session.loggedIn.value, user: session.user.value } }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isDev = process.dev
const session = useUserSession()
</script>