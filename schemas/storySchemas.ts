// /schemas/storySchemas.ts
import { z } from 'zod'

// Schema for generating a new story chapter
// Validates the data sent to the /api/generateForKC endpoint
export const generateForKCSchema = z.object({
  kcId: z.string({ required_error: 'KC ID is required.' }).min(1, 'KC ID cannot be empty.').max(50, 'KC ID is too long.'),
  masteryScore: z.number({ required_error: 'Mastery score is required.' }).min(0, 'Mastery score must be at least 0.').max(1, 'Mastery score cannot be more than 1.'),
})

// Schema for validating a user's answer
// Validates the data sent to the /api/validateAnswer endpoint
export const validateAnswerSchema = z.object({
  userAnswer: z.string().min(1, 'Your answer cannot be empty.').max(500, 'Your answer is too long.'),
  question: z.string().min(1).max(500),
  modelAnswer: z.string().min(1).max(500),
})

// Export TypeScript types derived from schemas for type safety in our app
export type GenerateForKCPayload = z.infer<typeof generateForKCSchema>
export type ValidateAnswerPayload = z.infer<typeof validateAnswerSchema>

