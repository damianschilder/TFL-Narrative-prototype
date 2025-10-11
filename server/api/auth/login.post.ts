// /server/api/auth/login.post.ts
import { z } from 'zod'

// Define a schema for the login payload
const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // 1. Validate the incoming data
  const validation = loginSchema.safeParse(body)
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  // 2. Check if the password is correct
  if (validation.data.password !== config.appPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Incorrect password' })
  }

  // 3. If correct, update the session.
  // This line is correct and will work after restarting the server.
  await updateSession(event, config.session, {
    loggedIn: true,
  })

  return { success: true }
})