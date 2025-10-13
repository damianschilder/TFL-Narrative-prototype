// /server/api/auth/logout.post.ts
import { logger } from '~/utils/logger'

export default defineEventHandler(async (event) => {
  logger.info('API: logout.post', 'Logout endpoint hit.')
  const config = useRuntimeConfig(event)

  try {
    await clearSession(event, config.session)
    logger.info('API: logout.post', 'Session cleared successfully.')
    return { success: true, message: 'Logged out successfully' }
  }
  catch (error) {
    logger.error('API: logout.post', 'Failed to clear session.', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear session',
    })
  }
})