import { GoogleGenAI, Type } from '@google/genai';

let ai: GoogleGenAI | null = null;

export function getGenAI(apiKey?: string) {
  if (!ai) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is required');
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export async function generateContent(
  prompt: string,
  model: string = 'gemini-3-flash-preview',
  systemInstruction?: string,
  apiKey?: string
) {
  const aiClient = getGenAI(apiKey);
  const response = await aiClient.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
}

export async function generateContentWithSearch(
  prompt: string,
  model: string = 'gemini-3-flash-preview',
  systemInstruction?: string,
  apiKey?: string
) {
  const aiClient = getGenAI(apiKey);
  const response = await aiClient.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
}
