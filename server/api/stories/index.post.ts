// /server/api/stories/index.post.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { allKCs } from '~/data/topics';
import type { KnowledgeComponent } from '~/data/ww2DomainModel';
import { generateForKCSchema } from '~/schemas';

const getTier1Prompt = (kc: KnowledgeComponent) => `
You are an expert history tutor creating learning content for a high school student with low knowledge of a topic.
Your task is to generate a short, engaging narrative and a multiple-choice question based on a specific learning objective.
The output MUST be a valid JSON object without any markdown formatting.

Learning Objective: "${kc.learningObjective}"

Generate the following JSON structure:
{
  "story": "A concise, narrative paragraph (3-5 sentences) that explains the concept.",
  "question": "A clear multiple-choice question testing the story's main point.",
  "options": ["An array of 4 strings with one correct answer and three plausible distractors."],
  "correctAnswerIndex": "The zero-based index of the correct answer in the 'options' array."
}
`;

const getTier2Prompt = (kc: KnowledgeComponent) => `
You are an expert history tutor creating content for a student with a medium grasp of a topic who needs to practice recall.
Your task is to generate a narrative and a simple open-ended question.
The output MUST be a valid JSON object without any markdown formatting.

Learning Objective: "${kc.learningObjective}"

Generate the following JSON structure:
{
  "story": "A concise, narrative paragraph (3-5 sentences) that explains the concept.",
  "question": "A clear, open-ended question that requires a short, factual recall answer (e.g., a name, date, key term).",
  "correctAnswer": "A string with the exact expected answer."
}
`;

const getTier3Prompt = (kc: KnowledgeComponent) => `
You are an expert history tutor creating content for a student with high mastery who needs a challenge.
Your task is to generate a narrative and a slightly more complex open-ended question.
The output MUST be a valid JSON object without any markdown formatting.

Learning Objective: "${kc.learningObjective}"

Generate the following JSON structure:
{
  "story": "A concise, narrative paragraph (3-5 sentences) with added nuance.",
  "question": "An open-ended question requiring a short phrase or sentence to answer.",
  "correctAnswer": "A string with a model correct answer."
}
`;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  const body = await readBody(event);

  // Validate the request body using the Zod schema
  const validation = generateForKCSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
      data: validation.error.issues,
    });
  }

  const { kcId, masteryScore } = validation.data;

  const kc = allKCs.get(kcId);
  if (!kc) {
    throw createError({
      statusCode: 404,
      statusMessage: `Knowledge Component with id ${kcId} not found.`,
    });
  }

  let prompt;
  if (masteryScore < 0.40) {
    prompt = getTier1Prompt(kc);
  } else if (masteryScore >= 0.40 && masteryScore < 0.85) {
    prompt = getTier2Prompt(kc);
  } else {
    prompt = getTier3Prompt(kc);
  }
  
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

    return { ...jsonResponse, kcId };

  } catch (error) {
    console.error('Error generating content with Gemini API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate learning content from the AI model.',
    });
  }
});
