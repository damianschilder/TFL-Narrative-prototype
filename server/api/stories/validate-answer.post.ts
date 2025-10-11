// /server/api/stories/validate-answer.post.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAnswerSchema } from '~/schemas';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  const body = await readBody(event);

  // Validate the request body using the Zod schema
  const validation = validateAnswerSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
      data: validation.error.issues,
    });
  }

  const { userAnswer, question, modelAnswer } = validation.data;

  const prompt = `
You are an AI assistant evaluating a student's answer to a history question.
Your task is to determine if the student's answer is correct. Your response MUST be a valid JSON object with a single key "isCorrect" which is a boolean.

- The original question was: "${question}"
- A model correct answer is: "${modelAnswer}"
- The student's answer was: "${userAnswer}"

Analyze the student's answer. It does not need to be a word-for-word match with the model answer, but it must capture the same essential meaning and be factually correct in the context of the question.

Return {"isCorrect": true} if the student's answer is correct, and {"isCorrect": false} otherwise.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.modelName,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());

    return jsonResponse;

  } catch (error) {
    console.error('Error validating answer with Gemini API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to validate the answer using the AI model.',
    });
  }
});
