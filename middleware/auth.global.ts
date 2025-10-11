// /middleware/auth.global.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // This middleware runs on every route change
  const authStore = useAuthStore()

  // We don't need to do anything on the server side here
  if (process.server) return

  // If the user's auth state is not yet set, check the session status
  if (!authStore.isAuthenticated) {
    try {
      // Use $fetch to check the session with the server.
      // This will either succeed or throw a 401 error.
      await $fetch('/api/user', {
         // This is a placeholder route handled by nuxt-security to check session
        headers: {
          'Accept': 'application/json'
        }
      })
      authStore.login()
    } catch (e) {
      authStore.logout()
    }
  }

  // If the user is not authenticated and not on the login page, redirect them
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If the user IS authenticated and tries to visit the login page, redirect them away
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
