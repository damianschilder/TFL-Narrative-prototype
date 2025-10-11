// /validation/story.ts
import { toTypedSchema } from '@vee-validate/zod';
import { validateAnswerSchema } from '~/schemas';

// This is the single source of truth for the open-ended answer form.
// It takes the core Zod schema and prepares it for vee-validate.
export const openEndedAnswerSchema = toTypedSchema(
  validateAnswerSchema.pick({ userAnswer: true })
);
