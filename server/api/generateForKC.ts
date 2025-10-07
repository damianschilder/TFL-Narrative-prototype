// /server/api/generateForKC.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { domainKnowledge } from '~/data/domainModel'; // Importeren van onze KCs

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { kcId } = await readBody(event);

  if (!kcId) {
    throw createError({ statusCode: 400, statusMessage: 'Geen KC ID opgegeven.' });
  }

  const kc = domainKnowledge.find(k => k.id === kcId);

  if (!kc) {
    throw createError({ statusCode: 404, statusMessage: 'KC niet gevonden.' });
  }

  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  const model = genAI.getGenerativeModel({ model: config.gemini.modelName });

  const prompt = `Je bent een API die alleen JSON retourneert.
Jouw taak is om een specifieke kenniscomponent (KC) te onderwijzen.
Gebruik de volgende informatie om een kort, boeiend verhaal voor een 16-jarige te schrijven: "${kc.learningObjective}".
Genereer daarna één multiple-choice vraag die specifiek test of de student de informatie uit de KC heeft begrepen.
Antwoord ALLEEN met een geldig JSON-object met de keys "story", "question", "options", "correctAnswerIndex" en "kcId".
BELANGRIJK: Zorg ervoor dat er maar één correct antwoord is en de andere drie opties plausibel maar duidelijk onjuist zijn.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonOutput = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    const generatedData = JSON.parse(jsonOutput);
    generatedData.kcId = kcId; // Voeg de KC ID toe aan de response
    return generatedData;
  } catch (error) {
    console.error('Gemini API Fout (KC):', error);
    throw createError({ statusCode: 500, statusMessage: 'Er ging iets mis bij het genereren voor de KC.' });
  }
});