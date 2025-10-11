// /server/middleware/auth.ts
// This middleware runs for every request to the /api directory.
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Skip this middleware for all /api/auth routes (e.g., login, logout, session status)
  if (path.startsWith('/api/auth/')) {
    return
  }

  // 1. Get the runtime config
  const config = useRuntimeConfig(event)
  
  // 2. Pass the session config to useSession
  const session = await useSession(event, config.session)

  if (!session.data?.loggedIn) {
    // If not, throw a 401 Unauthorized error
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})