import { GoogleGenerativeAI } from '@google/generative-ai';
import { allKCs } from '~/data'; // Gebruikt de centrale export voor alle KCs
import type { KnowledgeComponent } from '~/types/domain'; // Gebruikt de centrale type definities
import { generateForKCSchema } from '~/schemas'; // Zod schema voor validatie

/**
 * Genereert de prompt voor beginners (lage beheersing).
 * Vraagt om een simpel verhaal en een meerkeuzevraag.
 */
const getTier1Prompt = (kc: KnowledgeComponent) => `
You are an expert history tutor creating learning content for a high school student in the Netherlands with low prior knowledge.
Your task is to generate a short, engaging narrative and a multiple-choice question in DUTCH based on a specific learning objective.
The output MUST be a valid JSON object without any markdown formatting.

Learning Objective: "${kc.learningObjective}"

Generate the following JSON structure:
{
  "story": "A concise, narrative paragraph (3-5 sentences) in DUTCH that explains the concept.",
  "question": "A clear multiple-choice question in DUTCH testing the story's main point.",
  "options": ["An array of 4 strings in DUTCH with one correct answer and three plausible distractors."],
  "correctAnswerIndex": "The zero-based index of the correct answer in the 'options' array."
}
`;

/**
 * Genereert de prompt voor gemiddeld niveau (middelmatige beheersing).
 * Vraagt om een verhaal en een open vraag die feitenkennis toetst.
 */
const getTier2Prompt = (kc: KnowledgeComponent) => `
You are an expert history tutor creating content for a student with a medium grasp of a topic who needs to practice recall.
Your task is to generate a narrative and a simple open-ended question in DUTCH.
The output MUST be a valid JSON object without any markdown formatting.

Learning Objective: "${kc.learningObjective}"

Generate the following JSON structure:
{
  "story": "A concise, narrative paragraph (3-5 sentences) in DUTCH that explains the concept.",
  "question": "A clear, open-ended question in DUTCH that requires a short, factual recall answer (e.g., a name, date, key term).",
  "correctAnswer": "A string with the exact expected answer in DUTCH."
}
`;

/**
 * Genereert de prompt voor gevorderden (hoge beheersing).
 * Vraagt om een genuanceerd verhaal, een complexere open vraag, en een hint.
 */
const getTier3Prompt = (kc: KnowledgeComponent) => `
You are an expert history tutor creating content for a student with high mastery who needs a challenge.
Your task is to generate a narrative, a complex open-ended question, and a hint in DUTCH.
The output MUST be a valid JSON object without any markdown formatting.

Learning Objective: "${kc.learningObjective}"

Generate the following JSON structure:
{
  "story": "A concise, narrative paragraph (3-5 sentences) in DUTCH with added nuance.",
  "question": "An open-ended question in DUTCH requiring a short phrase or sentence to answer.",
  "correctAnswer": "A string with a model correct answer in DUTCH.",
  "hint": "A helpful, proactive hint in DUTCH for the student if their first answer is incorrect."
}
`;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  const body = await readBody(event);

  // Valideer de inkomende data met het Zod schema
  const validation = generateForKCSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
      data: validation.error.issues,
    });
  }

  const { kcId, masteryScore } = validation.data;

  // Zoek de juiste Knowledge Component op in de centrale Map
  const kc = allKCs.get(kcId);
  if (!kc) {
    throw createError({
      statusCode: 404,
      statusMessage: `Knowledge Component with id ${kcId} not found.`,
    });
  }

  // Bepaal welke prompt gebruikt moet worden op basis van de mastery score (R2.1)
  let prompt;
  if (masteryScore < 0.5) { // Beginner
    prompt = getTier1Prompt(kc);
  } else if (masteryScore < 0.75) { // Intermediate
    prompt = getTier2Prompt(kc);
  } else { // Advanced
    prompt = getTier3Prompt(kc);
  }
  
  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.modelName,
      generationConfig: {
        responseMimeType: "application/json", // Vraag direct om een JSON-respons
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());

    // Voeg kcId toe aan de response zodat de frontend weet welke KC is behandeld
    return { ...jsonResponse, kcId };

  } catch (error) {
    console.error('Error generating content with Gemini API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate learning content from the AI model.',
    });
  }
});