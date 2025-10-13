// /server/api/auth/login.post.ts
import { z } from 'zod'
import { logger } from '~/utils/logger'

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
  const source = 'API: /api/auth/login'
  logger.info(source, 'Login attempt initiated.')

  const config = useRuntimeConfig(event)
  const result = await readValidatedBody(event, body => loginSchema.safeParse(body))

  if (!result.success) {
    logger.warn(source, 'Invalid request body.', result.error.flatten())
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  if (result.data.password !== config.appPassword) {
    logger.warn(source, 'Incorrect password provided.')
    throw createError({ statusCode: 401, statusMessage: 'Incorrect password' })
  }

  try {
    const userPayload = { loggedInAt: new Date().toISOString() }
    await setUserSession(event, {
      user: userPayload,
    })
    logger.info(source, 'Password correct. User session created.', userPayload)
    return { success: true }
  }
  catch (error) {
    logger.error(source, 'Failed to set user session.', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not create session' })
  }
})