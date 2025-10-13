import { GoogleGenerativeAI } from '@google/generative-ai';
import { tijdvakken } from '~/data';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  const body = await readBody(event);
  const { aspectId } = body;

  if (!aspectId) {
    throw createError({ statusCode: 400, statusMessage: 'aspectId is required' });
  }

  // Zoek de KCs die bij het aspect horen
  const aspect = tijdvakken.flatMap(t => t.aspecten).find(a => a.id === aspectId);
  if (!aspect || !aspect.knowledgeComponents) {
    throw createError({ statusCode: 404, statusMessage: 'Aspect or KCs not found' });
  }
  const learningObjectives = aspect.knowledgeComponents.map(kc => `- ${kc.learningObjective}`).join('\n');

  const prompt = `
    You are a history teacher creating a baseline test for a Dutch high school student.
    Based on the following learning objectives, generate EXACTLY 10 multiple-choice questions in DUTCH to assess the student's prior knowledge.
    Each question must test one or more of these objectives. The questions should have a varied difficulty.
    The output MUST be a valid JSON array of objects, without any markdown formatting.

    Learning Objectives:
    ${learningObjectives}

    JSON Format for each question in the array:
    {
      "question": "The question text in Dutch.",
      "options": ["An array of 4 strings with one correct answer and three plausible distractors in Dutch."],
      "correctAnswerIndex": "The zero-based index of the correct answer."
    }
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.modelName,
      generationConfig: { responseMimeType: "application/json" },
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Error generating pre-test:", error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to generate pre-test' });
  }
});