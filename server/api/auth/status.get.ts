// /server/api/auth/status.get.ts
import { logger } from '~/utils/logger'

export default defineEventHandler(async (event) => {
  const source = 'API: /api/auth/status'
  try {
    const session = await requireUserSession(event)
    logger.info(source, 'Status check successful for user.', session.user)
    return { status: 'ok', user: session.user }
  }
  catch (error) {
    logger.warn(source, 'Unauthorized status check attempt.')
    throw error
  }
})