// /middleware/auth.global.ts
import { logger } from '~/utils/logger'
import { useAuthInitialized } from '~/composables/useAuthInitialized'

export default defineNuxtRouteMiddleware(async (to) => {
  const source = 'Middleware: auth.global'
  const isInitialized = useAuthInitialized()
  const { loggedIn, fetch: refreshSession } = useUserSession()

  // On the initial client-side load, refresh the session to get the latest auth state.
  if (process.client && !isInitialized.value) {
    logger.info(source, 'Initializing session state...')
    await refreshSession()
    isInitialized.value = true
    logger.info(source, `Initialization complete. User is ${loggedIn.value ? 'logged in' : 'not logged in'}.`)
  }

  // If the user is authenticated and trying to access the login page, redirect to home.
  if (loggedIn.value && to.path === '/login') {
    logger.info(source, 'Authenticated user redirected from /login to /.')
    return navigateTo('/')
  }

  // If the user is not authenticated and trying to access a protected page, redirect to login.
  if (!loggedIn.value && to.path !== '/login') {
    logger.info(source, `Unauthenticated user redirected to /login from '${to.path}'.`)
    return navigateTo('/login')
  }
})