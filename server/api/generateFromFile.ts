// server/api/generateFromFile.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MultiPartData } from 'h3';

async function fileToGenerativePart(file: MultiPartData) {
  if (!file.data || !file.type) {
    throw new Error('Bestandsdata of MIME-type ontbreekt.');
  }
  return {
    inlineData: {
      data: file.data.toString('base64'),
      mimeType: file.type,
    },
  };
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  const model = genAI.getGenerativeModel({ model: config.gemini.modelName });
  
  const body = await readMultipartFormData(event);
  const file = body?.find(part => part.name === 'file');

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Geen bestand gevonden in de request.' });
  }

  const filePart = await fileToGenerativePart(file);

  const promptParts = [
    'Je bent een API die alleen JSON retourneert.',
    'Transformeer de inhoud van het bijgevoegde document in een boeiend verhaal voor een 16-jarige.',
    'Genereer daarnaast één multiple-choice vraag over de belangrijkste informatie.',
    "Antwoord ALLEEN met een geldig JSON-object. Voeg geen inleidende tekst, uitleg of markdown-opmaak zoals '```json' toe.",
    'Het JSON-object moet de keys "story", "question", "options" (een array van 4 strings), en "correctAnswerIndex" (een getal van 0-3) bevatten.',
    'DOCUMENT:',
    filePart,
  ];

  try {
    const result = await model.generateContent(promptParts);
    
    const response = await result.response;
    let jsonOutput = response.text();

    jsonOutput = jsonOutput.replace('```json', '').replace('```', '').trim();
    
    const generatedData = JSON.parse(jsonOutput);
    return generatedData;

  } catch (error) {
    console.error('Gemini API Fout (File):', error);
    throw createError({ statusCode: 500, statusMessage: 'Er ging iets mis bij het verwerken van het bestand.' });
  }
});