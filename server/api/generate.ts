// server/api/generate.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// The declare block has been removed to allow Nuxt's auto-imports to work.

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig();
  const { text } = await readBody(event);

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'Geen tekst opgegeven.' });
  }

  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  const model = genAI.getGenerativeModel({ model: config.gemini.modelName });

  const prompt = `Je bent een API die alleen JSON retourneert.
Transformeer de volgende feitelijke tekst in een boeiend verhaal voor een 16-jarige.
Genereer daarnaast één multiple-choice vraag over de belangrijkste informatie in de tekst.
Antwoord ALLEEN met een geldig JSON-object. Voeg geen inleidende tekst, uitleg of markdown-opmaak zoals '\`\`\`json' toe.
Het JSON-object moet de keys "story", "question", "options" (een array van 4 strings), en "correctAnswerIndex" (een getal van 0-3) bevatten.

TEKST:
"${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonOutput = response.text();
    
    // This replace logic is a good fallback in case the model still adds the markdown.
    jsonOutput = jsonOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const generatedData = JSON.parse(jsonOutput);
    return generatedData;

  } catch (error) {
    console.error('Gemini API Fout (Text):', error);
    throw createError({ statusCode: 500, statusMessage: 'Er ging iets mis bij het genereren van het verhaal.' });
  }
});